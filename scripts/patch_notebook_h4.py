"""
Patch notebooks/02_data_engineering.ipynb for Phase 2B.5 (H4 repair).

Changes:
  Cell 9  → Fix ETH price merge bug + monthly rolling 95th percentile + TRX→USD
  Cell 17 → New Phase 2B.5 markdown header
  Cell 18 → New H4 master dataset build with raw components
"""

import json
import os
import sys

NB_PATH = os.path.join(os.path.dirname(__file__), "..", "notebooks", "02_data_engineering.ipynb")
NB_PATH = os.path.normpath(NB_PATH)

# ── New cell 9 source (code) ────────────────────────────────────────────
CELL_9_SOURCE = r'''# Phase 2B.5 Fix: USD Normalization with Monthly Rolling Gas Filter
#
# Bugs fixed in this cell:
#   1. eth_price_df merge was unfiltered by asset, doubling rows (ETH + TRX prices both joined)
#   2. Global 95th-percentile gas filter replaced with monthly rolling 95th percentile
#   3. TRX→USD conversion added for Tron side (was never done — fees stayed in TRX)

# ── ETH Side ──────────────────────────────────────────────────────────────
# Filter to ETH prices only (fix: original merged both ETH and TRX rows)
eth_prices_only = eth_price_df[eth_price_df['asset'] == 'eth'][['date', 'PriceUSD']].copy()
eth_tx_df = eth_tx_df.merge(eth_prices_only, on='date', how='left')
eth_tx_df['fee_usd'] = eth_tx_df['fee_eth'] * eth_tx_df['PriceUSD']

assert eth_tx_df['PriceUSD'].notna().all(), "ETH price merge left nulls — check date coverage"

# Monthly rolling 95th-percentile gas filter (replaces global 95th)
initial_count = len(eth_tx_df)
monthly_thresholds = eth_tx_df.groupby('month')['fee_usd'].quantile(0.95).reset_index()
monthly_thresholds.columns = ['month', 'gas_threshold_95_usd']
monthly_thresholds.to_csv(f"{INTERMEDIATE_DIR}eth_gas_filter_thresholds.csv", index=False)

eth_tx_df = eth_tx_df.merge(monthly_thresholds, on='month', how='left')
eth_tx_df = eth_tx_df[eth_tx_df['fee_usd'] <= eth_tx_df['gas_threshold_95_usd']].copy()
eth_tx_df = eth_tx_df.drop(columns=['gas_threshold_95_usd'])

filtered_count = initial_count - len(eth_tx_df)
print(f"ETH: {initial_count:,} raw → {len(eth_tx_df):,} after monthly 95th-pctile filter "
      f"({filtered_count:,} removed, {filtered_count/initial_count*100:.1f}%)")
print(f"  Threshold range: ${monthly_thresholds['gas_threshold_95_usd'].min():.4f}"
      f" – ${monthly_thresholds['gas_threshold_95_usd'].max():.2f}")

# ── Tron Side ─────────────────────────────────────────────────────────────
# TRX→USD conversion using daily TRX price from CoinMetrics
trx_prices_only = eth_price_df[eth_price_df['asset'] == 'trx'][['date', 'PriceUSD']].copy()
trx_prices_only = trx_prices_only.rename(columns={'PriceUSD': 'trx_price_usd'})
tron_tx_df = tron_tx_df.merge(trx_prices_only, on='date', how='left')
tron_tx_df['fee_usd'] = tron_tx_df['fee_trx'] * tron_tx_df['trx_price_usd']

assert tron_tx_df['fee_usd'].notna().all(), "TRX→USD merge left nulls — check date alignment"
print(f"\nTron: TRX→USD conversion complete.")
print(f"  fee_usd range: ${tron_tx_df['fee_usd'].min():.6f} – ${tron_tx_df['fee_usd'].max():.4f}")
print(f"  Mean fee: ${tron_tx_df['fee_usd'].mean():.4f} (was {tron_tx_df['fee_trx'].mean():.4f} TRX)")
'''

# ── New cell 17 source (markdown) ───────────────────────────────────────
CELL_17_SOURCE = r'''## Phase 2B.5: H4 Infrastructure Cost Dataset Repair

**Audit findings addressed:**
- Tron fees were in TRX, not USD → now converted via daily CoinMetrics TRX price
- Tron sample of 20 txns/month was statistically indefensible → expanded to ≥1000/month via TronGrid API
- Cost-savings formula conflated flat and percentage fees → raw components stored for Phase 5 dashboard
- Global 95th percentile gas filter → replaced with monthly rolling 95th percentile
- ETH price merge bug doubled rows (both ETH and TRX prices merged) → fixed by filtering to asset=='eth'

**Design decision:** This cell stores raw cost components (mean/median/p95 fees, WB legacy rates) rather than pre-computed savings. Phase 5's dashboard Cost Calculator computes `legacy_cost(x) = x × legacy_pct_fee + legacy_flat_fee` at user-input time for $200 and $10,000 scenarios.
'''

