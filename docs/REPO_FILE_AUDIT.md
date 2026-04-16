# Repo File Audit — 2026-04-15

## Summary

- **Total files audited:** 95
- **ACTIVE:** 51
- **EVIDENCE:** 27
- **DEAD:** 15
- **UNCLEAR:** 2
- **Total size of DEAD files:** ~2.3 MB (potential cleanup gain)
- **Total size of DEAD tracked files:** ~0.73 MB (git repo size reduction)

| Category | Tracked | Untracked (gitignored) | Total |
|----------|---------|------------------------|-------|
| ACTIVE | 37 | 14 | 51 |
| EVIDENCE | 20 | 7 | 27 |
| DEAD | 5 | 10 | 15 |
| UNCLEAR | 0 | 2 | 2 |
| **Total** | **62** | **33** | **95** |

## Methodology

Static analysis of all files in the repository excluding `venv/`, `.git/`, `__pycache__/`, and `.ipynb_checkpoints/`. File dependencies were extracted by parsing notebook JSON cells and Python scripts for `read_csv`, `to_csv`, `savefig`, `open()`, and `Path()` calls. Files not picked up by pipeline analysis were cross-referenced against `CLAUDE.md`, `Master_Recovery_Roadmap.md`, `AUDIT_REPORT.md`, `AUDIT_REPORT_V2.md`, `PHASE_2_FIX_LOG.md`, `DATA_DICTIONARY.md`, `REPO_CLEANUP_CHECKLIST.md`, and `h3_diagnostic_report.md` for evidence references. Classification defaults to EVIDENCE over DEAD when ambiguous.

---

## Pipeline Dependency Graph

### Notebook 01 (`01_data_validation_and_api.ipynb`)

| Direction | File |
|-----------|------|
| READS | Walks all CSVs under `data/01_raw/` (diagnostic scan) |
| READS | `.env` (ETHERSCAN_API_KEY) |
| WRITES | `data/01_raw/yfinance/USDC_daily_volume.csv` |
| WRITES | `data/01_raw/yfinance/USDT_daily_volume.csv` |

### Notebook 02 (`02_data_engineering.ipynb`)

| Cell | Direction | File | Notes |
|------|-----------|------|-------|
| 3 | READS | `data/01_raw/worldbank/all_indicators.csv` | `keep_default_na=False` |
| 3 | READS | `data/01_raw/coinmetrics/active_addresses.csv` | |
| 3 | READS | `data/01_raw/googletrends/global_search_intensity.csv` | DEPRECATED; guarded by `os.path.exists` |
| 3 | READS | `data/01_raw/yfinance/USDC_daily_volume.csv` | DEPRECATED; still loaded, no guard |
| 3 | READS | `data/01_raw/yfinance/USDT_daily_volume.csv` | DEPRECATED; still loaded, no guard |
| 3 | READS | `data/01_raw/etherscan/usdc_transfers_sample.csv` | |
| 3 | READS | `data/01_raw/tronscan/usdt_transfers_sample.csv` | |
| 3 | READS | `data/01_raw/coinmetrics/eth_trx_price_usd.csv` | |
| 9 | WRITES | `data/02_intermediate/eth_gas_filter_thresholds.csv` | Monthly 95th pctile thresholds |
| 12 | WRITES | `data/02_intermediate/wb_cleaned.csv` | Phase 2.1 export; zero consumers |
| 12 | WRITES | `data/02_intermediate/cm_active_addresses_cleaned.csv` | Phase 2.1 export; zero consumers |
| 12 | WRITES | `data/02_intermediate/yf_usdc_volume_cleaned.csv` | Phase 2.1 export; zero consumers |
| 12 | WRITES | `data/02_intermediate/yf_usdt_volume_cleaned.csv` | Phase 2.1 export; zero consumers |
| 12 | WRITES | `data/02_intermediate/etherscan_usdc_cleaned.csv` | Consumed by cell 18 |
| 12 | WRITES | `data/02_intermediate/tronscan_usdt_cleaned.csv` | Consumed by cell 18 (fallback) |
| 15 | READS | `data/01_raw/coinmetrics/transfer_count.csv` | H1 raw source |
| 15 | READS | `data/01_raw/coinmetrics/active_addresses.csv` | H1 raw source |
| 15 | **READS** | **`data/03_processed/h1_network_effects.csv`** | **Loads pre-built master; see Notable Observations** |
| 16 | READS | `data/02_intermediate/chainalysis_panel_long.csv` | |
| 16 | READS | `data/02_intermediate/wb_panel_cleaned.csv` | |
| 16 | WRITES | `data/03_processed/h2_diffusion_dataset.csv` | |
| 18 | READS | `data/02_intermediate/etherscan_usdc_cleaned.csv` | |
| 18 | READS | `data/01_raw/tronscan/usdt_transfers_expanded.csv` | If exists; fallback below |
| 18 | READS | `data/02_intermediate/tronscan_usdt_cleaned.csv` | Fallback if expanded not found |
| 18 | READS | `data/01_raw/coinmetrics/eth_trx_price_usd.csv` | If expanded path taken |
| 18 | READS | `data/01_raw/worldbank/remittance_cost_inbound_pct.csv` | |
| 18 | READS | `data/01_raw/worldbank/remittance_cost_outbound_pct.csv` | |
| 18 | WRITES | `data/03_processed/h4_infrastructure_cost.csv` | |
| 20 | READS | `data/01_raw/defillama/stablecoin_supply_by_chain.csv` | |
| 20 | WRITES | `data/02_intermediate/h3_stablecoin_monthly_supply.csv` | |
| 22 | READS | `data/02_intermediate/h3_stablecoin_monthly_supply.csv` | |
| 22 | WRITES | `data/03_processed/h3_concentration.csv` | |
| 24 | READS | `data/03_processed/h3_concentration.csv` | Verification gate |

