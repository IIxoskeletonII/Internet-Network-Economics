# Repository Cleanup Checklist

Forward-looking checklist to be **executed after Phase 3 completes but before final submission**. Do NOT execute any items now. This list is a reference for Phase 4 cleanup.

---

## Confirmed deletable post-Phase 3

- [ ] **`docs/PHASE_2B4_PLANNING.md`** — Working planning document for H2 panel construction. Key decisions are already captured in `docs/PHASE_2_FIX_LOG.md`. No downstream references.

- [ ] **`docs/CHECKPOINT_1_REPORT.md` through `CHECKPOINT_6_REPORT.md`** — Working artifacts from Phase 2B checkpoints. OPTIONAL: can keep as audit trail if preferred. All substantive content is captured in `PHASE_2_FIX_LOG.md` and `DATA_DICTIONARY.md`. No code references these files.

- [ ] **`scripts/patch_notebook_h4.py`** — One-shot notebook cell surgery utility used during CP5. Job complete; the notebook has the correct cells. No runtime dependency.

- [ ] **`scripts/apply_chainalysis_standardization.py`** — One-shot transformation that standardized Chainalysis CSVs to ISO3 codes during CP2. Output lives in `data/02_intermediate/chainalysis_standardized/`. No runtime dependency.

- [ ] **`scripts/scrape_tronscan_expanded.py`** — Failed Option A for Tron sample expansion (rate-limited at ~100 calls). Preserved through Phase 2B as evidence of the attempt. Can archive after final submission. No runtime dependency.

---

## Investigate before deleting

- [ ] **`data/01_raw/coinmetrics/transfer_count.csv` vs `transfer_counts.csv`** — `transfer_count.csv` (singular) is actively referenced by `02_data_engineering.ipynb` cell 15 (H1 build). `transfer_counts.csv` (plural) appears to be a stale duplicate. Verify contents are identical or that the plural version is unused, then delete the stale one.

- [ ] **`data/01_raw/coinmetrics/transaction_counts.csv`** — Was this superseded by the H1 pivot to `TxTfrCnt` (transfer count)? If `transaction_counts.csv` contains `TxCnt` (transaction count, different metric), it may be unused after the H1 DV change. Check whether any notebook or script references it.

- [ ] **`data/01_raw/googletrends/` entire subtree** — Google Trends was abandoned at CP1 as the H2 DV (no cross-sectional variation). The raw file is archived in `data/02_intermediate/ARCHIVE_preaudit/gt_global_intensity_cleaned.csv`. The `data/01_raw/googletrends/ARCHIVE_preaudit/global_search_intensity.csv` source folder may be removable if no notebook references it at runtime. Note: cell 17 of `02_data_engineering.ipynb` (old H2 build) still references `gt_global_intensity_cleaned.csv` — that cell is dead code but is not yet deleted.

- [ ] **`data/01_raw/yfinance/USDC_daily_volume.csv` and `USDT_daily_volume.csv`** — Superseded by CoinMetrics in CP2 after the $83T USDC outlier discovery. Keep for audit trail or delete. Referenced by cell 3 of `02_data_engineering.ipynb` at load time, but the loaded DataFrames are only used in the deprecated Phase 2.1 intermediate export (cell 12). Removing these files would require updating cell 3 to skip the yfinance loads.

- [ ] **`yfinance` and `pytrends` in `requirements.txt`** — These pin deprecated data source libraries. `yfinance` is still loaded in notebook 02 cell 3 (benign as long as the yfinance files exist); `pytrends` has no runtime reference. Remove both pins after the yfinance cell-3 load is also removed in Phase 4 cleanup.

---

## Heavy archival candidates (do not delete; move outside repo or zip)

- [ ] **`data/01_raw/chainalysis/*.pdf`** — ~86 MB of source PDFs (6 files, 2020-2025). Already gitignored. Once project ships, move to external archive (USB, cloud storage). Keep the extracted CSVs in-repo — they are the canonical, manually-corrected source.

---

## Empty-shell directories (will be populated in Phases 3-5)

- [ ] **`dashboard/app.py`** — Currently 0 KB. Will be populated in Phase 5 (Streamlit dashboard).

- [ ] **`presentations/`** — Currently empty, gitignored. Will hold slide decks for Phase 4.

- [ ] **`notebooks/03_empirical_analysis.ipynb`** — Currently empty. Will be populated in Phase 3.

- [ ] **`outputs/figures/`** and **`outputs/tables/`** — Currently empty. Will hold Phase 3 regression outputs.

---

## Phase 3 setup blockers

These items must be resolved before Phase 3 regressions can run, per Roadmap §3.1. Do NOT execute now — flag for Phase 3 kickoff.

- [ ] **Add `linearmodels` and `arch` to `requirements.txt`** — Required for panel regressions (two-way FE via `linearmodels.panel.PanelOLS`) and Newey-West standard errors (via `arch` or `statsmodels`). Install and pin before opening `03_empirical_analysis.ipynb`.

---

## Files to keep (for reference)

These working files serve ongoing purposes and should NOT be cleaned up:

- `AUDIT_REPORT.md` — Referenced by `PHASE_2_FIX_LOG.md` and `CLAUDE.md`; needed until final submission
- `Master_Recovery_Roadmap.md` — Authoritative plan through Phase 5; needed until project closes
- `CLAUDE.md` — Claude Code operating manual; needed for all remaining phases
- `scripts/extract_chainalysis.py` — Preserved with warning header; documents extraction methodology
- `scripts/standardize_country_names.py` — Reusable ISO3 mapping module; may be imported by Phase 3
- `scripts/clean_worldbank_panel.py` — Reusable WB cleaning utility
- `data/02_intermediate/h3_diagnostic_report.md` — Contains Phase 3/4 narrative notes; actively referenced
- `docs/ISO3_MAPPING_REPORT.md` — Full country mapping audit trail
- `docs/CP6_ASSERTIONS_AUDIT.md` — Assertions coverage record
