# Phase 2C — Task A Verification Report

Date: 2026-04-16
Executor: Claude Code
Status: **PASS** — all checks match baseline; green to proceed to Task B

---

## Step 1 — Environment

| Check | Expected | Actual | Status |
|---|---|---|---|
| `where.exe python` (first line) | `C:\dev\ine\venv\Scripts\python.exe` | `C:\dev\ine\venv\Scripts\python.exe` (after activation) | PASS |
| `python --version` | 3.13.2 | 3.13.2 | PASS |
| `git rev-parse --abbrev-ref HEAD` | main | main | PASS |
| `git log -1 --oneline` | f65abb9 | f65abb9 Phase 3.1: environment setup and notebook scaffold | PASS |
| Working tree | Clean + 1 untracked | Clean + 2 untracked | PASS (note below) |

**Note:** Baseline listed 1 untracked file (`docs/REPO_FILE_AUDIT.md`). Current state shows 2 untracked: `docs/REPO_FILE_AUDIT.md` and `docs/PHASE_2C_BASELINE.md`. The second file is the baseline snapshot itself, created after the baseline was written. Expected.

---

## Step 2 — Master datasets

| Dataset | Rows | Cols | Exp Rows | Exp Cols | Row OK | Col OK | First Date | Last Date | SHA256 |
|---|---|---|---|---|---|---|---|---|---|
| h1_network_effects.csv | 4384 | 4 | 4384 | 4 | YES | YES | 2020-01-01 | 2025-12-31 | `41424a658c2dd9e9e63c7b24df79de05f4a4b05f1b7dd1b5cc580fc901cddc2f` |
| h2_diffusion_dataset.csv | 861 | 23 | 861 | 23 | YES | YES | (year col) | (year col) | `5602eec7ecba84c843faf57bcccf7080ffd0c68e4aee4008211ed44cf6ea70eb` |
| h3_concentration.csv | 72 | 7 | 72 | 7 | YES | YES | 2020-01-01 | 2025-12-01 | `fe15802b75e55fe46bdff9a49b9ff4bd7b257481e1b26de1a1380d7135b28c64` |
| h4_infrastructure_cost.csv | 72 | 12 | 72 | 12 | YES | YES | 2020-01 | 2025-12 | `7665d0a255c449ef3525408b7d7570113c4103d14bc2cfbfee1fc226eaddc489` |

All 4 datasets match baseline expectations exactly.

---

## Step 3 — H1 reproducibility spot-check

| Date | H1 USDC | usdc_eth raw | USDC match | H1 USDT | usdt_eth+trx raw | USDT match |
|---|---|---|---|---|---|---|
| 2020-01-01 | 1481 | 1481 | TRUE | 28037 | 28037 | TRUE |
| 2022-05-15 | 1030144 | 32778 | FALSE | 704678 | 704678 | TRUE |
| 2023-03-10 | 255327 | 65111 | FALSE | 953663 | 953663 | TRUE |
| 2025-12-31 | 2001557 | 275206 | FALSE | 1465896 | 1465896 | TRUE |

**All values match the baseline document exactly.**

- USDC: 2020-01-01 matches (pre-multi-chain era, `usdc` aggregate == `usdc_eth`). Last 3 dates mismatch because H1 master uses multi-chain aggregate `usdc` series from CoinMetrics, which is NOT on disk in `active_addresses.csv` (that file only has `usdc_eth`). This gap must be resolved in Phase 2C Task B by re-pulling the `usdc` aggregate `AdrActCnt` from the CoinMetrics Community API.
- USDT: all 4 dates match raw `usdt_eth + usdt_trx` sum exactly. Fully reproducible.

---

## Step 4 — CoinMetrics inventory