# ── New cell 18 source (code) ───────────────────────────────────────────
CELL_18_SOURCE = r'''import pandas as pd
import numpy as np
import os

# ── Configuration ─────────────────────────────────────────────────────────
INTERMEDIATE_DIR = "../data/02_intermediate/"
PROCESSED_DIR = "../data/03_processed/"
RAW_DIR = "../data/01_raw/"

# ── 1. Load Transaction-Level Data ────────────────────────────────────────
# Prefer expanded Tron scrape (n≥1000/month); fall back to cleaned (n=20/month)
expanded_path = f"{RAW_DIR}tronscan/usdt_transfers_expanded.csv"
cleaned_path  = f"{INTERMEDIATE_DIR}tronscan_usdt_cleaned.csv"

df_eth = pd.read_csv(f"{INTERMEDIATE_DIR}etherscan_usdc_cleaned.csv")

if os.path.exists(expanded_path) and os.path.getsize(expanded_path) > 1000:
    df_tron = pd.read_csv(expanded_path)
    # Convert block_timestamp (ms) → date for TRX price merge
    df_tron['date'] = pd.to_datetime(df_tron['block_timestamp'], unit='ms').dt.strftime('%Y-%m-%d')
    # TRX→USD conversion on expanded data
    price_df = pd.read_csv(f"{RAW_DIR}coinmetrics/eth_trx_price_usd.csv")
    trx_px = price_df[price_df['asset'] == 'trx'][['time', 'PriceUSD']].copy()
    trx_px['date'] = pd.to_datetime(trx_px['time']).dt.strftime('%Y-%m-%d')
    df_tron = df_tron.merge(trx_px[['date', 'PriceUSD']], on='date', how='left')
    df_tron['fee_usd'] = df_tron['fee_trx'] * df_tron['PriceUSD']
    tron_source = f"expanded (n={len(df_tron):,}, {df_tron['month'].nunique()} months)"
else:
    df_tron = pd.read_csv(cleaned_path)
    tron_source = f"cleaned/original (n={len(df_tron):,}, 20/month — see caveats)"

print(f"ETH:  {len(df_eth):,} rows, {df_eth['month'].nunique()} months")
print(f"Tron: {tron_source}")
assert 'fee_usd' in df_eth.columns, "ETH intermediate missing fee_usd — run cell 9 first"
assert 'fee_usd' in df_tron.columns, "Tron data missing fee_usd — check conversion"

# ── 2. Aggregate ETH (USDC) Monthly Statistics ───────────────────────────
eth_monthly = df_eth.groupby('month').agg(
    eth_mean_fee_usd   = ('fee_usd', 'mean'),
    eth_median_fee_usd = ('fee_usd', 'median'),
    eth_p95_fee_usd    = ('fee_usd', lambda x: x.quantile(0.95)),
    eth_tx_count       = ('fee_usd', 'count'),
).reset_index()

# ── 3. Aggregate Tron (USDT) Monthly Statistics ──────────────────────────
tron_monthly = df_tron.groupby('month').agg(
    tron_mean_fee_usd   = ('fee_usd', 'mean'),
    tron_median_fee_usd = ('fee_usd', 'median'),
    tron_p95_fee_usd    = ('fee_usd', lambda x: x.quantile(0.95)),
    tron_tx_count       = ('fee_usd', 'count'),
).reset_index()

# ── 4. Merge Crypto Fee Panels ───────────────────────────────────────────
h4 = pd.merge(eth_monthly, tron_monthly, on='month', how='inner')

# ── 5. Structural Break Dummy ────────────────────────────────────────────
h4['post_nov_2022'] = (h4['month'] >= '2022-12').astype(int)

# ── 6. World Bank Remittance Cost (Time-Varying) ─────────────────────────
wb_in  = pd.read_csv(f"{RAW_DIR}worldbank/remittance_cost_inbound_pct.csv")
wb_out = pd.read_csv(f"{RAW_DIR}worldbank/remittance_cost_outbound_pct.csv")

wb_in_avg  = wb_in.groupby('year')['value'].mean().reset_index().rename(columns={'value': 'in_pct'})
wb_out_avg = wb_out.groupby('year')['value'].mean().reset_index().rename(columns={'value': 'out_pct'})
wb_yearly  = wb_in_avg.merge(wb_out_avg, on='year', how='outer')
# Average of inbound and outbound global means, convert percentage → decimal
wb_yearly['legacy_pct_fee'] = wb_yearly[['in_pct', 'out_pct']].mean(axis=1) / 100.0

h4['year'] = h4['month'].str[:4].astype(int)
h4 = h4.merge(wb_yearly[['year', 'legacy_pct_fee']], on='year', how='left')
# Forward-fill 2024–2025 from last available year (2023)
last_pct = wb_yearly.loc[wb_yearly['year'] == wb_yearly['year'].max(), 'legacy_pct_fee'].iloc[0]
h4['legacy_pct_fee'] = h4['legacy_pct_fee'].fillna(last_pct)

# No separate flat-fee component in WB RPW data
h4['legacy_flat_fee'] = 0.0
h4 = h4.drop(columns=['year'])

# ── 7. Sort & Export ─────────────────────────────────────────────────────
h4 = h4.sort_values('month').reset_index(drop=True)
h4.to_csv(f"{PROCESSED_DIR}h4_infrastructure_cost.csv", index=False)

# ── 8. Verification ─────────────────────────────────────────────────────
assert len(h4) == 72, f"Expected 72 monthly rows, got {len(h4)}"
assert h4.isna().sum().sum() == 0, f"Nulls remain:\n{h4.isna().sum()[h4.isna().sum()>0]}"
assert (h4['eth_mean_fee_usd'] >= 0).all(), "Negative ETH fees"
assert (h4['tron_mean_fee_usd'] >= 0).all(), "Negative Tron fees"
assert (h4['legacy_pct_fee'] > 0).all(), "Zero/negative legacy fee"

print(f"\n✓ h4_infrastructure_cost.csv saved: {h4.shape[0]} rows × {h4.shape[1]} cols")
print(f"  Columns: {list(h4.columns)}")
print(f"\nFee summary (USD):")
print(f"  ETH  mean:  ${h4['eth_mean_fee_usd'].min():.4f} – ${h4['eth_mean_fee_usd'].max():.2f}")
print(f"  Tron mean:  ${h4['tron_mean_fee_usd'].min():.6f} – ${h4['tron_mean_fee_usd'].max():.4f}")
print(f"  Legacy pct: {h4['legacy_pct_fee'].min()*100:.2f}% – {h4['legacy_pct_fee'].max()*100:.2f}%")
print(f"\nFirst 3 rows:")
display(h4.head(3))
'''


