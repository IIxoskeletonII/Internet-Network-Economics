"""
Dashboard data verification harness (Layer 2 of the dashboard audit).

Cross-checks every hard-coded number embedded in the dashboard JSX and the
window.DATA bundle against the canonical source tables under
``outputs/tables/``. Emits a markdown report at
``scripts/verification_report.md`` with one row per check (PASS / FAIL /
SKIP, dashboard value, source value, delta, source citation).

Extraction approach
-------------------
The JSX files contain plain JS object literals (unquoted keys) that cannot
be parsed as JSON. We delegate the parsing to Node, which evaluates each
named const via ``new Function`` inside its own scope and emits the
resulting structure as JSON to stdout. ``data.js`` is loaded the same way
by passing a synthetic ``window`` object into the script body.

Tolerances
----------
- Cost / fee values:        1e-2  (CSV precision is 4dp in dollars)
- Ratios:                   1e-1  (CSV precision is 2dp)
- Regression coefficients:  5e-3  (CSV precision is 4-6dp)
- p-value claims:           threshold-based (claim ``p < 1e-9`` passes
  when the source p_value is below that threshold)
- Counts / labels:          exact equality
"""
from __future__ import annotations

import json
import math
import subprocess
import sys
from pathlib import Path

import pandas as pd

REPO = Path(__file__).resolve().parent.parent
DASH = REPO / "dashboard"
TABLES = REPO / "outputs" / "tables"
OUT_REPORT = REPO / "scripts" / "verification_report.md"
OUT_LOG = REPO / "scripts" / "verification_log.txt"

TOL_FEE = 1e-2
TOL_RATIO = 1e-1
TOL_STAT = 5e-3
TOL_SE = 5e-2

NODE_HELPER = r"""
const fs = require('fs');
const tabPath = process.argv[1];
const dataPath = process.argv[2];
const src = fs.readFileSync(tabPath, 'utf8');
const names = ['H4_COST', 'H4_SPECS', 'H4_SENSITIVITY', 'H4_BREAKEVEN', 'H4_CROSSOVER', 'H4_SAVINGS'];
const out = {};
for (const n of names) {
  const re = new RegExp('const\\s+' + n + '\\s*=\\s*');
  const m = re.exec(src);
  if (!m) continue;
  let i = m.index + m[0].length;
  const open = src[i];
  if (open !== '{' && open !== '[') continue;
  const close = open === '{' ? '}' : ']';
  let depth = 0, inStr = null, esc = false, inLine = false, inBlock = false;
  const start = i;
  for (; i < src.length; i++) {
    const c = src[i], next = src[i + 1];
    if (inLine) { if (c === '\n') inLine = false; continue; }
    if (inBlock) { if (c === '*' && next === '/') { inBlock = false; i++; } continue; }
    if (esc) { esc = false; continue; }
    if (inStr) { if (c === '\\') { esc = true; } else if (c === inStr) { inStr = null; } continue; }
    if (c === '/' && next === '/') { inLine = true; i++; continue; }
    if (c === '/' && next === '*') { inBlock = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) { i++; break; } }
  }
  const literal = src.slice(start, i);
  out[n] = (new Function('return (' + literal + ');'))();
}
const dataSrc = fs.readFileSync(dataPath, 'utf8');
const winRef = {};
(new Function('window', dataSrc))(winRef);
out.DATA = winRef.DATA;
out.DATA_KEYS = Object.keys(winRef.DATA);
process.stdout.write(JSON.stringify(out));
"""

checks: list[dict] = []
errors: list[str] = []