| File | Rows | Exp Rows | Row OK | Assets | Exp Assets | Asset OK | Size (MB) |
|---|---|---|---|---|---|---|---|
| active_addresses.csv | 8768 | 8768 | YES | [dai, usdc_eth, usdt_eth, usdt_trx] | [dai, usdc_eth, usdt_eth, usdt_trx] | YES | 0.4 |
| eth_fees.csv | 2192 | 2192 | YES | [eth] | [eth] | YES | 0.1 |
| eth_trx_price_usd.csv | 4384 | 4384 | YES | [eth, trx] | [eth, trx] | YES | 0.2 |
| supply.csv | 8768 | 8768 | YES | [dai, usdc_eth, usdt_eth, usdt_trx] | [dai, usdc_eth, usdt_eth, usdt_trx] | YES | 0.5 |
| transaction_counts.csv | 8768 | 8768 | YES | [dai, usdc_eth, usdt_eth, usdt_trx] | [dai, usdc_eth, usdt_eth, usdt_trx] | YES | 0.4 |
| transfer_count.csv | 6576 | 6576 | YES | [usdc, usdt_eth, usdt_trx] | [usdc, usdt_eth, usdt_trx] | YES | 0.3 |
| transfer_counts.csv | 8768 | 8768 | YES | [dai, usdc_eth, usdt_eth, usdt_trx] | [dai, usdc_eth, usdt_eth, usdt_trx] | YES | 0.4 |
| trx_activity.csv | 2192 | 2192 | YES | [trx] | [trx] | YES | 0.1 |

All 8 files match baseline. No unexpected or missing files.

---

## Step 5 — Raw data size audit

### Per-file

| Relative path | Bytes | Human | Extension |
|---|---|---|---|
| chainalysis/SOURCES.md | 3407 | 3.3 KB | .md |
| chainalysis/adoption_index_2020.csv | 5377 | 5.3 KB | .csv |
| chainalysis/adoption_index_2020.pdf | 54774437 | 52.2 MB **>40MB** | .pdf |
| chainalysis/adoption_index_2021.csv | 4884 | 4.8 KB | .csv |
| chainalysis/adoption_index_2021.pdf | 2782818 | 2.7 MB | .pdf |
| chainalysis/adoption_index_2022.csv | 4664 | 4.6 KB | .csv |
| chainalysis/adoption_index_2022.pdf | 4541419 | 4.3 MB | .pdf |
| chainalysis/adoption_index_2023.csv | 4974 | 4.9 KB | .csv |
| chainalysis/adoption_index_2023.pdf | 9644202 | 9.2 MB | .pdf |
| chainalysis/adoption_index_2024.csv | 4292 | 4.2 KB | .csv |
| chainalysis/adoption_index_2024.pdf | 6363017 | 6.1 MB | .pdf |
| chainalysis/adoption_index_2025.csv | 3801 | 3.7 KB | .csv |
| chainalysis/adoption_index_2025.pdf | 10286925 | 9.8 MB | .pdf |
| coinmetrics/active_addresses.csv | 393124 | 383.9 KB | .csv |
| coinmetrics/eth_fees.csv | 145994 | 142.6 KB | .csv |
| coinmetrics/eth_trx_price_usd.csv | 231132 | 225.7 KB | .csv |
| coinmetrics/supply.csv | 524771 | 512.5 KB | .csv |
| coinmetrics/transaction_counts.csv | 395996 | 386.7 KB | .csv |
| coinmetrics/transfer_count.csv | 308135 | 300.9 KB | .csv |
| coinmetrics/transfer_counts.csv | 396743 | 387.4 KB | .csv |
| coinmetrics/trx_activity.csv | 111130 | 108.5 KB | .csv |
| defillama/stablecoin_supply_by_chain.csv | 29883814 | 28.5 MB | .csv |
| defillama/stablecoins_list.csv | 14900 | 14.6 KB | .csv |
| etherscan/usdc_transfers_sample.csv | 16297538 | 15.5 MB | .csv |
| googletrends/ARCHIVE_preaudit/global_search_intensity.csv | 1391 | 1.4 KB | .csv |
| tronscan/usdt_transfers_sample.csv | 254344 | 248.4 KB | .csv |
| worldbank/all_indicators.csv | 319634 | 312.1 KB | .csv |
| worldbank/financial_account_ownership_pct.csv | 26829 | 26.2 KB | .csv |
| worldbank/gdp_per_capita_usd.csv | 95671 | 93.4 KB | .csv |
| worldbank/inflation_cpi_annual_pct.csv | 91717 | 89.6 KB | .csv |
| worldbank/remittance_cost_inbound_pct.csv | 29177 | 28.5 KB | .csv |
| worldbank/remittance_cost_outbound_pct.csv | 14144 | 13.8 KB | .csv |
| worldbank/remittances_received_pct_gdp.csv | 105648 | 103.2 KB | .csv |
| yfinance/USDC_daily_volume.csv | 61338 | 59.9 KB | .csv |
| yfinance/USDT_daily_volume.csv | 63928 | 62.4 KB | .csv |