### Notebook 03 (`03_empirical_analysis.ipynb`)

| Direction | File | Notes |
|-----------|------|-------|
| READS | `data/03_processed/h1_network_effects.csv` | |
| READS | `data/03_processed/h2_diffusion_dataset.csv` | |
| READS | `data/03_processed/h3_concentration.csv` | |
| READS | `data/03_processed/h4_infrastructure_cost.csv` | |
| WRITES | `outputs/figures/h1_metcalfe_usdc.png` | TODO (Phase 3) |
| WRITES | `outputs/figures/h1_metcalfe_usdt.png` | TODO (Phase 3) |
| WRITES | `outputs/figures/h3_hhi_timeseries.png` | TODO (Phase 3) |
| WRITES | `outputs/tables/h3_top_stablecoins.csv` | TODO (Phase 3) |
| WRITES | `outputs/figures/h2_adoption_map.png` | TODO (Phase 3) |
| WRITES | `outputs/figures/h4_cost_comparison_200.png` | TODO (Phase 3) |
| WRITES | `outputs/figures/h4_cost_comparison_10000.png` | TODO (Phase 3) |
| WRITES | `outputs/figures/h4_cost_ratio_timeseries.png` | TODO (Phase 3) |

### Scripts

| Script | Reads | Writes | Status |
|--------|-------|--------|--------|
| `extract_chainalysis.py` | `data/01_raw/chainalysis/*.pdf` | `data/01_raw/chainalysis/*.csv` | One-shot; preserved as evidence |
| `standardize_country_names.py` | `data/01_raw/chainalysis/*.csv` (standalone) | stdout | Library module; imported by other scripts |
| `apply_chainalysis_standardization.py` | `data/01_raw/chainalysis/*.csv` | `data/02_intermediate/chainalysis_standardized/*.csv` | One-shot; output is active |
| `clean_worldbank_panel.py` | `data/01_raw/worldbank/all_indicators.csv` | `data/02_intermediate/wb_panel_cleaned.csv` | Active utility |
| `scrape_tronscan_expanded.py` | TronGrid API | `data/01_raw/tronscan/usdt_transfers_expanded.csv` | Failed (rate-limited); evidence |
| `patch_notebook_h4.py` | `notebooks/02_data_engineering.ipynb` | `notebooks/02_data_engineering.ipynb` | One-shot; job complete; DEAD |

---

## Classification by Directory

### Root Files

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `.gitignore` | ACTIVE | 928 B | Yes | Repo configuration; defines tiered data policy | Git |
| `README.md` | ACTIVE | 9,868 B | Yes | Project documentation; Phase 2B.6 deliverable | Human readers |
| `requirements.txt` | ACTIVE | 2,841 B | Yes | Pinned dependencies; Phase 2B.1 deliverable | `pip install -r` |
| `AUDIT_REPORT.md` | ACTIVE | 24,606 B | No (gitignored) | Original Phase 2 audit; referenced by PHASE_2_FIX_LOG and CLAUDE.md §4 | PHASE_2_FIX_LOG, AUDIT_REPORT_V2 |
| `CLAUDE.md` | ACTIVE | 13,948 B | No (gitignored) | Operating manual for all Claude Code sessions | Every session |
| `Master_Recovery_Roadmap.md` | ACTIVE | 32,368 B | No (gitignored) | Authoritative plan for Phases 2B-5; supersedes original roadmap | CLAUDE.md §2, all Phase 3+ work |
| `.env` | ACTIVE | 487 B | No (gitignored) | API keys (ETHERSCAN_API_KEY); correctly excluded for security | NB01 cell 1 |
| `.claude/settings.local.json` | ACTIVE | 253 B | No (gitignored) | Claude Code local configuration | Claude Code |

