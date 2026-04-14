# Checkpoint 5 Report — Phase 2B.5: H4 Infrastructure Cost Repair

**Date:** 2026-04-14
**Branch:** `fixes/`
**Status:** Complete (with one documented limitation)

---

## Tasks Completed

### Task A: TRX→USD Conversion Fix
- **Problem:** Tron fees stored in TRX (native units), never converted to USD.
- **Fix:** Merged daily TRX price from CoinMetrics (`eth_trx_price_usd.csv`, asset=trx) into Tron intermediate on `date` column. Added `fee_usd = fee_trx * trx_price_usd`.
- **Result:** Tron fee_usd range: $0.0006 – $9.37; mean $0.45.
- **Intermediate updated:** `data/02_intermediate/tronscan_usdt_cleaned.csv` (1,440 rows, +2 cols: `trx_price_usd`, `fee_usd`).

### Task B: Tronscan Sample Expansion — BLOCKED
- **Option A (TronGrid scraping):** TronGrid events API works for Transfer events (no auth). However, per-transaction fee lookups via `wallet/gettransactioninfobyid` hit persistent 429 (Too Many Requests) rate limits after ~100 calls. At the required scale (72,000 lookups for 1000/month × 72 months), this is infeasible within the time budget.
- **Option B (CoinMetrics aggregate):** All fee metrics (`FeeTotNtv`, `FeeTotUSD`, `FeeMeanNtv`, `FeeMeanUSD`, `FeeMedNtv`, `FeeMedUSD`) return HTTP 400 for `trx`, `usdt_trx`, and `tron` assets on the Community tier. CoinMetrics does not expose TRX fee data without a Pro subscription.
- **Current state:** H4 dataset built with existing n=20/month Tron data. The fee statistics are directionally correct (Tron fees are known to be very low and relatively uniform for TRC20 transfers), but the sample size is statistically thin.
- **Escalation required:** Per the checkpoint brief, Option C (keep n=20 with caveats) requires Claude.ai approval. Recommend calculating within-month confidence intervals in Phase 3 to assess whether n=20 is defensible given the low variance of Tron fees.
- **Possible future fixes:** (1) Register for a free Tronscan API key to unlock the TRC20 transfers endpoint (returned 401 without auth); (2) Use a Dune Analytics query for aggregate Tron USDT transfer fees; (3) Accept n=20 if within-month CIs are tight.

### Task C: Monthly Rolling 95th Percentile ETH Gas Filter
- **Problem:** Original code used a single global 95th percentile ($89.34), which removed zero rows from low-fee months and disproportionately affected high-fee months.
- **Fix:** Compute 95th percentile per month independently. Each month's threshold is applied only to that month's transactions.
- **Critical bug also fixed:** The original cell 9 merged `eth_price_df[['date', 'PriceUSD']]` without filtering by `asset=='eth'`. Since the price file contains both ETH and TRX rows, every transaction doubled (72,000 → 136,800 rows). Half the `fee_usd` values used TRX price (~$0.10) instead of ETH price (~$2,000). **This is now fixed** by filtering to `asset=='eth'` before the merge.
- **Result:** 72,000 raw → 68,847 after monthly filter (3,153 removed, 4.4%). Threshold range: $0.77 (Jan 2020) to $319.35 (peak month).
- **Thresholds logged:** `data/02_intermediate/eth_gas_filter_thresholds.csv` (72 rows).
- **Intermediate updated:** `data/02_intermediate/etherscan_usdc_cleaned.csv` (68,847 rows, correct 1:1 merge).

### Task D: H4 Master Dataset Build
- **Output:** `data/03_processed/h4_infrastructure_cost.csv`
- **Schema (12 columns):**