### Per-subfolder subtotals

| Subfolder | Files | Total bytes | Human |
|---|---|---|---|
| chainalysis | 13 | 88,424,217 | 84.3 MB |
| coinmetrics | 8 | 2,507,025 | 2.4 MB |
| defillama | 2 | 29,898,714 | 28.5 MB |
| etherscan | 1 | 16,297,538 | 15.5 MB |
| googletrends | 1 | 1,391 | 1.4 KB |
| tronscan | 1 | 254,344 | 248.4 KB |
| worldbank | 7 | 682,820 | 666.8 KB |
| yfinance | 2 | 125,266 | 122.3 KB |

### Per-extension subtotals

| Extension | Files | Total bytes | Human |
|---|---|---|---|
| .csv | 28 | 49,795,090 | 47.5 MB |
| .md | 1 | 3,407 | 3.3 KB |
| .pdf | 6 | 88,392,818 | 84.3 MB |

### Grand total

**138,191,315 bytes (131.8 MB)**

### Files >40 MB

- **`chainalysis/adoption_index_2020.pdf`** — 52.2 MB (already gitignored via `*.pdf` rule)

---

## Step 6 — .gitignore state

### Current .gitignore contents

```
# Security
.env

# Python & Jupyter Caches
__pycache__/
*.pyc
.ipynb_checkpoints/

# Data Guardrail — tiered policy
# Raw API/scraper outputs: ignored (large, re-fetchable from source)
data/01_raw/coinmetrics/
data/01_raw/etherscan/
data/01_raw/tronscan/
data/01_raw/defillama/
data/01_raw/worldbank/
data/01_raw/yfinance/

# Raw Chainalysis: track CSVs (manually corrected, irreplaceable), ignore PDFs (53MB+)
data/01_raw/chainalysis/*.pdf

# Intermediate and processed datasets: TRACKED (work product, audit trail)
# Exception: archived broken pre-audit masters (kept locally as evidence, not pushed)
data/03_processed/ARCHIVE/

# PDFs anywhere
*.pdf

# Environment & Presentations
venv/
presentations/

# OS / packaging artifacts
.DS_Store
*.egg-info/


# To be deleted from the repository after the project is complete
AUDIT_REPORT.md
CLAUDE.md
.claude/
Master_Recovery_Roadmap.md
```

### Files tracked under data/01_raw/ (8 files)

```
data/01_raw/chainalysis/SOURCES.md
data/01_raw/chainalysis/adoption_index_2020.csv
data/01_raw/chainalysis/adoption_index_2021.csv
data/01_raw/chainalysis/adoption_index_2022.csv
data/01_raw/chainalysis/adoption_index_2023.csv
data/01_raw/chainalysis/adoption_index_2024.csv
data/01_raw/chainalysis/adoption_index_2025.csv
data/01_raw/googletrends/ARCHIVE_preaudit/global_search_intensity.csv
```

### Files ignored under data/01_raw/

All files under these subdirectories are gitignored:
- `coinmetrics/` (8 files, 2.4 MB)
- `etherscan/` (1 file, 15.5 MB)
- `tronscan/` (1 file, 248.4 KB)
- `defillama/` (2 files, 28.5 MB)
- `worldbank/` (7 files, 666.8 KB)
- `yfinance/` (2 files, 122.3 KB)
- `chainalysis/*.pdf` (6 files, 84.3 MB)

---

## Step 7 — DEAD file reference scan

References are categorized as:
- **NB-output** = printed text in NB01 output cells (not executable code)
- **NB-producer** = NB02 write line that creates the file (no downstream consumer)
- **NB-load** = NB02 code that reads/loads the file
- **docs** = documentation/audit files (REPO_FILE_AUDIT.md, CLEANUP_CHECKLIST, etc.)

