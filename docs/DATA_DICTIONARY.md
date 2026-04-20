# Data Dictionary

Column-level documentation for the four hypothesis-ready master datasets in `data/03_processed/`. Built during Phase 2B audit remediation; see `docs/PHASE_2_FIX_LOG.md` for the full repair record.

---

## H1: Network Effects (`h1_network_effects.csv`)

- **Filepath:** `data/03_processed/h1_network_effects.csv`
- **Grain:** asset x date (daily)
- **Row count:** 4,384
- **Date range:** 2020-01-01 to 2025-12-31
- **Source pipeline:** CoinMetrics Community API (`data/01_raw/coinmetrics/transfer_count.csv`, `active_addresses.csv`) -> `notebooks/02_data_engineering.ipynb` (cell 15). USDC uses the `usdc` aggregate ticker from both files; USDT sums `usdt_eth + usdt_trx` from both files.
- **Raw inputs:** `data/01_raw/coinmetrics/transfer_count.csv`, `data/01_raw/coinmetrics/active_addresses.csv`

| Column | Unit | Type | Source | Notes |
|--------|------|------|--------|-------|
| `asset` | -- | string | CoinMetrics | Stablecoin identifier: `USDC`, `USDT` (aggregates `usdt_eth` + `usdt_trx` from CoinMetrics) |
| `date` | YYYY-MM-DD | date | CoinMetrics | UTC daily granularity |
| `active_addresses` | count | int | CoinMetrics `AdrActCnt` | Daily unique active addresses; independent variable for Metcalfe test. USDC: multi-chain aggregate (`usdc` ticker). USDT: Ethereum + Tron sum (`usdt_eth + usdt_trx`). |
| `transfer_count` | count | int | CoinMetrics `TxTfrCnt` | Daily on-chain transfer count; dependent variable for H1. Replaced `TxTfrValAdjUSD` (Pro-tier only, HTTP 403) |

**Known limitations:**
- **Chain-coverage asymmetry:** USDC `active_addresses` reflects the multi-chain aggregate published by CoinMetrics under asset ticker `usdc` (covering Ethereum, Solana, Polygon, Avalanche, Base, Arbitrum, and other chains as aggregated by CoinMetrics). USDT `active_addresses` reflects Ethereum + Tron only (`usdt_eth + usdt_trx`). This asymmetry reflects CoinMetrics' aggregation conventions — the `usdt` aggregate ticker is not available on the Community tier, so USDT is summed from the two dominant chains manually. This should be acknowledged in the H1 narrative.
- Transfer count (`TxTfrCnt`) was chosen over transfer value (`TxTfrValAdjUSD`) because the value metric is paywalled on CoinMetrics Community tier. Count-based Metcalfe tests have literature precedent (Peterson 2018, Wheatley et al. 2018) but beta is expected below 2.0.
- Yahoo Finance volume data was the original H1 source but was deprecated after discovering $83T USDC outliers on 2022-01-26 and 2022-01-29. See `PHASE_2_FIX_LOG.md` and `AUDIT_REPORT.md` for details.

---

## H2: Diffusion & Institutional Gaps (`h2_diffusion_dataset.csv`)

- **Filepath:** `data/03_processed/h2_diffusion_dataset.csv`
- **Grain:** country x year
- **Row count:** 861 (160 countries, 2020-2025; unbalanced panel)
- **Date range:** 2020 to 2025
- **Source pipeline:** Chainalysis adoption index CSVs (`data/01_raw/chainalysis/`) + World Bank indicators (`data/01_raw/worldbank/`) -> `scripts/standardize_country_names.py` + `scripts/apply_chainalysis_standardization.py` + `scripts/clean_worldbank_panel.py` -> `notebooks/02_data_engineering.ipynb` (cells 14-16)
- **Raw inputs:** `data/01_raw/chainalysis/adoption_index_20[20-25].csv`, `data/01_raw/worldbank/all_indicators.csv` (contains GDP per capita, CPI inflation, remittances % GDP, and financial account ownership; cleaned via `scripts/clean_worldbank_panel.py`)

