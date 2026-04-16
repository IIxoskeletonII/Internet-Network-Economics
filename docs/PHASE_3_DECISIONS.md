# Phase 3 Decision Log

Methodological decisions for the Phase 3 empirical analysis. Each
entry is written at the moment the decision is made, not reconstructed
later. The goal is that three weeks from now — during deck writing or
the viva — we can read any entry and know exactly why we made the
choice and what the strongest argument against it was.

Every entry uses the template below. Rationale and dissenting views
are written in plain language; anyone without an econometrics
background should be able to follow them.

Decisions may be superseded. When that happens, update the Status
line of the original entry to "Superseded by D-XX" and write the new
entry with its own ID. Do not overwrite.

---

## Entry template

### D-XX — [Short title]

**Date:** YYYY-MM-DD
**Phase 3 section:** §X.X
**Status:** Decided | Superseded by D-YY | Revisited YYYY-MM-DD

**Question:** What was being decided, in one sentence.

**Options considered:**
- Option A: description, pros, cons
- Option B: description, pros, cons
- (...)

**Decision:** Chosen option, in one sentence.

**Rationale:** Why this option. Plain language.

**Dissenting view:** The strongest argument against this decision,
stated fairly. Short paragraph, plain language.

**Consequences:** What this commits us to downstream. What robustness
check (if any) hedges the choice. What would force a revisit.

**Referenced in code:** notebook cell IDs, script paths, output files.

---

## D-01 — H3 post-crisis cutoff

**Date:** 2026-04-16
**Phase 3 section:** §2 (H3 market concentration)
**Status:** Decided

**Question:** What date should we use to split the H3 HHI series into
a "pre-crisis" and "post-crisis" sub-window for the trend regressions?

**Options considered:**
- Jun 2022 (post-Terra): cleanest pre-period baseline, matches the h3
  diagnostic's recommendation. Con: inconsistent with the rest of the
  project's use of FTX as the structural break.
- Nov 2022 (FTX collapse date): thematic consistency with the
  project's November 2022 break narrative. Con: FTX filed Nov 11, so
  the month itself is ambiguous.
- Dec 2022: matches H4's `post_ftx` dummy which treats Nov 2022 as
  pre-crisis because most of the month preceded Nov 11.
- Jan 2023: matches H2's `post_2022` dummy, but H2 uses year
  granularity by necessity.

**Decision:** Dec 2022 as headline cutoff; Jun 2022 as robustness row.

**Rationale:** H3 and H4 are both monthly datasets, so they should
use the same cutoff rule. Using different cutoffs on identically-
grained data for no substantive reason would look unprincipled to an
examiner. H2 uses a year cutoff because its data is annual — that's
a forced choice, not an analytical one. The h3 diagnostic's post-May
2022 recommendation is substantively correct (Terra contaminates the
pre-period) and we honor it by carrying Jun 2022 as a robustness row
in the H3 results table.

**Dissenting view:** The h3 diagnostic spent real effort showing that
Terra's collapse contaminates the April-June 2022 window, and using
Dec 2022 means the "pre-crisis" baseline includes the most turbulent
months in the entire dataset. A reader who cares more about empirical
cleanliness than about cross-hypothesis consistency would argue Jun
2022 should be the headline and Dec 2022 the robustness row.

**Consequences:** H3 main table reports the full-window trend plus
the Dec 2022 split as headline. A robustness row underneath reports
the Jun 2022 split. If the Jun 2022 split produces a materially
different trend coefficient, the narrative in Phase 4 should
acknowledge this openly rather than burying it.

**Referenced in code:** notebook 03 §2.3, §2.4 (TBD cell IDs).

---

## D-02 — H4 paired-test design

**Date:** 2026-04-16
**Phase 3 section:** §3 (H4 cost friction)
**Status:** Decided

**Question:** How should we structure the "paired difference-in-means
with robust SE" test specified in the Roadmap for H4?