| File / Variable | Active code refs | Doc-only refs | Classification | Notes |
|---|---|---|---|---|
| `eth_fees.csv` | 0 (NB01 output only) | 2 | SAFE | NB01 prints filename in analysis output |
| `supply.csv` | 0 | 3 | SAFE | NB02 hits were false positives (`stablecoin_supply_by_chain.csv`); grep for `coinmetrics/supply.csv` returned 0 |
| `transaction_counts.csv` | 0 (NB01 output only) | 3 | SAFE | |
| `trx_activity.csv` | 0 (NB01 output only) | 2 | SAFE | |
| `wb_cleaned.csv` | 1 (NB02 cell 12 producer) | 5 | SAFE | Write-only; zero consumers |
| `cm_active_addresses_cleaned.csv` | 1 (NB02 cell 12 producer) | 3 | SAFE | Write-only; zero consumers |
| `yf_usdc_volume_cleaned.csv` | 1 (NB02 cell 12 producer) | 5 | SAFE | Write-only; zero consumers |
| `yf_usdt_volume_cleaned.csv` | 1 (NB02 cell 12 producer) | 4 | SAFE | Write-only; zero consumers |
| `USDC_daily_volume.csv` | 1 (NB02 cell 3 load) | 4 | KNOWN ISSUE | Loaded by cell 3 but only feeds DEAD intermediate export. Documented in AUDIT_REPORT_V2 section N1 |
| `USDT_daily_volume.csv` | 1 (NB02 cell 3 load) | 3 | KNOWN ISSUE | Same as above |
| `gdp_per_capita_usd.csv` | 0 (NB01 output only) | 3 | SAFE | DATA_DICTIONARY.md lists as raw input |
| `inflation_cpi_annual_pct.csv` | 0 (NB01 output only) | 3 | SAFE | Same |
| `remittances_received_pct_gdp.csv` | 0 (NB01 output only) | 3 | SAFE | Same |
| `financial_account_ownership_pct.csv` | 0 (NB01 output only) | 3 | SAFE | Same |
| `patch_notebook_h4.py` | 0 | 5 | SAFE | README.md tree + docs only |
| **`yf_usdc_df`** (variable) | 3 (NB02: load, standardize, export) | 4 | KNOWN ISSUE | All 3 refs are in deprecated yfinance pipeline |
| **`yf_usdt_df`** (variable) | 3 (NB02: load, standardize, export) | 4 | KNOWN ISSUE | Same |

**No unexpected runtime references found.** The yfinance load/variable references are a known, documented issue (AUDIT_REPORT_V2 section N1, REPO_CLEANUP_CHECKLIST). The cleanup recipe is already specified.

---

## Findings summary

- **Deviations from baseline:** None. All master dataset dimensions, H1 spot-check values, and CoinMetrics inventory match the baseline document exactly.
- **DEAD files with unexpected references:** None. All active-code references are either producers (write-only, zero consumers) or the known yfinance pipeline issue already documented in AUDIT_REPORT_V2 section N1.
- **Files >40 MB requiring inclusion-strategy decision:** 1 file — `chainalysis/adoption_index_2020.pdf` at 52.2 MB. Already gitignored via `*.pdf` rule; no action needed unless the PDF tracking policy changes.
- **H1 USDC reproducibility gap:** Confirmed per baseline. The `usdc` aggregate `AdrActCnt` series used in the H1 master is not present on disk in `active_addresses.csv` (which only has `usdc_eth`). This must be re-pulled from the CoinMetrics Community API in Task B.
- **Recommendation:** **Green to proceed to Task B.** The repo state is clean, all datasets are intact, and no DEAD file has an unexpected dependency that would block cleanup.

---

## Task B — H1 raw input recovery

Date: 2026-04-16
Executor: Claude Code
Status: **PASS**

### API pull summary

- Endpoint: `https://community-api.coinmetrics.io/v4/timeseries/asset-metrics?assets=usdc&metrics=AdrActCnt&frequency=1d&start_time=2020-01-01&end_time=2025-12-31&page_size=10000`
- Rows returned: 2192
- Date range: 2020-01-01 to 2025-12-31
- Pages: 1 (all rows fit in single page)

### Spot-check verification

| Date | Pull value | H1 master value | Match |
|---|---|---|---|
| 2020-01-01 | 1481 | 1481 | PASS |
| 2022-05-15 | 1030144 | 1030144 | PASS |
| 2023-03-10 | 255327 | 255327 | PASS |
| 2025-12-31 | 2001557 | 2001557 | PASS |