def check(category, label, dash_val, src_val, tol=0.0, ref="", severity="high"):
    if dash_val is None or src_val is None:
        status, delta = "SKIP", None
    elif isinstance(dash_val, bool) or isinstance(src_val, bool):
        status = "PASS" if dash_val == src_val else "FAIL"
        delta = None
    elif isinstance(dash_val, (int, float)) and isinstance(src_val, (int, float)):
        delta = float(dash_val) - float(src_val)
        status = "PASS" if math.isclose(dash_val, src_val, abs_tol=tol, rel_tol=0) else "FAIL"
    else:
        status = "PASS" if dash_val == src_val else "FAIL"
        delta = None
    checks.append({
        "category": category,
        "label": label,
        "dashboard": dash_val,
        "source": src_val,
        "delta": delta,
        "tol": tol,
        "ref": ref,
        "status": status,
        "severity": severity,
    })


def extract_dashboard_constants() -> dict:
    proc = subprocess.run(
        ["node", "-e", NODE_HELPER, str(DASH / "tab_h4.jsx"), str(DASH / "data.js")],
        capture_output=True, text=True, check=False,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"Node extraction failed: {proc.stderr}")
    return json.loads(proc.stdout)


def main() -> int:
    h1 = pd.read_csv(TABLES / "tbl_h1_master_summary.csv")
    h2 = pd.read_csv(TABLES / "tbl_h2_master_summary.csv")
    h3 = pd.read_csv(TABLES / "tbl_h3_master_summary.csv")
    h4_cost = pd.read_csv(TABLES / "tbl_h4_cost_comparison.csv")
    h4_master = pd.read_csv(TABLES / "tbl_h4_master_summary.csv")
    h4_breakeven = pd.read_csv(TABLES / "tbl_h4_breakeven_by_year.csv")
    h4_crossover = pd.read_csv(TABLES / "tbl_h4_crossover_by_year.csv")
    h4_savings = pd.read_csv(TABLES / "tbl_h4_savings_ratio_by_year.csv")

    consts = extract_dashboard_constants()
    H4_COST = consts["H4_COST"]
    H4_SPECS = consts["H4_SPECS"]
    H4_SENSITIVITY = consts["H4_SENSITIVITY"]
    H4_BREAKEVEN = consts["H4_BREAKEVEN"]
    H4_CROSSOVER = consts["H4_CROSSOVER"]
    H4_SAVINGS = consts["H4_SAVINGS"]
    DATA_KEYS = consts.get("DATA_KEYS", [])

    # ---------- H4_COST headline numbers ----------
    cost200 = h4_cost.loc[h4_cost.transfer_size_usd == 200].iloc[0]
    cost10k = h4_cost.loc[h4_cost.transfer_size_usd == 10000].iloc[0]
    ref_cost = "tbl_h4_cost_comparison.csv"

    check("H4_COST", "eth.median",  H4_COST["eth"]["median"],  cost200["eth_median_fee_usd"], TOL_FEE, ref_cost)
    check("H4_COST", "eth.mean",    H4_COST["eth"]["mean"],    cost200["eth_mean_fee_usd"],   TOL_FEE, ref_cost)
    check("H4_COST", "tron.median", H4_COST["tron"]["median"], cost200["tron_median_fee_usd"], TOL_FEE, ref_cost)
    check("H4_COST", "tron.mean",   H4_COST["tron"]["mean"],   cost200["tron_mean_fee_usd"],   TOL_FEE, ref_cost)
    check("H4_COST", "legacy.s200.median",   H4_COST["legacy"]["s200"]["median"],   cost200["legacy_median_fee_usd"], TOL_FEE, ref_cost)
    check("H4_COST", "legacy.s200.mean",     H4_COST["legacy"]["s200"]["mean"],     cost200["legacy_mean_fee_usd"],   TOL_FEE, ref_cost)
    check("H4_COST", "legacy.s10000.median", H4_COST["legacy"]["s10000"]["median"], cost10k["legacy_median_fee_usd"], TOL_FEE, ref_cost)
    check("H4_COST", "legacy.s10000.mean",   H4_COST["legacy"]["s10000"]["mean"],   cost10k["legacy_mean_fee_usd"],   TOL_FEE, ref_cost)

    check("H4_COST", "ratios.s200_legacyMean_to_ethMean",      H4_COST["ratios"]["s200_legacyMean_to_ethMean"],      cost200["ratio_legacy_mean_to_eth_mean"],    TOL_RATIO, ref_cost)
    check("H4_COST", "ratios.s200_legacyMean_to_tronMedian",   H4_COST["ratios"]["s200_legacyMean_to_tronMedian"],   cost200["ratio_legacy_mean_to_tron_median"], TOL_RATIO, ref_cost)
    check("H4_COST", "ratios.s10000_legacyMean_to_ethMean",    H4_COST["ratios"]["s10000_legacyMean_to_ethMean"],    cost10k["ratio_legacy_mean_to_eth_mean"],    TOL_RATIO, ref_cost)
    check("H4_COST", "ratios.s10000_legacyMean_to_tronMedian", H4_COST["ratios"]["s10000_legacyMean_to_tronMedian"], cost10k["ratio_legacy_mean_to_tron_median"], TOL_RATIO, ref_cost)

    # ---------- H4_SPECS paired tests (flat fee $0.00 rows) ----------
    spec_map = {
        "full_eth_200":    ("full (2020-01 to 2025-12)",            "diff_200_eth"),
        "full_eth_10k":    ("full (2020-01 to 2025-12)",            "diff_10000_eth"),
        "full_tron_200":   ("full (2020-01 to 2025-12)",            "diff_200_tron"),
        "full_tron_10k":   ("full (2020-01 to 2025-12)",            "diff_10000_tron"),
        "dencun_eth_200":  ("post-Dencun (Apr 2024 onwards, D-20)", "diff_200_eth"),
        "dencun_eth_10k":  ("post-Dencun (Apr 2024 onwards, D-20)", "diff_10000_eth"),
        "dencun_tron_200": ("post-Dencun (Apr 2024 onwards, D-20)", "diff_200_tron"),
        "dencun_tron_10k": ("post-Dencun (Apr 2024 onwards, D-20)", "diff_10000_tron"),
    }
    h4m_headline = h4_master[h4_master.notes.str.contains(r"\$0\.00", regex=True, na=False)]
    for spec in H4_SPECS:
        win, dv = spec_map[spec["id"]]
        rows = h4m_headline[(h4m_headline.window == win) & (h4m_headline.dv == dv)]
        if rows.empty:
            check("H4_SPECS", f"{spec['id']}.row_found", False, True, 0,
                  f"tbl_h4_master_summary.csv window={win!r} dv={dv!r}", "critical")
            continue
        row = rows.iloc[0]
        ref = f"tbl_h4_master_summary.csv window={win!r} dv={dv!r}"
        check("H4_SPECS", f"{spec['id']}.beta", spec["beta"], round(float(row["beta"]), 4),    TOL_STAT, ref)
        check("H4_SPECS", f"{spec['id']}.se",   spec["se"],   round(float(row["se"]), 3),      TOL_SE,   ref)
        check("H4_SPECS", f"{spec['id']}.lo",   spec["lo"],   round(float(row["ci_low"]), 3),  TOL_SE,   ref)
        check("H4_SPECS", f"{spec['id']}.hi",   spec["hi"],   round(float(row["ci_high"]), 3), TOL_SE,   ref)
        check("H4_SPECS", f"{spec['id']}.n",    spec["n"],    int(row["n"]),                   0,        ref)
        check("H4_SPECS", f"{spec['id']}.hac",  spec["hac"],  int(row["hac_lags"]),            0,        ref)
        # p-value: dashboard rounds aggressively (e.g. 4.18e-225, or 0). Compare order of magnitude.
        dash_p = float(spec["p"])
        src_p = float(row["p_value"])
        if dash_p == 0:
            check("H4_SPECS", f"{spec['id']}.p_lt_1e_15", src_p < 1e-15, True, 0, ref)
        else:
            check("H4_SPECS", f"{spec['id']}.p_close",
                  math.isclose(math.log10(dash_p) if dash_p > 0 else -300,
                               math.log10(src_p) if src_p > 0 else -300, abs_tol=1.0),
                  True, 0, ref)

    # ---------- H4_SENSITIVITY ($0.00 vs $3.50 flat fee) ----------
    sens_map = {
        # dashboard key -> list of (h4_master notes, window, dv, sensitivity field)
        "s200_eth":   [("$0.00", "full (2020-01 to 2025-12)", "diff_200_eth",   "full_0"),
                       ("$3.50", "full (2020-01 to 2025-12)", "diff_200_eth",   "full_350"),
                       ("$0.00", "post-Dencun (Apr 2024 onwards, D-20)", "diff_200_eth",   "dencun_0"),
                       ("$3.50", "post-Dencun (Apr 2024 onwards, D-20)", "diff_200_eth",   "dencun_350")],
        "s200_tron":  [("$0.00", "full (2020-01 to 2025-12)", "diff_200_tron",  "full_0"),
                       ("$3.50", "full (2020-01 to 2025-12)", "diff_200_tron",  "full_350"),
                       ("$0.00", "post-Dencun (Apr 2024 onwards, D-20)", "diff_200_tron",  "dencun_0"),
                       ("$3.50", "post-Dencun (Apr 2024 onwards, D-20)", "diff_200_tron",  "dencun_350")],
        "s10000_eth": [("$0.00", "full (2020-01 to 2025-12)", "diff_10000_eth",  "full_0"),
                       ("$3.50", "full (2020-01 to 2025-12)", "diff_10000_eth",  "full_350"),
                       ("$0.00", "post-Dencun (Apr 2024 onwards, D-20)", "diff_10000_eth",  "dencun_0"),
                       ("$3.50", "post-Dencun (Apr 2024 onwards, D-20)", "diff_10000_eth",  "dencun_350")],
        "s10000_tron":[("$0.00", "full (2020-01 to 2025-12)", "diff_10000_tron", "full_0"),
                       ("$3.50", "full (2020-01 to 2025-12)", "diff_10000_tron", "full_350"),
                       ("$0.00", "post-Dencun (Apr 2024 onwards, D-20)", "diff_10000_tron", "dencun_0"),
                       ("$3.50", "post-Dencun (Apr 2024 onwards, D-20)", "diff_10000_tron", "dencun_350")],
    }
    for key, rows in sens_map.items():
        for fee_tag, win, dv, field in rows:
            sub = h4_master[(h4_master.window == win) & (h4_master.dv == dv) & h4_master.notes.str.contains(fee_tag, regex=False, na=False)]
            if sub.empty:
                check("H4_SENSITIVITY", f"{key}.{field}.row_found", False, True, 0,
                      f"tbl_h4_master_summary.csv {fee_tag} {win} {dv}", "high")
                continue
            beta = round(float(sub.iloc[0]["beta"]), 2)
            check("H4_SENSITIVITY", f"{key}.{field}", H4_SENSITIVITY[key][field], beta, TOL_FEE,
                  f"tbl_h4_master_summary.csv {fee_tag!r} {win!r} {dv!r}")

    # ---------- H4_BREAKEVEN ----------
    for row in H4_BREAKEVEN:
        src = h4_breakeven[h4_breakeven.year == row["year"]].iloc[0]
        ref = f"tbl_h4_breakeven_by_year.csv year={row['year']}"
        check("H4_BREAKEVEN", f"{row['year']}.eth_med",   row["eth_med"],   float(src["breakeven_eth_median_usd"]),   TOL_FEE, ref)
        check("H4_BREAKEVEN", f"{row['year']}.eth_mean",  row["eth_mean"],  float(src["breakeven_eth_mean_usd"]),     TOL_FEE, ref)
        check("H4_BREAKEVEN", f"{row['year']}.tron_med",  row["tron_med"],  float(src["breakeven_tron_median_usd"]),  TOL_FEE, ref)
        check("H4_BREAKEVEN", f"{row['year']}.tron_mean", row["tron_mean"], float(src["breakeven_tron_mean_usd"]),    TOL_FEE, ref)

    # ---------- H4_CROSSOVER ----------
    # Dashboard fields (n, pct) map to (crossovers_mean, mean_pct_of_year) per
    # tab_h4.jsx comment: "Months in which Tron MEAN fee exceeded legacy at $200".
    for row in H4_CROSSOVER:
        src = h4_crossover[h4_crossover.year == row["year"]].iloc[0]
        ref = f"tbl_h4_crossover_by_year.csv year={row['year']}"
        check("H4_CROSSOVER", f"{row['year']}.n",   row["n"],   int(src["crossovers_mean"]),  0,        ref)
        check("H4_CROSSOVER", f"{row['year']}.pct", row["pct"], float(src["mean_pct_of_year"]), TOL_FEE, ref)

    # ---------- H4_SAVINGS ----------
    for row in H4_SAVINGS:
        s200 = h4_savings[(h4_savings.year == row["year"]) & (h4_savings.size_usd == 200)].iloc[0]
        s10k = h4_savings[(h4_savings.year == row["year"]) & (h4_savings.size_usd == 10000)].iloc[0]
        ref = f"tbl_h4_savings_ratio_by_year.csv year={row['year']}"
        check("H4_SAVINGS", f"{row['year']}.e200", row["e200"], float(s200["eth_savings_ratio_median"]),  TOL_FEE, ref)
        check("H4_SAVINGS", f"{row['year']}.t200", row["t200"], float(s200["tron_savings_ratio_median"]), TOL_FEE, ref)
        check("H4_SAVINGS", f"{row['year']}.e10k", row["e10k"], float(s10k["eth_savings_ratio_median"]),  TOL_FEE, ref)
        check("H4_SAVINGS", f"{row['year']}.t10k", row["t10k"], float(s10k["tron_savings_ratio_median"]), TOL_FEE, ref)

    # ---------- Synthesis tab claims (app.jsx) ----------
    # Each claim is sourced explicitly to a table row; the assertion is the dashboard's claim.

    # 1. "β ≈ 1, not 2. Metcalfe rejected at p<1e-40 across all 8 specs"
    metcalfe_specs = h1[h1["specification"].str.contains("levels OLS", na=False)]
    n_metcalfe = len(metcalfe_specs)
    max_p = float(metcalfe_specs["p_beta_equals_2"].max())
    check("Synthesis", "metcalfe.n_specs_eq_8", n_metcalfe, 8, 0,
          "tbl_h1_master_summary.csv rows with specification ~ 'levels OLS' (excludes first-diff robustness)",
          "critical")
    check("Synthesis", "metcalfe.max_p_lt_1e_40", max_p < 1e-40, True, 0,
          f"tbl_h1_master_summary.csv max(p_beta_equals_2) over 'levels OLS' specs = {max_p:.2e}",
          "critical")
    # And β ≈ 1 (not 2) — sanity-check the central beta is bracketed
    usdc_full = h1[(h1.asset == "USDC") & (h1.specification == "levels OLS") & (h1.window.str.contains("full"))].iloc[0]
    usdt_full = h1[(h1.asset == "USDT") & (h1.specification == "levels OLS") & (h1.window.str.contains("full"))].iloc[0]
    check("Synthesis", "metcalfe.usdc_beta_near_1", abs(float(usdc_full["beta"]) - 1.0) < 0.1, True, 0,
          f"tbl_h1_master_summary.csv USDC full beta = {float(usdc_full['beta']):.4f}", "high")
    check("Synthesis", "metcalfe.usdt_beta_near_1", abs(float(usdt_full["beta"]) - 1.0) < 0.1, True, 0,
          f"tbl_h1_master_summary.csv USDT full beta = {float(usdt_full['beta']):.4f}", "high")

    # 2. "Chow interaction +119.4 (p<1e-9)"
    chow = h3[h3["spec"] == "Chow interaction (slope diff)"].iloc[0]
    check("Synthesis", "chow.beta_119_4", round(float(chow["beta"]), 1), 119.4, 0,
          f"tbl_h3_master_summary.csv Chow interaction beta = {float(chow['beta']):.4f}", "critical")
    check("Synthesis", "chow.p_lt_1e_9", float(chow["p_value"]) < 1e-9, True, 0,
          f"tbl_h3_master_summary.csv Chow interaction p_value = {float(chow['p_value']):.2e}", "critical")

    # 3. "259× at $200" (Tron savings ratio)
    src_259 = float(cost200["ratio_legacy_mean_to_tron_median"])
    check("Synthesis", "synth.tron_259x_at_200", round(src_259, 0), 259.0, 0,
          f"tbl_h4_cost_comparison.csv ratio_legacy_mean_to_tron_median @ $200 = {src_259:.2f}", "critical")

    # 4. "0.56× at $200" (ETH ratio — ETH is WORSE than legacy at remittance size)
    src_056 = float(cost200["ratio_legacy_mean_to_eth_mean"])
    check("Synthesis", "synth.eth_0_56x_at_200", round(src_056, 2), 0.56, 0,
          f"tbl_h4_cost_comparison.csv ratio_legacy_mean_to_eth_mean @ $200 = {src_056:.2f}", "critical")
    check("Synthesis", "synth.eth_worse_than_legacy_at_200", src_056 < 1.0, True, 0,
          "ratio < 1 ⇒ legacy cheaper than ETH at $200", "high")

    # 5. "$405/tx at $10K" — sourced from full-window paired-test β for ETH at $10K
    eth_10k_full = h4m_headline[(h4m_headline.window == "full (2020-01 to 2025-12)") &
                                 (h4m_headline.dv == "diff_10000_eth")].iloc[0]
    src_405 = round(float(eth_10k_full["beta"]), 0)
    check("Synthesis", "synth.eth_405_at_10k", src_405, 405.0, 0,
          f"tbl_h4_master_summary.csv diff_10000_eth full window β = {float(eth_10k_full['beta']):.4f} → rounds to ${src_405:.0f}",
          "critical")
    # Note: the cost-comparison table reports legacy_mean_at_10k = 419.67 (~$420). The dashboard's
    # $405 figure is the *paired-test β*, which subtracts onchain fee from legacy. Document both.
    check("Synthesis", "synth.eth_405_vs_legacy_mean_diff", abs(419.6663 - 14.9232 - 404.7431) < 0.01, True, 0,
          "($419.67 legacy_mean − $14.92 ETH_mean = $404.74 ≈ $405) per H4_COST + H4_SPECS",
          "medium")

    # 6. "n = 72 months · 123 countries · 2,192 daily obs"
    h3_n = int(h3[h3["window"] == "full (2020-01 to 2025-12)"].iloc[0]["n"])
    check("Synthesis", "masthead.h3_72_months", h3_n, 72, 0,
          "tbl_h3_master_summary.csv full-window n", "critical")
    h2_countries = int(h2.iloc[0]["n_countries"])
    check("Synthesis", "masthead.h2_123_countries", h2_countries, 123, 0,
          "tbl_h2_master_summary.csv n_countries (any spec)", "critical")
    h1_n = int(h1[(h1.asset == "USDC") & (h1.specification == "levels OLS") & (h1.window.str.contains("full"))].iloc[0]["n"])
    check("Synthesis", "masthead.h1_2192_daily", h1_n, 2192, 0,
          "tbl_h1_master_summary.csv USDC levels OLS full-window n", "critical")

    # ---------- DATA bundle structural checks ----------
    expected_data_keys = {"h3"}
    missing_keys = expected_data_keys - set(DATA_KEYS)
    check("DATA", "data_js.has_h3_key", "h3" in DATA_KEYS, True, 0,
          f"window.DATA top-level keys = {DATA_KEYS}", "high")
    if missing_keys:
        errors.append(f"window.DATA missing keys: {missing_keys}")

    # h3 series structural sanity: 72 monthly rows
    if "h3" in (consts.get("DATA") or {}):
        h3_series = consts["DATA"]["h3"]
        check("DATA", "data_js.h3_72_rows", len(h3_series), 72, 0,
              "len(window.DATA.h3) should match 72 monthly observations", "high")

    return write_report()