### `data/01_raw/chainalysis/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `SOURCES.md` | ACTIVE | 3,407 B | Yes | Documents PDF source URLs for Chainalysis data | Human reference |
| `adoption_index_2020.csv` | ACTIVE | 5,377 B | Yes | Raw Chainalysis adoption index; read by `apply_chainalysis_standardization.py` | Script reads |
| `adoption_index_2021.csv` | ACTIVE | 4,884 B | Yes | Same as above | Script reads |
| `adoption_index_2022.csv` | ACTIVE | 4,664 B | Yes | Same as above | Script reads |
| `adoption_index_2023.csv` | ACTIVE | 4,974 B | Yes | Same as above | Script reads |
| `adoption_index_2024.csv` | ACTIVE | 4,292 B | Yes | Same as above | Script reads |
| `adoption_index_2025.csv` | ACTIVE | 3,801 B | Yes | Same as above | Script reads |
| `adoption_index_2020.pdf` | EVIDENCE | 54.8 MB | No (gitignored) | Source PDF for 2020 data extraction; heavy archival candidate | REPO_CLEANUP_CHECKLIST "Heavy archival" |
| `adoption_index_2021.pdf` | EVIDENCE | 2.8 MB | No (gitignored) | Source PDF for 2021 data extraction | Same |
| `adoption_index_2022.pdf` | EVIDENCE | 4.5 MB | No (gitignored) | Source PDF for 2022 data extraction | Same |
| `adoption_index_2023.pdf` | EVIDENCE | 9.6 MB | No (gitignored) | Source PDF for 2023 data extraction | Same |
| `adoption_index_2024.pdf` | EVIDENCE | 6.4 MB | No (gitignored) | Source PDF for 2024 data extraction | Same |
| `adoption_index_2025.pdf` | EVIDENCE | 10.3 MB | No (gitignored) | Source PDF for 2025 data extraction | Same |

### `data/01_raw/googletrends/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `ARCHIVE_preaudit/global_search_intensity.csv` | EVIDENCE | 1,391 B | Yes | Deprecated Google Trends raw data; H2 DV replaced by Chainalysis per audit | PHASE_2_FIX_LOG §2B.4.a; CLAUDE.md §10 |

### `data/01_raw/coinmetrics/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `active_addresses.csv` | ACTIVE | 393 KB | No (gitignored) | Read by NB02 cells 3, 15 (H1 build) | NB02 cell 3, cell 15 |
| `eth_trx_price_usd.csv` | ACTIVE | 231 KB | No (gitignored) | Read by NB02 cells 9, 18 (ETH/TRX price conversion) | NB02 cells 9, 18 |
| `transfer_count.csv` | ACTIVE | 308 KB | No (gitignored) | Read by NB02 cell 15 (H1 build); contains TxTfrCnt for usdc, usdt_eth, usdt_trx | NB02 cell 15; DATA_DICTIONARY H1 |
| `eth_fees.csv` | DEAD | 146 KB | No (gitignored) | Not consumed by any active cell; vestigial Phase 1 API pull. Contains FeeTotNtv/TxCnt for eth (2,192 rows). H4 uses Etherscan transaction data, not CoinMetrics fee aggregates | N/A |
| `supply.csv` | DEAD | 525 KB | No (gitignored) | Not consumed by active pipeline; H3 uses DefiLlama supply data, not CoinMetrics. Contains SplyCur for 4 assets (8,768 rows) | N/A |
| `transaction_counts.csv` | DEAD | 396 KB | No (gitignored) | Not consumed; contains TxCnt (transaction count), different from TxTfrCnt (transfer count) used in H1. Vestigial Phase 1 pull | N/A |
| `trx_activity.csv` | DEAD | 111 KB | No (gitignored) | Not consumed; contains AdrActCnt/TxCnt for trx (2,192 rows). Active addresses are sourced from `active_addresses.csv` instead | N/A |
| `transfer_counts.csv` | UNCLEAR | 397 KB | No (gitignored) | Similar name to `transfer_count.csv` (singular) but different size (397 KB vs 308 KB, 8,768 vs ~6,576 rows). May contain TxTfrCnt for 4 assets vs 3. **Question:** Is this a superset of `transfer_count.csv` with an additional asset? If so, which is canonical? REPO_CLEANUP_CHECKLIST flags this for investigation | REPO_CLEANUP_CHECKLIST §"Investigate before deleting" |