### Append verification

- Pre-append rows: 8768
- Pull rows: 2192
- Post-append rows: 10960
- Distinct assets: [dai, usdc, usdc_eth, usdt_eth, usdt_trx]
- Duplicate (asset, time) pairs: 0
- Null values: 0
- Original usdc_eth values preserved: YES (all 4 spot-check dates verified unchanged)

| Date | usdc_eth value (pre) | usdc_eth value (post) | Preserved |
|---|---|---|---|
| 2020-01-01 | 1481 | 1481 | YES |
| 2022-05-15 | 32778 | 32778 | YES |
| 2023-03-10 | 65111 | 65111 | YES |
| 2025-12-31 | 275206 | 275206 | YES |

### Files created

- `scripts/pull_coinmetrics_usdc_active_addresses.py` (permanent, re-runnable)

### Files modified

- `data/01_raw/coinmetrics/active_addresses.csv` (appended 2192 `usdc` aggregate rows; now 10960 rows, 5 assets)

---

## Task C — H1 cell 15 reproducibility patch

Date: 2026-04-16
Executor: Claude Code
Status: **PASS**

### What changed

Cell 15 (id `7daf3c1d`) of notebook 02 was rewritten from "load pre-built
master and verify" to "build H1 from raw inputs and verify rebuild matches
existing master."

### Build logic

- USDC: `usdc` aggregate from both `transfer_count.csv` (TxTfrCnt) and `active_addresses.csv` (AdrActCnt), merged on date (inner join)
- USDT: `usdt_eth + usdt_trx` summed from both files, merged on date (inner join)
- Combined, sorted by [asset, date], saved to `h1_network_effects.csv`

### Verification

- `pd.testing.assert_frame_equal`: PASS (rebuild == existing master)
- SHA256 match (saved file == pre-rewrite backup): PASS (`41424a658c2dd9e9e63c7b24df79de05f4a4b05f1b7dd1b5cc580fc901cddc2f`)
- 8 spot-check values (4 USDC + 4 USDT active_addresses): all PASS
- 6 verification gates (row count, nulls, outlier ratio, date range, SVB, positivity): all PASS
- No other cells modified (26 cells, all IDs unchanged)

### Row counts

- USDC: 2192 rows
- USDT: 2192 rows
- Total: 4384 rows

### Files modified

- `notebooks/02_data_engineering.ipynb` (cell 15 / id `7daf3c1d` rewritten)

---

## Task D — DATA_DICTIONARY.md update

Date: 2026-04-16
Executor: Claude Code
Status: **PASS**

### Changes made

1. H1: Added chain-coverage asymmetry note to Known limitations (USDC = multi-chain aggregate, USDT = ETH + TRX sum)
2. H1: Updated source pipeline description to reference cell 15 and document the aggregation logic
3. H1: Updated `active_addresses` column notes with chain details
4. H2: Fixed raw inputs to reference `all_indicators.csv` instead of individual World Bank files

### Files modified

- `docs/DATA_DICTIONARY.md`

---

## Task E — DEAD file cleanup

Date: 2026-04-16
Status: **PASS**

### Pre-flight

- `where.exe python` first line: `C:\dev\ine\venv\Scripts\python.exe` — PASS
- Branch: `main`, HEAD: `9bf889f Phase 2C: H1 reproducibility fix — raw recovery, cell 15 rebuild, DATA_DICTIONARY update`
- Step 0 pre-deletion grep: all hits for `yf_usdc_df`, `yf_usdt_df`, `USDC_daily_volume`, `USDT_daily_volume`, `yfinance` were in expected locations (NB02 cells 3/107/210, requirements.txt, NB01 historical, README, .gitignore, docs). No unexpected references.

### Part 1: yfinance removal

