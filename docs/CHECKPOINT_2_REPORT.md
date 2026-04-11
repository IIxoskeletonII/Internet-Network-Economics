# Checkpoint 2 Report — Phase 2B.4.a Closeout

> Generated 2026-04-10. Awaiting Claude.ai review before proceeding to
> World Bank cleanup and the Chainalysis–WB join (Checkpoint 3).

---

## Task 1: Repair adoption_index_2020.csv

| Metric | Before | After |
|---|---|---|
| Total data rows | 144 | **154** |
| Ranked countries (integer rank 1–142) | 142 | 142 |
| "Among lowest" countries | 2 (Afghanistan, Algeria) | **12** |
| `rank_note` column | did not exist | added |

**10 countries added** from page 130 of the 2020 PDF: Cape Verde, Chad,
Fiji, Laos, Libya, Mongolia, Tajikistan, Turkmenistan, West Bank and Gaza,
Zimbabwe.

**Verification checks — all pass:**
- 154 data rows (142 ranked + 12 "Among lowest")
- All 12 "Among lowest" have `rank_note = "Among lowest"`
- All 12 "Among lowest" have `overall_score = 0`
- All 12 "Among lowest" have `p2p_exchange_trade_volume_rank` = empty (NaN)
- All 142 ranked countries have integer ranks 1–142 with no gaps

---

## Task 2: Add rank_note column to 2021–2025 CSVs

| CSV | Data rows | rank_note column added | All values empty |
|---|---|---|---|
| adoption_index_2021.csv | 157 | Yes | Yes |
| adoption_index_2022.csv | 146 | Yes | Yes |
| adoption_index_2023.csv | 155 | Yes | Yes |
| adoption_index_2024.csv | 151 | Yes | Yes |
| adoption_index_2025.csv | 131 | Yes | Yes |

All 6 CSVs now have a consistent `rank_note` column. Only the 2020 file
has non-empty values ("Among lowest" for 12 rows).

---

## Task 3: ISO3 Standardization Module

### Module created

`scripts/standardize_country_names.py` implements a 4-step resolution:

1. **Drop list** — 7 non-sovereign entity names (8 with Hong Kong variant) → returns `None`
2. **Hardcoded alias dictionary** — 60 name variants for known problem cases
3. **pycountry lookup** — exact match on name/alpha_2/alpha_3
4. **pycountry fuzzy search** — last resort

### Full mapping results

| Metric | Value |
|---|---|
| Distinct country names across 6 CSVs | 207 |
| Resolved to ISO3 code | 199 |
| Unique ISO3 codes (sovereign countries) | **165** |
| Dropped (non-sovereign entities) | 8 |
| **Unresolved** | **0** |

### Resolution method breakdown

| Method | Count |
|---|---|
| pycountry lookup | 139 |
| hardcoded alias | 60 |
| dropped | 8 |

### Dropped entities

| Entity | Years present |
|---|---|
| French Polynesia | 2021 |
| Hong Kong | 2020, 2021, 2022, 2023, 2024 |
| Hong Kong SAR, China | 2025 |
| Macao | 2020, 2021, 2022, 2023, 2024 |
| New Caledonia | 2021 |
| Puerto Rico | 2020, 2021, 2023, 2024 |
| Taiwan | 2022, 2023, 2024 |
| Virgin Islands, U.S. | 2021 |

### Name variant consolidation

27 ISO3 codes have multiple name variants across the 6 CSVs (e.g., "Turkey" /
"Türkiye" / "Turkiye" → TUR). Full list in `docs/ISO3_MAPPING_REPORT.md`.

---

## Items for Claude.ai Review

### 1. Potential additional drops (ESCALATION)

The following entities are resolved by pycountry but may not appear in the
World Bank sovereign country panel. The task spec only explicitly lists 7
drops (Hong Kong, Macao, Taiwan, Puerto Rico, Virgin Islands U.S., French
Polynesia, New Caledonia). These additional entities were NOT dropped but
may need review:

| Entity | ISO3 | Years | Concern |
|---|---|---|---|
| Aruba | ABW | 2024 | Dutch constituent country, not always in WB panel |
| Bermuda | BMU | 2020, 2021, 2022 | British Overseas Territory |
| Cayman Islands | CYM | 2021 | British Overseas Territory |
| Monaco | MCO | 2021 | Sovereign microstate — likely OK, but very small |
| Seychelles | SYC | 2021, 2022, 2023 | Sovereign — should be fine |
| Saint Lucia | LCA | 2022 | Sovereign — should be fine |
| Antigua and Barbuda | ATG | 2023 | Sovereign — should be fine |
| Andorra | AND | 2024, 2025 | Sovereign microstate — likely OK |

**Recommendation:** Aruba, Bermuda, and Cayman Islands are territories and
will likely have no World Bank match. They will naturally drop during the
join (inner join on ISO3). No action needed unless Claude.ai wants them
explicitly added to the DROP_ENTITIES set for clarity.

### 2. No surprises on the "Among lowest" repair

The 10 missing countries from page 130 of the 2020 PDF were added exactly
as specified. No judgment calls were needed.

### 3. pycountry version note

Using pycountry v26.2.16 which uses the ISO's current official names
(e.g., "Türkiye" not "Turkey"). The alias dictionary covers all legacy
name forms that appear in the Chainalysis data.

---

## Files Created / Modified

| Path | Action |
|---|---|
| `data/01_raw/chainalysis/adoption_index_2020.csv` | Modified (10 rows + rank_note column) |
| `data/01_raw/chainalysis/adoption_index_2021.csv` | Modified (rank_note column) |
| `data/01_raw/chainalysis/adoption_index_2022.csv` | Modified (rank_note column) |
| `data/01_raw/chainalysis/adoption_index_2023.csv` | Modified (rank_note column) |
| `data/01_raw/chainalysis/adoption_index_2024.csv` | Modified (rank_note column) |
| `data/01_raw/chainalysis/adoption_index_2025.csv` | Modified (rank_note column) |
| `scripts/standardize_country_names.py` | Created |
| `docs/ISO3_MAPPING_REPORT.md` | Created |
| `docs/CHECKPOINT_2_REPORT.md` | Created (this file) |

---

**STOP — awaiting Claude.ai review before proceeding to Checkpoint 3
(World Bank cleanup and Chainalysis–WB join).**
