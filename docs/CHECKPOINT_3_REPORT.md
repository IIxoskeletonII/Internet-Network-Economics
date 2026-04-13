# Checkpoint 3 Report — Phase 2B.4 Pre-Join Audit

> Generated 2026-04-11. Covers Tasks A through D of the Checkpoint 3 brief.
> Awaiting Claude.ai review before proceeding to Checkpoint 4
> (Chainalysis-WB join and h2_diffusion_dataset.csv construction).

---

## 1. Chainalysis Standardized Row Counts

| Year | Raw rows | Drops | Post-drop rows | Brief expected | Match |
|---|---|---|---|---|---|
| 2020 | 154 | 4 (Hong Kong, Puerto Rico, Macao, Bermuda) | **150** | 151 | **NO** |
| 2021 | 157 | 8 (Hong Kong, Puerto Rico, French Polynesia, Macao, New Caledonia, Virgin Islands U.S., Bermuda, Cayman Islands) | **149** | 151 | **NO** |
| 2022 | 146 | 4 (Hong Kong, Taiwan, Bermuda, Macao) | **142** | 143 | **NO** |
| 2023 | 155 | 4 (Taiwan, Hong Kong, Puerto Rico, Macao) | **151** | 151 | YES |
| 2024 | 151 | 5 (Hong Kong, Taiwan, Puerto Rico, Macao, Aruba) | **146** | 147 | **NO** |
| 2025 | 131 | 1 (Hong Kong SAR, China) | **130** | 130 | YES |
| **Total** | **894** | **26** | **868** | 873 | |

### Row count discrepancy explanation

The brief's expected values (151/151/143/151/147/130) were taken from the
Checkpoint 2 addendum, which computed "sovereign rows after ISO3
standardization" using the **old 8-entry DROP_ENTITIES set** (before
ABW/BMU/CYM were added). The discrepancies are exactly accounted for by the
three newly-dropped territories:

| Year | Entity dropped | Count change |
|---|---|---|
| 2020 | Bermuda | -1 |
| 2021 | Bermuda + Cayman Islands | -2 |
| 2022 | Bermuda | -1 |
| 2024 | Aruba | -1 |

This is an arithmetic consequence of the Claude.ai-approved drop decision
(Checkpoint 2 review, Option a), **not** a methodology change or data issue.
All per-file assertions pass with the corrected expected values.

---

## 2. Updated Drop List

**11 name strings covering 10 distinct entities** (was 8 strings / 7 entities at Checkpoint 2):

| Entity | Name strings | ISO3 (if any) | Added at |
|---|---|---|---|
| Hong Kong | "Hong Kong", "Hong Kong SAR, China" | HKG | Checkpoint 2 (original) |
| Macao | "Macao" | MAC | Checkpoint 2 (original) |
| Taiwan | "Taiwan" | TWN | Checkpoint 2 (original) |
| Puerto Rico | "Puerto Rico" | PRI | Checkpoint 2 (original) |
| French Polynesia | "French Polynesia" | PYF | Checkpoint 2 (original) |
| New Caledonia | "New Caledonia" | NCL | Checkpoint 2 (original) |
| Virgin Islands, U.S. | "Virgin Islands, U.S." | VIR | Checkpoint 2 (original) |
| **Aruba** | "Aruba" | ABW | **Checkpoint 2 review** |
| **Bermuda** | "Bermuda" | BMU | **Checkpoint 2 review** |
| **Cayman Islands** | "Cayman Islands" | CYM | **Checkpoint 2 review** |

---

## 3. ISO3 Mapping Report Update

| Metric | Checkpoint 2 | Checkpoint 3 | Change |
|---|---|---|---|
| Distinct country names | 207 | 207 | unchanged |
| Resolved to ISO3 | 199 | 196 | -3 (ABW/BMU/CYM moved to drops) |
| Unique ISO3 codes | 165 | **162** | -3 |
| Dropped | 8 | **11** | +3 |
| Unresolved | 0 | 0 | unchanged |

### Unique ISO3 count note

