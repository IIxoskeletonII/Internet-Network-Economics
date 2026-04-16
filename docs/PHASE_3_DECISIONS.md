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

---

## D-11 — Notebook 03 scaffold: overwrite prior committed stub

**Date:** 2026-04-16
**Phase 3 section:** §0 (setup and structure)
**Status:** Decided

**Question:** The notebook `notebooks/03_empirical_analysis.ipynb`
already existed as a committed TODO stub from commit f65abb9
("Phase 3.1: environment setup and notebook scaffold"), created
before Phase 2C started. Should we overwrite it with the new 14-cell
scaffold designed in Prompt 2, or merge the new requirements into
the old structure?

**Options considered:**
- A: Overwrite the old scaffold entirely with the new 14-cell design.
- B: Merge — keep the old section order and stub helper functions,
  layer the new seed/style/assertions/smoke test on top.

**Decision:** Option A — overwrite.

**Rationale:** The old scaffold contained only library imports, four
one-line data loads, a `run_adf` helper function signature with no
body, and TODO markdown placeholders. No analytical work existed to
preserve. Option B would have created a third structure matching
neither the committed baseline nor the designed scaffold, which
defeats the purpose of having a designed scaffold and would generate
debugging ambiguity later ("which version are we looking at?"). The
decision log itself exists partly to prevent this class of drift.

One element from the old scaffold was preserved: the "Phase 3 Exit
Checklist" markdown cell at the end, which is a genuinely useful
pattern inherited from Phase 2B closure. The `run_adf` helper was
NOT preserved because abstracting ADF logic into a helper before
the call site is designed is premature.

**Dissenting view:** Option B respects the principle that committed
work should be extended rather than discarded. A reviewer who didn't
know the old scaffold was TODO-only would object to silently
replacing a committed file without explanation — which is exactly
why this entry exists. The objection is addressed by the recovery
path (the old scaffold is retrievable via
`git show f65abb9:notebooks/03_empirical_analysis.ipynb`).

**Consequences:** Notebook 03 now has the designed 14-cell structure
with seed, style, assertions, smoke test, and D-0X cross-references.
Fresh-kernel execution verified. The `linearmodels` smoke test
passed with 859 observations and 160 entities, retiring the H2
dependency-compatibility risk flagged earlier in Phase 3 planning.

**Referenced in code:** notebooks/03_empirical_analysis.ipynb
(entirety); recovery via `git show f65abb9:notebooks/03_empirical_analysis.ipynb`.

---

## D-12 — ADF interpretation policy for H1

**Date:** 2026-04-16
**Phase 3 section:** §1.2 (H1 stationarity pre-check)
**Status:** Decided (before results are observed)

**Question:** The H1 log-log OLS regresses `log_transfer_count` on
`log_active_addresses`. Both series are time series and could be
non-stationary (trending). An ADF test tells us whether each series
is stationary in levels (I(0)) or only after differencing (I(1)).
What do we do with that result?

**Background in plain language:** "Stationary" means a time series
does not have a persistent trend — its mean and variance are roughly
constant over time. Regressing one trending series on another can
produce a "spurious regression" where the coefficient looks
statistically significant purely because both series are trending,
not because they're actually related. Standard responses when this
happens: (i) work in first differences instead of levels, (ii) test
for cointegration (a long-run relationship between the two series)
and use the levels if cointegration holds, or (iii) proceed with
levels and rely on HAC standard errors to handle the autocorrelation.

**Options considered:**
- A: ADF is a gate. If any series is non-stationary, stop and
  switch the entire specification to first differences.
- B: ADF is a pre-check. Run the main regression in levels as
  specified in the Roadmap; if ADF flags non-stationarity, ADD a
  first-differenced regression as a robustness row and report both.
- C: Formally test for cointegration (Engle-Granger or Johansen) and
  only use levels if cointegration is confirmed.

**Decision:** Option B.

**Rationale:** The Roadmap specifies log-log OLS in levels with
Newey-West HAC SE. The Metcalfe literature (Peterson 2018, Wheatley
et al. 2018) also works in levels. Switching the headline
specification to first differences would depart from both sources
for reasons that ADF alone doesn't force — HAC standard errors are
designed exactly to handle the autocorrelation that makes non-
stationary regressions unreliable under homoskedastic SEs. Option A
over-reacts to ADF. Option C (formal cointegration testing) is
defensible but adds a full layer of econometric machinery for a
question the data has ~2,200 daily observations to answer
empirically — if a first-differenced regression produces a
similarly-signed and similarly-significant coefficient, the level
regression is defensible; if the sign flips, that's a substantive
finding worth discussing in Phase 4 narrative.

**Dissenting view:** A time-series purist would argue that without
formal cointegration testing, the levels regression is uninterpretable
if either series is I(1). We accept this criticism and hedge by
reporting the first-differenced regression alongside the levels
regression whenever ADF flags non-stationarity in levels. Readers
who distrust the levels spec can look at the first-differenced row
instead.