- Notebook 02 cell 3 (id `031671c2`): removed `yf_usdc_df` and `yf_usdt_df` load lines
- Notebook 02 standardize_dates cell (id `185d87f8`): removed `yf_usdc_df` / `yf_usdt_df` standardize_dates calls
- Notebook 02 cell 12 (id `572ddb60`): removed DEAD `.to_csv()` lines for `wb_cleaned.csv`, `cm_active_addresses_cleaned.csv`, `yf_usdc_volume_cleaned.csv`, `yf_usdt_volume_cleaned.csv`; print statement updated to reflect remaining exports
- Deleted 4 intermediate files: `yf_usdc_volume_cleaned.csv`, `yf_usdt_volume_cleaned.csv`, `wb_cleaned.csv`, `cm_active_addresses_cleaned.csv`
- Deleted `data/01_raw/yfinance/` directory (2 files: `USDC_daily_volume.csv`, `USDT_daily_volume.csv`)
- `pip uninstall yfinance -y` → uninstalled `yfinance-1.2.0` (no dependency cascade)
- `pip uninstall pytrends -y` → uninstalled `pytrends-4.9.2` (no dependency cascade)
- `pip freeze > requirements.txt` → regenerated (147 lines, was 149)
- Cell 3 post-edit execution: **PASS** (all 6 remaining loads returned expected shapes; `gt_df` is None as expected)

### Part 2: DEAD file deletions

- `scripts/patch_notebook_h4.py`: deleted
- CoinMetrics DEAD files (4): `eth_fees.csv`, `supply.csv`, `transaction_counts.csv`, `trx_activity.csv`
- World Bank DEAD files (4): `gdp_per_capita_usd.csv`, `inflation_cpi_annual_pct.csv`, `remittances_received_pct_gdp.csv`, `financial_account_ownership_pct.csv`
- **Total files deleted: 17** (2 yfinance raw + 4 intermediate + 1 script + 4 CM + 4 WB + 2 yfinance-dir-removal = re-counted: 16 files + 1 empty directory)

### Part 3: Post-cleanup verification

| Check | Expected | Actual | Status |
|---|---|---|---|
| `data/01_raw/` file count | 25 (was 35 pre-cleanup; -10 files) | 25 | PASS |
| Notebook 02 cell 3 execution | No error | `CELL3_OK: (3844, 7) (10960, 3) None (72000, 10) (1440, 8) (4384, 3)` | PASS |
| `active_addresses.csv` | 10960 rows, [dai, usdc, usdc_eth, usdt_eth, usdt_trx] | match | PASS |
| `transfer_count.csv` | 6576 rows, [usdc, usdt_eth, usdt_trx] | match | PASS |
| `transfer_counts.csv` | 8768 rows, [dai, usdc_eth, usdt_eth, usdt_trx] | match | PASS |
| `eth_trx_price_usd.csv` | 4384 rows, [eth, trx] | match | PASS |
| requirements.txt — yfinance | Absent | Absent (grep count 0) | PASS |
| requirements.txt — pytrends | Absent | Absent (grep count 0) | PASS |
| requirements.txt — core (pandas/numpy/statsmodels/linearmodels/arch/scipy/matplotlib/pycountry) | 8 present | 8 present | PASS |

### Preserved files confirmed

- `data/01_raw/coinmetrics/active_addresses.csv` — present (10960 rows)
- `data/01_raw/coinmetrics/transfer_count.csv` — present (6576 rows)
- `data/01_raw/coinmetrics/transfer_counts.csv` — present (8768 rows)
- `data/01_raw/coinmetrics/eth_trx_price_usd.csv` — present (4384 rows)
- `data/01_raw/worldbank/all_indicators.csv` — present
- `data/01_raw/worldbank/remittance_cost_inbound_pct.csv` — present (ACTIVE in H4 cell 52efe9ee)
- `data/01_raw/worldbank/remittance_cost_outbound_pct.csv` — present (ACTIVE in H4 cell 52efe9ee)
- `data/01_raw/googletrends/ARCHIVE_preaudit/global_search_intensity.csv` — present
- `data/02_intermediate/ARCHIVE_preaudit/` — present (4 files)
- `data/03_processed/ARCHIVE/` — present (4 files)

### Files to stage for Commit 2

Modified:
- `notebooks/02_data_engineering.ipynb` (cells `031671c2`, `185d87f8`, `572ddb60`)
- `requirements.txt` (yfinance/pytrends removed)
- `docs/PHASE_2C_TASK_A_REPORT.md` (this Task E section appended)