| Column | Unit | Type | Source | Notes |
|--------|------|------|--------|-------|
| `country_iso3` | -- | string (ISO 3166-1 alpha-3) | Derived | Standardized via `scripts/standardize_country_names.py`; join key |
| `country_name` | -- | string | Chainalysis | Canonical English name from Chainalysis reports |
| `year` | year | int | -- | Panel time dimension (2020-2025) |
| `adoption_percentile` | 0.0-1.0 | float | Derived from Chainalysis rank | H2 dependent variable. Formula: `1 - (rank - 1) / (max_rank - 1)`. "Among lowest" countries receive 0.0 |
| `rank` | ordinal | float (NaN for "Among lowest") | Chainalysis | Original Chainalysis ranking; NaN for 12 unranked rows in 2020 |
| `rank_note` | -- | string or NaN | Chainalysis | "Among lowest" for 2020 unranked countries; NaN otherwise |
| `overall_score` | 0-1 | float or NaN | Chainalysis | Non-null for 2020-2021 only (Chainalysis discontinued scores after 2021); robustness use |
| `centralized_service_value_received_rank` | ordinal | float or NaN | Chainalysis | Sub-index; non-null for 2022-2025 |
| `defi_value_received_rank` | ordinal | float or NaN | Chainalysis | Sub-index; non-null for 2022-2025 |
| `institutional_centralized_service_value_received_rank` | ordinal | float or NaN | Chainalysis | Sub-index; non-null for 2025 only |
| `number_of_onchain_deposits_rank` | ordinal | float or NaN | Chainalysis | Sub-index; non-null for 2020 only |
| `onchain_retail_value_received_rank` | ordinal | float or NaN | Chainalysis | Sub-index; non-null for 2020-2021 |
| `onchain_value_received_rank` | ordinal | float or NaN | Chainalysis | Sub-index; non-null for 2020-2021 |
| `p2p_exchange_trade_volume_rank` | ordinal | float or NaN | Chainalysis | Sub-index; non-null for 2020-2023 |
| `retail_centralized_service_value_received_rank` | ordinal | float or NaN | Chainalysis | Sub-index; non-null for 2022-2025 |
| `retail_defi_value_received_rank` | ordinal | float or NaN | Chainalysis | Sub-index; non-null for 2022-2024 |
| `gdp_per_capita_usd` | USD | float or NaN | World Bank WDI (NY.GDP.PCAP.CD) | Current US dollars; NaN where WB has no data |
| `inflation_cpi_annual_pct` | percent | float or NaN | World Bank WDI (FP.CPI.TOTL.ZG) | Annual CPI inflation rate |
| `financial_account_baseline` | percent | float or NaN | World Bank Global Findex (FX.OWN.TOTL.ZS) | Time-invariant within country. Sourced from most recent Findex wave (139 countries at 2024, 5 at 2021, 1 at 2022). Absorbed by country FE in two-way specs |
| `baseline_year` | year | float or NaN | Derived | Year of the Findex observation used for `financial_account_baseline` (2021, 2022, or 2024) |
| `remittances_received_pct_gdp` | percent of GDP | float or NaN | World Bank WDI (BX.TRF.PWKR.DT.GD.ZS) | Personal remittances received as share of GDP |
| `post_2022` | 0/1 | int | Derived | Structural break dummy: 1 if year >= 2023, 0 otherwise |
| `is_forward_filled` | True/False | bool | Derived | True for 2025 observations where WB indicators are forward-filled from 2024 |

**Known limitations:**
- 2025 World Bank indicators are forward-filled from 2024 (no 2025 WB data published yet). The `is_forward_filled` flag enables robustness exclusion in Phase 3.
- `financial_account_baseline` is time-invariant and absorbed by country FE; re-introduce via interaction terms if needed.
- Join attrition: 7 rows (0.8%) from Cuba (0 overlap years), Syria (partial), Yemen (0 overlap years) due to WB data sparsity. No G20 countries affected.
- 8 single-year countries (ATG, LBR, LCA, MCO, MRT, NER, SDN, TCD) should be excluded from two-way FE specifications.
- Sub-index columns vary across years because Chainalysis changed its methodology and published sub-index set each year. Sub-indices available per year: 2020 (number_of_onchain_deposits, onchain_retail_value_received, onchain_value_received, p2p_exchange_trade_volume); 2021 (onchain_retail_value_received, onchain_value_received, p2p_exchange_trade_volume); 2022-2023 (centralized_service_value_received, defi_value_received, p2p_exchange_trade_volume, retail_centralized_service_value_received, retail_defi_value_received); 2024 (centralized_service_value_received, defi_value_received, retail_centralized_service_value_received, retail_defi_value_received); 2025 (centralized_service_value_received, defi_value_received, institutional_centralized_service_value_received, retail_centralized_service_value_received). All column names have `_rank` suffix.
- Google Trends was the original H2 DV but was replaced because global search intensity has no cross-sectional variation. See `AUDIT_REPORT.md`.