**Consequences:** §1.2 reports ADF test statistics on levels and
first differences for both variables and both assets. §1.3 runs
log-log OLS in levels as the headline. If any variable is non-
stationary in levels at the 5% level, §1.3 also reports a first-
differenced regression as an additional row in the same table. The
Phase 4 H1 narrative explicitly addresses which variables are
stationary and how the headline survives the robustness check.

**Referenced in code:** notebook 03 §1.2, §1.3.

---

## D-13 — Engle-Granger cointegration test for H1

**Date:** 2026-04-16
**Phase 3 section:** §1.4b
**Status:** Decided (before results are observed)

**Question:** USDC's `log_active_addresses` and `log_transfer_count`
both test as non-stationary in levels per §1.2 ADF. Per D-12, we
report the levels regression alongside first-differenced robustness,
but this does not resolve whether the levels β is a legitimate
long-run elasticity or a spurious-regression artifact. How do we
tell?

**Background in plain language:** When two time series both trend
upward (non-stationary), regressing one on the other can produce a
coefficient that looks significant purely because both are trending,
not because they're genuinely related — this is "spurious
regression." The formal test is whether the regression's residuals
are stationary. If residuals are stationary, the two series are
"cointegrated" — they share a long-run relationship, and the levels
coefficient is a valid estimate of that relationship. If residuals
are non-stationary, the levels regression is spurious and we should
rely on the first-differenced result instead.

**Options considered:**
- A: Skip the formal test, rely on HAC standard errors and
  economic intuition.
- B: Engle-Granger two-step test: run the OLS, then ADF-test the
  residuals against a null of unit root.
- C: Johansen multivariate test.

**Decision:** Option B (Engle-Granger).

**Rationale:** Engle-Granger is the standard two-variable
cointegration test and is the direct follow-up to the ADF results
already produced in §1.2. Johansen (Option C) is designed for
systems of 3+ variables and is overkill for a two-variable
regression. Skipping the test (Option A) leaves a legitimate
methodological objection unanswered — a careful reader would ask
"how do you know the USDC levels regression isn't spurious?" and
we need an answer.

**Dissenting view:** Engle-Granger has known low power in small
samples and when the two series have structural breaks (which USDC
does, at every chain expansion). A critic could argue we should
use Gregory-Hansen or similar structural-break-aware tests. We
don't because (a) n = 2192 is not small, (b) the Phillips-Ouliaris
alternative to Engle-Granger gives similar results in practice,
and (c) we already report the first-differenced regression as a
robustness against any form of levels misspecification.

**Consequences:** If USDC residuals are stationary (cointegration
confirmed), the levels β = 0.982 is the headline elasticity. If
non-stationary (no cointegration), the first-differenced β = 0.703
becomes the headline and the Phase 4 narrative must acknowledge
this. USDT is tested symmetrically even though its levels series
are stationary, so the cointegration result exists on the record
for both assets.

**Referenced in code:** notebook 03 §1.4b.

---

## D-14 — Cook's distance for outlier influence

**Date:** 2026-04-16
**Phase 3 section:** §1.4c, §1.4d
**Status:** Decided (before results are observed)

**Question:** The USDC scatter in the §1 figure shows a visible
cluster of points around log(active_addresses) ≈ 10.5 that sit well
above the fitted line. Are these outliers driving the β estimate,
and should we do anything about them?

**Background in plain language:** In regression, not every
observation has equal influence on the estimated coefficients. A
point that is both far from the average x-value AND far from the
fitted line "pulls" the regression line toward itself more than a
typical observation. "Cook's distance" is a standard diagnostic
that measures how much each observation influences the regression.
The convention (Cook, 1977) is to flag points with Cook's D greater
than 4/n as "influential." Whether to actually delete them is a
separate question.

**Options considered:**
- A: Don't run an influence diagnostic. Trust that HAC SE and R² ≥
  0.87 are enough.
- B: Compute Cook's distance, identify points above 4/n, and
  delete them from the regression.
- C: Compute Cook's distance, report both the full regression and
  a robustness regression without the influential points, let the
  reader compare.

**Decision:** Option C.

**Rationale:** Option B (silent deletion) is methodologically
indefensible — you can inflate any R² by dropping points that
don't fit. Option A leaves the outlier cluster unexplained, which
a reviewer will notice. Option C is the transparent approach:
show the full regression, show the robustness regression without
influential points, and let the reader judge materiality. This
also lets us answer a specific question ("do outliers drive β?")
with a specific answer (whether β shifts materially when they're
removed).

**Dissenting view:** The 4/n threshold is a detection heuristic,
not a statistical test. Some econometricians prefer the DFBETAS
diagnostic, which measures influence on individual coefficients
rather than on the fit overall. We use Cook's distance because
it's more widely known and interpreted, and for a two-variable
regression Cook's D and DFBETAS tell essentially the same story.

**Consequences:** §1.4c reports β with and without influential
points for both assets. §1.4d identifies the specific dates of
the top-10 highest-Cook's-D USDC observations so Phase 4 narrative
can reference them by date and likely cause (early-2020 DeFi bot
days, March 2023 SVB depeg episode, etc.).

**Referenced in code:** notebook 03 §1.4c, §1.4d.