def main():
    with open(NB_PATH, "r", encoding="utf-8") as f:
        nb = json.load(f)

    cells = nb["cells"]
    print(f"Notebook has {len(cells)} cells.")

    # ── Patch cell 9 ───────────────────────────────────────────────────────
    old_9 = "".join(cells[9]["source"])
    assert "USD Normalization" in old_9 or "fee_usd" in old_9, \
        f"Cell 9 doesn't look like the ETH gas filter cell: {old_9[:80]}"
    cells[9]["source"] = CELL_9_SOURCE.strip().split("\n")
    # Re-add newlines (notebook format stores lines with trailing \n except the last)
    cells[9]["source"] = [line + "\n" for line in cells[9]["source"][:-1]] + [cells[9]["source"][-1]]
    cells[9]["outputs"] = []
    print("  Cell 9 patched (ETH merge fix + monthly 95th + TRX->USD)")

    # ── Patch cell 17 ──────────────────────────────────────────────────────
    old_17 = "".join(cells[17]["source"])
    assert "H4" in old_17 or "Cost Friction" in old_17, \
        f"Cell 17 doesn't look like the H4 markdown: {old_17[:80]}"
    cells[17]["source"] = CELL_17_SOURCE.strip().split("\n")
    cells[17]["source"] = [line + "\n" for line in cells[17]["source"][:-1]] + [cells[17]["source"][-1]]
    print("  Cell 17 patched (Phase 2B.5 markdown header)")

    # ── Patch cell 18 ──────────────────────────────────────────────────────
    old_18 = "".join(cells[18]["source"])
    assert "ETH_FILE" in old_18 or "h4_cost_friction" in old_18, \
        f"Cell 18 doesn't look like the H4 build cell: {old_18[:80]}"
    cells[18]["source"] = CELL_18_SOURCE.strip().split("\n")
    cells[18]["source"] = [line + "\n" for line in cells[18]["source"][:-1]] + [cells[18]["source"][-1]]
    cells[18]["outputs"] = []
    print("  Cell 18 patched (Phase 2B.5 H4 master build)")

    # ── Write back ──────────────────────────────────────────────────────────
    with open(NB_PATH, "w", encoding="utf-8", newline="\n") as f:
        json.dump(nb, f, indent=1, ensure_ascii=False)
        f.write("\n")

    print(f"\nNotebook saved to {NB_PATH}")
    # Quick sanity: re-read and confirm cell counts
    with open(NB_PATH, "r", encoding="utf-8") as f:
        nb2 = json.load(f)
    print(f"Re-read: {len(nb2['cells'])} cells (unchanged = good)")


if __name__ == "__main__":
    main()
