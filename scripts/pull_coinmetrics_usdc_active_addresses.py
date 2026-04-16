"""
Pull USDC aggregate AdrActCnt from CoinMetrics Community API.

Phase 2C Task B: The H1 master dataset uses the multi-chain aggregate USDC
active-address series (asset='usdc', metric='AdrActCnt') from CoinMetrics
Community tier. This series was pulled during Phase 2B but never persisted
to disk. This script re-pulls and verifies it against the H1 master.

API: https://community-api.coinmetrics.io/v4/timeseries/asset-metrics
  - No authentication required (Community tier, free)
  - asset=usdc, metric=AdrActCnt, frequency=1d
  - Date range: 2020-01-01 to 2025-12-31

Verification spot-check values (must match H1 master exactly):
  2020-01-01: 1481
  2022-05-15: 1030144
  2023-03-10: 255327
  2025-12-31: 2001557

Usage:
  python scripts/pull_coinmetrics_usdc_active_addresses.py
"""

import requests
import pandas as pd
import json
import time
import os
import sys

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
RAW_DIR = os.path.join(PROJECT_ROOT, "data", "01_raw", "coinmetrics")
H1_PATH = os.path.join(PROJECT_ROOT, "data", "03_processed", "h1_network_effects.csv")
OUTPUT_PATH = os.path.join(RAW_DIR, "usdc_aggregate_active_addresses_PULL.csv")

# API config
BASE_URL = "https://community-api.coinmetrics.io/v4/timeseries/asset-metrics"
PARAMS = {
    "assets": "usdc",
    "metrics": "AdrActCnt",
    "frequency": "1d",
    "start_time": "2020-01-01",
    "end_time": "2025-12-31",
    "page_size": "10000",
}

# Spot-check values from H1 master
SPOT_CHECKS = {
    "2020-01-01": 1481,
    "2022-05-15": 1030144,
    "2023-03-10": 255327,
    "2025-12-31": 2001557,
}

MAX_RETRIES = 3


def pull_data():
    """Pull AdrActCnt for usdc from CoinMetrics Community API with pagination."""
    all_rows = []
    url = BASE_URL
    params = PARAMS.copy()
    page = 1

    while True:
        print(f"  Fetching page {page}...")
        last_err = None
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                resp = requests.get(url, params=params, timeout=30)
                resp.raise_for_status()
                last_err = None
                break
            except (requests.RequestException, requests.HTTPError) as e:
                last_err = e
                print(f"  Attempt {attempt}/{MAX_RETRIES} failed: {e}")
                if attempt < MAX_RETRIES:
                    time.sleep(2)

        if last_err is not None:
            print(f"FATAL: API request failed after {MAX_RETRIES} retries: {last_err}")
            sys.exit(1)

        data = resp.json()
        rows = data.get("data", [])
        all_rows.extend(rows)
        print(f"  Page {page}: got {len(rows)} rows (total so far: {len(all_rows)})")

        # Handle pagination
        next_url = data.get("next_page_url")
        if next_url:
            url = next_url
            params = {}  # next_page_url is fully qualified
            page += 1
            time.sleep(2)  # rate-limit courtesy
        else:
            break

    return all_rows


def parse_data(raw_rows):
    """Parse raw API rows into a clean DataFrame."""
    df = pd.DataFrame(raw_rows)
    df = df.rename(columns={"asset": "asset", "time": "time", "AdrActCnt": "AdrActCnt"})
    # Extract date part from ISO timestamp
    df["time"] = pd.to_datetime(df["time"]).dt.strftime("%Y-%m-%dT00:00:00.000000000Z")
    df["AdrActCnt"] = df["AdrActCnt"].astype(int)
    return df


def validate(df):
    """Run basic validations on the parsed DataFrame."""
    print("\n--- Validation ---")

    # All rows should be usdc
    assert (df["asset"] == "usdc").all(), f"FAIL: non-usdc assets found: {df['asset'].unique()}"
    print("  All rows asset='usdc': PASS")

    # No nulls
    null_count = df.isna().sum().sum()
    assert null_count == 0, f"FAIL: {null_count} null values found"
    print("  No nulls: PASS")

    # Date range
    dates = pd.to_datetime(df["time"])
    first_date = dates.min().strftime("%Y-%m-%d")
    last_date = dates.max().strftime("%Y-%m-%d")
    assert first_date == "2020-01-01", f"FAIL: first date is {first_date}, expected 2020-01-01"
    assert last_date == "2025-12-31", f"FAIL: last date is {last_date}, expected 2025-12-31"
    print(f"  Date range: {first_date} to {last_date}: PASS")

    # Row count approximately 2192
    n = len(df)
    assert 2000 <= n <= 2300, f"FAIL: row count {n} outside [2000, 2300]"
    print(f"  Row count: {n} (expected ~2192): PASS")

    print(f"\n  First 5 rows:\n{df.head(5).to_string(index=False)}")
    print(f"\n  Last 5 rows:\n{df.tail(5).to_string(index=False)}")


def spot_check(df):
    """Verify pulled values against H1 master dataset."""
    print("\n--- Spot-check against H1 master ---")

    h1 = pd.read_csv(H1_PATH)
    h1["date"] = pd.to_datetime(h1["date"])

    df_check = df.copy()
    df_check["date"] = pd.to_datetime(df_check["time"], utc=True).dt.tz_localize(None).dt.normalize()

    all_pass = True
    for date_str, expected in SPOT_CHECKS.items():
        dt = pd.Timestamp(date_str)

        # Pulled value
        pull_row = df_check[df_check["date"] == dt]
        if len(pull_row) == 0:
            print(f"  {date_str}: FAIL — date not found in pull data")
            all_pass = False
            continue
        pull_val = int(pull_row["AdrActCnt"].values[0])

        # H1 master value
        h1_row = h1[(h1["asset"] == "USDC") & (h1["date"] == dt)]
        if len(h1_row) == 0:
            print(f"  {date_str}: FAIL — date not found in H1 master")
            all_pass = False
            continue
        h1_val = int(h1_row["active_addresses"].values[0])

        match = pull_val == h1_val == expected
        status = "PASS" if match else "FAIL"
        print(f"  {date_str}: pull={pull_val}, H1={h1_val}, expected={expected}: {status}")
        if not match:
            all_pass = False

    return all_pass


def main():
    print("=" * 60)
    print("CoinMetrics USDC Aggregate AdrActCnt Pull")
    print("=" * 60)

    # Step 1: Pull
    print("\nStep 1: Pulling from CoinMetrics Community API...")
    print(f"  URL: {BASE_URL}")
    print(f"  Params: {PARAMS}")
    raw_rows = pull_data()
    print(f"  Total rows pulled: {len(raw_rows)}")

    # Step 2: Parse
    print("\nStep 2: Parsing into DataFrame...")
    df = parse_data(raw_rows)

    # Step 3: Validate
    validate(df)

    # Step 4: Spot-check
    passed = spot_check(df)

    if not passed:
        print("\nFAIL: Spot-check failed. NOT saving any files.")
        print("Review the mismatches above and report to the user.")
        sys.exit(1)

    # Step 5: Save temp file
    print(f"\nStep 5: Saving verified pull to {OUTPUT_PATH}")
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"  Saved {len(df)} rows to {OUTPUT_PATH}")

    print("\n" + "=" * 60)
    print("PULL VERIFIED — ready for append")
    print(f"Temp file: {OUTPUT_PATH}")
    print("=" * 60)


if __name__ == "__main__":
    main()
