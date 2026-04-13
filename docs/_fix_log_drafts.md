# Fix Log Drafts (staging)

> Pending content for `docs/PHASE_2_FIX_LOG.md`, which is created in Phase 2B.6.
> Each entry below is a finished paragraph ready to paste into the fix log.
> This file itself will be deleted once `PHASE_2_FIX_LOG.md` exists and these
> entries have been migrated.

---

## Phase 2B.4.a — Chainalysis adoption index

The 2020 PDF parser silently dropped 10 "Among lowest" countries from page 130 (Cape Verde, Chad, Fiji, Laos, Libya, Mongolia, Tajikistan, Turkmenistan, West Bank and Gaza, Zimbabwe), reducing 2020 coverage from 154 to 144. Caught at Checkpoint 1 by manual cross-check of all six years' CSVs against their source PDFs; only 2020 was affected. Repair: rows restored with `score=0`, `rank=NaN`, `rank_note="Among lowest"`, and sub-index ranks transcribed from the PDF. Schema-unified across all six years via a new `rank_note` column. The 2025 file's coverage ceiling at rank 130 was investigated and confirmed to reflect Chainalysis's actual published depth, not a parser truncation — no remediation required. Dependent variable for H2 was set to percentile rank rather than raw `overall_score` because Chainalysis discontinued publishing normalized scores after 2021; raw score is retained as a 2020–2021 robustness appendix. Sub-national/territory drops (10 total): Hong Kong, Macao, Taiwan, Puerto Rico, French Polynesia, New Caledonia, Virgin Islands (U.S.), Aruba, Bermuda, Cayman Islands.

The original `scripts/extract_chainalysis.py` parser was preserved with a prominent warning header documenting all three known issues (the 2020 vision/OCR requirement, the page-130 "Among lowest" omission, and the 2025 coverage ceiling). This is to prevent future re-runs from silently overwriting the manually-corrected CSVs. The canonical source from Checkpoint 2 onward is the CSVs in `data/01_raw/chainalysis/`, not the script output.

## Phase 2B.4.b — World Bank panel 2025 extension via forward-fill

The World Bank indicator pull covers 2020–2024 only; no 2025 values are published yet for the four indicators (GDP per capita, CPI inflation, remittances as % of GDP, Findex financial account ownership). Chainalysis publishes 2025 rankings for 130 countries, which would drop entirely in an inner join. Decision: forward-fill 2024 WB values to 2025 for countries with 2024 data present, no cascade from earlier years. This is defensible given the low year-over-year volatility of the four indicators (the Findex baseline is already treated as time-invariant by design; GDP per capita, remittance share, and inflation move slowly at annual frequency relative to the variation the regression is identifying on). An `is_forward_filled` boolean flag is added so Phase 3 can run a robustness spec excluding 2025 observations. Alternative considered: accepting a 2020–2024 panel. Rejected because it would drop a full post-FTX year (2025) at the cost of ~130 observations, and 2025 is the year where the H2 hypothesis of a strengthening post-crisis relationship would be most observable.

## Phase 2B.4.b — Financial account baseline sourced from 2024 Findex wave

The original Roadmap spec anticipated 2021 as the target Findex year for the `financial_account_baseline` time-invariant control. The World Bank pull contained a 2024 Findex wave (Global Findex 2024) with survey values for 139 of 212 sovereign countries — real new survey data, not carried-forward (e.g., US: 94.95% in 2021, 97.02% in 2024). Decision: take the most recent non-null Findex value per country, yielding 139 countries at 2024, 5 at 2021, 1 at 2022, and 67 NaN. A `baseline_year` column records the source year per country for transparency. The variable remains time-invariant within country (verified by assertion) so it continues to be absorbed by country fixed effects in the two-way FE specification. For pooled and interaction specifications where the baseline enters directly, Phase 3 includes a robustness check interacting `baseline_year == 2024` with the baseline variable to verify the survey-year heterogeneity is not driving results.