Deleted:
- `data/01_raw/yfinance/USDC_daily_volume.csv`
- `data/01_raw/yfinance/USDT_daily_volume.csv`
- `data/01_raw/coinmetrics/eth_fees.csv`
- `data/01_raw/coinmetrics/supply.csv`
- `data/01_raw/coinmetrics/transaction_counts.csv`
- `data/01_raw/coinmetrics/trx_activity.csv`
- `data/01_raw/worldbank/gdp_per_capita_usd.csv`
- `data/01_raw/worldbank/inflation_cpi_annual_pct.csv`
- `data/01_raw/worldbank/remittances_received_pct_gdp.csv`
- `data/01_raw/worldbank/financial_account_ownership_pct.csv`
- `data/02_intermediate/yf_usdc_volume_cleaned.csv`
- `data/02_intermediate/yf_usdt_volume_cleaned.csv`
- `data/02_intermediate/wb_cleaned.csv`
- `data/02_intermediate/cm_active_addresses_cleaned.csv`
- `scripts/patch_notebook_h4.py`

Note: the ten `data/01_raw/` CSVs are gitignored per `.gitignore`, so they won't appear as tracked deletions — only the intermediate CSVs and `scripts/patch_notebook_h4.py` will show up in `git status`. The gitignored deletions are recorded here for the audit trail.

### Proposed commit message

```
Phase 2C: dead file cleanup and yfinance removal

- Remove yfinance raw loads and exports from notebook 02 (cells 3, 107, 210)
- Remove zero-consumer Phase 2.1 exports (wb_cleaned, cm_active_addresses_cleaned,
  yf_usdc_volume_cleaned, yf_usdt_volume_cleaned)
- Delete scripts/patch_notebook_h4.py (one-shot CP5 utility, job complete)
- Delete 4 DEAD CoinMetrics files and 4 DEAD individual World Bank files
  (superseded by active files: active_addresses, transfer_count[s],
  eth_trx_price_usd, all_indicators, remittance_cost_in/outbound)
- Uninstall yfinance and pytrends from venv; regenerate requirements.txt
- Cell 3 verified to execute top-to-bottom without error

All ACTIVE and EVIDENCE files preserved (ARCHIVE dirs, googletrends preaudit,
chainalysis sources, defillama, etherscan, tronscan). See
docs/PHASE_2C_TASK_A_REPORT.md Task E section for full change list.
```

---

## Task F — README and .gitignore updates

Date: 2026-04-16
Status: **PASS**

### Changes

1. **`.gitignore`**: removed the 6 raw-data subdirectory ignore rules
   (`coinmetrics/`, `etherscan/`, `tronscan/`, `defillama/`, `worldbank/`,
   `yfinance/`). Replaced with an explanatory comment block noting that
   raw CSVs are now tracked for clone-and-reproduce. The PDF ignores
   (`data/01_raw/chainalysis/*.pdf`, global `*.pdf`), ARCHIVE ignore,
   venv/presentations/secrets/caches rules, and the project-closure
   ignore block (`AUDIT_REPORT.md`, `CLAUDE.md`, `.claude/`,
   `Master_Recovery_Roadmap.md`) are all unchanged.
2. **`README.md`**: added "Reproducing This Analysis" section between
   "Research Question" and "Hypotheses" with 3-step clone-and-run
   instructions. Added note under "Setup" that all raw data CSVs are
   committed. Team names left unchanged per instructions.
3. **`data/01_raw/README.md`**: created with per-subdirectory
   documentation of all raw data files, sources, and column/row notes.

### Newly trackable files after .gitignore change (11 total)

```
data/01_raw/README.md                                  (new file)
data/01_raw/coinmetrics/eth_trx_price_usd.csv
data/01_raw/coinmetrics/transfer_count.csv
data/01_raw/coinmetrics/transfer_counts.csv
data/01_raw/defillama/stablecoin_supply_by_chain.csv
data/01_raw/defillama/stablecoins_list.csv
data/01_raw/etherscan/usdc_transfers_sample.csv
data/01_raw/tronscan/usdt_transfers_sample.csv
data/01_raw/worldbank/all_indicators.csv
data/01_raw/worldbank/remittance_cost_inbound_pct.csv
data/01_raw/worldbank/remittance_cost_outbound_pct.csv
```