### `data/01_raw/defillama/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `stablecoin_supply_by_chain.csv` | ACTIVE | 29.9 MB | No (gitignored) | Read by NB02 cell 20 (H3 sub-step 2); 828K rows | NB02 cell 20 |
| `stablecoins_list.csv` | UNCLEAR | 14.9 KB | No (gitignored) | Reference lookup table (342 stablecoins: id, name, symbol, peg_type, peg_mechanism). Not loaded by any active notebook cell. **Question:** Was this used during the H3 diagnostic investigation? If so, should it be kept as reference documentation for stablecoin ID → name mapping? | N/A |

### `data/01_raw/etherscan/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `usdc_transfers_sample.csv` | ACTIVE | 16.3 MB | No (gitignored) | Read by NB02 cell 3; 72,000 USDC transfer transactions | NB02 cell 3 |

### `data/01_raw/tronscan/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `usdt_transfers_sample.csv` | ACTIVE | 254 KB | No (gitignored) | Read by NB02 cell 3; 1,440 USDT transfer transactions (20/month) | NB02 cell 3 |

### `data/01_raw/worldbank/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `all_indicators.csv` | ACTIVE | 320 KB | No (gitignored) | Read by NB02 cell 3 and `scripts/clean_worldbank_panel.py`; contains all 4 WB indicators in long format (3,844 rows) | NB02 cell 3; clean_worldbank_panel.py line 96 |
| `remittance_cost_inbound_pct.csv` | ACTIVE | 29 KB | No (gitignored) | Read by NB02 cell 18 for H4 legacy cost computation (385 rows) | NB02 cell 18 |
| `remittance_cost_outbound_pct.csv` | ACTIVE | 14 KB | No (gitignored) | Read by NB02 cell 18 for H4 legacy cost computation (178 rows) | NB02 cell 18 |
| `financial_account_ownership_pct.csv` | DEAD | 27 KB | No (gitignored) | Not consumed by active code; `clean_worldbank_panel.py` reads from `all_indicators.csv` which contains this indicator. Standalone Phase 1 pull, now redundant | N/A |
| `gdp_per_capita_usd.csv` | DEAD | 96 KB | No (gitignored) | Same as above; GDP data is in `all_indicators.csv` | N/A |
| `inflation_cpi_annual_pct.csv` | DEAD | 92 KB | No (gitignored) | Same as above; inflation data is in `all_indicators.csv` | N/A |
| `remittances_received_pct_gdp.csv` | DEAD | 106 KB | No (gitignored) | Same as above; remittance share data is in `all_indicators.csv`. Note: distinct from `remittance_cost_*.csv` which ARE active | N/A |

### `data/01_raw/yfinance/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `USDC_daily_volume.csv` | DEAD | 61 KB | No (gitignored) | Yahoo Finance deprecated for H1 per CLAUDE.md §10 ($83T USDC outliers). Still loaded by NB02 cell 3 (no `os.path.exists` guard) but only used in deprecated Phase 2.1 intermediate export. REPO_CLEANUP_CHECKLIST provides 7-step removal recipe | REPO_CLEANUP_CHECKLIST §"Investigate"; PHASE_2_FIX_LOG §2B.2 |
| `USDT_daily_volume.csv` | DEAD | 64 KB | No (gitignored) | Same as above | Same |

