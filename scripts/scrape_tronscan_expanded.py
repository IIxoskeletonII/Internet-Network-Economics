"""
Phase 2B.5 Task B: Expanded Tronscan USDT Transfer Scraping
============================================================
Uses TronGrid public API (no auth required) to collect ≥1000 USDT TRC20
transfers per month for 2020-01 through 2025-12 (72 months).

Two-phase approach:
  Phase 1: Get Transfer event transaction IDs via TronGrid events endpoint
  Phase 2: Look up per-transaction fees via wallet/gettransactioninfobyid

Output: data/01_raw/tronscan/usdt_transfers_expanded.csv
"""

import os
import sys
import csv
import json
import time
import urllib.request
import urllib.error
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

# --- Configuration ---
USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
TRONGRID_BASE = "https://api.trongrid.io"
EVENTS_URL = f"{TRONGRID_BASE}/v1/contracts/{USDT_CONTRACT}/events"
FEE_URL = f"{TRONGRID_BASE}/wallet/gettransactioninfobyid"
TARGET_PER_MONTH = 1000
EVENTS_PAGE_SIZE = 200  # TronGrid max
QPS_LIMIT = 12  # conservative vs 15 QPS limit
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                          "data", "01_raw", "tronscan")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "usdt_transfers_expanded.csv")
PROGRESS_FILE = os.path.join(OUTPUT_DIR, "scrape_progress.json")

# Rate limiter
_lock = threading.Lock()
_last_call = [0.0]

def rate_limit():
    with _lock:
        now = time.time()
        min_interval = 1.0 / QPS_LIMIT
        elapsed = now - _last_call[0]
        if elapsed < min_interval:
            time.sleep(min_interval - elapsed)
        _last_call[0] = time.time()


def api_get(url, retries=3):
    """GET request with retry and rate limiting."""
    for attempt in range(retries):
        rate_limit()
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            resp = urllib.request.urlopen(req, timeout=20)
            return json.loads(resp.read().decode())
        except (urllib.error.HTTPError, urllib.error.URLError, Exception) as e:
            if attempt < retries - 1:
                wait = 2 ** (attempt + 1)
                print(f"    Retry {attempt+1}/{retries} after {wait}s: {e}")
                time.sleep(wait)
            else:
                raise


def api_post(url, body, retries=3):
    """POST request with retry and rate limiting."""
    for attempt in range(retries):
        rate_limit()
        try:
            data = json.dumps(body).encode()
            req = urllib.request.Request(url, data=data,
                                        headers={"Content-Type": "application/json",
                                                 "User-Agent": "Mozilla/5.0"})
            resp = urllib.request.urlopen(req, timeout=20)
            return json.loads(resp.read().decode())
        except (urllib.error.HTTPError, urllib.error.URLError, Exception) as e:
            if attempt < retries - 1:
                wait = 2 ** (attempt + 1)
                print(f"    Retry {attempt+1}/{retries} after {wait}s: {e}")
                time.sleep(wait)
            else:
                raise


def get_month_timestamps(year, month):
    """Return (start_ms, end_ms) for a given year-month."""
    start = datetime(year, month, 1)
    if month == 12:
        end = datetime(year + 1, 1, 1)
    else:
        end = datetime(year, month + 1, 1)
    return int(start.timestamp() * 1000), int(end.timestamp() * 1000)


