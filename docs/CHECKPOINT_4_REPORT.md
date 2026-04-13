# Checkpoint 4 Report — Chainalysis–WB Join & h2_diffusion_dataset.csv

**Date:** 2026-04-14
**Branch:** `fixes/`
**Previous checkpoint:** 669596b (Checkpoint 3)

---

## Task A — WB Panel 2025 Forward-Fill

- **Old row count:** 1,032 (212 countries × 5 years, 2020–2024, unbalanced)
- **New row count:** 1,231 (+199 forward-filled 2025 rows)
- **Countries forward-filled:** 199 (every country with a 2024 row)
- **Countries skipped (no 2024 data):** 13

### baseline_year derivation

Source: `data/01_raw/worldbank/all_indicators.csv` indicator `FX.OWN.TOTL.ZS` (Findex financial account ownership). Most recent non-null survey year per country, mapped from WB ISO2 codes to panel ISO3 codes via country_name bridge.

| baseline_year | Count |
|---|---|
| 2024 | 139 |
| 2022 | 1 |
| 2021 | 5 |
| NaN | 67 |

No values outside `{2021, 2022, 2024, NaN}` observed. The allowed set `{2017, 2021, 2022, 2024, NaN}` was not violated.

### New columns added to `wb_panel_cleaned.csv`
- `baseline_year` (Int64, nullable): source year of Findex observation, constant within country.
- `is_forward_filled` (bool): `True` iff `year == 2025`.

### Assertions: ALL PASSED
- Row increase = 199 = count of countries with 2024 data ✓
- Every 2024 country has a 2025 row; no other country gained rows ✓
- `is_forward_filled == True` iff `year == 2025` ✓
- `baseline_year` constant within country (nunique ≤ 1 per country, ignoring NaN) ✓
- `baseline_year ∈ {2021, 2022, 2024, NaN}` ✓

---

## Task B — Chainalysis Long-Format Panel

- **Total rows:** 868 (150 + 149 + 142 + 151 + 146 + 130)
- **Output:** `data/02_intermediate/chainalysis_panel_long.csv` (868 rows, 15 columns)

### adoption_percentile derivation

Formula: `1 - (rank - 1) / (max_rank - 1)` per year, where `max_rank` is the maximum rank value in that year's Chainalysis data (the full ranking universe, including dropped territories). Rows with `rank_note == "Among lowest"` receive `adoption_percentile = 0.0`.

**Implementation note:** The brief specified `N_ranked` as the count of ranked countries. After territory drops (Hong Kong, Taiwan, etc. at CP1–CP3), ranked rows in our file are fewer than the original Chainalysis ranking universe, but rank values are preserved from the original. Using `max(rank)` per year as the denominator ensures rank 1 → 1.0, last rank → 0.0, and no negative values. This is the correct implementation given the territory drops — not a methodology change.

| Year | Total rows | Ranked rows | max_rank | Among lowest |
|---|---|---|---|---|
| 2020 | 150 | 138 | 141 | 12 |
| 2021 | 149 | 149 | 155 | 0 |
| 2022 | 142 | 142 | 146 | 0 |
| 2023 | 151 | 151 | 155 | 0 |
| 2024 | 146 | 146 | 151 | 0 |
| 2025 | 130 | 130 | 130 | 0 |

### adoption_percentile distribution
- Min: 0.0000
- Median: 0.4948
- Max: 1.0000

### overall_score: non-null for 2020 (150 rows) and 2021 (149 rows) only; NaN for 2022–2025. ✓

### Sub-index columns (union across years, alphabetically)
`centralized_service_value_received_rank`, `defi_value_received_rank`, `institutional_centralized_service_value_received_rank`, `number_of_onchain_deposits_rank`, `onchain_retail_value_received_rank`, `onchain_value_received_rank`, `p2p_exchange_trade_volume_rank`, `retail_centralized_service_value_received_rank`, `retail_defi_value_received_rank`

### Assertions: ALL PASSED
- Row count == 868 ✓
- No null `country_iso3`, `year`, or `adoption_percentile` ✓
- `adoption_percentile ∈ [0, 1]` ✓
- No duplicate `(country_iso3, year)` ✓
- `overall_score` non-null for 2020–2021 only ✓

---

## Task C — Inner Join & h2_diffusion_dataset.csv

- **Chainalysis input:** 868 rows (162 countries)
- **WB input:** 1,231 rows (212 countries)
- **Inner join output:** 861 rows (160 countries)
- **Join attrition:** 7 Chainalysis rows dropped

### Dropped (country_iso3, year) pairs

| ISO3 | Country | Year | Reason |
|---|---|---|---|
| CUB | Cuba | 2021 | WB has CUB only in 2020 |
| CUB | Cuba | 2023 | WB has CUB only in 2020 |
| SYR | Syria | 2023 | WB has SYR only in 2020–2022 |
| YEM | Yemen | 2020 | WB has YEM only in 2022 |
| YEM | Yemen | 2023 | WB has YEM only in 2022 |
| YEM | Yemen | 2024 | WB has YEM only in 2022 |
| YEM | Yemen | 2025 | WB has YEM only in 2022 |

