"""
Apply ISO3 standardization to Chainalysis adoption index CSVs.
Phase 2B.4 Checkpoint 3 — Task A.2.

Reads each raw CSV from data/01_raw/chainalysis/adoption_index_YYYY.csv,
applies the standardization module to produce a country_iso3 column,
drops rows where country_iso3 is None (territory/non-sovereign entities),
and writes the result to data/02_intermediate/chainalysis_standardized/.

Usage:
    python scripts/apply_chainalysis_standardization.py
"""

import csv
import os
import sys

import pycountry

# Allow importing from scripts/ directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from standardize_country_names import resolve_iso3

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(REPO_ROOT, "data", "01_raw", "chainalysis")
OUT_DIR = os.path.join(REPO_ROOT, "data", "02_intermediate", "chainalysis_standardized")

YEARS = [2020, 2021, 2022, 2023, 2024, 2025]

# Expected post-drop row counts per year.
# These account for the full 11-entry DROP_ENTITIES set (including ABW/BMU/CYM
# added at Checkpoint 2 review). The Checkpoint 2 addendum's "sovereign rows"
# column used the old 8-entry drop list; these are the corrected values.
#   2020: 154 raw - 4 drops (HK, Macao, Puerto Rico, Bermuda) = 150
#   2021: 157 raw - 8 drops (HK, Macao, PR, VI-US, FrPoly, NewCal, Bermuda, Cayman) = 149
#   2022: 146 raw - 4 drops (HK, Macao, Taiwan, Bermuda) = 142
#   2023: 155 raw - 4 drops (HK, Macao, Taiwan, Puerto Rico) = 151
#   2024: 151 raw - 5 drops (HK, Macao, Taiwan, Puerto Rico, Aruba) = 146
#   2025: 131 raw - 1 drop  (HK SAR China) = 130
EXPECTED_ROWS = {
    2020: 150,
    2021: 149,
    2022: 142,
    2023: 151,
    2024: 146,
    2025: 130,
}

# Minimum required columns in every output file
REQUIRED_COLS = {"country", "country_iso3", "rank", "rank_note"}


def process_year(year):
    """Process a single year's CSV: add country_iso3, drop territories."""
    inpath = os.path.join(RAW_DIR, f"adoption_index_{year}.csv")
    outpath = os.path.join(OUT_DIR, f"adoption_index_{year}.csv")

    rows_in = []
    with open(inpath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames)
        for row in reader:
            rows_in.append(row)

    # Add country_iso3 column and filter
    rows_out = []
    dropped = []
    for row in rows_in:
        name = row["country"].strip()
        iso3, method = resolve_iso3(name)
        if iso3 is None:
            dropped.append(name)
            continue
        row["country_iso3"] = iso3
        rows_out.append(row)

    # Build output fieldnames: insert country_iso3 right after country
    out_fields = list(fieldnames)
    country_idx = out_fields.index("country")
    out_fields.insert(country_idx + 1, "country_iso3")

    with open(outpath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=out_fields)
        writer.writeheader()
        writer.writerows(rows_out)

    return {
        "year": year,
        "raw_rows": len(rows_in),
        "output_rows": len(rows_out),
        "dropped": dropped,
        "fieldnames": out_fields,
        "iso3_codes": [r["country_iso3"] for r in rows_out],
    }


def run_assertions(result):
    """Run all per-file assertions. Raises AssertionError on failure."""
    year = result["year"]
    expected = EXPECTED_ROWS[year]
    actual = result["output_rows"]
    iso3_codes = result["iso3_codes"]
    fieldnames = result["fieldnames"]

    # 1. Row count
    assert actual == expected, (
        f"{year}: row count {actual} != expected {expected}. "
        f"Dropped: {result['dropped']}"
    )

    # 2. Zero null country_iso3
    null_iso3 = sum(1 for c in iso3_codes if not c or c.strip() == "")
    assert null_iso3 == 0, f"{year}: {null_iso3} null country_iso3 values"

    # 3. No duplicate country_iso3 within year
    dupes = [c for c in iso3_codes if iso3_codes.count(c) > 1]
    assert len(dupes) == 0, f"{year}: duplicate ISO3 codes: {set(dupes)}"

    # 4. Schema check — required columns present
    missing = REQUIRED_COLS - set(fieldnames)
    assert len(missing) == 0, f"{year}: missing required columns: {missing}"

    # Also check year-specific sub-index rank columns exist
    sub_index_cols = [c for c in fieldnames if c.endswith("_rank")]
    assert len(sub_index_cols) >= 1, f"{year}: no sub-index rank columns found"

    # 5. Every country_iso3 is a valid ISO3 per pycountry
    invalid = []
    for code in iso3_codes:
        try:
            pycountry.countries.get(alpha_3=code)
        except Exception:
            if pycountry.countries.get(alpha_3=code) is None:
                invalid.append(code)
    # pycountry.countries.get returns None for invalid codes, doesn't raise
    invalid = [c for c in iso3_codes if pycountry.countries.get(alpha_3=c) is None]
    assert len(invalid) == 0, f"{year}: invalid ISO3 codes: {set(invalid)}"

    print(f"  {year}: ALL ASSERTIONS PASS ({actual} rows)")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    print("=" * 60)
    print("Applying ISO3 standardization to Chainalysis CSVs")
    print("=" * 60)

    all_results = []
    for year in YEARS:
        print(f"\n--- {year} ---")
        result = process_year(year)
        print(f"  Raw: {result['raw_rows']}, Output: {result['output_rows']}, "
              f"Dropped: {len(result['dropped'])} ({result['dropped']})")
        run_assertions(result)
        all_results.append(result)

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    all_iso3 = set()
    for r in all_results:
        all_iso3.update(r["iso3_codes"])
        print(f"  {r['year']}: {r['output_rows']} rows, "
              f"{len(set(r['iso3_codes']))} unique ISO3")
    print(f"\n  Total unique ISO3 across all years: {len(all_iso3)}")
    print(f"  Total panel observations: {sum(r['output_rows'] for r in all_results)}")
    print("\nALL YEARS PASS.")


if __name__ == "__main__":
    main()