def fetch_transfer_events(start_ms, end_ms, target_n):
    """Fetch up to target_n Transfer events from TronGrid events API."""
    events = []
    fingerprint = None
    pages = 0
    max_pages = (target_n // EVENTS_PAGE_SIZE) + 5  # safety margin

    while len(events) < target_n and pages < max_pages:
        url = (f"{EVENTS_URL}?event_name=Transfer"
               f"&limit={EVENTS_PAGE_SIZE}"
               f"&min_block_timestamp={start_ms}"
               f"&max_block_timestamp={end_ms}"
               f"&order_by=block_timestamp,asc")
        if fingerprint:
            url += f"&fingerprint={fingerprint}"

        data = api_get(url)
        batch = data.get("data", [])
        if not batch:
            break

        events.extend(batch)
        pages += 1

        meta = data.get("meta", {})
        fingerprint = meta.get("fingerprint")
        if not fingerprint or not meta.get("links", {}).get("next"):
            break

    return events[:target_n]


def lookup_fee(tx_id):
    """Look up transaction fee via TronGrid wallet endpoint."""
    try:
        data = api_post(FEE_URL, {"value": tx_id})
        fee_sun = data.get("fee", 0)
        receipt = data.get("receipt", {})
        energy_fee = receipt.get("energy_fee", 0)
        net_fee = receipt.get("net_fee", 0)
        energy_usage_total = receipt.get("energy_usage_total", 0)
        block_ts = data.get("blockTimeStamp", 0)
        return {
            "fee_sun": fee_sun,
            "energy_fee": energy_fee,
            "net_fee": net_fee,
            "energy_usage_total": energy_usage_total,
            "block_timestamp": block_ts,
        }
    except Exception as e:
        return {"fee_sun": None, "energy_fee": None, "net_fee": None,
                "energy_usage_total": None, "block_timestamp": None, "error": str(e)}


def parse_transfer_event(event):
    """Extract from/to/value from a TronGrid Transfer event."""
    result = event.get("result", {})
    # TRC20 Transfer events have: from, to, value (indexed params)
    from_hex = result.get("0") or result.get("from", "")
    to_hex = result.get("1") or result.get("to", "")
    value_raw = result.get("2") or result.get("value", "0")

    # Convert hex addresses to base58 if needed (TronGrid usually returns hex)
    tx_id = event.get("transaction_id", "")
    block_ts = event.get("block_timestamp", 0)

    # USDT has 6 decimals
    try:
        value_usdt = int(value_raw) / 1e6
    except (ValueError, TypeError):
        value_usdt = 0.0

    return {
        "tx_id": tx_id,
        "block_timestamp": block_ts,
        "from": from_hex,
        "to": to_hex,
        "value_usdt": value_usdt,
    }


def load_progress():
    """Load scraping progress to allow resumption."""
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, "r") as f:
            return json.load(f)
    return {"completed_months": []}


def save_progress(progress):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(progress, f)


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    progress = load_progress()
    completed = set(progress.get("completed_months", []))

    # Generate month list
    months = []
    for year in range(2020, 2026):
        for month in range(1, 13):
            label = f"{year}-{month:02d}"
            months.append((year, month, label))

    # Open output file (append mode for resumability)
    file_exists = os.path.exists(OUTPUT_FILE) and os.path.getsize(OUTPUT_FILE) > 0
    mode = "a" if file_exists and completed else "w"
    csvfile = open(OUTPUT_FILE, mode, newline="", encoding="utf-8")
    writer = csv.DictWriter(csvfile, fieldnames=[
        "month", "tx_hash", "block_timestamp", "from", "to",
        "value_usdt", "fee_sun", "fee_trx",
        "energy_fee_sun", "net_fee_sun", "energy_usage_total"
    ])
    if mode == "w":
        writer.writeheader()

    total_months = len(months)
    done_count = len(completed)

    for year, month, label in months:
        if label in completed:
            continue

        start_ms, end_ms = get_month_timestamps(year, month)
        done_count += 1
        print(f"\n[{done_count}/{total_months}] {label}: fetching events...", flush=True)

        try:
            events = fetch_transfer_events(start_ms, end_ms, TARGET_PER_MONTH)
        except Exception as e:
            print(f"  ERROR fetching events for {label}: {e}")
            continue

        transfers = [parse_transfer_event(ev) for ev in events]
        print(f"  Got {len(transfers)} transfer events. Looking up fees...", flush=True)

        # Look up fees (sequential to respect rate limit)
        rows_written = 0
        for i, tx in enumerate(transfers):
            fee_info = lookup_fee(tx["tx_id"])
            fee_sun = fee_info.get("fee_sun")
            if fee_sun is None:
                continue

            row = {
                "month": label,
                "tx_hash": tx["tx_id"],
                "block_timestamp": tx["block_timestamp"],
                "from": tx["from"],
                "to": tx["to"],
                "value_usdt": tx["value_usdt"],
                "fee_sun": fee_sun,
                "fee_trx": fee_sun / 1e6,  # 1 TRX = 1,000,000 SUN
                "energy_fee_sun": fee_info.get("energy_fee", 0),
                "net_fee_sun": fee_info.get("net_fee", 0),
                "energy_usage_total": fee_info.get("energy_usage_total", 0),
            }
            writer.writerow(row)
            rows_written += 1

            if (i + 1) % 100 == 0:
                print(f"    {i+1}/{len(transfers)} fee lookups done...", flush=True)
                csvfile.flush()

        csvfile.flush()
        completed.add(label)
        save_progress({"completed_months": sorted(completed)})
        print(f"  {label} complete: {rows_written} rows written.", flush=True)

    csvfile.close()
    print(f"\nScraping complete! Output: {OUTPUT_FILE}")

    # Remove progress file on full completion
    if len(completed) == total_months and os.path.exists(PROGRESS_FILE):
        os.remove(PROGRESS_FILE)


if __name__ == "__main__":
    main()