### `data/02_intermediate/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `chainalysis_panel_long.csv` | ACTIVE | 56 KB | Yes | Read by NB02 cell 16 for H2 panel join; 868 rows, 162 countries | NB02 cell 16 |
| `chainalysis_standardized/adoption_index_2020.csv` | ACTIVE | 5,854 B | Yes | Standardized with ISO3 codes; input to `chainalysis_panel_long.csv` build | NB02 pipeline |
| `chainalysis_standardized/adoption_index_2021.csv` | ACTIVE | 5,214 B | Yes | Same | Same |
| `chainalysis_standardized/adoption_index_2022.csv` | ACTIVE | 5,121 B | Yes | Same | Same |
| `chainalysis_standardized/adoption_index_2023.csv` | ACTIVE | 5,464 B | Yes | Same | Same |
| `chainalysis_standardized/adoption_index_2024.csv` | ACTIVE | 4,749 B | Yes | Same | Same |
| `chainalysis_standardized/adoption_index_2025.csv` | ACTIVE | 4,294 B | Yes | Same | Same |
| `cm_active_addresses_cleaned.csv` | DEAD | 244 KB | Yes | Produced by NB02 cell 12 (Phase 2.1 export) but zero downstream consumers. H1 rebuild reads raw `active_addresses.csv` directly. Write-only output | N/A |
| `eth_gas_filter_thresholds.csv` | ACTIVE | 2,006 B | Yes | Produced by NB02 cell 9; documents per-month gas filter thresholds for H4 reproducibility (72 rows) | DATA_DICTIONARY H4 |
| `etherscan_usdc_cleaned.csv` | ACTIVE | 18.2 MB | Yes | Produced by NB02 cell 12; read by NB02 cell 18 for H4 build | NB02 cell 18 |
| `h3_diagnostic_report.md` | ACTIVE | 20 KB | Yes | Contains H3 diagnostic narrative, Terra collapse decomposition, and Phase 3/4 narrative notes. Referenced by CLAUDE.md §10, NB03 markdown | CLAUDE.md §10; NB03 H3 section |
| `h3_stablecoin_monthly_supply.csv` | ACTIVE | 220 KB | Yes | Produced by NB02 cell 20; read by NB02 cell 22 for HHI computation | NB02 cell 22 |
| `tronscan_usdt_cleaned.csv` | ACTIVE | 303 KB | Yes | Produced by NB02 cell 12; read by NB02 cell 18 as fallback for H4 build | NB02 cell 18 |
| `wb_cleaned.csv` | DEAD | 354 KB | Yes | Produced by NB02 cell 12 (Phase 2.1 export); zero consumers. Superseded by `wb_panel_cleaned.csv` produced by `clean_worldbank_panel.py` | REPO_CLEANUP_CHECKLIST §"Confirmed deletable" |
| `wb_panel_cleaned.csv` | ACTIVE | 110 KB | Yes | Produced by `clean_worldbank_panel.py`; read by NB02 cell 16 for H2 join | NB02 cell 16 |
| `yf_usdc_volume_cleaned.csv` | DEAD | 66 KB | Yes | Produced by NB02 cell 12; zero consumers. H1 DV switched from Yahoo Finance to CoinMetrics TxTfrCnt | REPO_CLEANUP_CHECKLIST §"Investigate"; PHASE_2_FIX_LOG §2B.2 |
| `yf_usdt_volume_cleaned.csv` | DEAD | 68 KB | Yes | Same as above | Same |

### `data/02_intermediate/ARCHIVE_preaudit/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `gt_global_intensity_cleaned.csv` | EVIDENCE | 1,549 B | Yes | Pre-audit Google Trends cleaned output; retained as audit trail | REPO_CLEANUP_CHECKLIST §"Investigate" |
| `wb_cleaned_PREAUDIT.csv` | EVIDENCE | 354 KB | Yes | Pre-audit World Bank cleaned output (before Namibia fix, before aggregate region removal) | Audit trail |
| `yf_usdc_volume_cleaned.csv` | EVIDENCE | 66 KB | Yes | Pre-audit Yahoo Finance USDC cleaned output (contains $83T outliers); audit trail evidence | AUDIT_REPORT.md; PHASE_2_FIX_LOG §2B.2 |
| `yf_usdt_volume_cleaned.csv` | EVIDENCE | 68 KB | Yes | Pre-audit Yahoo Finance USDT cleaned output; audit trail | Same |

### `data/03_processed/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `h1_network_effects.csv` | ACTIVE | 138 KB | Yes | H1 master dataset; read by NB03 cell a0000011 and NB02 cell 15 | NB03; NB02 cell 15 |
| `h2_diffusion_dataset.csv` | ACTIVE | 131 KB | Yes | H2 master dataset; read by NB03 cell a0000031 | NB03 |
| `h3_concentration.csv` | ACTIVE | 4,389 B | Yes | H3 master dataset; read by NB03 cell a0000021 and NB02 cell 24 (verification) | NB03; NB02 cell 24 |
| `h4_infrastructure_cost.csv` | ACTIVE | 11 KB | Yes | H4 master dataset; read by NB03 cell a0000041 | NB03 |

### `data/03_processed/ARCHIVE/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `h1_network_effects.csv` | EVIDENCE | 214 KB | Yes | Broken pre-audit H1 master (Yahoo Finance source with $83T outliers); retained per CLAUDE.md §2 | CLAUDE.md §2; PHASE_2_FIX_LOG §2B.2 |
| `h2_diffusion_dataset.csv` | EVIDENCE | 114 KB | Yes | Broken pre-audit H2 master (Google Trends DV, WB aggregates); retained per CLAUDE.md §2 | CLAUDE.md §2; PHASE_2_FIX_LOG §2B.4 |
| `h4_infrastructure_cost.csv` | EVIDENCE | 9,148 B | Yes | Broken pre-audit H4 master (TRX not USD, duplicated ETH rows); retained per CLAUDE.md §2 | CLAUDE.md §2; PHASE_2_FIX_LOG §2B.5 |
| `h2_diffusion_dataset_pre_cell17_fix.csv` | EVIDENCE | 131 KB | No (gitignored) | Intermediate checkpoint during H2 cell 17 fix; audit trail | Audit trail |

