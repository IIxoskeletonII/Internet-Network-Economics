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

---

## D-15 — H3 structural event table: descriptive, not inferential

**Date:** 2026-04-18
**Phase 3 section:** §2.2
**Status:** Decided (before results are observed)

**Question:** The H3 analysis includes a structural event table decomposing
ΔHHI across five identifiable episodes (Terra collapse, FTX collapse,
SVB/USDC depeg, BUSD wind-down, FDUSD/PYUSD emergence). A critic could
argue that hand-picking events and their time windows biases the narrative
toward a preferred story. What is the formal status of this table, and how
do we defend it methodologically?

**Background in plain language:** An "event study" in econometrics usually
means a formal test — the analyst hypothesises that an event caused a
measurable change and computes a test statistic against a null of no
effect. What we are doing here is different. We are observing HHI movements
in specific windows and *describing* the compositional mechanics of those
movements (which stablecoin gained share, which lost, and why). No null
hypothesis is being tested at the row level.

**Options considered:**
- A: Frame the table as formal event study with hypothesis tests on each row.
- B: Frame the table as descriptive decomposition with no per-row inferential
  claim. Anchor every window on a publicly documented real-world event with
  a dated trigger. Report ΔHHI as it falls regardless of direction, including
  null or contrary results.
- C: Skip the table entirely, rely on the regression battery for all H3 claims.

**Decision:** Option B.

**Rationale:** The table's purpose is to show that HHI movement in the window
is *mechanistically coherent* — that when we decompose the ΔHHI into
stablecoin-level share changes, the story is consistent with the proposed
mechanism (flight-to-quality, structural exit, etc.). This is descriptive
work. Formal event-study machinery (Option A) would require modelling
counterfactual HHI paths, which is overkill for a six-year monthly series
with five identified events. Option C discards the richest part of the H3
finding and leaves us with a regression battery that the diagnostic report
already predicts will produce a weak full-window trend.