---

## H3: Market Concentration (`h3_concentration.csv`)

- **Filepath:** `data/03_processed/h3_concentration.csv`
- **Grain:** month
- **Row count:** 72
- **Date range:** 2020-01-01 to 2025-12-01
- **Source pipeline:** DefiLlama stablecoin supply data (`data/01_raw/defillama/stablecoin_supply_by_chain.csv`) -> `notebooks/02_data_engineering.ipynb` (cells 20-22)
- **Raw inputs:** `data/01_raw/defillama/stablecoin_supply_by_chain.csv`

| Column | Unit | Type | Source | Notes |
|--------|------|------|--------|-------|
| `date` | YYYY-MM-DD | date | Derived | First of month (monthly frequency) |
| `hhi_full` | 0-10,000 | float | Derived | Herfindahl-Hirschman Index across all stablecoins. Computed from market share of total supply |
| `hhi_top5` | 0-10,000 | float | Derived | HHI computed across top-5 stablecoins only; robustness measure |
| `n_stablecoins` | count | int | DefiLlama | Number of stablecoins with non-zero supply in that month |
| `total_supply_usd` | USD | float | DefiLlama | Total stablecoin market supply (sum across all coins and chains) |
| `top_stablecoin` | -- | string | Derived | Symbol of the largest stablecoin by supply that month |
| `top_stablecoin_share` | 0.0-1.0 | float | Derived | Market share of the top stablecoin |

**Known limitations:**
- HHI is computed across stablecoins (not across chains), at monthly frequency, per Roadmap spec.
- DefiLlama supply data uses `circulating` supply (not `total` which includes bridged/locked tokens). Bridge tokens and duplicate stablecoin IDs were filtered during aggregation. See `data/02_intermediate/h3_diagnostic_report.md` for the full diagnostic.
- Terra/UST collapse (May 2022): DefiLlama marks UST supply as ~0 from June 2022 onward (post-depeg). The HHI dip in May-June 2022 reflects USDT gaining share as UST collapsed, not a genuine competitive rebalancing. See the diagnostic report's Terra decomposition section for Phase 4 narrative guidance.
- The H3 dataset did not exist in the pre-audit repo; it was built from scratch in Phase 2B.3.

---

## H4: Infrastructure Cost (`h4_infrastructure_cost.csv`)

- **Filepath:** `data/03_processed/h4_infrastructure_cost.csv`
- **Grain:** month
- **Row count:** 72
- **Date range:** 2020-01 to 2025-12
- **Source pipeline:** Etherscan USDC transfers (`data/01_raw/etherscan/`) + Tronscan USDT transfers (`data/01_raw/tronscan/`) + CoinMetrics prices (`data/01_raw/coinmetrics/eth_trx_price_usd.csv`) + World Bank Remittance Prices Worldwide -> `notebooks/02_data_engineering.ipynb` (cells 9, 18)
- **Raw inputs:** `data/01_raw/etherscan/usdc_transfers_sample.csv`, `data/01_raw/tronscan/usdt_transfers_sample.csv`, `data/01_raw/coinmetrics/eth_trx_price_usd.csv`

