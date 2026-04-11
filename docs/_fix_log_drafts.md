# Fix Log Drafts (staging)

> Pending content for `docs/PHASE_2_FIX_LOG.md`, which is created in Phase 2B.6.
> Each entry below is a finished paragraph ready to paste into the fix log.
> This file itself will be deleted once `PHASE_2_FIX_LOG.md` exists and these
> entries have been migrated.

---

## Phase 2B.4.a — Chainalysis adoption index

The 2020 PDF parser silently dropped 10 "Among lowest" countries from page 130 (Cape Verde, Chad, Fiji, Laos, Libya, Mongolia, Tajikistan, Turkmenistan, West Bank and Gaza, Zimbabwe), reducing 2020 coverage from 154 to 144. Caught at Checkpoint 1 by manual cross-check of all six years' CSVs against their source PDFs; only 2020 was affected. Repair: rows restored with `score=0`, `rank=NaN`, `rank_note="Among lowest"`, and sub-index ranks transcribed from the PDF. Schema-unified across all six years via a new `rank_note` column. The 2025 file's coverage ceiling at rank 130 was investigated and confirmed to reflect Chainalysis's actual published depth, not a parser truncation — no remediation required. Dependent variable for H2 was set to percentile rank rather than raw `overall_score` because Chainalysis discontinued publishing normalized scores after 2021; raw score is retained as a 2020–2021 robustness appendix. Sub-national/territory drops (10 total): Hong Kong, Macao, Taiwan, Puerto Rico, French Polynesia, New Caledonia, Virgin Islands (U.S.), Aruba, Bermuda, Cayman Islands.

The original `scripts/extract_chainalysis.py` parser was preserved with a prominent warning header documenting all three known issues (the 2020 vision/OCR requirement, the page-130 "Among lowest" omission, and the 2025 coverage ceiling). This is to prevent future re-runs from silently overwriting the manually-corrected CSVs. The canonical source from Checkpoint 2 onward is the CSVs in `data/01_raw/chainalysis/`, not the script output.