The brief expected the unique ISO3 count to remain at 165. It is 162 because
ABW, BMU, and CYM were previously counted as resolved ISO3 codes (they are
valid pycountry entries) but are now classified as drops. The 3-code decrease
is the exact and expected consequence of adding them to DROP_ENTITIES.

`docs/ISO3_MAPPING_REPORT.md` has been regenerated with post-Checkpoint-2
numbers.

---

## 4. World Bank Panel Summary

| Metric | Value |
|---|---|
| Source file | `data/01_raw/worldbank/all_indicators.csv` |
| Raw rows | 3,844 |
| Rows after aggregate drop | 3,086 |
| Aggregate codes dropped | **49** |
| Unique sovereign ISO3 codes | 212 |
| Wide-format rows | **1,032** |
| Year coverage | 2020, 2021, 2022, 2023, 2024 |
| Output file | `data/02_intermediate/wb_panel_cleaned.csv` |

### Schema

| Column | Type | Description |
|---|---|---|
| country_iso3 | str | ISO 3166-1 alpha-3 code |
| country_name | str | World Bank country name |
| year | int | Calendar year (2020-2024) |
| gdp_per_capita_usd | float | NY.GDP.PCAP.CD |
| inflation_cpi_annual_pct | float | FP.CPI.TOTL.ZG |
| financial_account_baseline | float | Most recent FX.OWN.TOTL.ZS per country (time-invariant) |
| remittances_received_pct_gdp | float | BX.TRF.PWKR.DT.GD.ZS |

No additional WB indicators beyond the 4 core columns.

### Year coverage note

WB data covers 2020-2024 only. **No 2025 data is present.** Chainalysis has
2025 entries (130 countries). In an inner join on (country_iso3, year),
all 2025 Chainalysis observations will drop unless WB data is extended.
This is an **escalation for Claude.ai** — see section 11.

---

## 5. WB Aggregate Codes Dropped

49 aggregate/region codes were identified by attempting pycountry resolution
on all 261 unique WB country codes. All 49 fail pycountry resolution and are
confirmed non-sovereign entities.

Source: empirical analysis of the data (no WB metadata file found in `data/01_raw/worldbank/`).

<details>
<summary>Full list of 49 aggregate codes</summary>

| Code | Name |
|---|---|
| 1A | Arab World |
| 1W | World |
| 4E | East Asia & Pacific (excluding high income) |
| 7E | Europe & Central Asia (excluding high income) |
| 8S | South Asia |
| B8 | Central Europe and the Baltics |
| EU | European Union |
| F1 | Fragile and conflict affected situations |
| JG | Channel Islands |
| OE | OECD members |
| S1 | Small states |
| S2 | Pacific island small states |
| S3 | Caribbean small states |
| S4 | Other small states |
| T2 | Latin America & the Caribbean (IDA & IBRD countries) |
| T3 | Middle East, North Africa, Afghanistan & Pakistan (IDA & IBRD) |
| T4 | East Asia & Pacific (IDA & IBRD countries) |
| T5 | South Asia (IDA & IBRD) |
| T6 | Sub-Saharan Africa (IDA & IBRD countries) |
| T7 | Europe & Central Asia (IDA & IBRD countries) |
| V1 | Pre-demographic dividend |
| V2 | Early-demographic dividend |
| V3 | Late-demographic dividend |
| V4 | Post-demographic dividend |
| XC | Euro area |
| XD | High income |
| XE | Heavily indebted poor countries (HIPC) |
| XF | IBRD only |
| XG | IDA total |
| XH | IDA blend |
| XI | IDA only |
| XJ | Latin America & Caribbean (excluding high income) |
| XL | Least developed countries: UN classification |
| XM | Low income |
| XN | Lower middle income |
| XO | Low & middle income |
| XP | Middle income |
| XQ | Middle East, North Africa, Afghanistan & Pakistan (excluding high income) |
| XT | Upper middle income |
| XU | North America |
| Z4 | East Asia & Pacific |
| Z7 | Europe & Central Asia |
| ZF | Sub-Saharan Africa (excluding high income) |
| ZG | Sub-Saharan Africa |
| ZH | Africa Eastern and Southern |
| ZI | Africa Western and Central |
| ZJ | Latin America & Caribbean |
| ZQ | Middle East, North Africa, Afghanistan & Pakistan |
| ZT | IDA & IBRD total |