**Options considered:**
- A: Pool all on-chain fees (ETH + Tron) vs legacy, single test per
  transfer size. Simple, but hides the ETH-Tron difference which is
  itself interesting.
- B: Two separate tests — ETH vs legacy, Tron vs legacy — each at
  $200 and $10,000. Four tests total, one per rail per size.
- C: Three-way comparison including ETH vs Tron as a separate test.
  Answers a different research question (which blockchain is cheaper,
  not whether blockchain beats SWIFT).

**Decision:** Option B — two rails × two transfer sizes = four
headline tests. Tron side uses `tron_median_fee_usd` (the existing
dataset column), not `tron_mean_fee_usd`, because the within-month
n=20 makes the mean unreliable. Legacy cost at the headline uses
`legacy_flat_fee = 0` (the dataset value); a $3.50 flat-fee sensitivity
row is reported underneath.

**Rationale:** The research question is stablecoins-vs-SWIFT, not
ETH-vs-Tron. Running separate tests per rail preserves the ETH-vs-
Tron comparison for narrative discussion (§3.4 crossover analysis)
without muddying the main test. Using Tron medians rather than means
honors the Roadmap's H4 instruction that the n=20 sample forces
medians as the headline Tron statistic. The flat-fee sensitivity row
makes our zero-flat-fee assumption transparent without embedding a
made-up number into the main results.

**Dissenting view:** Four tests instead of two doubles the multiple-
comparisons surface, and someone could argue we should apply a
Bonferroni correction to the p-values. We don't, because the four
tests are addressing four separable sub-questions (ETH-at-$200,
ETH-at-$10k, Tron-at-$200, Tron-at-$10k) rather than repeated
attempts at the same question. But this is a defensible objection
a methodological hawk might raise.

**Consequences:** H4 results table has 4 rows × 2 flat-fee scenarios
= 8 test outputs. The Tron-side CIs will be wide because of the n=20
problem; we report them honestly rather than suppressing them.

**Referenced in code:** notebook 03 §3.2, §3.3 (TBD cell IDs).

---

## D-03 — H1 structural break date