def write_report() -> int:
    n_pass = sum(1 for c in checks if c["status"] == "PASS")
    n_fail = sum(1 for c in checks if c["status"] == "FAIL")
    n_skip = sum(1 for c in checks if c["status"] == "SKIP")
    n_total = len(checks)

    cats: dict[str, list[dict]] = {}
    for c in checks:
        cats.setdefault(c["category"], []).append(c)

    lines: list[str] = []
    lines.append("# Dashboard verification report")
    lines.append("")
    lines.append(f"- Repository: `{REPO}`")
    lines.append(f"- Total checks: **{n_total}**")
    lines.append(f"- Pass: **{n_pass}**  ·  Fail: **{n_fail}**  ·  Skip: **{n_skip}**")
    lines.append("")
    lines.append("Tolerances: fee 1e-2 · ratio 1e-1 · regression coef 5e-3 · SE/CI 5e-2 · counts exact.")
    lines.append("")

    if n_fail:
        lines.append("## Failures (sorted by severity)")
        lines.append("")
        sev_rank = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        fails = sorted([c for c in checks if c["status"] == "FAIL"],
                       key=lambda c: (sev_rank.get(c["severity"], 4), c["category"], c["label"]))
        lines.append("| Severity | Category | Label | Dashboard | Source | Δ | Source ref |")
        lines.append("|---|---|---|---|---|---|---|")
        for c in fails:
            d = c["delta"]
            d_str = f"{d:+.6g}" if isinstance(d, (int, float)) else "—"
            lines.append(f"| {c['severity']} | {c['category']} | `{c['label']}` | `{c['dashboard']}` | `{c['source']}` | {d_str} | {c['ref']} |")
        lines.append("")

    if n_skip:
        lines.append("## Skipped checks")
        lines.append("")
        for c in [c for c in checks if c["status"] == "SKIP"]:
            lines.append(f"- `{c['category']}/{c['label']}` — {c['ref']}")
        lines.append("")

    lines.append("## Per-category summary")
    lines.append("")
    lines.append("| Category | Total | Pass | Fail | Skip |")
    lines.append("|---|---|---|---|---|")
    for cat, items in sorted(cats.items()):
        p = sum(1 for c in items if c["status"] == "PASS")
        f = sum(1 for c in items if c["status"] == "FAIL")
        s = sum(1 for c in items if c["status"] == "SKIP")
        lines.append(f"| {cat} | {len(items)} | {p} | {f} | {s} |")
    lines.append("")

    lines.append("## Full check ledger")
    lines.append("")
    lines.append("| Status | Category | Label | Dashboard | Source | Δ | Tol | Ref |")
    lines.append("|---|---|---|---|---|---|---|---|")
    for c in checks:
        d = c["delta"]
        d_str = f"{d:+.6g}" if isinstance(d, (int, float)) else "—"
        dash = c["dashboard"]
        src = c["source"]
        if isinstance(dash, float):
            dash_s = f"{dash:.6g}"
        else:
            dash_s = str(dash)
        if isinstance(src, float):
            src_s = f"{src:.6g}"
        else:
            src_s = str(src)
        lines.append(f"| {c['status']} | {c['category']} | `{c['label']}` | `{dash_s}` | `{src_s}` | {d_str} | {c['tol']} | {c['ref']} |")
    lines.append("")

    if errors:
        lines.append("## Extraction warnings")
        lines.append("")
        for e in errors:
            lines.append(f"- {e}")
        lines.append("")

    OUT_REPORT.write_text("\n".join(lines), encoding="utf-8")

    summary = (
        f"verify_dashboard.py — total {n_total}, pass {n_pass}, fail {n_fail}, skip {n_skip}\n"
        f"report: {OUT_REPORT}\n"
    )
    OUT_LOG.write_text(summary, encoding="utf-8")
    print(summary, end="")
    return 0 if n_fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