| Column | Unit | Type | Source | Notes |
|--------|------|------|--------|-------|
| `month` | YYYY-MM | string | Derived | Monthly aggregation period |
| `eth_mean_fee_usd` | USD | float | Etherscan + CoinMetrics ETH price | Mean USDC transfer fee on Ethereum, after monthly rolling 95th percentile gas filter |
| `eth_median_fee_usd` | USD | float | Etherscan + CoinMetrics ETH price | Median USDC transfer fee on Ethereum |
| `eth_p95_fee_usd` | USD | float | Etherscan + CoinMetrics ETH price | 95th percentile USDC transfer fee on Ethereum |
| `eth_tx_count` | count | int | Etherscan | Number of sampled Ethereum transactions in that month (post-filter); range ~950-1000 |
| `tron_mean_fee_usd` | USD | float | Tronscan + CoinMetrics TRX price | Mean USDT transfer fee on Tron, converted from TRX via daily price |
| `tron_median_fee_usd` | USD | float | Tronscan + CoinMetrics TRX price | Median USDT transfer fee on Tron |
| `tron_p95_fee_usd` | USD | float | Tronscan + CoinMetrics TRX price | 95th percentile USDT transfer fee on Tron |
| `tron_tx_count` | count | int | Tronscan | Number of sampled Tron transactions per month; **n=20 (see limitations)** |
| `post_ftx` | 0/1 | int | Derived | Structural break dummy: 1 if month >= 2022-12, 0 otherwise. Nov 2022 is assigned to pre-crisis since most of the month preceded the Nov 11 FTX collapse, parallel to H2's `post_2022` treatment |
| `legacy_pct_fee` | proportion (e.g. 0.0508) | float | World Bank RPW | Legacy remittance percentage fee by year. 2020=5.08%, 2021=4.60%, 2022=3.95%, 2023=3.85%; 2024-2025 forward-filled from 2023 |
| `legacy_flat_fee` | USD | float | Assumption | Set to 0.0 globally. WB RPW reports blended percentages without a separate flat component |

**Known limitations:**
- **Tron n=20 per month:** Sample expansion to n>=1000 was blocked by TronGrid API rate limits (HTTP 429) and CoinMetrics fee metric paywalling (HTTP 400). The n=20 sample has median within-month CV of 1.29 and 95% CI half-width averaging 62% of the mean. Phase 3 must use medians (not means) as the headline Tron statistic and report CIs explicitly.
- **`legacy_flat_fee` = 0.0 assumption:** WB RPW reports blended percentage averages without separating flat and percentage components. The dashboard (Phase 5) should treat a corridor-typical $3-5 flat fee as a sensitivity case.
- **2024-2025 legacy fee forward-fill:** WB RPW last published 2023 global averages; 2024-2025 use the 2023 value (3.85%). Phase 3 should note this assumption.
- **ETH gas filter:** Monthly rolling 95th percentile (not global). Per-month thresholds logged to `data/02_intermediate/eth_gas_filter_thresholds.csv`.
- **Pre-audit merge bug:** The original H4 pipeline duplicated Etherscan rows (72K -> 136.8K) by merging on date without filtering the price file by asset. Fixed at CP5. Broken version preserved in `data/03_processed/ARCHIVE/`.
- **Tron fees originally in TRX:** Pre-audit pipeline never converted to USD. Fixed at CP5 via CoinMetrics TRX daily price.
- **ETH fee crossover:** In 6 months of 2025 (post-Dencun), ETH mean fees undercut Tron mean fees. H4 should be framed as "congestion-dependent" cost advantage, not universal superiority.

---

# Phase 3 derived variables

Variables introduced during empirical analysis in notebook 03. Unlike
the four master datasets above, these are computed on the fly within
the notebook and not persisted to disk (except where noted). Listed
here so the data dictionary remains complete.

## H1 (§4) derived variables

- `log_transfer_count` = `np.log(transfer_count)`. Computed per
  asset. Requires `transfer_count > 0` (verified in §4.1).
- `log_active_addresses` = `np.log(active_addresses)`. Same
  constraint.

## H3 (§2) derived variables

Variables computed within notebook 03 §2 for the H3 regression
battery. None are persisted to disk; they exist as in-notebook
analytical objects. Documented here so the dictionary mirrors the
analytical surface a Phase 4 reader will encounter.

- `time_index` = monotonic integer 0 to 71 assigned after sorting
  `h3` by `date` ascending. Used as the time regressor in §2.5
  (full-window OLS) and §2.7 (Chow interaction test). Units:
  months from window start (2020-01).
- `time_index_local` = monotonic integer assigned per sub-window
  after sorting and resetting index. Used in §2.6 (post-Dec-2022
  sub-window, range 0 to 35) and §2.8 (post-Jun-2022 sub-window,
  range 0 to 41). Distinct from `time_index` because each sub-
  window regression treats its own first month as time zero.
- `post_dec2022` = binary dummy, 1 if `date >= 2023-01-01`
  else 0. Used in §2.7 Chow interaction specification.
  Cutoff per D-01 headline split.
- `time_x_post` = `time_index * post_dec2022`. Interaction term
  in §2.7 Chow specification. The coefficient on this term is
  the slope difference between post- and pre-Dec-2022 periods;
  its p-value is the test statistic for "does the trend differ
  across the structural break?"
