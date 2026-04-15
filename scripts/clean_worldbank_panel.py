"""
Clean World Bank panel for H2 diffusion dataset.
Phase 2B.4 Checkpoint 3 — Task C.

Loads data/01_raw/worldbank/all_indicators.csv (long format),
drops aggregate region codes, converts to ISO3, filters to 2020-2025,
constructs financial_account_baseline, pivots to wide format,
and saves to data/02_intermediate/wb_panel_cleaned.csv.

Usage:
    python scripts/clean_worldbank_panel.py
"""

import csv
import os
import sys

import numpy as np
import pandas as pd
import pycountry

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from standardize_country_names import resolve_iso3

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_PATH = os.path.join(REPO_ROOT, "data", "01_raw", "worldbank", "all_indicators.csv")
OUT_PATH = os.path.join(REPO_ROOT, "data", "02_intermediate", "wb_panel_cleaned.csv")

# ── Indicator code to friendly column name mapping ────────────────────────
INDICATOR_MAP = {
    "NY.GDP.PCAP.CD": "gdp_per_capita_usd",
    "FP.CPI.TOTL.ZG": "inflation_cpi_annual_pct",
    "FX.OWN.TOTL.ZS": "financial_account_ownership_pct",
    "BX.TRF.PWKR.DT.GD.ZS": "remittances_received_pct_gdp",
}

# ── 49 aggregate/region codes found in the WB data ───────────────────────
# Identified by attempting pycountry resolution on all 261 unique WB codes.
# These do not resolve to any ISO 3166-1 sovereign country.
WB_AGGREGATE_CODES = {
    "1A", "1W", "4E", "7E", "8S",
    "B8", "EU", "F1", "JG", "OE",
    "S1", "S2", "S3", "S4",
    "T2", "T3", "T4", "T5", "T6", "T7",
    "V1", "V2", "V3", "V4",
    "XC", "XD", "XE", "XF", "XG", "XH", "XI", "XJ", "XL", "XM",
    "XN", "XO", "XP", "XQ", "XT", "XU",
    "Z4", "Z7", "ZF", "ZG", "ZH", "ZI", "ZJ", "ZQ", "ZT",
}

# ── Special WB code mappings ─────────────────────────────────────────────
# Kosovo: WB uses 'XK', pycountry doesn't have it as a standard code.
# XKX is the commonly used user-assigned alpha-3 for Kosovo.
# Note: Kosovo is NOT in the Chainalysis data, so it will drop at join time.
WB_SPECIAL_CODES = {
    "XK": "XKX",  # Kosovo
}


def wb_code_to_iso3(country_code, country_name):
    """
    Convert a WB country_code to ISO3.
    Returns (iso3, method) or (None, reason).
    """
    cc = country_code.strip()

    # Check special codes first
    if cc in WB_SPECIAL_CODES:
        return (WB_SPECIAL_CODES[cc], "special_wb_code")

    # Try pycountry alpha_2
    country = pycountry.countries.get(alpha_2=cc)
    if country:
        return (country.alpha_3, "alpha_2")

    # Try pycountry alpha_3 (some WB codes are 3-letter)
    country = pycountry.countries.get(alpha_3=cc)
    if country:
        return (country.alpha_3, "alpha_3")

    # Try name resolution via the standardize module
    iso3, method = resolve_iso3(country_name)
    if iso3:
        return (iso3, f"name_resolve:{method}")

    return (None, "unresolved")