### `docs/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `AUDIT_REPORT_V2.md` | ACTIVE | 17 KB | Yes | Phase 2B closure re-audit; authorizes Phase 3 entry | CLAUDE.md §5 |
| `CHECKPOINT_1_REPORT.md` | EVIDENCE | 7,944 B | Yes | Phase 2B checkpoint working artifact; content captured in PHASE_2_FIX_LOG | REPO_CLEANUP_CHECKLIST §"Confirmed deletable post-Phase 3" |
| `CHECKPOINT_2_REPORT.md` | EVIDENCE | 5,481 B | Yes | Same | Same |
| `CHECKPOINT_3_REPORT.md` | EVIDENCE | 18 KB | Yes | Same | Same |
| `CHECKPOINT_4_REPORT.md` | EVIDENCE | 8,840 B | Yes | Same | Same |
| `CHECKPOINT_5_REPORT.md` | EVIDENCE | 6,999 B | Yes | Same | Same |
| `CHECKPOINT_6_REPORT.md` | EVIDENCE | 5,252 B | Yes | Same | Same |
| `CP6_ASSERTIONS_AUDIT.md` | EVIDENCE | 3,029 B | Yes | Assertions coverage record for Phase 2B | REPO_CLEANUP_CHECKLIST §"Files to keep" |
| `DATA_DICTIONARY.md` | ACTIVE | 13 KB | Yes | Column-level documentation for all 4 master datasets | CLAUDE.md §5; NB03 references |
| `ISO3_MAPPING_REPORT.md` | EVIDENCE | 17 KB | Yes | Full country name → ISO3 mapping audit trail | REPO_CLEANUP_CHECKLIST §"Files to keep" |
| `PHASE_2B4_PLANNING.md` | EVIDENCE | 23 KB | Yes | Working planning document for H2 panel construction; key decisions captured in PHASE_2_FIX_LOG | REPO_CLEANUP_CHECKLIST §"Confirmed deletable post-Phase 3" |
| `PHASE_2_FIX_LOG.md` | ACTIVE | 15 KB | Yes | Audit remediation record; referenced by CLAUDE.md §4, AUDIT_REPORT_V2, DATA_DICTIONARY | CLAUDE.md §4 |
| `REPO_CLEANUP_CHECKLIST.md` | ACTIVE | 7,669 B | Yes | Forward-looking cleanup reference for Phase 4; enumerates deletable files with recipes | Active planning doc |

### `notebooks/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `01_data_validation_and_api.ipynb` | ACTIVE | 11 KB | Yes | Phase 1: data fetch and diagnostic scan | Pipeline step 1 |
| `02_data_engineering.ipynb` | ACTIVE | 51 KB | Yes | Phase 2/2B: cleaning, transformation, master dataset builds | Pipeline step 2 |
| `03_empirical_analysis.ipynb` | ACTIVE | 18 KB | Yes | Phase 3: empirical analysis scaffold (TODO cells with imports and structure) | Pipeline step 3 |

### `scripts/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `apply_chainalysis_standardization.py` | EVIDENCE | 6,205 B | Yes | One-shot transformation that produced `chainalysis_standardized/` CSVs during CP2. No runtime dependency — output is active but script won't be re-run | REPO_CLEANUP_CHECKLIST §"Confirmed deletable post-Phase 3" |
| `clean_worldbank_panel.py` | ACTIVE | 14 KB | Yes | Produces `wb_panel_cleaned.csv`; reusable WB cleaning utility with `keep_default_na=False` fix | NB02 consumes output; REPO_CLEANUP_CHECKLIST §"Files to keep" |
| `extract_chainalysis.py` | EVIDENCE | 9,407 B | Yes | Preserved with prominent WARNING header documenting 3 known issues; canonical source is CSVs not script output. Documents extraction methodology | PHASE_2_FIX_LOG §2B.4.a; REPO_CLEANUP_CHECKLIST §"Files to keep" |
| `patch_notebook_h4.py` | DEAD | 13 KB | Yes | One-shot notebook cell surgery for H4 repair (patched cells 9, 17, 18). Job complete — the notebook already has the correct cells. No runtime dependency | REPO_CLEANUP_CHECKLIST §"Confirmed deletable post-Phase 3" |
| `scrape_tronscan_expanded.py` | EVIDENCE | 9,884 B | Yes | Failed Option A for Tron sample expansion (rate-limited at ~100 calls). Preserved as evidence that expansion was attempted before accepting n=20 limitation | PHASE_2_FIX_LOG §2B.5; REPO_CLEANUP_CHECKLIST §"Confirmed deletable post-Phase 3" |
| `standardize_country_names.py` | ACTIVE | 7,516 B | Yes | Reusable ISO3 mapping module; imported by `apply_chainalysis_standardization.py` and `clean_worldbank_panel.py`. May be needed in Phase 3 | REPO_CLEANUP_CHECKLIST §"Files to keep" |