The table's defence against "hand-picking" has three legs: (1) every window
is anchored on a published real-world event date that pre-existed the
analysis, (2) ΔHHI is reported as computed regardless of sign or magnitude
(including the FTX row where we expect a small ΔHHI and will say so if
that's what we find), (3) the mechanism description is constrained by
decomposing the ΔHHI into stablecoin-level contributions which are data,
not narrative.

**Dissenting view:** A purist methodologist could argue that any table
labelled "structural events" with hand-picked windows is inherently
selective and should not appear in an empirical section alongside formal
regression output, because readers will conflate the two types of
evidence. The counter is that the table is clearly labelled as descriptive
decomposition, lives under its own subsection with explanatory markdown,
and is presented as complement to rather than replacement for the
regression battery. Empirical papers routinely present descriptive
decompositions in tables — the issue is clarity of epistemic status, not
the table itself.

**Consequences:** §2.2 contains one table with five rows (Terra, FTX, SVB,
BUSD, FDUSD/PYUSD emergence). Columns: event name, window (start → end
months), ΔHHI, direction, dominant mechanism, top-stablecoin share change,
notes. A Notes column distinguishes "event-triggered" rows (Terra, FTX,
SVB, BUSD) from "scale-in window" rows (FDUSD/PYUSD emergence). The §2.2
markdown cell opens with an explicit statement that the table is descriptive
decomposition, not hypothesis testing. Null or contrary-to-expected results
(e.g., if FTX ΔHHI is near-zero) are reported as such in the table and
discussed honestly in Phase 4 narrative.

**Referenced in code:** notebook 03 §2.2.

---

## D-16 — ADF policy for H3

**Date:** 2026-04-18
**Phase 3 section:** §2.4
**Status:** Decided (before results are observed)

**Question:** Should we ADF-test `hhi_full` before running the OLS trend
regression, and if so, what do we do with the result?

**Background in plain language:** HHI is a bounded index (0–10000) but our
observed values trend over the window, and a linear regression of HHI on
time is at risk of the same spurious-regression concern that motivated
D-12 for H1. D-12 chose an "ADF as pre-check, not gate" policy for H1,
where levels-OLS is the headline and first-differenced OLS appears as a
robustness row when levels stationarity is rejected. For H3 the question
is the same but the sample is much smaller: n=72 monthly observations vs
n=2192 daily observations for H1. ADF's well-known low power in small
samples becomes a live concern here — a non-rejection at n=72 may reflect
lack of power rather than genuine non-stationarity.

**Options considered:**
- A: Apply D-12's H1 policy unchanged — report ADF, run levels as headline,
  add first-diff robustness row if ADF rejects stationarity at 5%.
- B: Skip ADF entirely for H3; run levels OLS as specified by the Roadmap,
  rely on HAC standard errors to handle autocorrelation.
- C: Report ADF as descriptive context only; do NOT let the ADF outcome
  gate or branch the specification; add a first-differenced robustness row
  only if ADF rejects at the 1% level (strong evidence threshold) rather
  than 5%.

**Decision:** Option C.

**Rationale:** H1's n=2192 gives ADF ample power to detect non-stationarity,
so D-12's 5%-threshold gate is well-calibrated there. At n=72 the same
threshold produces unreliable branching — a spurious non-rejection could
send us down a "levels-only" path when first-differences would have been
more appropriate, or a spurious rejection could add a first-differenced
row that muddies the presentation without analytical payoff. Raising the
threshold to 1% addresses the small-sample power problem by requiring
strong evidence before changing specification. Option B (skip ADF) leaves
a reasonable methodological objection unanswered; Option A over-uses an
unreliable test at this sample size.

Reporting ADF as "context, not gate" mirrors standard practice in
time-series papers with short series: the test statistic informs
interpretation without deterministically selecting the specification.

**Dissenting view:** An econometrics purist could argue that if ADF is
unreliable at n=72 we should use a different stationarity test (KPSS,
Phillips-Perron) or rely on theory rather than testing. The counter is
that KPSS and PP have similar small-sample issues and that relying on
theory for a bounded index like HHI is itself a judgement call. The
honest framing is that no stationarity test is fully reliable at n=72
and we're choosing to report ADF as the most widely-understood diagnostic
without letting it dominate the specification decision.

**Consequences:** §2.4 reports ADF test statistics and p-values for
`hhi_full` in levels and first differences, with an explanatory markdown
cell noting the low-power caveat. §2.5 runs the OLS-on-levels headline
regression regardless of ADF outcome. A first-differenced robustness row
appears in the master summary table *only if* ADF rejects the unit-root
null at 1% in levels. Phase 4 narrative must acknowledge the stationarity
question explicitly if the ADF result is borderline.

**Referenced in code:** notebook 03 §2.4, §2.5, §2.11.

---

## D-17 — HAC maxlags for H3 sub-window regressions

**Date:** 2026-04-18
**Phase 3 section:** §2.6, §2.7, §2.8
**Status:** Decided (before results are observed)

**Question:** D-09 set Newey-West `maxlags=4` for all H3 and H4 monthly
regressions based on the Newey (1994) rule of thumb applied at n=72. For
the H3 sub-window regressions (post-Dec-2022 with n=36, post-Jun-2022
with n=42), should we continue to use `maxlags=4` or recompute the rule
at the sub-window sample size?

**Background in plain language:** The Newey (1994) bandwidth formula is
`int(4 * (n/100)^(2/9))`. For n=72 it produces 4 (our H3/H4 default, per
D-09). For n=36 it produces 3; for n=42 it also produces 3. Applying a
maxlags value calibrated for n=72 to a sub-window of n=36 would
over-correct for autocorrelation — the standard errors would be wider
than the formula's own recommendation suggests they should be. This is a
small distinction but affects the significance of sub-window coefficients.

**Options considered:**
- A: Keep maxlags=4 everywhere for consistency with D-09. Simpler to state.
- B: Recompute the Newey formula at each sub-window's sample size. Use
  maxlags=3 for post-Dec-2022 (n=36) and post-Jun-2022 (n=42); keep
  maxlags=4 for the full-window regression (n=72) and for the full-sample
  Chow interaction (n=72).
- C: Use maxlags=4 for all sub-windows but report a sensitivity check at
  maxlags=3.

**Decision:** Option B.

**Rationale:** D-09's rationale was explicitly that the Newey formula
applies "per regression" — the rule is supposed to scale with the
regression's sample size, not the project's largest dataset. Using a
single maxlags value across sample sizes contradicts the formula's own
logic. Option C (sensitivity) adds output without adding information,
because the correct value at each n is a deterministic function, not a
judgement call.

The footnote convention per D-09 ("The lag choice is reported as a
footnote in each results table") naturally handles the fact that
different rows in the H3 master summary have different HAC lags — each
row gets its own footnote value.

**Dissenting view:** A reviewer could argue that consistency is more
important than precise formula application, and that using maxlags=4
uniformly is cleaner to explain in a deck ("we use HAC(4) throughout").
The counter is that the deck footnote can still say "HAC standard errors,
bandwidth per Newey (1994)" which is both accurate and consistent in
convention even if the numerical value varies. And examiners will notice
if a sub-window regression has a mechanically-wider SE than the formula
recommends.

**Consequences:** §2.5 (full-window hhi_full) uses `maxlags=4`. §2.6
(post-Dec-2022) uses `maxlags=3`. §2.7 (full-window Chow interaction)
uses `maxlags=4`. §2.8 (post-Jun-2022) uses `maxlags=3`. §2.9 (hhi_top5
full-window) uses `maxlags=4`. The master summary table in §2.11 has a
`hac_lags` column documenting the value per row. The H3 results narrative
explicitly states that HAC bandwidth scales per Newey (1994).

**Referenced in code:** notebook 03 §2.5 through §2.9, §2.11.

---

## D-18 — HHI enters regressions in levels, not logs or proportions

**Date:** 2026-04-18
**Phase 3 section:** §2.5 through §2.9
**Status:** Decided (before results are observed)

**Question:** The H3 trend regressions test whether HHI rises over time.
HHI is a bounded index in [0, 10000]. Should it enter the regression in
levels, in logs, or as a proportion (HHI/10000)?

**Background in plain language:** The choice of functional form for the
dependent variable determines what the time-trend coefficient measures.
In levels, β is "HHI points per unit of time." In logs, β is "percent
change in HHI per unit of time." As a proportion (HHI/10000, treating HHI
like a concentration ratio in [0, 1]), β is "change in proportion per
unit of time." Each choice implies different assumptions about how HHI
moves and produces a different interpretation of the coefficient.

**Options considered:**
- A: Levels. β interprets as "HHI index points per month." Standard choice
  for bounded indices in the industrial-organisation literature.
- B: Logs. β interprets as "fractional change in HHI per month." Appropriate
  when multiplicative dynamics dominate.
- C: Proportion (HHI/10000). β interprets as "change in concentration
  proportion per month." Tidier numerical range but non-standard for HHI.

**Decision:** Option A — levels.

**Rationale:** HHI is already a bounded, normalised index on the canonical
0–10000 scale used across all industrial-organisation applications. The
coefficient "HHI points per month" translates directly to reader intuition
— a β of 20 means HHI rises by 20 points per month, which at HHI ≈ 3500
is roughly 0.6% monthly. No transformation adds analytical content. Logs
(Option B) introduce scaling that is standard for unbounded series
(prices, populations) but gratuitous for an index already on a canonical
scale. Proportions (Option C) divide by a constant, which has no
analytical effect but breaks convention with the IO literature that
reports HHI in index points.

A secondary consideration: the structural event table (D-15) reports
ΔHHI in index points. Keeping the regression in levels means the event
table and the regression coefficients are in the same units, which
simplifies Phase 4 narrative and slide construction.

**Dissenting view:** A reader could argue that logs handle the bounded
nature of HHI more gracefully — an HHI near 10000 cannot rise by another
500 points, but in log space the ceiling is handled automatically. The
counter is that our observed HHI range is 2500–5500, nowhere near either
bound, and the log transformation buys us asymptotic elegance at the cost
of losing the clean "points per month" interpretation. If we had a series
pushing against either bound, the calculus would differ.

**Consequences:** All five H3 regressions (§2.5 full-window, §2.6
post-Dec-2022, §2.7 Chow interaction, §2.8 post-Jun-2022, §2.9 hhi_top5)
regress HHI in levels on `time_index` in levels. The master summary table
reports β in HHI-points-per-month units. Phase 4 narrative translates
these to percent-of-base-HHI terms ("β = 20 corresponds to ~0.6% monthly
rise at typical HHI levels") for reader intuition without altering the
underlying regression.

**Referenced in code:** notebook 03 §2.5 through §2.9, §2.11.

---

## D-19 — H4 ETH-Tron crossover analysis: descriptive subsection with median-vs-median comparison

**Date:** 2026-04-18
**Phase 3 section:** §3.2 (H4 ETH-Tron crossover)
**Status:** Superseded by D-21 (2026-04-18)

**Question:** The H4 dataset contains both ETH and Tron monthly fees over 2020-2025. Phase 2B.5 documented that in 6 months of 2025 (post-Dencun), ETH mean fees undercut Tron mean fees, and the H4 framing must be "congestion-dependent cost advantage" rather than universal cost superiority. How should the crossover phenomenon be presented in §3 of notebook 03, and which fee statistics should the comparison use?

**Background in plain language:** The bar charts in §3.1 (cost comparison at $200 and $10,000) use the headline ETH mean and Tron median fee statistics chosen for the paired tests. Those bar charts pool across all 72 months and show stablecoins beating SWIFT by 1-3 orders of magnitude. They do not show the within-stablecoin dynamic where ETH and Tron trade places after the Dencun upgrade. That dynamic is the empirical content behind the "congestion-dependent" framing constraint and needs its own treatment so the framing is supported by the data, not asserted around it.

A second question is which fee statistic to use when comparing ETH and Tron directly. The paired tests use ETH mean (n=950-1000/month, distribution roughly symmetric within months) and Tron median (n=20/month, within-month CV of 1.29 makes the mean unreliable). Mixing mean for ETH and median for Tron in a single overlay or crossover-count is methodologically inconsistent and would confuse a reader.

**Options considered:**
- A: Skip the crossover treatment entirely. Rely on the paired tests in §3.5 to carry the cost story, and let the post-Dencun nuance live in Phase 4 narrative.
- B: Add a single overlay figure showing ETH mean and Tron median over time, with the Dencun upgrade annotated. Simple, but mixes statistics.
- C: Add §3.2 as a dedicated subsection with (i) an overlay figure of ETH median and Tron median over time on log y-axis with Dencun annotated, and (ii) a per-year crossover-count table. Use median-vs-median as the comparison rule for both deliverables. Footnote the table noting that the headline paired tests use ETH mean for separate reasons.
- D: Run a formal regime-switch test (e.g., Bai-Perron) on the ETH-Tron fee ratio to identify the breakpoint statistically.

**Decision:** Option C.

**Rationale:** Option A leaves the framing constraint unsupported on the data. Option B mixes statistics in a single chart and a reader will rightly object. Option D adds econometric machinery (a regime-switch test) for a question whose answer is already known from prior work — Dencun went live 2024-03-13 and the empirical fee compression dates from that month — so the test would confirm what the timeline already tells us at the cost of additional methodological surface. Option C is the descriptive analogue of H3's structural-event table (D-15): a labelled subsection with a known epistemic status (descriptive decomposition, not hypothesis testing) that supports the framing without overclaiming.

The median-vs-median comparison rule resolves the statistic-mixing problem cleanly. Median is defensible on both rails — for ETH the median is a coherent measure even though we don't use it in the headline test, and for Tron the median is already the headline statistic. The footnote on the §3.2 table makes the asymmetry between §3.2's choice (median-vs-median, comparison logic) and §3.5's choice (mean-for-ETH, average-cost-burden logic) explicit so a reader can see both choices are deliberate.

**Dissenting view:** A reader could argue that Option B is good enough — show the overlay, write a paragraph, move on — and that Option C's per-year crossover-count table over-engineers a narrative point. The counter is that the table converts "we eyeballed the chart and saw crossovers" into "in 2024 ETH undercut Tron in N months out of 9 post-Dencun, in 2025 in M months out of 12" which is the level of specificity Phase 4 will need to defend the framing. The cost of adding the table is small (one cell, one csv, one tex); the cost of not adding it is being unable to cite a number when an examiner asks how often the crossover happens.

**Consequences:** §3.2 contains two artifacts: `fig_h4_eth_tron_overlay.png` (overlay figure of ETH median and Tron median over time, log y-axis, Dencun annotated) and `tbl_h4_crossover_by_year.csv` / `.tex` (per-year crossover counts). Both use median-vs-median. The §3.2 markdown cell opens with an explicit statement that this is descriptive decomposition supporting the "congestion-dependent" framing per Phase 2B.5. The §3.5 paired tests are unaffected — they continue to use ETH mean and Tron median per D-02.

**Referenced in code:** notebook 03 §3.2.

---

## D-20 — Reserved for prompt 3.4b (Dencun cutoff rule for §3.6 sub-window)

**Status:** Reserved 2026-04-18. To be written in prompt 3.4b when the
post-Dencun paired test sub-window is constructed. Will document the
Apr 2024 onwards cutoff (n=21) per D-01 precedent ("first full month
after the event"). This placeholder exists so the decision-log ID
sequence is dense and a Phase 4 reader does not wonder if D-20 was
deleted.

---

## D-21 — H4 §3.2 ETH-Tron comparison: mean-vs-mean with transparency overlay (supersedes D-19)

**Date:** 2026-04-18
**Phase 3 section:** §3.2 (H4 ETH-Tron crossover)
**Status:** Decided (data observed during prompt 3.4a Pre-Task C)
**Supersedes:** D-19

**Question:** D-19 specified median-vs-median for the §3.2 ETH-Tron comparison, on the principle that consistent statistics avoid the appearance of cherry-picking. Pre-computation in prompt 3.4a found that median-vs-median produces zero crossovers across the entire 72-month window — even post-Dencun, the ETH median never falls below the Tron median. This contradicts the Phase 2B.5 finding that ETH mean undercut Tron mean in 6 months of 2025. The contradiction is real: which statistic is correct for this particular comparison?

**Background in plain language:** "Same statistic on both sides" sounds like a clean methodological rule, but it only works when both statistics estimate comparable constructs. ETH and Tron have very different within-month sample properties:

- ETH (n=950-1000/month): the median approximates the typical unstaked-user fee on Ethereum. The within-month distribution is roughly continuous; mean and median are both informative.
- Tron (n=20/month, energy/bandwidth fee model): the median is pulled toward zero by staked-TRX senders who pay near-zero fees. The Tron median therefore approximates the staked-sender experience, not the typical user's fee. The Tron mean is pulled upward by the unstaked-sender minority, approximating the typical-user fee but with wide within-month variance (CV ~1.29).

Median-vs-median compares ETH-typical-user fee to Tron-staked-sender fee. That is apples-to-oranges. Mean-vs-mean compares ETH-typical-user fee to Tron-typical-user fee — both estimating the same construct (what does the unstaked sender pay on each rail?), even though the Tron mean has wide CIs.

**Options considered:**
- A: Keep D-19 (median-vs-median) and rewrite §3.2 narrative as "ETH never undercuts Tron across the window; the ratio compresses 14× from 388 in 2020 to 28 in 2025." Methodologically defensible but contradicts Phase 2B.5's documented finding and produces an all-zero crossover table.
- B: Mean-vs-mean for the comparison. Recovers the Phase 2B.5 finding, matches construct, but uses a Tron statistic CP5 flagged as unreliable for inference.
- C: Mixed statistics (ETH mean vs Tron median). Original D-19 rejected this on consistency grounds; the rejection was correct.
- D: Mean-vs-mean for the headline comparison plus a transparency overlay figure showing all four series (ETH mean, ETH median, Tron mean, Tron median) on one log-y plot, so the reader sees the construct comparison AND the precision concern simultaneously. The crossover-count table uses mean-vs-mean as the headline rule with a parenthetical row showing what median-vs-median would produce.

**Decision:** Option D.

**Rationale:** Construct comparability is more important than statistic identity. Phase 2B.5 already established mean-vs-mean as the operative comparison for documenting the post-Dencun crossover; D-19's "consistent statistics" reasoning silently contradicted that prior commitment by substituting an apples-to-oranges median comparison. Option D restores construct match while making the precision concern visible on the figure itself — the reader can see that Tron mean is wider/noisier than Tron median and judge for themselves.

CP5's caveat that "Tron mean is unreliable" applied to its use in *inference* against a third construct (legacy fees), where wide CIs eroded the test's power. The §3.2 use is descriptive comparison against another on-chain rail whose mean has the same n=20-driven precision profile, so the precision concern is symmetric and does not bias the comparison's direction.

**Dissenting view:** A reader could argue that the Tron mean's wide CIs mean even mean-vs-mean crossover counts in any individual year are noisy, and that the honest answer to "do the rails cross?" is "yes per the means but only barely and within sampling noise." We address this by (i) showing the median series alongside the mean series on the overlay so the reader sees the within-month distributional difference, and (ii) restricting the analytically informative crossover narrative to the post-Dencun period where the ETH-Tron mean ratio collapsed by an order of magnitude — a finding that's not noise-driven.

**Consequences:** §3.2 figure (`fig_h4_eth_tron_overlay.png`) is a 4-line overlay: ETH mean (bold), Tron mean (bold), ETH median (light), Tron median (light), all on log y-axis with Dencun annotated. §3.2 table (`tbl_h4_crossover_by_year.csv` / `.tex`) reports per-year crossover counts on mean-vs-mean as the headline column, with median-vs-median included as a secondary column and a footnote explaining the construct difference. The §3.2 markdown opens by restating the construct logic from this entry so a Phase 4 reader does not relitigate it. D-19 stays in the decision log marked as superseded; this entry references it explicitly.

**Referenced in code:** notebook 03 §3.2.