- `hhi_full_diff` = first difference of `hhi_full`,
  `np.diff(h3['hhi_full'].values)`. Length 71 (one shorter than
  levels series). Used in §2.9b first-differenced robustness
  regression. Triggered conditionally per D-16 (ADF on levels
  rejected unit-root at 1%, p=0.0014).

### H3 output artifacts (outputs/ files written by §2)

Files saved to disk by the H3 cells. Listed here so the
dictionary's coverage matches what's on disk. None are
hypothesis-ready datasets — they are analysis outputs.

| File | Path | Source cell | Purpose |
|---|---|---|---|
| `fig_h3_hhi_timeseries.png` | `outputs/figures/` | §2.1 | Two-panel HHI + leader-share figure with four event annotations |
| `tbl_h3_structural_events.csv` / `.tex` | `outputs/tables/` | §2.2 | Five-event ΔHHI decomposition with mover-level breakdown (descriptive per D-15) |
| `tbl_h3_top3_stablecoins.csv` / `.tex` | `outputs/tables/` | §2.3 | Top-3 stablecoins by share at window start (2020-01) and end (2025-12) |
| `fig_h3_trend_overlays.png` | `outputs/figures/` | §2.10 | HHI series with three fitted OLS lines (full-window, post-Dec-2022, post-Jun-2022) and Chow result in caption |
| `tbl_h3_master_summary.csv` / `.tex` | `outputs/tables/` | §2.11 | Six-row consolidated regression results across all H3 specifications, with HAC lag annotations per D-17 |
| `tbl_h3_ols_fullwindow_summary.txt` | `outputs/tables/` | §2.12 | Statsmodels text dumps for full-window specs (§2.5, §2.9, §2.9b) |
| `tbl_h3_ols_sub_samples_summary.txt` | `outputs/tables/` | §2.12 | Statsmodels text dumps for sub-window and Chow specs (§2.6, §2.7, §2.8) |

## H4 (§3) derived variables

Variables computed within notebook 03 §3 for the H4 cost-comparison
battery. None are persisted to disk except where noted via the "H4
output artifacts" table below. Documented here so the dictionary
mirrors the analytical surface a Phase 4 reader will encounter.

**§3.1 derived (legacy cost columns used across §3):**

- `legacy_cost_200` = `200 * legacy_pct_fee + legacy_flat_fee` per
  month. USD. Written in cells 79 (§3.4) and 81 (§3.5). Headline
  scenario uses `legacy_flat_fee = 0` (per D-02); sensitivity uses
  `legacy_flat_fee = 3.50` (reconstructed inline in cells 81 and 83
  as `legacy_cost_200 + 3.50`).
- `legacy_cost_10000` = `10000 * legacy_pct_fee + legacy_flat_fee`
  per month. USD. Same scenario rule as `legacy_cost_200`.

**§3.2 derived (ETH-Tron crossover flags):**

- `eth_undercuts_tron_mean` — boolean, True in months where
  `eth_mean_fee_usd < tron_mean_fee_usd`. Headline construct for
  the §3.2 crossover-counts table per D-21. 6 True values across
  72 months, all in 2025.
- `eth_undercuts_tron_median` — boolean, True in months where
  `eth_median_fee_usd < tron_median_fee_usd`. Secondary column
  in §3.2's table. 0 True values across the window — the Tron
  median saturates at $0 in 14 months, which makes the ETH
  median undercut mathematically impossible there and does not
  occur in the other 58.

**§3.3 derived (break-even transfer sizes):**

- `breakeven_eth_median` — USD per month,
  `eth_median_fee_usd / legacy_pct_fee`. Transfer size at which
  the percentage legacy fee equals the ETH median fee.
- `breakeven_eth_mean` — USD per month, same with
  `eth_mean_fee_usd`.
- `breakeven_tron_median` — USD per month, same with
  `tron_median_fee_usd`. Equals $0 in the 14 months where
  `tron_median_fee_usd == 0`; the annual median is still
  well-defined via positive months.
- `breakeven_tron_mean` — USD per month, same with
  `tron_mean_fee_usd`.

**§3.4 derived (cost-savings ratios):**

- `ratio_eth_med_200` — ratio (dimensionless),
  `legacy_cost_200 / eth_median_fee_usd`. Typical interpretation:
  "legacy is N× more expensive than ETH median at a $200 transfer."
