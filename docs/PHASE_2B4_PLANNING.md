# Phase 2B.4 Planning — H2 Diffusion Dataset Rebuild

**Status:** Methodology lock-in document. Must be committed to `fixes/` before any Claude Code execution of 2B.4.
**Owner:** Methodology decisions made in Claude.ai per CLAUDE.md §9 red-flag rule.
**Supersedes:** nothing. Supplements `Master_Recovery_Roadmap.md` §2B.4 with information that was not known when the roadmap was written (the 2024 and 2025 Chainalysis methodology changes).

---

## 0. Checkpoint 2 Closeout Addendum (added 2026-04-11)

This section corrects and supplements the original document with information learned during execution of Checkpoints 1 and 2. The body of the document below (§1–§9) is preserved as written for audit-trail purposes; where it conflicts with this addendum, this addendum is authoritative.

### 0.1 Actual extracted row counts (correction to §1)

The §1 inventory table assumed 154 countries for 2020–2023 and 151 for 2024–2025 based on Chainalysis's published methodology descriptions. The actual extracted row counts differ. Manual verification of all six PDFs at Checkpoint 1 confirmed these are real coverage figures, not parser bugs.

| Year | §1 expected | Actual extracted | Sovereign rows after ISO3 standardization |
|---|---|---|---|
| 2020 | 154 | 154 | 151 |
| 2021 | 154 | 157 | 151 |
| 2022 | 154 | 146 | 143 |
| 2023 | 154 | 155 | 151 |
| 2024 | 151 | 151 | 147 |
| 2025 | 151 | **131** | 130 |

Total panel observations pre-WB-join: ~873 across ~165 unique sovereign countries. The 2025 file's coverage ceiling at rank 130 is Chainalysis's actual published depth, not a parser truncation — confirmed by manual PDF inspection at Checkpoint 1.

**The 2020 file required additional repair:** the initial vision-based extraction silently dropped 10 countries from the "Among lowest" section on page 130 (Cape Verde, Chad, Fiji, Laos, Libya, Mongolia, Tajikistan, Turkmenistan, West Bank and Gaza, Zimbabwe). These were restored at Checkpoint 2 with `rank=NaN`, `overall_score=0`, and a new `rank_note="Among lowest"` column. The 142 ranked countries plus the 12 "Among lowest" countries (the 10 added plus Afghanistan and Algeria, which were already present) give the final 2020 count of 154.

### 0.2 Schema additions (supplement to §3)

Two columns were added to the raw CSVs at Checkpoint 2 beyond the §3 specification:

- **`rank_note`** — populated as `"Among lowest"` for the 12 unranked countries in the 2020 file; empty for all other rows in all other years. Schema-unified across all six raw CSVs at Checkpoint 2 for consistency.
- **`country_iso3`** — added as a separate column by the standardization module (not overwriting the original `country` column, for audit trail). To be applied to the standardized intermediate CSVs in Task A of the next Claude Code brief.

### 0.3 Raw score availability (correction to §3)

§3 specifies `adoption_score_raw` as a column in the cleaned dataset and as the robustness DV in the Phase 3.4 regression table. Checkpoint 1 manual PDF verification revealed that **Chainalysis published normalized 0–1 scores in 2020 and 2021 only and discontinued them in 2022.** Subsequent reports publish ranks but not normalized scores.

This does not invalidate §3's decision to use percentile rank as the primary DV; if anything it strengthens it (Chainalysis's own discontinuation of the score corroborates the rank-based choice). But the §3 robustness plan needs to be revised:

- The `adoption_score_raw` column will exist in the cleaned dataset but will be NaN for 2022–2025.
- The §3 robustness analysis ("If the percentile-rank and raw-score results agree on sign and significance...") can only be run on the 2020–2021 sub-sample, not the full panel.
- This becomes a 2020–2021 appendix in the Phase 3.4 regression table rather than a primary robustness column.
- The Phase 4 limitations narrative should explicitly note that Chainalysis discontinued normalized scores after 2021, citing this as further justification for the rank-based DV.

### 0.4 Sub-national and territory drops (supplement to §5)

§5 lists ~28 alias mappings for the standardization module. The actual implementation in `scripts/standardize_country_names.py` (not `src/country_codes.py` — see §0.6) contains 60 alias entries plus an explicit `DROP_ENTITIES` set for non-sovereign units.

**Ten entities are dropped from the H2 panel** because they have no standard World Bank sovereign counterpart:

| Entity | ISO3 (if any) | Justification |
|---|---|---|
| Hong Kong / Hong Kong SAR, China | HKG | Sub-national (PRC SAR) |
| Macao | MAC | Sub-national (PRC SAR) |
| Taiwan | TWN | Not in WB sovereign panel under that name |
| Puerto Rico | PRI | US territory |
| French Polynesia | PYF | French overseas collectivity |
| New Caledonia | NCL | French overseas collectivity |
| Virgin Islands, U.S. | VIR | US territory |
| Aruba | ABW | Dutch constituent country |
| Bermuda | BMU | British Overseas Territory |
| Cayman Islands | CYM | British Overseas Territory |

Aruba, Bermuda, and Cayman Islands were added to the explicit drop list at Checkpoint 2 review (rather than being silently filtered by the WB join) for audit-trail consistency with the other territory drops.

### 0.5 Region column not extracted (clarification to §1)

The 2023, 2024, and 2025 PDFs include a Region column in the ranking tables. Checkpoint 1 made the deliberate decision NOT to extract this column, on the grounds that World Bank provides a consistent cross-year region classification that will be joined in during 2B.4.b. Chainalysis's region labels remain available in the source PDFs if needed for narrative purposes during Phase 4.

### 0.6 Standardization module location (correction to §5)

§5 specifies the module should live at `src/country_codes.py`. Actual implementation: `scripts/standardize_country_names.py`. The repo does not have a `src/` directory; helper scripts live in `scripts/`. No functional difference; documenting for accuracy.

### 0.7 Checkpoint status

- **Checkpoint 1 (PDF acquisition and extraction):** ✅ Complete. All six PDFs downloaded, all six CSVs extracted, all six manually cross-checked against PDFs. One parser bug found (2020 page-130 "Among lowest"), repaired at Checkpoint 2. See `docs/CHECKPOINT_1_REPORT.md`.
- **Checkpoint 2 (ISO3 standardization, pre-WB-join):** ✅ Complete. Standardization module built, mapping report generated, all 207 distinct country names resolved (199 to ISO3, 8 dropped — now 11 after the ABW/BMU/CYM addition). See `docs/CHECKPOINT_2_REPORT.md` and `docs/ISO3_MAPPING_REPORT.md`.
- **Checkpoint 3 (cleaned WB panel and standardized Chainalysis panel, pre-join):** ⏳ Pending. To be executed by the next Claude Code brief.

---

## 1. Chainalysis Report Inventory

Research conducted in Claude.ai on 2026-04-09 confirmed that six annual editions of the Chainalysis Global Crypto Adoption Index are published and accessible. The full panel window required by H2 (2020–2025) is covered; no year needs to be dropped for non-availability.

| Report year | Edition | Approx. data window | Countries ranked | Sub-indices included | Methodology notes |
|---|---|---|---|---|---|
| 2020 | 1st | Jul 2019 – Jun 2020 | 154 | P2P + on-chain activity; **no DeFi sub-index** | Baseline methodology |
| 2021 | 2nd | Jul 2020 – Jun 2021 | 154 | Added DeFi sub-index | Reports "880%" global adoption growth |
| 2022 | 3rd | Jul 2021 – Jun 2022 | 154 | 5 sub-indices (peak) | Last pre-FTX report |
| 2023 | 4th | Jul 2022 – Jun 2023 | 154 | 5 sub-indices | First post-FTX report |
| 2024 | 5th | Jul 2023 – Jun 2024 | **151** | **4 sub-indices — P2P dropped** | LocalBitcoins shutdown cited as justification |
| 2025 | 6th | Jul 2024 – Jun 2025 | 151 | **4 sub-indices — retail DeFi dropped** | Published Oct 2025; methodology shifted to population-adjusted for some views |

**Primary acquisition source:** the gated "Geography of Cryptocurrency Report" PDFs at `go.chainalysis.com/[year]-geography-of-cryptocurrency-report.html`. The 2023 PDF is also mirrored at `static.poder360.com.br/2024/01/The-2023-Geography-of-Cryptocurrency-Report_Chainalysis.pdf` and the 2025 release PDF is hosted on Chainalysis's own CDN at `chainalysis.com/wp-content/uploads/2025/10/the-2025-geography-of-crypto-report-release.pdf`.

**Secondary source (fallback):** the Chainalysis Market Intel interactive map, which exposes all ranked countries via a JSON endpoint loaded by the browser. Only use this if PDF extraction fails for a given year.