### `dashboard/`

| Path | Class | Size | Tracked | Reason | Reader / Evidence ref |
|------|-------|------|---------|--------|-----------------------|
| `app.py` | ACTIVE-PLACEHOLDER | 0 B | Yes | Empty stub for Phase 5 Streamlit dashboard per Roadmap §5.1 | Master_Recovery_Roadmap.md §5 |

---

## Sanity Checks Against CLAUDE.md Expectations

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| 4 master datasets at `data/03_processed/` | h1, h2, h3, h4 tracked | All 4 present and tracked | PASS |
| 3 archived broken masters at `data/03_processed/ARCHIVE/` | h1, h2, h4 per CLAUDE.md §2 | All 3 present and tracked. Additional `h2_diffusion_dataset_pre_cell17_fix.csv` exists (untracked/gitignored) | PASS (extra file is benign) |
| `data/02_intermediate/h3_diagnostic_report.md` exists and tracked | Yes | Confirmed: 20 KB, tracked | PASS |
| 6 Chainalysis standardized CSVs at `chainalysis_standardized/` | 2020-2025 | All 6 present and tracked | PASS |
| `.gitignore` excludes venv/, .env, presentations/, __pycache__/ | All excluded | Confirmed in .gitignore lines 1-8, 29-30 | PASS |
| `.gitignore` excludes raw data subdirs (coinmetrics, etherscan, etc.) | Excluded | Lines 11-16: coinmetrics, etherscan, tronscan, defillama, worldbank, yfinance all excluded | PASS |
| `.gitignore` excludes `data/03_processed/ARCHIVE/` | Excluded | Line 23: `data/03_processed/ARCHIVE/` | PASS |
| `.gitignore` excludes Claude-related files | AUDIT_REPORT.md, CLAUDE.md, .claude/, Master_Recovery_Roadmap.md | Lines 38-41: all excluded | PASS |
| Every script referenced by a notebook or another script | All 6 scripts checked | `patch_notebook_h4.py` is NOT referenced by any notebook/script at runtime (one-shot, DEAD). `scrape_tronscan_expanded.py` output checked by NB02 cell 18 but script itself not called. `extract_chainalysis.py` not referenced at runtime. `apply_chainalysis_standardization.py` not referenced at runtime. `clean_worldbank_panel.py` produces active output but is not called by notebooks. `standardize_country_names.py` imported by 2 other scripts | PASS (all accounted for) |

---

## Findings Requiring User Input (UNCLEAR Items)

1. **`data/01_raw/coinmetrics/transfer_counts.csv` (plural, 397 KB, 8,768 rows)**
   - Active pipeline uses `transfer_count.csv` (singular, 308 KB). Both contain column `TxTfrCnt` but differ in size — plural may contain 4 assets (8,768 = 4 × 2,192 days) vs 3 assets in singular (usdc, usdt_eth, usdt_trx).
   - **Question:** What assets does `transfer_counts.csv` contain? If it includes an extra asset (e.g., `usdt` aggregate), is it the original pull before the H1 build was refined? If purely a superset, safe to delete. Already flagged in `REPO_CLEANUP_CHECKLIST`.

2. **`data/01_raw/defillama/stablecoins_list.csv` (15 KB, 342 rows)**
   - Reference lookup table with columns: `id, name, symbol, peg_type, peg_mechanism`. Not loaded by any active notebook cell.
   - **Question:** Was this used during the H3 diagnostic investigation to identify stablecoin IDs? If so, it may be worth keeping as documentation for the ID→name mapping used in H3. If it was just an exploratory download, it's safely deletable.

---

## Notable Methodological Observations

### 1. H1 Master Dataset Is Not Reconstructed from Raw by Notebook 02

**Critical finding.** Notebook 02 cell 15 (the H1 build cell) loads raw CoinMetrics data (`transfer_count.csv`, `active_addresses.csv`) for context, but then executes:

```python
h1 = pd.read_csv(f'{OUTPUT_DIR}h1_network_effects.csv')
```

This loads the **pre-built** master dataset from `data/03_processed/` rather than actually constructing it from raw inputs. The cell then runs verification gates on the loaded data but does not write it. This means:

- **If `h1_network_effects.csv` is lost or corrupted, notebook 02 cannot regenerate it.** The notebook would need to be modified to actually perform the USDT chain aggregation (summing `usdt_eth` + `usdt_trx` transfer counts and active addresses) and output the result.
- The comment in the cell explains this: *"The pre-built h1_network_effects.csv used 'usdc' aggregate AdrActCnt pulled fresh from the API for consistency with aggregate TxTfrCnt."* The `usdc` aggregate `AdrActCnt` is not in `active_addresses.csv` (which has `usdc_eth`), so the file was built with a fresh API pull that isn't captured in the raw data layer.
- **Risk level:** Low (the file exists and is tracked in git), but this is a reproducibility gap that should be documented or addressed before final submission.