| Column | Type | Description |
|--------|------|-------------|
| `month` | str | YYYY-MM |
| `eth_mean_fee_usd` | float | Mean ETH USDC transfer fee (USD) |
| `eth_median_fee_usd` | float | Median ETH fee |
| `eth_p95_fee_usd` | float | 95th percentile ETH fee |
| `eth_tx_count` | int | Transactions in sample after gas filter |
| `tron_mean_fee_usd` | float | Mean Tron USDT transfer fee (USD) |
| `tron_median_fee_usd` | float | Median Tron fee |
| `tron_p95_fee_usd` | float | 95th percentile Tron fee |
| `tron_tx_count` | int | Transactions in sample (20/month) |
| `post_nov_2022` | int | Structural break dummy (0/1) |
| `legacy_pct_fee` | float | WB Remittance Prices global avg (decimal) |
| `legacy_flat_fee` | float | Fixed fee component (0.0 — WB RPW is percentage-only) |

- **Design decision:** Raw cost components stored, no pre-computed savings. Phase 5 dashboard computes `legacy_cost(x) = x * legacy_pct_fee + legacy_flat_fee` at user-input time.
- **Legacy fee is time-varying** by year (2020: 5.08%, 2021: 4.60%, 2022: 3.95%, 2023+: 3.85%). Years 2024–2025 forward-filled from 2023 (last available WB data).

### Task E: Verification Gate
All 9 gates pass:

| # | Gate | Result |
|---|------|--------|
| 1 | Row count = 72 | PASS |
| 2 | All fee columns present and non-null | PASS |
| 3 | ETH May 2021 ($14.43) > ETH May 2020 ($0.37) | PASS |
| 4 | Tron mean fees < $5 (max $2.97) | PASS |
| 5 | Zero nulls | PASS |
| 6 | Structural break: 35 pre + 37 post | PASS |
| 7 | Legacy fee time-varying (4 distinct values) | PASS |
| 8 | Schema matches spec (12 columns) | PASS |
| 9 | Gas filter thresholds CSV (72 months) | PASS |

**Spot checks:**
- ETH 2021 avg ($37.57) is 14x ETH 2020 avg ($2.68) — confirms bull-market gas spike.
- Tron is NOT always cheaper than ETH: during low-congestion ETH months (e.g., early 2020), ETH fees ($0.12) can be lower than Tron fees ($0.63). This is economically meaningful — it shows Tron's cost advantage is congestion-dependent.

---

## Files Modified

| File | Change |
|------|--------|
| `notebooks/02_data_engineering.ipynb` cell 9 | Fixed ETH price merge bug + monthly rolling 95th percentile + TRX→USD conversion |
| `notebooks/02_data_engineering.ipynb` cell 17 | New Phase 2B.5 markdown header |
| `notebooks/02_data_engineering.ipynb` cell 18 | New H4 master dataset build with raw components |
| `data/02_intermediate/etherscan_usdc_cleaned.csv` | Rebuilt: 68,847 rows (was 136,800 due to merge bug) |
| `data/02_intermediate/tronscan_usdt_cleaned.csv` | Added `fee_usd` and `trx_price_usd` columns |
| `data/02_intermediate/eth_gas_filter_thresholds.csv` | **NEW** — 72 monthly gas thresholds |
| `data/03_processed/h4_infrastructure_cost.csv` | **NEW** — 72 rows, 12 cols, raw cost components |
| `scripts/scrape_tronscan_expanded.py` | **NEW** — TronGrid scraping script (functional but rate-limited) |
| `scripts/patch_notebook_h4.py` | **NEW** — Notebook patching utility |

---

## Escalation Items for Claude.ai

1. **Tron n=20 acceptance (Option C):** Both API expansion options failed. Recommend Phase 3 compute within-month CIs on Tron fee_usd. If tight (likely, given low fee variance), n=20 is defensible with explicit caveats. If wide, acknowledge as a limitation. Needs methodology approval.
2. **Tron not always cheaper finding:** In 5–6 low-congestion ETH months, Tron mean fees exceed ETH mean fees. This complicates the "stablecoins are always cheaper" narrative. Phase 4 should frame H4 as "congestion-dependent cost advantage" rather than "universal cost superiority."