</details>

Note: the original AUDIT_REPORT.md estimated 23 aggregates. The actual count
is 49. The difference is due to the WB API returning additional income-group,
lending-group, and demographic-dividend aggregates beyond the standard
regional groupings. All 49 correctly fail pycountry resolution.

### Fallback resolutions

Only 1 WB code required non-standard resolution:
- **XK** (Kosovo) -> **XKX** via hardcoded special mapping. Kosovo uses the
  user-assigned code XKX (not in the standard ISO 3166-1 table). It is NOT
  in the Chainalysis data and will drop at join time.

---

## 6. `financial_account_baseline` Coverage

| Metric | Value |
|---|---|
| Countries with non-null baseline | **145 of 212** |
| Countries with NaN baseline | 67 |
| Coverage rate | 68.4% |

### Baseline year distribution

| Source year | Countries |
|---|---|
| 2024 | 139 |
| 2021 | 5 |
| 2022 | 1 |

**Note:** The task spec anticipated 2021 as the target Findex year. The WB
data contains a **2024 Findex wave** (Global Findex 2024, published by
the World Bank) with 151 country-level observations. These are real survey
values, not carried-forward data (e.g., US: 94.95% in 2021 vs 97.02% in
2024). The script correctly takes the most recent non-null value per country,
which is 2024 for 139 countries and 2021 for 5 countries that lack 2024 data.

This is a **positive development** (more recent baseline), not a data quality
concern. The `financial_account_baseline` column is verified constant within
country_iso3.

---

## 7. Null Policy

| Column | Null % | Policy |
|---|---|---|
| gdp_per_capita_usd | 1.2% | Left as-is |
| inflation_cpi_annual_pct | 14.6% | Left as-is |
| remittances_received_pct_gdp | 12.0% | Left as-is |
| financial_account_baseline | 30.1% | Left as-is (time-invariant; NaN = country has no Findex data) |

All nulls will be handled via listwise deletion at regression time in
Phase 3. No interpolation, no imputation.

---

## 8. Pre-Join Attrition Preview

### Chainalysis ISO3 not in WB: **0 countries**

Every Chainalysis country has a World Bank counterpart. No panel attrition
from the Chainalysis side.

### WB ISO3 not in Chainalysis: **50 countries**

These WB countries would be dropped in an inner join (no Chainalysis DV):

