"""
ISO3 Country Name Standardization Module
=========================================
Resolves country names from Chainalysis adoption index CSVs to ISO 3166-1 alpha-3 codes.

Strategy:
  1. Check hardcoded drop list (non-sovereign / sub-national entities) -> returns None
  2. Check hardcoded alias dictionary (known problem cases) -> returns ISO3
  3. Try pycountry.countries.lookup (exact match on name/alpha_2/alpha_3)
  4. Try pycountry.countries.search_fuzzy
  5. If all fail -> returns None (unresolved)

Usage:
  from standardize_country_names import resolve_iso3, resolve_all_from_csv
"""

import pycountry

# ── Non-sovereign / sub-national entities to DROP ──────────────────────────
# These do not appear in the World Bank sovereign country panel.
# Methodology decision: documented in CLAUDE.md §10 and approved by Claude.ai.
DROP_ENTITIES = {
    "Hong Kong",
    "Hong Kong SAR, China",
    "Macao",
    "Taiwan",
    "Puerto Rico",
    "Virgin Islands, U.S.",
    "French Polynesia",
    "New Caledonia",
}

# ── Hardcoded alias dictionary ─────────────────────────────────────────────
# Covers names that pycountry (v26+) cannot resolve via lookup or fuzzy match,
# plus names where fuzzy match returns the wrong country.
ALIAS_TO_ISO3 = {
    # Bahamas variants
    "Bahamas, The": "BHS",
    "The Bahamas": "BHS",
    # Bolivia
    "Bolivia": "BOL",
    "Bolivia, Plurinational State of": "BOL",
    # Brunei
    "Brunei": "BRN",
    "Brunei Darussalam": "BRN",
    # Cape Verde / Cabo Verde
    "Cape Verde": "CPV",
    "Cabo Verde": "CPV",
    # Congo (Republic of)
    "Congo": "COG",
    "Rep. of Congo": "COG",
    # Congo (Democratic Republic)
    "Congo, The Democratic Republic of the": "COD",
    "Democratic Republic of the Congo": "COD",
    "Democratic Republic of Congo": "COD",
    "Dem. Rep. of Congo": "COD",
    # Cote d'Ivoire
    "Ivory Coast": "CIV",
    "Cote d'Ivoire": "CIV",
    "Côte d'Ivoire": "CIV",
    # Czech Republic
    "Czech Republic": "CZE",
    "Czechia": "CZE",
    # Egypt
    "Egypt": "EGY",
    "Egypt, Arab Rep.": "EGY",
    # Iran
    "Iran": "IRN",
    "Iran, Islamic Republic of": "IRN",
    # Korea (South)
    "South Korea": "KOR",
    "Korea, Republic of": "KOR",
    "Korea, Rep.": "KOR",
    # Kyrgyzstan
    "Kyrgyzstan": "KGZ",
    "Kyrgyz Republic": "KGZ",
    # Laos
    "Laos": "LAO",
    "Lao People's Democratic Republic": "LAO",
    "Lao PDR": "LAO",
    # Moldova
    "Moldova": "MDA",
    "Moldova, Republic of": "MDA",
    # North Macedonia
    "Macedonia": "MKD",
    "North Macedonia": "MKD",
    # Palestine
    "Palestine": "PSE",
    "West Bank and Gaza": "PSE",
    # Russia
    "Russia": "RUS",
    "Russian Federation": "RUS",
    # Serbia
    "Republic of Serbia": "SRB",
    "Serbia": "SRB",
    # Slovakia
    "Slovakia": "SVK",
    "Slovak Republic": "SVK",
    # Syria
    "Syria": "SYR",
    "Syrian Arab Republic": "SYR",
    # Tanzania
    "United Republic of Tanzania": "TZA",
    "Tanzania": "TZA",
    # Turkey / Türkiye
    "Turkey": "TUR",
    "Türkiye": "TUR",
    "Turkiye": "TUR",
    # UAE
    "UAE": "ARE",
    "United Arab Emirates": "ARE",
    # United States
    "United States": "USA",
    "United States of America": "USA",
    # Venezuela
    "Venezuela": "VEN",
    "Venezuela, RB": "VEN",
    # Vietnam
    "Vietnam": "VNM",
    "Viet Nam": "VNM",
    # Yemen
    "Yemen": "YEM",
    "Yemen, Rep.": "YEM",
}


def resolve_iso3(country_name):
    """
    Resolve a country name to an ISO 3166-1 alpha-3 code.

    Returns:
      tuple: (iso3_code_or_None, match_method)
        match_method is one of: 'dropped', 'hardcoded alias', 'pycountry lookup',
                                'pycountry fuzzy', 'unresolved'
    """
    name = country_name.strip()

    # Step 1: Check drop list
    if name in DROP_ENTITIES:
        return (None, "dropped")

    # Step 2: Check hardcoded alias dictionary
    if name in ALIAS_TO_ISO3:
        return (ALIAS_TO_ISO3[name], "hardcoded alias")

    # Step 3: Try pycountry exact lookup
    try:
        result = pycountry.countries.lookup(name)
        return (result.alpha_3, "pycountry lookup")
    except LookupError:
        pass

    # Step 4: Try pycountry fuzzy search
    try:
        results = pycountry.countries.search_fuzzy(name)
        if results:
            return (results[0].alpha_3, "pycountry fuzzy")
    except LookupError:
        pass

    # Step 5: Unresolved
    return (None, "unresolved")


def resolve_all_from_csv(csv_path):
    """
    Read a Chainalysis adoption index CSV and resolve all country names.

    Returns:
      list of dicts: [{country, iso3, method}, ...]
    """
    import csv
    results = []
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row["country"].strip()
            if not name:
                continue
            iso3, method = resolve_iso3(name)
            results.append({"country": name, "iso3": iso3, "method": method})
    return results


if __name__ == "__main__":
    import csv
    import os
    import sys

    base = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "data", "01_raw", "chainalysis",
    )

    all_results = {}  # name -> {iso3, method, years}
    for year in [2020, 2021, 2022, 2023, 2024, 2025]:
        path = os.path.join(base, f"adoption_index_{year}.csv")
        entries = resolve_all_from_csv(path)
        for e in entries:
            name = e["country"]
            if name not in all_results:
                all_results[name] = {
                    "iso3": e["iso3"],
                    "method": e["method"],
                    "years": [],
                }
            all_results[name]["years"].append(year)

    # Summary stats
    total = len(all_results)
    resolved = sum(1 for v in all_results.values() if v["iso3"] is not None)
    dropped = sum(1 for v in all_results.values() if v["method"] == "dropped")
    unresolved = sum(1 for v in all_results.values() if v["method"] == "unresolved")

    print(f"Total distinct country names: {total}")
    print(f"Resolved to ISO3: {resolved}")
    print(f"Dropped (non-sovereign): {dropped}")
    print(f"Unresolved: {unresolved}")

    if unresolved > 0:
        print("\n⚠️  UNRESOLVED ENTRIES — ESCALATE TO CLAUDE.AI:")
        for name, v in sorted(all_results.items()):
            if v["method"] == "unresolved":
                print(f"  {name} (years: {v['years']})")
        sys.exit(1)

    print("\nFull mapping:")
    for name in sorted(all_results.keys()):
        v = all_results[name]
        iso3 = v["iso3"] if v["iso3"] else "None (dropped)"
        print(f"  {name:45s} -> {iso3:5s}  [{v['method']}]  years: {v['years']}")