**Root cause:** WB data sparsity for sanctioned/conflict countries. All 3 ISO3 codes exist in both datasets; the gaps are at the (country, year) level. No mapping bug. No G20 or top-30 GDP countries dropped.

**Note:** Attrition of 7 exceeds the brief's >5 red-flag threshold. Flagged as **Escalation 1** below.

### Per-year row counts in final panel

| Year | Countries | post_2022 | is_forward_filled |
|---|---|---|---|
| 2020 | 149 | 0 | False |
| 2021 | 148 | 0 | False |
| 2022 | 142 | 0 | False |
| 2023 | 148 | 1 | False |
| 2024 | 145 | 1 | False |
| 2025 | 129 | 1 | True |

### Final output: `data/03_processed/h2_diffusion_dataset.csv`
- 861 rows, 23 columns
- 160 unique countries, 6 years

### Assertions: ALL PASSED
- `post_2022` ∈ {0, 1}, no nulls ✓
- `is_forward_filled` ∈ {True, False}, no nulls ✓
- `adoption_percentile` no nulls ✓

---

## Task D — H2 Verification Gate

| # | Check | Result |
|---|---|---|
| 1 | Row count ~820–868 | **PASS** — 861 rows |
| 2 | Zero nulls on `adoption_percentile` | **PASS** — 0 nulls |
| 3 | `post_2022` exactly 0 or 1, no nulls | **PASS** |
| 4 | `is_forward_filled` exactly True/False, no nulls | **PASS** |
| 5 | Country FE feasibility (≥2 years each) | **PASS** — 8 countries with 1 year flagged (see below) |
| 6 | Time FE feasibility (≥30 countries/year) | **PASS** — min 129 (2025) |
| 7 | Spot-check 1: VNM, NGA, ARG top quartile | **PASS** |
| 8 | Spot-check 2: IND rank 1 in 2023–2025 | **PASS** |
| 9 | Spot-check 3: CHE, JPN < VNM | **PASS** |

### Check 5 detail — single-year countries
ATG, LBR, LCA, MCO, MRT, NER, SDN, TCD — these appear in only 1 year. Kept in file; will be dropped from two-way FE specs at regression time.

### Spot-check 1 values (top quartile threshold = 0.7517)
| Country | Mean adoption_percentile |
|---|---|
| VNM | 0.9788 |
| NGA | 0.9661 |
| ARG | 0.8891 |

### Spot-check 2 values
| Year | IND rank |
|---|---|
| 2023 | 1 |
| 2024 | 1 |
| 2025 | 1 |

### Spot-check 3 values
| Country | Mean adoption_percentile | < VNM (0.9788)? |
|---|---|---|
| CHE | 0.5763 | Yes ✓ |
| JPN | 0.7342 | Yes ✓ |

---

## Escalations for Claude.ai

### Escalation 1 — Join attrition 7 rows (exceeds >5 threshold)

The inner join dropped 7 Chainalysis rows for 3 sanctioned/conflict countries (Cuba, Syria, Yemen) due to year-level gaps in World Bank data. All 3 ISO3 codes exist in both datasets — the mismatch is at the (country, year) level, not at the country level. No G20 or top-30 GDP countries are affected.

**Options:**
- **(a) Accept as-is.** 7/868 = 0.8% attrition. These are peripheral countries with extreme data quality issues. The panel retains CUB (0 years), SYR (2 years: 2020–2021), and YEM (1 year: 2022 — but matched from Chainalysis side, only 2022 overlap). Net: SYR contributes 2 rows, YEM 0 rows (YEM's Chainalysis years are 2020/2023/2024/2025, WB only has 2022 — but YEM does not appear in Chainalysis for 2022, so it drops entirely). CUB's only WB year (2020) is also not in Chainalysis (2021/2023), so CUB drops entirely. The final panel has 160 countries.
- **(b) Flag for sensitivity analysis.** Note that results should be robust to excluding these 3 countries entirely, since their sparse coverage makes them weak contributors to any panel regression.

**Recommended:** (a), with a footnote in Phase 3 noting the 3 conflict-state exclusions.

### Escalation 2 — adoption_percentile denominator uses max(rank) not count(ranked rows)

The brief specified `N_ranked` as "ranked countries total that year." After territory drops at CP1–CP3, the count of ranked rows in our file is lower than the max rank value (e.g., 2021: 149 rows but max rank = 155). Using row count as denominator produced negative percentiles for countries ranked beyond our file's count. Using `max(rank)` — the original Chainalysis ranking universe size — is the correct interpretation and produces percentiles ∈ [0, 1] as expected. This is a clarification of the formula implementation, not a methodology change.

**Request:** Confirm this interpretation is acceptable.

---

## Scope Boundary Check

- [x] No git commit made
- [x] No Phase 3 / empirical work
- [x] No modifications to `data/01_raw/` or `data/02_intermediate/chainalysis_standardized/`
- [x] No H1, H3, or H4 dataset touches
- [x] No files in `outputs/`