- `ratio_tron_med_200` — ratio, same with Tron median. Set to
  `np.nan` in 14 months where `tron_median_fee_usd == 0`
  (ratio is mathematically undefined there; CONTINUATION CHANGE 5).
- `ratio_eth_med_10000`, `ratio_tron_med_10000` — same at $10,000.

**§3.5/§3.6 derived (paired-test DVs):**

- `diff_200_eth` = `legacy_cost_200 - eth_mean_fee_usd` per month.
  Dependent variable for the §3.5 ETH-at-$200 paired test.
- `diff_200_tron` = `legacy_cost_200 - tron_median_fee_usd` per
  month. Dependent variable for the §3.5 Tron-at-$200 paired test.
- `diff_10000_eth`, `diff_10000_tron`: same at $10,000.
- Sensitivity versions of all four computed with
  `legacy_flat_fee = 3.50` (i.e., `legacy_cost_{size} + 3.50`
  minus the on-chain fee), reconstructed inline.
- The paired test is OLS on a constant with HAC standard errors at
  `maxlags=4` for the full window (n=72) and `maxlags=2` for the
  post-Dencun sub-windows (n=21 headline, n=22 robustness) per
  D-09. The coefficient on the constant is the mean monthly
  legacy-minus-on-chain dollar difference; its t-test is the test
  of H0: mean = 0 per D-10.

### H4 output artifacts (outputs/ files written by §3)

Files saved to disk by the H4 cells. Listed here so the
dictionary's coverage matches what's on disk. None are
hypothesis-ready datasets — they are analysis outputs.

| File | Path | Source cell | Purpose |
|---|---|---|---|
| `tbl_h4_cost_comparison.csv` / `.tex` | `outputs/tables/` | §3.1 (cell 73) | Descriptive cost comparison at $200 and $10,000 with ETH mean / Tron median / Legacy mean and four construct-matched ratios per D-23 |
| `fig_h4_cost_comparison.png` | `outputs/figures/` | §3.1 (cell 73) | Log-scale bar chart of the three D-02 constructs, with an on-bar annotation naming the Tron median value and the 14-month $0-saturation count per D-23 |
| `tbl_h4_crossover_by_year.csv` / `.tex` | `outputs/tables/` | §3.2 (cell 75) | Per-year crossover counts for ETH-mean-vs-Tron-mean (D-21 headline) and ETH-median-vs-Tron-median (secondary column) |
| `fig_h4_eth_tron_overlay.png` | `outputs/figures/` | §3.2 (cell 75) | Four-series log-scale time series: ETH mean, Tron mean (headline bold), ETH median, Tron median (transparency overlays) with Dencun annotation per D-21 |
| `tbl_h4_breakeven_by_year.csv` / `.tex` | `outputs/tables/` | §3.3 (cell 77) | Year-by-year median break-even transfer sizes for the four on-chain statistics (ETH median/mean, Tron median/mean) |
| `tbl_h4_savings_ratio_by_year.csv` / `.tex` | `outputs/tables/` | §3.4 (cell 79) | Year-by-year median of the monthly legacy/on-chain cost ratio at $200 and $10,000. Columns `eth_savings_ratio_median` and `tron_savings_ratio_median` are dimensionless ratios, not dollar savings (renamed from `*_savings_median` per Phase 3.4c audit) |
| `fig_h4_cost_ratio_timeseries.png` | `outputs/figures/` | §3.4 (cell 79) | Log-scale monthly cost-ratio (legacy / on-chain) time series at $10,000 with Dencun and parity annotations |
| `tbl_h4_master_summary.csv` / `.tex` | `outputs/tables/` | §3.7 (cell 85) | 24-row paired-test consolidation: ETH + Tron × $200 + $10,000 × full + post-Dencun-Apr + post-Dencun-Mar × flat=$0 + flat=$3.50 |
| `tbl_h4_paired_tests_summary.txt` | `outputs/tables/` | §3.8 (cell 87) | Full `statsmodels` text dumps for the 24 paired tests (D-08 rule 7) |

## H2 (§4) derived variables

All columns below are created in `notebooks/03_empirical_analysis.ipynb`
§4.2 on the filtered `h2_analysis` frame (raw `h2` minus 8 single-year
countries minus listwise-deletion losses per D-26). They are not
written to disk — they live on the in-memory analysis frame only.