**Tertiary source (last resort):** manual transcription from the blog posts, which publish the top 20 each year. Acceptable only for the top 20; the long tail must come from primary or secondary sources.

---

## 2. Critical Methodology Risk — Cross-Year Comparability of the DV

The roadmap as originally written assumed Chainalysis scores were comparable across years. They are not. Two methodology changes materially affect the dependent variable:

- **2024 report:** P2P sub-index dropped. A country's 2024 score reflects a 4-component geometric mean rather than a 5-component one. Countries with historically high P2P activity (Venezuela, Nigeria, Kenya, several Eastern European states) are mechanically affected.
- **2025 report:** Retail DeFi sub-index dropped. Countries with DeFi-heavy activity patterns (Vietnam, Thailand, Ukraine) are mechanically affected.

**Country fixed effects do not solve this.** The contamination is time-varying and country-heterogeneous — different countries are affected by different amounts depending on their pre-change sub-index composition. A regression on raw scores will partially identify the `inflation × post_2022` interaction coefficient off Chainalysis's instrument changes rather than off real-world adoption shifts. This would be an econometric flaw that a reviewer or professor could catch.

The roadmap's verification gate does not test for this because the gate was designed before we had information about the sub-index changes. **The gate can pass on a contaminated dataset.** This document establishes the mitigations that must be applied during the rebuild.

---

## 3. Methodology Decision 1 — Dependent Variable Specification

### Options considered

1. **Raw adoption score (0–1).** Directly contaminated by 2024/2025 sub-index changes. Rejected as primary DV.
2. **Rank (1 to ~151).** More robust to scale changes but affected by the country-count shift (154 → 151). Loses magnitude information.
3. **Within-year percentile rank** (rank ÷ N, rescaled 0–1). Normalizes out methodology changes that affect the overall distribution. Preserves ordinal information. Directly comparable across years. Standard defensive move when a ranking's underlying construction shifts.

### Decision

**Primary DV: within-year percentile rank.** Computed as `1 - (rank - 1) / (N - 1)` so that the highest-ranked country scores 1.0 and the lowest-ranked scores 0.0 in every year. This makes the DV strictly comparable across the full 2020–2025 panel regardless of sub-index changes.

**Robustness column: raw adoption score.** Reported as one column in the Phase 3.4 regression table. If the percentile-rank and raw-score results agree on sign and significance for the key coefficients, the methodology concern is defused empirically. If they disagree, the percentile-rank result is the defensible one and the disagreement itself becomes part of the Phase 4 limitations narrative.

**Secondary robustness: rank.** Computed but not reported in the headline table unless percentile-rank and raw-score disagree, in which case rank is the tiebreaker.

### What to store in `chainalysis_cleaned.csv`

All three columns must be stored so that any of them can be used at regression time without rebuilding the dataset:

- `country_iso3` (join key)
- `year`
- `adoption_rank` (1 = highest adoption, integer)
- `adoption_score_raw` (the 0–1 Chainalysis-published score)
- `adoption_pct_rank` (the computed percentile rank, primary DV)
- `n_countries_ranked` (154 for 2020–2023, 151 for 2024–2025; stored for transparency)

---

## 4. Methodology Decision 2 — Handling the 2024/2025 Sub-Index Changes in Post-2022 Analysis

Even with percentile-rank as the DV, the sub-index changes remain a concern for the interaction specification. The `post_2022` dummy is 1 for 2023, 2024, 2025. Of those three years, two (2024 and 2025) have a modified measurement instrument. Any `X × post_2022` interaction is therefore partially identified off methodology changes that happen to fall inside the post-2022 window.

### Options considered

- **(A) Percentile-rank DV only.** Decision 1 addresses most but not all of the concern. Insufficient on its own because a country's *rank* within the 151-country 2024 set still depends on which sub-indices were used.
- **(B) Add a `methodology_change` dummy** equal to 1 for 2024 and 2025, 0 otherwise. Absorbs the average shift in measurement. Does not absorb heterogeneous effects but does absorb the dominant level shift.
- **(C) Restrict the headline panel to 2020–2023.** Most conservative. Costs two of three post-FTX years, gutting the statistical power of the `post_2022` interaction test. Rejected as primary approach.

### Decision

