# Phase 2B.4.a — Checkpoint 1 Report

**Date:** 2026-04-09
**Scope:** Chainalysis PDF acquisition and country ranking table extraction
**Branch:** `fixes/`
**Status:** Complete with gaps flagged for Claude.ai review

---

## 1. Summary Table

| Year | PDF Downloaded | Size | Extraction Method | Rows Extracted | Expected | Full Table? | Has Score (0–1) |
|------|---------------|------|-------------------|----------------|----------|-------------|-----------------|
| 2020 | Y | 53 MB | Read tool (vision/OCR on image-based table) | 144 | ~154 | Yes — 142 ranked + 2 "Among lowest" | **Yes** |
| 2021 | Y | 2.7 MB | PyMuPDF `find_tables()` | 157 | ~154 | Yes — full table | **Yes** |
| 2022 | Y | 4.4 MB | PyMuPDF `find_tables()` | 146 | ~154 | **Partial — see §3.1** | No |
| 2023 | Y | 9.2 MB | PyMuPDF `find_tables()` | 155 | ~154 | Yes — full table | No |
| 2024 | Y | 6.1 MB | PyMuPDF `find_tables()` | 151 | 151 | Yes — full table | No |
| 2025 | Y | 9.9 MB | PyMuPDF `find_tables()` | 131 | 151 | **No — truncated at rank 130 (see §3.2)** | No |

---

## 2. Files Created

### PDFs (downloaded to `data/01_raw/chainalysis/`)
- `adoption_index_2020.pdf` — 53 MB (go.chainalysis.com CDN)
- `adoption_index_2021.pdf` — 2.7 MB (bitcoinke.io mirror)
- `adoption_index_2022.pdf` — 4.4 MB (go.chainalysis.com CDN)
- `adoption_index_2023.pdf` — 9.2 MB (chainalysis.com wp-content)
- `adoption_index_2024.pdf` — 6.1 MB (chainalysis.com wp-content)
- `adoption_index_2025.pdf` — 9.9 MB (chainalysis.com wp-content)

### CSV extractions (same directory)
- `adoption_index_2020.csv` — 144 rows, 7 columns
- `adoption_index_2021.csv` — 157 rows, 6 columns
- `adoption_index_2022.csv` — 146 rows, 6 columns
- `adoption_index_2023.csv` — 155 rows, 7 columns
- `adoption_index_2024.csv` — 151 rows, 6 columns
- `adoption_index_2025.csv` — 131 rows, 6 columns

### Extraction script
- `scripts/extract_chainalysis.py` — One-time extraction script using PyMuPDF `find_tables()`. Documents the exact page ranges and column mappings used. 2020 was extracted separately via vision.

---

## 3. Gaps and Anomalies Requiring Claude.ai Decision

### 3.1 — 2022: 146 countries instead of expected ~154

The 2022 PDF table (pages 82–88) ends at rank 146 (Afghanistan). All 7 table pages were extracted; there are no additional table pages in the PDF. The table appears complete within the document — the 2022 report may have genuinely ranked fewer countries, or 8 countries may appear elsewhere in the report (e.g., excluded due to insufficient data). The last entry is Afghanistan at rank 146 with score 0.

**Decision needed:** Accept 146 as-is, or attempt Market Intel fallback for the missing ~8 countries?

### 3.2 — 2025: PDF truncated at rank 130 (131 rows, expected 151)

The "release" PDF (`the-2025-geography-of-crypto-report-release.pdf`) contains the full index table only through rank 130 (with a tie — Maldives and Botswana both rank 130, yielding 131 data rows). The remaining 20 countries (ranks 131–151) are not in the PDF.

The blog post (chainalysis.com/blog/2025-global-crypto-adoption-index/) confirms 151 countries exist but only publishes the top 20. The full ranking is available on the interactive Market Intel map.

**Decision needed:** Use the Market Intel interactive map to fill the 20-country gap? Or accept the truncation and document it as a panel limitation?

### 3.3 — Scores available only for 2020 and 2021

The 0–1 normalized `overall_score` column appears only in the 2020 and 2021 PDF tables. The 2022–2025 tables publish **rankings only** (integer positions), not scores. PHASE_2B4_PLANNING.md §3 specifies storing `adoption_score_raw`, but this is not extractable from the PDFs for 4 of 6 years.