def main():
    print("=" * 60)
    print("Cleaning World Bank panel")
    print("=" * 60)

    # ── C.1 Load with keep_default_na=False ──────────────────────────────
    print("\n--- C.1: Loading ---")
    df = pd.read_csv(RAW_PATH, keep_default_na=False)
    print(f"  Raw rows: {len(df)}")
    print(f"  Columns: {list(df.columns)}")

    # Verify Namibia's code survived
    namibia = df[df["country_name"] == "Namibia"]
    assert len(namibia) > 0, "Namibia not found in data!"
    na_code = namibia["country_code"].iloc[0]
    assert na_code == "NA", f"Namibia code is {na_code!r}, expected 'NA'"
    print(f"  Namibia code: {na_code!r} (correct)")

    # Replace empty strings with NaN only on the value column (numeric)
    df["value"] = df["value"].replace("", np.nan)
    df["value"] = pd.to_numeric(df["value"], errors="coerce")

    # ── C.2 Drop aggregate region codes ──────────────────────────────────
    print("\n--- C.2: Dropping aggregates ---")
    pre_drop = len(df)
    aggregate_mask = df["country_code"].isin(WB_AGGREGATE_CODES)
    n_aggregate_rows = aggregate_mask.sum()
    df = df[~aggregate_mask].copy()
    print(f"  Dropped {n_aggregate_rows} rows ({len(WB_AGGREGATE_CODES)} aggregate codes)")
    print(f"  Remaining: {len(df)} rows")

    # ── C.3 Convert to ISO3 ──────────────────────────────────────────────
    print("\n--- C.3: Converting to ISO3 ---")
    unique_codes = df[["country_code", "country_name"]].drop_duplicates()
    code_map = {}
    fallback_log = []
    failed = []

    for _, row in unique_codes.iterrows():
        cc = row["country_code"]
        cn = row["country_name"]
        if cc in code_map:
            continue
        iso3, method = wb_code_to_iso3(cc, cn)
        if iso3:
            code_map[cc] = iso3
            if method != "alpha_2":
                fallback_log.append(f"  {cc} ({cn}) -> {iso3} via {method}")
        else:
            failed.append(f"  {cc}: {cn}")

    if fallback_log:
        print(f"  Fallback resolutions ({len(fallback_log)}):")
        for line in fallback_log:
            print(line)

    if failed:
        print(f"\n  FAILED RESOLUTIONS ({len(failed)}):")
        for line in failed:
            print(line)
        raise AssertionError(
            f"{len(failed)} WB country codes failed pycountry resolution. "
            "Stop and flag — an aggregate may have slipped through "
            "or a sovereign name variant is missing from the alias dictionary."
        )

    df["country_iso3"] = df["country_code"].map(code_map)
    assert df["country_iso3"].notna().all(), "Null ISO3 codes after mapping!"
    n_unique = df["country_iso3"].nunique()
    print(f"  All codes resolved. {n_unique} unique ISO3 codes.")

    # Verify each ISO3 is valid via pycountry (except XKX for Kosovo)
    for iso3 in df["country_iso3"].unique():
        if iso3 == "XKX":
            continue  # Kosovo — user-assigned, not in pycountry
        result = pycountry.countries.get(alpha_3=iso3)
        assert result is not None, f"Invalid ISO3 code: {iso3}"
    print("  All ISO3 codes validated via pycountry (XKX/Kosovo exempted).")

    # ── C.4 Filter to 2020-2025 ──────────────────────────────────────────
    print("\n--- C.4: Filtering to 2020-2025 ---")
    df["year"] = df["year"].astype(int)
    pre_filter = len(df)
    df = df[(df["year"] >= 2020) & (df["year"] <= 2025)].copy()
    print(f"  Filtered from {pre_filter} to {len(df)} rows")
    print(f"  Year range: {df['year'].min()} - {df['year'].max()}")

    # ── C.5-C.7 Pivot to wide and construct baseline ─────────────────────
    print("\n--- C.5-C.7: Pivoting to wide format ---")

    # Map indicator codes to friendly names
    df["indicator_friendly"] = df["indicator_code"].map(INDICATOR_MAP)
    unknown = df[df["indicator_friendly"].isna()]["indicator_code"].unique()
    if len(unknown) > 0:
        print(f"  WARNING: Unknown indicators (will be preserved): {unknown}")
        # Use the indicator_name column as fallback
        df.loc[df["indicator_friendly"].isna(), "indicator_friendly"] = (
            df.loc[df["indicator_friendly"].isna(), "indicator_name"]
        )

    # Pivot: one row per (country_iso3, country_name, year), columns = indicators
    pivot = df.pivot_table(
        index=["country_iso3", "country_name", "year"],
        columns="indicator_friendly",
        values="value",
        aggfunc="first",
    ).reset_index()

    # Flatten column names
    pivot.columns.name = None
    print(f"  Wide-format rows: {len(pivot)}")
    print(f"  Columns: {list(pivot.columns)}")

    # ── C.5 Construct financial_account_baseline ─────────────────────────
    print("\n--- C.5: Constructing financial_account_baseline ---")

    # For each country, take the most recent non-null financial_account_ownership_pct
    # Target 2021, fallback to 2017 (but we only have 2020+ data — check what's available)
    if "financial_account_ownership_pct" in pivot.columns:
        findex = pivot[pivot["financial_account_ownership_pct"].notna()][
            ["country_iso3", "year", "financial_account_ownership_pct"]
        ].copy()
        findex = findex.sort_values(["country_iso3", "year"], ascending=[True, False])
        # Take most recent per country
        baseline = findex.groupby("country_iso3").first()["financial_account_ownership_pct"]
        baseline.name = "financial_account_baseline"
        print(f"  Countries with baseline: {len(baseline)}")
        print(f"  Baseline year distribution:")
        findex_years = findex.groupby("country_iso3").first()["year"]
        print(f"    {findex_years.value_counts().to_dict()}")
    else:
        print("  WARNING: financial_account_ownership_pct column not found!")
        baseline = pd.Series(dtype=float, name="financial_account_baseline")

    # Merge baseline back as time-invariant column
    pivot = pivot.merge(baseline, on="country_iso3", how="left")

    # Drop the original time-varying findex column (if exists)
    if "financial_account_ownership_pct" in pivot.columns:
        pivot = pivot.drop(columns=["financial_account_ownership_pct"])

    # Assert: financial_account_baseline is constant within country
    baseline_check = pivot.groupby("country_iso3")["financial_account_baseline"].nunique()
    non_constant = baseline_check[baseline_check > 1]
    assert len(non_constant) == 0, (
        f"financial_account_baseline is not constant within country: "
        f"{non_constant.to_dict()}"
    )
    print("  financial_account_baseline is constant within country: PASS")

    # Coverage stats
    total_countries = pivot["country_iso3"].nunique()
    has_baseline = pivot.groupby("country_iso3")["financial_account_baseline"].first().notna().sum()
    no_baseline = total_countries - has_baseline
    print(f"  Coverage: {has_baseline} of {total_countries} countries have baseline; {no_baseline} NaN")

    # ── C.6 Null policy ──────────────────────────────────────────────────
    print("\n--- C.6: Null policy ---")
    for col in ["inflation_cpi_annual_pct", "remittances_received_pct_gdp",
                 "gdp_per_capita_usd", "financial_account_baseline"]:
        if col in pivot.columns:
            null_pct = pivot[col].isna().mean() * 100
            print(f"  {col}: {null_pct:.1f}% null — left as-is (listwise deletion at regression time)")

    # ── C.8 Save and assert ──────────────────────────────────────────────
    print("\n--- C.8: Saving and asserting ---")

    # Ensure column order
    core_cols = ["country_iso3", "country_name", "year",
                 "gdp_per_capita_usd", "inflation_cpi_annual_pct",
                 "financial_account_baseline", "remittances_received_pct_gdp"]
    extra_cols = [c for c in pivot.columns if c not in core_cols]
    if extra_cols:
        print(f"  Additional WB indicators retained: {extra_cols}")
    out_cols = [c for c in core_cols if c in pivot.columns] + extra_cols
    pivot = pivot[out_cols]

    # Save
    pivot.to_csv(OUT_PATH, index=False)
    print(f"  Saved to {OUT_PATH}")

    # ── Assertions ───────────────────────────────────────────────────────
    print("\n--- Assertions ---")

    # 1. Row count <= unique_countries * 6
    n_countries = pivot["country_iso3"].nunique()
    max_rows = n_countries * 6
    assert len(pivot) <= max_rows, (
        f"Row count {len(pivot)} > {n_countries} countries * 6 years = {max_rows}"
    )
    print(f"  Row count: {len(pivot)} <= {max_rows} (max): PASS")

    # 2. Zero aggregate codes
    retained_iso3 = set(pivot["country_iso3"].unique())
    # Re-check no aggregate code slipped through
    # (WB aggregates use 2-letter codes, our ISO3 are 3-letter, so this is a sanity check)
    agg_check = retained_iso3.intersection(WB_AGGREGATE_CODES)
    assert len(agg_check) == 0, f"Aggregate codes in output: {agg_check}"
    print("  Zero aggregate codes: PASS")

    # 3. Every country_iso3 resolves via pycountry (except XKX)
    for iso3 in retained_iso3:
        if iso3 == "XKX":
            continue
        assert pycountry.countries.get(alpha_3=iso3) is not None, f"Invalid: {iso3}"
    print("  All ISO3 codes valid via pycountry: PASS")

    # 4. financial_account_baseline constant within country
    print("  financial_account_baseline constant: PASS (checked above)")

    # 5. Year values subset of {2020..2025}
    valid_years = {2020, 2021, 2022, 2023, 2024, 2025}
    actual_years = set(pivot["year"].unique())
    assert actual_years.issubset(valid_years), (
        f"Unexpected years: {actual_years - valid_years}"
    )
    print(f"  Year values: {sorted(actual_years)} (subset of 2020-2025): PASS")

    # 6. Schema
    for col in ["country_iso3", "country_name", "year"]:
        assert col in pivot.columns, f"Missing required column: {col}"
    print("  Schema: PASS")

    # Summary
    print(f"\n{'=' * 60}")
    print(f"SUMMARY")
    print(f"{'=' * 60}")
    print(f"  Total rows: {len(pivot)}")
    print(f"  Unique countries: {n_countries}")
    print(f"  Year coverage: {sorted(actual_years)}")
    print(f"  Columns: {list(pivot.columns)}")
    print(f"  Aggregate codes dropped: {len(WB_AGGREGATE_CODES)}")
    print(f"  financial_account_baseline coverage: {has_baseline}/{total_countries}")

    print("\nALL ASSERTIONS PASS.")


if __name__ == "__main__":
    main()