**A and B combined.** Percentile-rank is the primary DV; `methodology_change` is added as a control in every H2 regression specification. Report both the baseline (without `methodology_change`) and the controlled specification in the Phase 3.4 regression table — the comparison itself is informative. Phase 4 narrative will explicitly flag this as a limitation and cite this planning document as the pre-registered handling.

**C is the Phase 3 robustness fallback.** If the percentile-rank + methodology-dummy results are unstable or sensitive to specification, re-run the headline regression on the 2020–2023 subpanel and report it as a sensitivity analysis.

### What to store in the final H2 panel

Add `methodology_change` as a column in `h2_diffusion_dataset.csv`. Value: 1 for year ∈ {2024, 2025}, 0 otherwise. Document the column in `DATA_DICTIONARY.md`.

---

## 5. ISO3 Country Code Reconciliation

Mechanical problem with a well-understood solution. Not a methodology risk, but must be implemented consistently to avoid silent join failures.

### Approach

1. **Canonical standard:** ISO 3166-1 alpha-3. All countries in both the Chainalysis and World Bank sides must be mapped to this before the join.
2. **Primary tool:** `pycountry`, which ships with every ISO 3166-1 code and supports fuzzy lookup via `pycountry.countries.lookup()`.
3. **Hardcoded alias dictionary:** for the ~20 known problem cases listed below. The dictionary is applied *before* pycountry lookup as an override, so that edge cases never fall through to fuzzy matching.
4. **Implementation location:** build as a standalone Python module at `src/country_codes.py` (or similar) so the mapping is auditable, testable, and reusable across notebooks. Not buried inside a notebook cell.

### Known alias mappings to hardcode

| Alias forms (likely to appear in raw data) | Canonical ISO3 |
|---|---|
| "Türkiye", "Turkey", "Turkiye" | TUR |
| "United States", "USA", "U.S.", "US", "United States of America" | USA |
| "United Kingdom", "UK", "Great Britain", "Britain" | GBR |
| "South Korea", "Korea, Rep.", "Republic of Korea", "Korea, Republic of" | KOR |
| "North Korea", "Korea, Dem. People's Rep.", "DPRK" | PRK |
| "Russia", "Russian Federation" | RUS |
| "Venezuela", "Venezuela, RB", "Venezuela, Bolivarian Republic of" | VEN |
| "Egypt", "Egypt, Arab Rep." | EGY |
| "Iran", "Iran, Islamic Rep." | IRN |
| "Vietnam", "Viet Nam" | VNM |
| "Yemen", "Yemen, Rep." | YEM |
| "Congo, Dem. Rep.", "Democratic Republic of the Congo", "DRC", "DR Congo" | COD |
| "Congo, Rep.", "Republic of Congo", "Congo-Brazzaville" | COG |
| "Ivory Coast", "Côte d'Ivoire", "Cote d'Ivoire" | CIV |
| "Taiwan", "Taiwan, China", "Chinese Taipei", "Taiwan, Province of China" | TWN |
| "Hong Kong", "Hong Kong SAR, China", "Hong Kong SAR" | HKG |
| "Macao", "Macau", "Macao SAR, China" | MAC |
| "Kyrgyzstan", "Kyrgyz Republic" | KGZ |
| "Slovakia", "Slovak Republic" | SVK |
| "Gambia", "Gambia, The", "The Gambia" | GMB |
| "Bahamas", "Bahamas, The", "The Bahamas" | BHS |
| "Laos", "Lao PDR", "Lao People's Democratic Republic" | LAO |
| "Brunei", "Brunei Darussalam" | BRN |
| "Cape Verde", "Cabo Verde" | CPV |
| "East Timor", "Timor-Leste" | TLS |
| "Czechia", "Czech Republic" | CZE |
| "Eswatini", "Swaziland" | SWZ |
| "North Macedonia", "Macedonia, FYR", "Macedonia" | MKD |

### Verification after the join

- Assert that dropout from each side is under 15 countries.
- Manually review the dropout list. If any G20 country or any top-30-by-GDP country appears in the dropout, stop and investigate — a large-economy dropout is almost certainly a mapping bug, not a real coverage gap.
- Log both dropout lists to the notebook markdown for audit trail.

---

## 6. Execution Checkpoints for Claude Code

The roadmap calls for Claude Code to execute 2B.4.a through 2B.4.c in sequence. This planning document adds two mandatory checkpoints at which Claude Code must stop and wait for Claude.ai review before proceeding. These exist because the highest-risk failures in this rebuild are silent ones — the dataset can look correct and still be contaminated.