| ISO3 | Country | Category |
|---|---|---|
| ABW | Aruba | Territory (also in Chainalysis DROP_ENTITIES) |
| ASM | American Samoa | US territory |
| BDI | Burundi | Sovereign — not ranked by Chainalysis |
| BMU | Bermuda | Territory (also in Chainalysis DROP_ENTITIES) |
| BTN | Bhutan | Sovereign — not ranked by Chainalysis |
| CAF | Central African Republic | Sovereign — not ranked |
| COM | Comoros | Sovereign — not ranked |
| CUW | Curacao | Dutch territory |
| CYM | Cayman Islands | Territory (also in Chainalysis DROP_ENTITIES) |
| DJI | Djibouti | Sovereign — not ranked |
| DMA | Dominica | Sovereign — not ranked |
| FRO | Faroe Islands | Danish territory |
| FSM | Micronesia | Sovereign — not ranked |
| GMB | Gambia | Sovereign — not ranked |
| GNB | Guinea-Bissau | Sovereign — not ranked |
| GNQ | Equatorial Guinea | Sovereign — not ranked |
| GRD | Grenada | Sovereign — not ranked |
| GRL | Greenland | Danish territory |
| GUM | Guam | US territory |
| HKG | Hong Kong | SAR (also in Chainalysis DROP_ENTITIES) |
| IMN | Isle of Man | British Crown dependency |
| KIR | Kiribati | Sovereign — not ranked |
| KNA | Saint Kitts and Nevis | Sovereign — not ranked |
| LIE | Liechtenstein | Sovereign — not ranked |
| LSO | Lesotho | Sovereign — not ranked |
| MAC | Macao | SAR (also in Chainalysis DROP_ENTITIES) |
| MAF | Saint Martin (French) | French territory |
| MHL | Marshall Islands | Sovereign — not ranked |
| MNP | Northern Mariana Islands | US territory |
| NCL | New Caledonia | French territory (also in DROP_ENTITIES) |
| NRU | Nauru | Sovereign — not ranked |
| PLW | Palau | Sovereign — not ranked |
| PRI | Puerto Rico | US territory (also in DROP_ENTITIES) |
| PYF | French Polynesia | French territory (also in DROP_ENTITIES) |
| SLB | Solomon Islands | Sovereign — not ranked |
| SLE | Sierra Leone | Sovereign — not ranked |
| SMR | San Marino | Sovereign — not ranked |
| SSD | South Sudan | Sovereign — not ranked |
| STP | Sao Tome and Principe | Sovereign — not ranked |
| SWZ | Eswatini | Sovereign — not ranked |
| SXM | Sint Maarten (Dutch) | Dutch territory |
| TCA | Turks and Caicos Islands | British territory |
| TLS | Timor-Leste | Sovereign — not ranked |
| TON | Tonga | Sovereign — not ranked |
| TUV | Tuvalu | Sovereign — not ranked |
| VCT | Saint Vincent & Grenadines | Sovereign — not ranked |
| VIR | Virgin Islands, U.S. | US territory (also in DROP_ENTITIES) |
| VUT | Vanuatu | Sovereign — not ranked |
| WSM | Samoa | Sovereign — not ranked |
| XKX | Kosovo | User-assigned code — not ranked |

No G20 or top-30-by-GDP country appears in either dropout list. The 50
WB-only countries are a mix of territories (already in DROP_ENTITIES) and
small sovereign states that Chainalysis does not rank. This is expected
and not a mapping bug.

---

## 9. SOURCES.md Status

Created at `data/01_raw/chainalysis/SOURCES.md`.

| Year | URL status | Source |
|---|---|---|
| 2020 | **TODO** | CDN host: go.chainalysis.com |
| 2021 | **TODO** | CDN host: bitcoinke.io mirror |
| 2022 | **TODO** | CDN host: go.chainalysis.com |
| 2023 | Recovered (mirror) | `static.poder360.com.br/2024/01/...` |
| 2024 | **TODO** | CDN host: chainalysis.com wp-content |
| 2025 | Recovered (direct) | `chainalysis.com/wp-content/uploads/2025/10/...` |

**4 of 6 URLs require recovery.** No URLs were found in
`scripts/extract_chainalysis.py`, `notebooks/`, or git history. CDN host
hints are available from `docs/CHECKPOINT_1_REPORT.md` for all years.

Recovery procedure documented in the file header.

---

## 10. Dependency Pinning & Import Audit

### requirements.txt

- `pycountry==26.2.16` confirmed installed and pinned.
- All lines in `requirements.txt` have `==` version specifiers. **PASS.**

### Import cross-reference

| Package imported | requirements.txt entry | Status |
|---|---|---|
| fitz (PyMuPDF) | PyMuPDF==1.27.2.2 | Present |
| pycountry | pycountry==26.2.16 | Present |
| dotenv (python-dotenv) | python-dotenv==1.2.2 | Present |
| numpy | numpy==2.4.3 | Present |
| pandas | pandas==2.3.3 | Present |
| yfinance | yfinance==1.2.0 | Present |
| csv, os, re, sys | stdlib | N/A |
| standardize_country_names | local module | N/A |

**No imported packages are missing from requirements.txt. Zero gaps.**

---

## 11. Escalations for Claude.ai