**Date:** 2026-04-16
**Phase 3 section:** §4 (H1 Metcalfe's Law)
**Status:** Decided

**Question:** What exact date should we use to split the H1 daily
series into pre- and post-structural-break sub-samples?

**Options considered:**
- 2022-11-01: rounds to a month boundary for tidiness.
- 2022-11-11: the actual FTX Chapter 11 filing date.
- 2022-12-01: matches H4's `post_ftx` dummy.

**Decision:** 2022-11-11 (the event date).

**Rationale:** Standard practice in financial economics event studies
is to split at the event date itself when the data granularity allows
it. H1 is daily, so we don't need to round to a month boundary. Using
Nov 1 arbitrarily puts 10 pre-crisis days in the post period; using
Dec 1 puts 20 crisis days in the pre period, which is worse because
those 20 days are exactly when a behavioral regime change would be
most visible.

**Dissenting view:** Using the exact event date implicitly assumes
the FTX collapse had an immediate effect on stablecoin transfer
behavior rather than a gradual one — a critic could argue that the
first week of effects is contaminated by mechanical noise (people
rushing to withdraw, exchanges halting transfers temporarily) and
that a one- or two-week buffer would give a cleaner post-period.
We don't use a buffer because choosing one would itself be a free
parameter, and the Newey-West standard errors already handle short-
horizon serial correlation.

**Consequences:** Pre-period = 2020-01-01 to 2022-11-10; post-period
= 2022-11-11 to 2025-12-31. Sample sizes per asset are roughly 1,050
days pre and 1,150 days post — both large enough for stable OLS.

**Referenced in code:** notebook 03 §4.5 (TBD cell IDs).

---

## D-04 — H2 specification ladder

**Date:** 2026-04-16
**Phase 3 section:** §5 (H2 diffusion)
**Status:** Decided

**Question:** Which regression specifications should we estimate for
H2, and in what order should they appear in the results table?

**Options considered:**
- A: Two-way FE only (what the Roadmap literally specifies).
- B: Three-spec ladder — pooled OLS, country FE, two-way FE with
  interaction — plus two robustness specs.
- C: Full ladder plus a random-effects spec for completeness.

**Decision:** Option B — five-column results table. Columns: (1)
Pooled OLS, (2) Country FE, (3) Two-way FE with
`baseline × post_2022` interaction, (4) Two-way FE excluding
forward-filled 2025 rows, (5) Two-way FE with
`baseline_year == 2024` interaction. All specs use country-clustered
standard errors. Specs 3-5 exclude the 8 single-year countries.

**Rationale:** Showing multiple specifications is standard practice
in applied panel work because it lets the reader see how coefficients
change as you add structure. If the coefficient on
`baseline × post_2022` is stable across specs, that's reassuring. If
it moves a lot, that's information about what's identifying the
result. Showing only the two-way FE without the pooled baseline would
mean we have no estimate of the direct association between financial
inclusion and adoption — only of how that relationship changes
post-2022.

We skip random-effects (Option C) because the Hausman test almost
always rejects random effects in macro country panels (country-
specific factors are correlated with the included regressors), and
adding a column we'd then argue against is cluttered.

**Dissenting view:** Five columns is a lot. A reader focused on the
bottom-line answer would argue the Roadmap specified two-way FE with
interactions and that's what we should report, with the others as an
appendix. We include them up front instead because the value of the
ladder lies in the comparison; putting them in an appendix effectively
hides that comparison.

**Consequences:** The H2 results table is wider than the others.
Output is one main table with 5 columns; footnotes document the 8
excluded single-year countries and the forward-fill treatment.

**Referenced in code:** notebook 03 §5.2-§5.5 (TBD cell IDs).

---

## D-05 — Figure style conventions

**Date:** 2026-04-16
**Phase 3 section:** All
**Status:** Decided

**Question:** What visual conventions should all Phase 3 figures
follow?

**Options considered:**
- A: Default matplotlib settings, minimal tweaking.
- B: Default matplotlib with standardized size, DPI, font, palette,
  and event-annotation convention.
- C: Seaborn defaults.
- D: Custom branded style (consulting deck look).

**Decision:** Option B.

**Rationale:** Academic econometrics papers in journals like the
American Economic Review and Journal of Finance use clean matplotlib-
style figures with sparse axes and restricted palettes. This is the
relevant reference class for an MSc assessment. Seaborn defaults
(Option C) can read as "Kaggle tutorial" when applied uncritically;
heavy custom styling (Option D) reads as "consulting deck" rather
than empirical research. Consistency across figures is more important
than style choice itself, which is why we standardize rather than
leaving each figure's look up to whoever writes the code.

**Dissenting view:** Someone could argue the final deck will benefit
from more visually striking figures than academic conventions
produce, and that we should use a livelier palette for the Phase 4
slides. The right response is to keep Phase 3 figures academically
styled and re-style only those specific figures that get re-used in
the deck during Phase 4. That way the notebook output is always
defense-ready and the deck gets its own polish layer.

**Consequences:**
- `figsize=(10, 6)` for time series; `(8, 8)` for scatter
- `dpi=300` on `savefig`
- Three-color palette maximum, picked for colorblind safety
  (matplotlib `tab10` first three: blue, orange, green)
- DejaVu Sans font (matplotlib default, no install needed)
- No grid, or grid with `alpha=0.3` max
- Event annotations via
  `axvline(date, linestyle='--', color='gray', alpha=0.6)` with
  `text()` label near top of plot

**Referenced in code:** notebook 03 §0 (style setup cell).

---

## D-06 — Global random seed

**Date:** 2026-04-16
**Phase 3 section:** All
**Status:** Decided

**Question:** What random seed should we use and how should it be set?

**Options considered:**
- 42 (the universe-ly standard).
- 0.
- Some project-specific number like 2026.

**Decision:** 42, set at the top of notebook 03 via `random.seed(42)`
and `np.random.seed(42)`. Any downstream sampling call passes
`random_state=RANDOM_SEED` explicitly.

**Rationale:** The seed value itself is unimportant as long as it's
fixed and documented. 42 is a convention so strong that using anything
else would make a reader wonder if the choice was intentional or a
mistake. The Roadmap requires a global seed even where it's not
currently needed because some robustness checks we may add later
(e.g., bootstrap CIs for H4) would be non-deterministic otherwise.

**Dissenting view:** None meaningful. The choice is conventional.

**Consequences:** All downstream stochastic computation is
reproducible.

**Referenced in code:** notebook 03 §0 (imports and setup cell).

---

## D-07 — Output file naming convention

**Date:** 2026-04-16
**Phase 3 section:** All
**Status:** Decided

**Question:** How should figure and table files be named?

**Decision:**
- Figures: `outputs/figures/fig_h{N}_{short_desc}.png`
- Tables: `outputs/tables/tbl_h{N}_{short_desc}.csv` +
  `outputs/tables/tbl_h{N}_{short_desc}.tex`

where `{N}` is the hypothesis number (1, 2, 3, 4) and `{short_desc}`
is a snake_case description (e.g., `metcalfe_scatter`,
`hhi_timeseries`, `cost_comparison`, `diffusion_fe_table`).

**Rationale:** Deck slides → results tables → notebook cells → figure
files need to be traceable. A naming scheme lets anyone reading the
final deck find the underlying artifact without searching. Sorting
`ls outputs/figures/` groups all H1 figures together, then all H2,
and so on.

**Dissenting view:** Someone might prefer dates in the filenames
(`2026-04-17_metcalfe_scatter.png`) so reruns don't overwrite
previous versions. We don't because git history serves that purpose,
and dated filenames accumulate into clutter during iterative work.

**Consequences:** Every `savefig` and `to_csv` in notebook 03 follows
this convention. Any deviation is flagged in PR review.

**Referenced in code:** All notebook 03 sections.

---

## D-08 — Notebook 03 hygiene rules

**Date:** 2026-04-16
**Phase 3 section:** All
**Status:** Decided

**Question:** What structural rules must notebook 03 follow?

**Decision:**
1. Must run top-to-bottom on a fresh kernel (same rule as notebook
   02).
2. All imports in cell 1 only; no scattered imports mid-notebook.
3. Global seed set in cell 1 immediately after imports.
4. No hardcoded paths; use a `REPO_ROOT` constant derived from the
   notebook's own location.
5. Assertions after every transformation, regression fit, and
   `to_csv` / `savefig` call.
6. Each hypothesis section opens with a markdown cell that
   references the relevant D-0X decisions.
7. Regression result objects (from `statsmodels` / `linearmodels`)
   are saved to `.summary()` text dumps in `outputs/tables/`
   alongside the CSV/LaTeX for archival.

**Rationale:** These rules are inherited from notebook 02's Phase 2B
closure audit. Making them explicit up front prevents drift during
Phase 3 execution and eliminates a category of rework that would
otherwise happen during Phase 4 cleanup.

**Dissenting view:** Rule 2 (all imports in cell 1) is strict and
occasionally painful during exploratory analysis. Some analysts
prefer adding imports as needed so readers see dependencies next to
their first use. We favor the centralized approach because it makes
the notebook's dependency surface explicit at the top and matches
what notebook 02 already does.

**Consequences:** All Phase 3 cells follow these rules. The final
top-to-bottom fresh-kernel run is part of the Phase 3 closure
criteria.

**Referenced in code:** notebook 03 §0 and throughout.

---

## D-09 — Newey-West HAC maxlags choice

**Date:** 2026-04-16
**Phase 3 section:** §2 (H3), §3 (H4), §4 (H1)
**Status:** Decided

**Question:** How many lags should we use for Newey-West standard
errors in each regression?

**Background in plain language:** Newey-West standard errors correct
for autocorrelation in time-series regressions — the phenomenon where
today's residual is correlated with yesterday's, which makes ordinary
OLS standard errors too small. The "maxlags" parameter tells the
estimator how far back to look when computing this correction. Too
few lags → residual autocorrelation bleeds into the SEs. Too many →
SEs become noisy.

**Options considered:**
- Fixed small number (e.g., maxlags=4 for all regressions).
- Newey (1994) rule of thumb: `int(4 * (n/100)**(2/9))`.
- Automatic selection via statsmodels' internal procedure.

**Decision:** Newey (1994) rule of thumb applied per regression.
For H1 (n ≈ 2,200 daily observations per asset), this gives
maxlags ≈ 12. For H3 and H4 (n = 72 monthly observations), this
gives maxlags ≈ 4.

**Rationale:** The Newey rule of thumb is the standard published
choice in applied econometrics and is referenced by name in most
empirical finance papers, which makes it trivially defensible. Using
a fixed small number ignores the data size; automatic selection
introduces reproducibility risk across statsmodels versions.

**Dissenting view:** Andrews (1991) proposes a data-driven bandwidth
selection procedure that some econometricians prefer because it
adapts to the estimated residual autocorrelation structure. We use
Newey (1994) because it's simpler to state and defend in a viva, and
because the difference between the two in finite samples is rarely
material for the hypotheses we're testing.

**Consequences:** H1 regressions use `cov_kwds={'maxlags': 12}`; H3
and H4 monthly regressions use `cov_kwds={'maxlags': 4}`. The lag
choice is reported as a footnote in each results table.

**Referenced in code:** H1, H3, H4 regression cells.

---

## D-10 — H4 paired-test implementation

**Date:** 2026-04-16
**Phase 3 section:** §3 (H4)
**Status:** Decided

**Question:** How should we implement the H4 "paired difference-in-
means with robust SE" test in code?

**Background in plain language:** We have 72 months of paired
differences between legacy remittance cost and on-chain fee. The null
hypothesis is that the mean of these differences is zero (i.e., on-
chain and legacy cost the same). We want a t-test-like statistic,
but with standard errors that correct for the fact that nearby
months are autocorrelated.

**Options considered:**
- A: `scipy.stats.ttest_1samp(differences, popmean=0)`. Simple, but
  assumes independent observations, which is false for monthly
  series.
- B: Regress the monthly differences on a constant term with HAC
  standard errors. The coefficient on the constant is the mean
  difference; its standard error is HAC-corrected; the t-statistic
  tests whether the mean is significantly different from zero.
- C: Bootstrap the standard error with block bootstrap to respect
  autocorrelation.

**Decision:** Option B.

**Rationale:** Option B gives exactly the same point estimate as
Option A but with a standard error that's robust to autocorrelation.
It uses statsmodels' standard OLS machinery, which means the output
is directly comparable to H1 and H3 regressions in format and
interpretation. Option C (block bootstrap) is defensible but adds
implementation complexity and isn't meaningfully more accurate for
n=72.

**Dissenting view:** A purist could argue the block bootstrap is
more flexible because it doesn't assume any parametric structure for
the autocorrelation. The counter is that HAC standard errors are the
industry-standard response to this exact problem and Phase 3 already
uses them in H1 and H3; inventing a new SE method for H4 alone would
create inconsistency for no material gain.

**Consequences:** H4 test code uses
`sm.OLS(differences, np.ones(n)).fit(cov_type='HAC', cov_kwds={'maxlags': 4})`.
The reported "t-stat" in the H4 results table is the t-stat on the
constant coefficient; the "p-value" is the two-sided p-value from
that regression.

**Referenced in code:** notebook 03 §3.3.