### Checkpoint 1 — After PDF acquisition and extraction (between 2B.4.a bullet 2 and bullet 4)

Claude Code must:

1. Download all six Chainalysis Geography of Cryptocurrency reports using the URLs in §1.
2. Use the `pdf-reading` skill to locate and extract the full country ranking table from each PDF.
3. Save raw extractions to `data/01_raw/chainalysis/adoption_index_YYYY.csv` with whatever columns the PDF exposes (at minimum: country name, rank, overall score).
4. **Stop and report back** with a summary table: for each year, row count extracted, whether the full ~150-country table was captured or only the top 20, and any parsing anomalies.

Claude.ai reviews the report. If any year yielded only the top 20, Claude.ai decides whether to fall back to Market Intel scraping or to proceed with the gap documented. Claude Code does not make this decision unilaterally.

### Checkpoint 2 — After ISO3 standardization, before the join (between 2B.4.a bullet 5 and 2B.4.b)

Claude Code must:

1. Apply the alias dictionary and pycountry lookup to produce `data/02_intermediate/chainalysis_cleaned.csv` with the five columns specified in §3.
2. Produce a diagnostic listing: countries that failed to map to ISO3 (should be zero), countries whose name form required the alias dictionary (for the fix log), and a count of unique ISO3 codes per year.
3. **Stop and report back** with the diagnostic before beginning 2B.4.b (World Bank cleanup).

Claude.ai reviews. This checkpoint exists because country-code failures are the single most likely way to silently corrupt the join — a missed alias produces a country with no WB match, which silently drops from the panel, which nobody notices until a spot-check fails.

### No checkpoint before 2B.4.c

Once both sides are in ISO3 and the diagnostics clear, Claude Code can execute the join and the verification gate in a single pass. The verification gate in the roadmap (row counts, nulls, Vietnam/Nigeria/Argentina spot check) is sufficient at that stage because the upstream risks have already been addressed at Checkpoints 1 and 2.

---

## 7. Updates Required to Downstream Artifacts

These changes propagate beyond 2B.4 itself and must be reflected elsewhere before Phase 2B closes.

- **`docs/PHASE_2_FIX_LOG.md`** (to be written in Part 2B.6): add a section citing this document, summarizing the two methodology decisions, and noting that raw-score results will appear as a robustness column in Phase 3.4.
- **`docs/DATA_DICTIONARY.md`** (to be written in Part 2B.6): document `adoption_pct_rank`, `adoption_score_raw`, `adoption_rank`, `n_countries_ranked`, and `methodology_change` with full definitions and value ranges.
- **`Master_Recovery_Roadmap.md` §2B.4.c verification gate:** the spot-check on Vietnam, Nigeria, and Argentina should be run against `adoption_pct_rank`, not raw score. All three should score in the top decile (`adoption_pct_rank ≥ 0.9`) across most years of the panel. If any of them fails the top-decile check in multiple years, stop and investigate.
- **`Master_Recovery_Roadmap.md` Phase 3.4:** the panel regression specification must be updated to use `adoption_pct_rank` as the DV and include `methodology_change` as a control. This update will be made at the start of Phase 3, not now.
- **Phase 4 limitations slide:** must explicitly state the Chainalysis methodology changes and cite this document as the pre-registered handling.

---

## 8. Open Questions Deferred to Phase 3

These are flagged here so they are not forgotten, but they do not block 2B.4 execution:

1. **Whether to use `adoption_pct_rank` or its logit transform** as the regression DV. The percentile rank is bounded in [0, 1], which can cause heteroskedasticity at the extremes. A logit transform is the textbook fix. Decision deferred to Phase 3.1 after inspecting the DV distribution.
2. **Whether to weight the panel regression by population or GDP.** Chainalysis already weights its sub-indices by PPP and population internally, so an additional outer weight is likely double-counting. Tentative decision: unweighted OLS with country-clustered SE. Revisit in Phase 3.4 if the residual diagnostics look bad.
3. **Whether `financial_account_baseline` should enter only as an interaction** (since its main effect is absorbed by country FE). Roadmap §3.4 already calls for the interaction; this note is just to confirm we do not need to make the call now.

---

## 9. Sign-off

This document locks the H2 methodology as of the commit that introduces it. Any subsequent change — DV choice, methodology dummy, ISO3 approach, checkpoint structure — must be made via an amendment commit to this file, not silently in the notebook. The file is the methodology contract between Claude.ai (decision owner) and Claude Code (executor).