Note: `data/01_raw/coinmetrics/active_addresses.csv` was already tracked
(force-added in Commit 1 when usdc aggregate rows were appended), so it
does not appear in the newly-untracked list. Chainalysis CSVs and
`SOURCES.md` were already tracked. `googletrends/ARCHIVE_preaudit/
global_search_intensity.csv` was already tracked.

### Files modified
- `.gitignore`
- `README.md`

### Files created
- `data/01_raw/README.md`

---

## Task G — Full notebook 02 re-run

Date: 2026-04-16
Status: **PASS**

### Execution

- Method: `jupyter nbconvert --to notebook --execute --inplace 02_data_engineering.ipynb --ExecutePreprocessor.timeout=300`
- Kernel: fresh (nbconvert spawns a new kernel)
- Cells executed: all
- Errors: none
- Notebook size after execution: 86,199 bytes (outputs refreshed in place)

### Master dataset SHA256 verification

| Dataset | Task A SHA256 (baseline) | Post-run SHA256 | Match |
|---|---|---|---|
| h1_network_effects.csv | `41424a65…cddc2f` | `41424a65…cddc2f` | **YES** |
| h2_diffusion_dataset.csv | `5602eec7…ea70eb` | `5602eec7…ea70eb` | **YES** |
| h3_concentration.csv | `fe15802b…b28c64` | `fe15802b…b28c64` | **YES** |
| h4_infrastructure_cost.csv | `7665d0a2…eaddc489` | `7665d0a2…eaddc489` | **YES** |

All 4 master datasets produce byte-identical output to the Task A baseline.

### Shape sanity checks

| Dataset | Expected | Actual | OK |
|---|---|---|---|
| h1_network_effects.csv | 4384 rows × 4 cols, assets {USDC, USDT} | (4384, 4), {USDC, USDT} | YES |
| h2_diffusion_dataset.csv | 861 rows × 23 cols | (861, 23) | YES |
| h3_concentration.csv | 72 rows × 7 cols | (72, 7) | YES |
| h4_infrastructure_cost.csv | 72 rows × 12 cols | (72, 12) | YES |

### Files to stage for Commit 3

Modified:
- `.gitignore`
- `README.md`
- `notebooks/02_data_engineering.ipynb` (outputs refreshed by the fresh-kernel run)
- `docs/PHASE_2C_TASK_A_REPORT.md` (Task F + G sections appended)

Created (and newly trackable):
- `data/01_raw/README.md`
- `data/01_raw/coinmetrics/eth_trx_price_usd.csv`
- `data/01_raw/coinmetrics/transfer_count.csv`
- `data/01_raw/coinmetrics/transfer_counts.csv`
- `data/01_raw/defillama/stablecoin_supply_by_chain.csv`
- `data/01_raw/defillama/stablecoins_list.csv`
- `data/01_raw/etherscan/usdc_transfers_sample.csv`
- `data/01_raw/tronscan/usdt_transfers_sample.csv`
- `data/01_raw/worldbank/all_indicators.csv`
- `data/01_raw/worldbank/remittance_cost_inbound_pct.csv`
- `data/01_raw/worldbank/remittance_cost_outbound_pct.csv`

Also currently untracked (created during Phase 2C — user can stage if desired):
- `docs/PHASE_2C_BASELINE.md`
- `docs/PHASE_2C_TASK_A_REPORT.md` (this file)
- `docs/REPO_FILE_AUDIT.md`

### Proposed commit message

```
Phase 2C: README updates, raw data tracked for reproducibility

- .gitignore: remove 6 raw-data subdirectory ignore rules so all
  raw CSVs (coinmetrics, defillama, etherscan, tronscan, worldbank)
  are tracked. Chainalysis/global PDF ignores retained.
- README.md: add "Reproducing This Analysis" section with
  clone-to-run instructions. Note that all raw CSVs are committed.
- data/01_raw/README.md: new file documenting each raw data
  subdirectory, file purpose, sources, and column notes.
- notebooks/02_data_engineering.ipynb: refresh cell outputs after
  fresh-kernel re-run (verified all 4 master datasets produce
  byte-identical SHA256 to Task A baseline).
- Track 10 newly committed raw CSVs (coinmetrics x 3, defillama x 2,
  etherscan x 1, tronscan x 1, worldbank x 3) enabling clone-and-
  reproduce without any API calls.
```