This is **not a blocking issue** for the primary DV: PHASE_2B4_PLANNING.md §3 designates `adoption_pct_rank` (computed from rank) as the primary DV, and `adoption_score_raw` as a robustness column. The robustness analysis would be limited to 2020–2021 if raw scores cannot be sourced for other years.

**Decision needed:** Accept rank-only data for 2022–2025? Or attempt Market Intel scraping to recover scores?

### 3.4 — 2020: Two "Among lowest" entries without numeric ranks

Afghanistan and Algeria appear in the 2020 table with score = 0 and rank = "Among lowest" instead of a numeric rank. I stored them with empty rank fields. Additionally, Afghanistan's P2P sub-index rank is also "Among lowest" (stored as empty).

**Decision needed:** Assign them ranks 143 and 144 (or drop them)? This affects the percentile-rank computation.

---

## 4. Sub-Index Changes Across Years (Confirmed)

Matches PHASE_2B4_PLANNING.md §1 exactly:

| Year | # Sub-indices | Sub-indices |
|------|--------------|-------------|
| 2020 | 4 | On-chain value received, On-chain retail value received, Number of on-chain deposits, P2P exchange trade volume |
| 2021 | 3 | On-chain value received, On-chain retail value received, P2P exchange trade volume |
| 2022 | 5 | Centralized service value received, Retail centralized service value received, P2P exchange trade volume, DeFi value received, Retail DeFi value received |
| 2023 | 5 | Same as 2022 |
| 2024 | 4 | Centralized service value received, Retail centralized service value received, DeFi value received, Retail DeFi value received (**P2P dropped**) |
| 2025 | 4 | Retail centralized service value received, Centralized service value received, DeFi value received, Institutional centralized service value received (**Retail DeFi dropped, Institutional added**) |

---

## 5. Country Name Variants Observed

These will need the alias dictionary at Checkpoint 2. Notable variants:

| Country | Variants across years |
|---------|----------------------|
| Vietnam | "Vietnam" (2020–2024), "Viet Nam" (2025) |
| Turkey | "Turkey" (2020–2023), "Türkiye" (2024), "Turkiye" (2025) |
| South Korea | "South Korea" (2020, 2022), "Korea, Rep." (2025) |
| Tanzania | "United Republic of Tanzania" (2020), "Tanzania" (2021–2024) |
| Ivory Coast | "Ivory Coast" (2020), "Côte d'Ivoire" (2022–2024) |
| Serbia | "Republic of Serbia" (2020), not checked other years |
| Congo (DRC) | "Democratic Republic of the Congo" (2020) |
| North Macedonia | "Macedonia" (2020) |
| Bahamas | "The Bahamas" (2020), "Bahamas, The" (2025) |
| Macao | "Macao" (2020), "Macao" (2022) — asterisked as SAR in 2020 |
| Hong Kong | "Hong Kong" (2020) — asterisked as SAR in 2020 |

---

## 6. Gitignore Recommendation

All 6 PDFs exceed 5 MB (the 2020 PDF is 53 MB). They should be added to `.gitignore`:

```
data/01_raw/chainalysis/*.pdf
```

The 6 CSV extractions (3–5 KB each) should be tracked in git.

**Not applied yet** — flagged per instructions. Will apply after checkpoint review.

---

## 7. Recommendation on Market Intel Fallback

| Year | Needs fallback? | Reason |
|------|----------------|--------|
| 2020 | No | Full table extracted via vision |
| 2021 | No | Full table extracted |
| 2022 | Maybe | 8 countries short of expected ~154 |
| 2023 | No | Full table extracted |
| 2024 | No | Full table extracted |
| 2025 | **Yes** | 20 countries missing (ranks 131–151) |

**Recommended next step:** Use the Market Intel interactive map JSON endpoint to fill the 2025 gap (20 countries) and optionally the 2022 gap (8 countries). If Claude.ai decides raw scores are needed for 2022–2025, Market Intel would be the source for those as well. This should be a separate session after checkpoint approval.

---

## 8. What Was NOT Done (Per Scope Constraints)

- No country name standardization or ISO3 mapping
- No World Bank data touched
- No commits made
- No `.gitignore` modifications
- No Market Intel scraping attempted
- Did not proceed past Checkpoint 1