### Escalation 1: WB data ends at 2024 — no 2025 coverage

The World Bank `all_indicators.csv` covers 2020-2024 only. Chainalysis has
130 countries ranked in 2025. In an inner join on (country_iso3, year), all
2025 Chainalysis rows will have no WB match and will drop from the panel.

**Options for Claude.ai:**
- **(a)** Accept the panel as 2020-2024 (5 years). The `post_2022` dummy
  covers 2023-2024 (2 post-crisis years). This reduces the post-FTX sample
  but avoids imputation.
- **(b)** Forward-fill 2024 WB values to 2025 (standard practice for
  slow-moving macro indicators). Gains 130 additional observations at the
  cost of assuming macro stability from 2024 to 2025.
- **(c)** Attempt to pull 2025 WB data via API (may not be available yet
  for all indicators).

**This is a methodology decision — not executing any option without Claude.ai
guidance.**

### Escalation 2: `financial_account_baseline` sourced from 2024 Findex (not 2021)

The task spec specified "Target 2021; fall back to 2017." The WB data
contains a 2024 Findex wave with updated values for 139 countries. The
script takes the most recent non-null value per country, which is 2024
for most countries. This is methodologically sound (more recent data is
better for a baseline), but differs from the spec's assumption.

**Requesting Claude.ai confirmation:** Is using the 2024 Findex baseline
acceptable, or should we constrain to the 2021 wave for consistency with
the planning document?

### Escalation 3: Row counts and ISO3 count deviate from brief's expected values

As documented in sections 1 and 3, the post-drop row counts (150/149/142/
151/146/130) and the unique ISO3 count (162) differ from the brief's
expected values (151/151/143/151/147/130 and 165). These differences are
fully explained by the addition of ABW, BMU, and CYM to the drop list
(Claude.ai's own Checkpoint 2 decision). No methodology change was made.

**Requesting Claude.ai acknowledgment** that the corrected expected values
are accepted.

### Escalation 4: 49 aggregate codes (vs AUDIT_REPORT's 23)

The WB data contains 49 aggregate/region codes, not 23 as estimated in
AUDIT_REPORT.md. All 49 correctly fail pycountry resolution and have been
dropped. No sovereign country was lost. No metadata file was found in
`data/01_raw/worldbank/` — the 49 codes were identified empirically.

This is informational, not a methodology concern.

---

## 12. Files Created / Modified

| Path | Action |
|---|---|
| `scripts/standardize_country_names.py` | Modified (ABW/BMU/CYM + docstring) |
| `scripts/apply_chainalysis_standardization.py` | Created |
| `scripts/clean_worldbank_panel.py` | Created |
| `data/02_intermediate/chainalysis_standardized/adoption_index_2020.csv` | Created (150 rows) |
| `data/02_intermediate/chainalysis_standardized/adoption_index_2021.csv` | Created (149 rows) |
| `data/02_intermediate/chainalysis_standardized/adoption_index_2022.csv` | Created (142 rows) |
| `data/02_intermediate/chainalysis_standardized/adoption_index_2023.csv` | Created (151 rows) |
| `data/02_intermediate/chainalysis_standardized/adoption_index_2024.csv` | Created (146 rows) |
| `data/02_intermediate/chainalysis_standardized/adoption_index_2025.csv` | Created (130 rows) |
| `data/02_intermediate/wb_panel_cleaned.csv` | Created (1,032 rows) |
| `data/01_raw/chainalysis/SOURCES.md` | Created |
| `docs/ISO3_MAPPING_REPORT.md` | Regenerated (post-Checkpoint-2 numbers) |
| `docs/CHECKPOINT_3_REPORT.md` | Created (this file) |
| `requirements.txt` | Updated (pip freeze) |

---

## 13. Scope Boundary Verification

- [x] No `git commit` performed
- [x] No Chainalysis-WB join performed
- [x] No file in `data/03_processed/` written or modified
- [x] Stopped after Task D

---

**STOP — awaiting Claude.ai review before Checkpoint 4 (Chainalysis-WB join).**