### 2. Notebook 02 Cell 3 Still Loads Deprecated Yahoo Finance Files

Cell 3 unconditionally loads:
```python
yf_usdc_df = pd.read_csv(f"{RAW_DIR}yfinance/USDC_daily_volume.csv")
yf_usdt_df = pd.read_csv(f"{RAW_DIR}yfinance/USDT_daily_volume.csv")
```

These DataFrames are only consumed by the Phase 2.1 intermediate export in cell 12 (writing `yf_usdc_volume_cleaned.csv` and `yf_usdt_volume_cleaned.csv`, both zero-consumer DEAD files). The loads have no `os.path.exists` guard, so **deleting the yfinance raw files would break notebook 02's top-to-bottom execution**. The REPO_CLEANUP_CHECKLIST provides a concrete 7-step removal recipe. This is documented in AUDIT_REPORT_V2 §N1 as a minor issue deferred to Phase 4.

### 3. DATA_DICTIONARY Lists Individual WB Files as H2 Raw Inputs, but Pipeline Uses `all_indicators.csv`

The DATA_DICTIONARY §H2 states raw inputs include `data/01_raw/worldbank/gdp_per_capita_usd.csv`, `inflation_cpi_annual_pct.csv`, `remittances_received_pct_gdp.csv`, and `financial_account_ownership_pct.csv`. However, the actual pipeline (`clean_worldbank_panel.py`) reads only `all_indicators.csv`, which contains all four indicators in long format. The individual files are vestigial Phase 1 API pulls and are classified as DEAD. The DATA_DICTIONARY should be updated to reflect the actual pipeline input if this is cleaned up.

### 4. Write-Only Tracked Intermediates

Three tracked files in `data/02_intermediate/` are produced by notebook 02 cell 12 but have zero downstream consumers:
- `cm_active_addresses_cleaned.csv` (244 KB)
- `wb_cleaned.csv` (354 KB)
- `yf_usdc_volume_cleaned.csv` + `yf_usdt_volume_cleaned.csv` (134 KB combined)

These are Phase 2.1 atomic exports that were superseded by the Phase 2B rebuild. They add ~732 KB to the git repo without serving any pipeline or evidence purpose. The `wb_cleaned.csv` case is already flagged in `REPO_CLEANUP_CHECKLIST`.

### 5. `outputs/` Directories Do Not Yet Exist on Disk

Notebook 03 creates `outputs/figures/` and `outputs/tables/` via `os.makedirs(..., exist_ok=True)` at runtime. These directories currently do not exist in the repo and contain no files. They will be populated when Phase 3 regressions are executed. This is expected behavior.

---

## Proposed Cleanup Actions (Informational — Do Not Execute)

### Immediate (pre-Phase 3, low risk)

| Action | Files | Size Reclaimed | Risk |
|--------|-------|----------------|------|
| Delete `scripts/patch_notebook_h4.py` | 1 tracked file | 13 KB | None — one-shot, job complete |

### Phase 4 cleanup (per REPO_CLEANUP_CHECKLIST)

| Action | Files | Size Reclaimed | Risk |
|--------|-------|----------------|------|
| Execute yfinance removal recipe (REPO_CLEANUP_CHECKLIST 7-step) | 2 raw + 2 intermediate + cell edits | 256 KB (tracked) + 125 KB (untracked) | Low — requires NB02 cell edit + rerun |
| Delete `wb_cleaned.csv` + `cm_active_addresses_cleaned.csv` | 2 tracked files | 598 KB | Low — zero consumers, remove export lines in cell 12 |
| Delete 6 CHECKPOINT reports + PHASE_2B4_PLANNING.md | 7 tracked files | 75 KB | None — content captured in PHASE_2_FIX_LOG |
| Delete 4 redundant individual WB files | 4 untracked files | 321 KB | None — data in `all_indicators.csv` |
| Delete 4 vestigial CoinMetrics files | 4 untracked files | 1.2 MB | None — not consumed by pipeline |

### Post-submission archival

| Action | Files | Size Reclaimed | Risk |
|--------|-------|----------------|------|
| Move Chainalysis PDFs to external archive | 6 untracked files | 88 MB (local only) | None — CSVs are canonical source |
| Delete AUDIT_REPORT.md, CLAUDE.md, Master_Recovery_Roadmap.md, .claude/ | 4 untracked files | 71 KB | None — per .gitignore comments |

**Total potential cleanup: ~2.3 MB tracked + ~89.6 MB untracked (mostly PDFs)**