- `log_gdp_per_capita_usd` = `np.log(gdp_per_capita_usd)`. Natural log
  of GDP per capita in current USD. Created to reduce right-skewness
  of the raw level (D-25). NaN where `gdp_per_capita_usd` is NaN or
  zero — no such rows expected in the filtered `h2_analysis`. Enters
  all five headline specs as a control.
- `inflation_winsorized_pct` = `inflation_cpi_annual_pct` winsorised
  symmetrically at the 1st and 99th percentiles of the `h2_analysis`
  distribution. Used only in the §4.11 master-summary robustness row
  (D-25); the headline specs use raw inflation to preserve the
  hyperinflation tail.
- `is_among_lowest` = `(rank_note == "Among lowest")`. Flags rows
  (2020 only) where Chainalysis classified the country into the
  lowest-adoption tier and left `rank` as NaN. The raw `h2` panel
  contains 12 such rows; in `h2_analysis` (after the D-26 cascade) 6
  survive — the other 6 are dropped by the single-year-country filter
  (TCD) or by listwise deletion on World Bank controls (CPV, FJI on
  `financial_account_baseline`; LBY on `remittances_received_pct_gdp`;
  TJK, TKM on `inflation_cpi_annual_pct`). Used only in the §4.8
  robustness drop (D-24); see also D-24 Consequences for the effect on
  the §4.8 row-count.
- `baseline_is_2024` = `(baseline_year == 2024)`. True where the
  Findex baseline observation for that country was drawn from the
  2024 wave (139 countries of 160). Enters spec 5 as the interaction
  dummy `baseline × I(baseline_year == 2024)` (D-04).
- `region_wb` = World Bank region code mapped from `country_iso3`
  (values: `SSA`, `LAC`, `SA`, `EAP`, `MENA`, `ECA`, `NAM_REGION`).
  Used only in the §4.11 regional panel (D-31). Constructed in §4.11
  (Phase 3.5b-α). A collapsed `region_panel` column is also derived,
  mapping `SA` and `EAP` to `SA_EAP` for the three-row regional
  output table.

**Restated panel indicators (already on the raw dataset, used
unchanged):**
- `post_2022` = 1 if `year >= 2023`, 0 otherwise. Structural break
  dummy. Enters specs 1–2 as a main effect; absorbed by year FE in
  specs 3–5 and re-expressed via the `baseline × post_2022`
  interaction (D-27).
- `is_forward_filled` = True for 2025 rows with forward-filled WB
  controls. Used in spec 4 exclusion (D-04).

### H2 output artifacts (outputs/ files written by §4)

Files saved to disk by the H2 cells. Listed so the dictionary's
coverage matches what's on disk. None are hypothesis-ready datasets
— they are analysis outputs.

| File | Path | Source cell | Purpose |
|---|---|---|---|
| `fig_h2_descriptive.png` | `outputs/figures/` | §4.1 (Phase 3.5a) | Adoption percentile distribution by year (faceted), with panel-balance annotation |
| `tbl_h2_descriptive.csv` / `.tex` | `outputs/tables/` | §4.1 (Phase 3.5a) | Panel balance table: countries per year, pct non-missing on each control, mean/SD of DV by year |
| `tbl_h2_master_summary.csv` / `.tex` | `outputs/tables/` | §4.11 (Phase 3.5b) | 5-spec ladder + 3 robustness rows × standard results-table schema (spec, N, beta, SE, ci_low, ci_high, p_value, r2_within, cluster_count, notes) |
| `tbl_h2_regression_tables.txt` | `outputs/tables/` | §4.12 (Phase 3.5b) | `linearmodels` / `statsmodels` full text dumps for all 5 specs + 3 robustness specs + 3 regional specs (D-08 rule 7) |
| `tbl_h2_regional_panel.csv` / `.tex` | `outputs/tables/` | §4.10 (Phase 3.5b) | Spec-3 estimates for SSA, LAC, and SA+EAP splits; descriptive — see D-31 |
| `fig_h2_coefficient_plot.png` | `outputs/figures/` | §4.13 (Phase 3.5b) | Dot-and-whisker of `baseline × post_2022` coefficient with 95% CI across specs 3/4/5 and `baseline` main effect across specs 1/2; D-29 pre-registered-sign shading |
| `fig_h2_binscatter.png` | `outputs/figures/` | §4.13 (Phase 3.5b) | Two-panel binscatter of adoption_percentile on `financial_account_baseline` (residualised against log-GDP), pre/post-2022 |
