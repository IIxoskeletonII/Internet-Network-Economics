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

**2026-04-20 clarification:** Spec 5 implemented as the triple
interaction `baseline × post_2022 × I(baseline_year == 2024)` after a
two-way `baseline × I(baseline_year == 2024)` formulation was found
mechanically non-identifiable under entity FE (both factors
time-invariant within country). The triple is identified because
`post_2022` provides within-country time variation. Caught and
resolved during Phase 3.5b-α execution.

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

## D-20 — H4 post-Dencun sub-window cutoff rule

**Date:** 2026-04-19
**Phase 3 section:** §3.6 (H4 post-Dencun paired tests)
**Status:** Decided (before results are observed)

**Question:** The H4 paired tests §3.5 run on the full 72-month window. A post-event
sub-window is needed to test whether the cost advantage changed after the Dencun L1 fee
compression (mainnet 2024-03-13). What exact monthly cutoff should define "post-Dencun"?

**Background in plain language:** Dencun activated on 2024-03-13. March 2024 is a
partially-pre-Dencun month (first 12 days ran on the old fee regime). D-01 faced the
same partial-month problem for H3's FTX split and chose Dec 2022 as the headline with
Jun 2022 as robustness, on the principle "first full month after the event." The same
rule applied here means April 2024 as headline, March 2024 as robustness.

**Options considered:**
- A: Mar 2024 onwards (n=22). Includes the month the event happened. Precedent from
  D-03's H1 treatment of the FTX date itself, but H1 is daily data and can split on
  the event date precisely; H4 is monthly.
- B: Apr 2024 onwards (n=21). "First full month after event" per D-01 precedent.
- C: May 2024 onwards (n=20). Buffer month to let users adjust to new fee regime.
  Rejected because "buffer length" is a free parameter.

**Decision:** Option B — April 2024 onwards as headline (n=21). March 2024 onwards
reported as a one-month-earlier robustness (n=22) in the §3.7 master summary.

**Rationale:** Direct application of D-01's rule for monthly data. The 13-day portion
of March 2024 that is post-Dencun is substantively contaminated by the pre-Dencun
portion; including it in the "post" sample would bias the sub-window estimates toward
the pre-window. Option A would force an asymmetric treatment vs D-01 for no reason.

**Dissenting view:** A reader could argue that one extra month (n=22 vs n=21) materially
improves the sub-window's statistical power given that we are already at n < 25. The
counter is that power is not the limiting concern — under the documented post-Dencun
ETH fee compression (Phase 2B.5, §3.2 results), the effect sizes are large relative to
SE even at n=21. Adding a half-contaminated month to gain power is a bad trade when the
robustness row is already reported.

**Newey (1994) HAC bandwidth** at both sub-window sizes: int(4 * (21/100)^(2/9)) ≈
int(2.83) = 2 for n=21; int(4 * (22/100)^(2/9)) ≈ int(2.86) = 2 for n=22. Both
sub-windows use maxlags=2. The §3.7 master summary footnote states that H4 uses
int() (floor) on the Newey formula per-regression, which differs from H3's rounded
convention at n=72 (maxlags=4); this is a documented cross-hypothesis footnote, not an
analytical inconsistency — H3 uses maxlags=4 because that's what its committed master
summary uses; H4's sub-window sizes were not anticipated by H3's convention.

**Consequences:** §3.6 produces two blocks of 8 paired tests: one at cutoff Apr 2024
(n=21, headline), one at cutoff Mar 2024 (n=22, robustness). Both use maxlags=2. The
§3.7 master summary table has three window values: "full (2020-01 to 2025-12)",
"post-Dencun (Apr 2024 onwards, D-20)", "post-Dencun robustness (Mar 2024 onwards)".

**Referenced in code:** notebook 03 §3.6, §3.7.

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

---

## D-22 — H4 $10k headline framing: ratio vs absolute-dollar difference

**Date:** 2026-04-19
**Phase 3 section:** §3.6, §3.7 (H4 post-Dencun interpretation)
**Status:** Decided (data observed during prompt 3.4b-RECOVERY)

**Question:** The §3.4 year-by-year cost-savings analysis reports the
legacy/on-chain ratio, which expands from ~35× (2021) to ~1058× (2025) at
$10,000 transfers — a ~30× multiplicative growth in advantage post-Dencun.
The §3.5/§3.6 paired tests report the mean monthly legacy-minus-on-chain
dollar difference, which COMPRESSES from ~$405 (full window) to ~$378
(post-Dencun) at the same $10,000 size. Both are correct; they measure
different constructs. Which does the Phase 3 narrative — and the Phase 4
deck — treat as the headline H4 finding?

**Background in plain language:** A ratio grows when the denominator falls
faster than the numerator. A dollar difference shrinks when both rails
fall but the larger one (legacy) falls by more dollars. Dencun and RPW
corridor compression happened in parallel over 2023-2025 — Ethereum L1
fees collapsed ~20× post-Dencun, but legacy percentage fees also declined
from 5.08% (2020) to 3.85% (2023, forward-filled through 2025). At $10k,
the legacy-side dollar drop (~$123) outweighs the stablecoin-side dollar
drop (~$8), so mean absolute savings compress. Meanwhile the ratio
explodes because the stablecoin denominator approaches zero.

A reader who sees only §3.4 concludes "stablecoins' advantage at $10k has
grown ~30× post-Dencun." A reader who sees only §3.5/§3.6 concludes
"stablecoins' advantage at $10k has compressed ~7% post-Dencun." Neither
is complete without the other.

**Options considered:**
- A: Lead with the ratio (§3.4) as the headline; treat the paired test
  as secondary. Pro: intuitive, large, deck-friendly. Con: hides that
  the absolute welfare surplus per $10k transfer slightly shrank.
- B: Lead with the paired test (§3.5/§3.6) as the headline; treat §3.4
  as secondary. Pro: this is the formal test; dollar-difference is
  welfare-relevant. Con: compression at 7% reads as "the advantage
  weakened" which obscures that multiplicative advantage grew 30×.
- C: Report BOTH as co-equal headlines, with an explicit reconciliation
  paragraph that names the two measures and explains the mechanism.
  Pro: methodologically honest, turns a potential confusion into a
  research finding. Con: requires the reader to hold two numbers at
  once; more cognitive load.

**Decision:** Option C.

**Rationale:** The two measures are not in conflict — they are different
questions. The ratio answers "how many times cheaper is on-chain than
legacy?" The dollar difference answers "how many dollars per transfer
does the sender save?" Both are welfare-relevant for different audiences:
a regulator or researcher interested in the competitive displacement
threat SWIFT faces cares about the multiplicative gap; a remittance
sender choosing a rail cares about the absolute dollars. A deck that
presents only one is leaving half the finding on the table.

The compression finding also strengthens rather than weakens the H4
hypothesis when read carefully. H4 states that on-chain fees are
"orders of magnitude below legacy remittance costs." The 2025
post-Dencun state has legacy costs around $385 at $10k versus ETH mean
fees around $7 and Tron mean fees around $0.4 — the advantage is
1000×–5000× in pure ratio terms, the largest in the sample. The
"compression" is a side effect of legacy fees themselves falling (a
separate observation about correspondent-banking competition that is
consistent with the World Bank RPW trend) and does not reflect any
weakening of on-chain rails' relative competitive position.

**Dissenting view:** A critic could argue that presenting both measures
invites a reader to pick whichever supports their prior — the ratio for
pro-stablecoin readers, the compression for skeptics — and that a
disciplined paper picks one headline. The counter is that the §3.7
takeaways explicitly state the reconciliation (T6 in the master summary
markdown), and a reader who wants to cherry-pick will do so regardless
of how the result is presented. Transparency about the dual measures
pre-empts the objection "but the dollar advantage shrank" during a
viva.

**Consequences:** §3.7 master summary markdown includes six takeaways
(T1 through T6, originally five). T1 is rewritten to cite positive and
significant coefficients across all windows at $10k without any
"advantage grew" language. T6 is added to name the ratio vs dollar-
difference divergence explicitly and cross-reference §3.4 for the
ratio picture. §3.6 markdown includes a legacy-fee decomposition
paragraph quantifying the legacy-cost drop ($ per $10k) and the ETH-
fee drop ($ per $10k) separately. The Phase 4 deck treats §3.4 ratio
and §3.7 paired test as co-equal H4 findings on separate slides or in
separate panels.

**Referenced in code:** notebook 03 §3.4 (already committed), §3.6, §3.7.

---

## D-23 — §3.1 descriptive bar chart: construct realignment to D-02 paired-test constructs

**Date:** 2026-04-19
**Phase 3 section:** §3.1 (H4 descriptive cost comparison)
**Status:** Decided (correction of execution error in Phase 3.4b)
**Supersedes:** nothing. D-23 does NOT supersede D-02 or D-21; it corrects a scope-misapplication of D-21 made in Phase 3.4b.

**Question:** The §3.1 bar chart was built in Phase 3.4b using Tron mean as the on-chain statistic, with a cell-74 markdown rationale citing D-21. Audit on 2026-04-19 found that D-21 is scoped explicitly to §3.2 (ETH-Tron crossover) — it governs ETH-vs-Tron comparisons where both rails are on-chain — and does not cover §3.1's legacy-vs-on-chain comparison. What statistic should §3.1 use, and what does the bar chart do about the fact that Tron median saturates at $0 in 14 of 72 months?

**Background in plain language:** §3.1 is the descriptive companion to the §3.5 paired tests. A reader comparing §3.1 bars to §3.5 coefficients expects the same on-chain construct on both sides. D-02 is the live decision governing that construct choice, and it specifies ETH **mean** and Tron **median** as the paired-test constructs (because the Tron n=20/month sample has CV 1.29 and CI half-width averaging 62% of mean — CP5 caveat — so the median is the safer inferential statistic). D-21 is about a different comparison (ETH vs Tron, both on-chain rails) and rests on a construct-comparability argument (mean-vs-mean approximates the typical unstaked-sender fee on each rail) that does not transfer to the legacy-vs-on-chain question §3.1 asks.

The complication is that a strict D-02 reading produces a Tron median bar of $0.0324 that is visually indistinguishable from zero on the log y-axis. A reader glancing at the bar sees essentially nothing and assumes "Tron median = 0", which mis-reads the 14-month saturation artefact as the whole sample.

**Options considered:**

- A: Keep Tron mean, extend D-21 to cover §3.1 retroactively. *Pro:* no re-render needed. *Con:* D-21's reasoning turns on ETH and Tron sharing the same within-month precision structure (both are on-chain rails where the mean estimates the typical unstaked-sender fee); §3.1 compares an on-chain rail to legacy correspondent-banking costs, where the construct-comparability argument doesn't apply. D-21's rationale does not transfer.
- B: Revert to Tron median per D-02, accept that the bar shows $0 visually, and footnote the 14-month saturation artefact. *Pro:* strict D-02 compliance. *Con:* an empty bar reads "Tron fee is zero" — mechanically true for the median statistic but hides that the Tron sample contains fee-paying senders. The visual story contradicts the data.
- C: Show Tron median as the bar and add a data-label annotation on the bar naming the $0.0324 value and the 14/72 saturation count. *Pro:* preserves D-02 construct while surfacing the artefact that Option B hides. *Con:* adds visual complexity; the reader has to parse both the bar height and the annotation text.
- D: Show both Tron median and Tron mean as paired bars within each transfer-size group. *Pro:* maximum transparency. *Con:* six bars per size group is cluttered and the reader still has to be told which one matches the paired test.

**Decision:** Option C.

**Rationale:** §3.1 is a descriptive companion to the §3.5 paired tests. A reader comparing §3.1 bars to §3.5 coefficients expects the same on-chain construct on both sides. D-02 is the live decision governing that construct choice and says ETH mean, Tron median. D-21 is about a different comparison (ETH vs Tron) and does not generalise to §3.1's legacy-vs-on-chain question. The $0-bar visual problem that Option B would create is solved by Option C's explicit data-label annotation, which puts the sample-caveat in the reader's eyeline rather than in a footnote — the same principle D-21 used to keep the precision concern visible on the §3.2 overlay figure.

**Dissenting view:** A reader could argue that §3.1's "Tron median $0.03" bar and §3.2's "Tron mean" line force them to track two different Tron statistics across three pages, and that the cognitive load outweighs the construct-purity gain. The counter is that §3.2's overlay already shows both Tron median and Tron mean as transparency overlays per D-21, so a reader working sequentially through §3.1 → §3.2 sees the Tron median value from §3.1 restated as the dashed line on §3.2's 4-series overlay. The continuity is visible if the reader looks, and §3.2's narrative opens by naming the construct distinction.

**Consequences:** cell 73 (§3.1 code) is rewritten to use ETH mean + Tron median + Legacy mean on the bar chart and in the four ratio columns of `tbl_h4_cost_comparison.csv`. The ratios are construct-matched (mean/mean or median/median) — no median/mean hybrids. The old columns `ratio_legacy_to_eth_median` and `ratio_legacy_to_tron_mean` (median-numerator / mean-denominator, which produced a non-interpretable hybrid) are replaced by four new columns: `ratio_legacy_mean_to_eth_mean`, `ratio_legacy_mean_to_tron_median`, `ratio_legacy_median_to_eth_median`, `ratio_legacy_median_to_tron_median`. Cell 74 (§3.1 markdown) is rewritten to drop the "Per D-21" reference and cite D-23 for the reasoning. No other cells or artefacts are affected; the §3.5/§3.6 paired tests are untouched and `tbl_h4_master_summary.csv` is byte-identical before and after the change.

**Referenced in code:** notebook 03 §3.1 (cell 73), §3.1 narrative (cell 74).

---

## D-24 — H2 dependent variable (headline + robustness)

**Date:** 2026-04-19
**Phase 3 section:** §4 (H2 diffusion)
**Status:** Decided

**Question:** Which of `adoption_percentile`, `rank`, or `overall_score`
should be the H2 headline DV, and how should the 12 "Among lowest" 2020
rows (mechanically assigned `adoption_percentile = 0.0`) be handled?

**Options considered:**
- A: `adoption_percentile` as headline, keep the 12 rows at 0.0.
- B: `adoption_percentile` as headline, drop the 12 rows.
- C: `rank` as headline.
- D: `overall_score` as headline.

**Decision:** Option A — `adoption_percentile` as headline, retain the
12 "Among lowest" rows at 0.0. A robustness row in the §4.11 master
summary drops those 12 rows and re-runs spec 3; a second robustness
row uses `overall_score` as DV on the 2020–2021 subsample (pooled
spec only; two years cannot identify year FE).

**Rationale:** `adoption_percentile` is continuous on [0, 1], covers
every row (N = 861), and maps naturally onto OLS with
bounded-outcome caveats handled by the FE structure. The 0.0
assignment for "Among lowest" is mechanically defensible — those
countries were classified by Chainalysis as the lowest-adoption
tier, so zero is the correct floor, not a data artefact. The
drop-them robustness exists to separate "the floor assignment is
right" (maintained assumption) from "the result isn't driven by
those 12 rows" (empirical question). `rank` loses cardinal
information and would force an ordinal-probit complication for no
inferential gain. `overall_score` is cramped to 2 years and cannot
support the main specification; it serves only as DV-robustness.

**Dissenting view:** A critic could argue that assigning 0.0 to 12
countries that Chainalysis chose not to rank introduces a non-random
left-tail distortion that biases the pooled coefficient. The counter
is exactly why we carry the drop-12 robustness: if the spec-3
coefficient survives that exclusion, the distortion is immaterial;
if it doesn't, we report the discrepancy and re-open the DV choice.

**Consequences:** §4.1 plots the full `adoption_percentile`
distribution. §4.3–§4.7 use the full post-filter panel (861 minus 8
single-year countries, minus listwise-deletion losses). The raw h2
panel contains 12 "Among lowest" country-years, but the D-26 cascade
drops 6 of them on the way to `h2_analysis`: TCD via the single-year
filter; CPV and FJI on `financial_account_baseline` NaN; LBY on
`remittances_received_pct_gdp` NaN; TJK and TKM on
`inflation_cpi_annual_pct` NaN. The 6 survivors (AFG, DZA, LAO, MNG,
PSE, ZWE) carry through to every downstream spec. Therefore the §4.8
robustness row drops the 6 surviving "Among lowest" rows (not 12);
the raw-panel count of 12 is still asserted upstream in §4.2 as an
invariant against Chainalysis drift, but the §4.8 mirror uses the
surviving count. §4.9 robustness runs pooled OLS on `overall_score`
with the 2020–2021 subsample. Expected behaviour: spec-3 coefficient
on `baseline × post_2022` should be within ~20% of its value on the
drop-survivors sample; any larger swing must be discussed openly in
Phase 4.

**Referenced in code:** notebook 03 §4.2 (DV selection), §4.8, §4.9.

---

## D-25 — Controls & transforms

**Date:** 2026-04-19
**Phase 3 section:** §4 (H2 diffusion)
**Status:** Decided

**Question:** What functional forms should the H2 controls take —
specifically `gdp_per_capita_usd`, `inflation_cpi_annual_pct`,
`remittances_received_pct_gdp`, and the `baseline_year` column?

**Options considered:**
- A: log-GDP, raw inflation, raw remittances.
- B: log-GDP, winsorised inflation (99th pct), log remittances.
- C: winsorised-levels GDP, log inflation (shifted for negatives),
  raw remittances.
- D: raw everything.

**Decision:** Option A with a winsorised-inflation robustness row.
Specifically: `log_gdp_per_capita_usd = np.log(gdp_per_capita_usd)`;
`inflation_cpi_annual_pct` enters raw in the headline;
`remittances_received_pct_gdp` enters raw (already a bounded %);
`baseline_year` enters only in spec 5 via `I(baseline_year == 2024)`.
A robustness row in §4.11 runs spec 3 with inflation winsorised
symmetrically at the 1st/99th percentiles (`inflation_winsorized_pct`,
derived in §4.2).

**Rationale:** Log-GDP is standard in cross-country panels and handles
right-skewness with a clean "percent change in GDP" coefficient
interpretation. Raw inflation preserves the hyperinflation tail
(Venezuela, Zimbabwe, Argentina, Turkey) which is part of the
identifying variation, not noise; winsorising as the main spec would
attenuate the coefficient mechanically. Raw remittances enters
naturally because the variable is already a bounded ratio (% of GDP);
logging a bounded ratio is a convention-breach with no analytical
benefit. `baseline_year` is a nuisance parameter — its pooled
inclusion would add a near-colinear-with-country control; spec 5's
interaction is where it earns its seat.

**Dissenting view:** A reader could argue that raw CPI with four-digit
tails from Venezuela in 2018–2019 will dominate the inflation
coefficient's identifying variation, and that any robustness against
this is more meaningful than the drop-12 rows robustness. The counter
is that inflation is a control, not the variable of interest — the
`financial_account_baseline` coefficient is what the hypothesis is
about, and inflation winsorisation should not materially move that
coefficient. The winsorised-inflation robustness row lets a sceptical
reader verify this empirically.

**Consequences:** §4.2 creates `log_gdp_per_capita_usd` and
`inflation_winsorized_pct` columns on `h2_analysis`. Headline specs
1–5 use log-GDP + raw inflation + raw remittances. §4.11 robustness
row "winsorised inflation (spec 3)" re-runs spec 3 with
`inflation_winsorized_pct` substituted in.

**Referenced in code:** notebook 03 §4.2 (derivations), §4.3–§4.7
(regression calls), §4.11 (robustness row).

---

## D-26 — Sample rules (uniform across specs)

**Date:** 2026-04-19
**Phase 3 section:** §4 (H2 diffusion)
**Status:** Decided

**Question:** Should the 8 single-year countries (ATG, LBR, LCA, MCO,
MRT, NER, SDN, TCD) be excluded from specs 1–2 as well as 3–5, and
how should listwise deletion on NaN controls be documented?

**Options considered:**
- A: Exclude the 8 only from FE specs (linearmodels will silently
  drop them from country-FE regressions anyway).
- B: Exclude the 8 from every spec for sample identity across
  columns.
- C: Include them everywhere and accept silent drops in specs 2–5.

**Decision:** Option B — drop the 8 single-year countries from every
spec before any regression runs. Listwise deletion on the four
controls (`log_gdp_per_capita_usd`, `inflation_cpi_annual_pct`,
`financial_account_baseline`, `remittances_received_pct_gdp`) then
applies uniformly. §4.2 must compute and print the attrition (rows
before → after each filter) and assert that no G20 country loses any
year to listwise deletion.

**Rationale:** Sample identity across columns of the results table
is the reader's mental reference point. If spec 1 has N = 861 and
spec 3 has N = 798, a reader must compute the difference and work
out which rows were dropped; they will suspect the FE specs
cherry-pick. Uniform filtering eliminates this concern — every
coefficient in the table comes from exactly the same row set, and
the footnote documents the single filtering rule. Option C's silent
drops in linearmodels are how bugs hide in panel papers; a model
that "works" on 160 entities but silently regresses on 152 is a
reproducibility hazard. The G20 assertion guards against a
plausible failure mode where a specific high-weight country loses a
year to control NaN without us noticing.

**Dissenting view:** A reader could argue that pooled OLS and country
FE have no technical reason to exclude single-year countries (their
contribution to a pooled coefficient is informative even if small)
and that uniform exclusion is over-engineering. The counter is that
the loss of information is tiny (8 country-year rows) and the gain
in sample-identity clarity across the 5-column table is large.

**Consequences:** §4.2 constructs `h2_analysis` by (i) dropping the
8 single-year countries, (ii) dropping rows with NaN in any of the
four controls, (iii) asserting a country-count sanity floor (≥100
countries), (iv) asserting no G20 country loses more than one year.
The exact post-filter N is not hardcoded — it is computed and
printed at run-time. At Phase 3.5a close: 702 rows from 123
countries survive (151 rows lost to listwise deletion on WB
controls, primarily on `financial_account_baseline` for the ~30
countries with no Findex wave covering them, plus scattered NaNs on
inflation and remittances for smaller economies). G20 attrition:
zero. The 123-country, 702-row realisation is a normal cross-country
WB panel; the Phase 3.5a prompt's pre-execution estimate of
"~800–850 rows, ~150 countries" was speculative. Phase 4 narrative
documents the attrition.

**Referenced in code:** notebook 03 §4.2 (filtering + assertions).

---

## D-27 — `post_2022` main-effect handling in two-way FE specs

**Date:** 2026-04-19
**Phase 3 section:** §4 (H2 diffusion)
**Status:** Decided

**Question:** D-04 specifies that specs 3–5 include
`baseline × post_2022` as the interaction of interest. In a two-way
FE model with year fixed effects, the `post_2022` main effect is a
linear combination of year dummies and will be absorbed. How is this
absorbed main effect reported?

**Options considered:**
- A: Include `post_2022` as a regressor in specs 3–5 and let
  linearmodels drop it (with a warning).
- B: Omit `post_2022` from specs 3–5, include only the interaction
  and the other time-varying controls.
- C: Include `post_2022` in specs 1–2 where year FE don't absorb
  it, and omit from specs 3–5 with an explicit footnote.

**Decision:** Option C. Specs 1 (pooled) and 2 (country FE) include
`post_2022` as a regressor — it identifies in both because neither
has year FE to absorb it. Specs 3, 4, 5 include year fixed effects
and do not pass `post_2022` as a column at all; the
`baseline × post_2022` interaction (or
`baseline × I(baseline_year==2024)` in spec 5) enters alone. The
results table reports the interaction coefficient as the row-1
headline for specs 3–5 and the `post_2022` main-effect coefficient
for specs 1–2.

**Rationale:** Passing `post_2022` into a two-way FE model and
letting linearmodels silently drop it invites exactly the kind of
"which regressor did the software keep?" ambiguity we should
engineer out. Omitting it explicitly is the honest move: the main
effect is identified by year FE in specs 3–5, and the interaction
is what the hypothesis is about. Option C produces a clean results
table where each row's coefficient has an identified meaning in its
column.

**Dissenting view:** A reader unfamiliar with FE absorption could
scan the results table and wonder why specs 1–2 have a `post_2022`
row and specs 3–5 don't. The fix is a clear footnote on the table:
"post_2022 main effect absorbed by year fixed effects in specs 3–5;
its identification in those specs is via the baseline × post_2022
interaction." The footnote is cheap.

**Consequences:** §4.3–§4.4 build design matrices that include
`post_2022`; §4.5–§4.7 build design matrices that exclude it and
rely on year FE via `time_effects=True`. The §4.11 master summary
has a `post_2022` column with values for specs 1–2 and `--` (or
NaN) for specs 3–5; the `baseline_x_post_2022` column is populated
for specs 3–4 (and `baseline_x_baseline_2024` for spec 5).

**Referenced in code:** notebook 03 §4.3, §4.4, §4.5, §4.6, §4.7,
§4.11.

---

## D-28 — Country-only clustering (not two-way)

**Date:** 2026-04-19
**Phase 3 section:** §4 (H2 diffusion)
**Status:** Decided

**Question:** D-04 locks country-clustered SE. Should we also
consider two-way (country + year) clustering for robustness?

**Options considered:**
- A: Country-only clustering.
- B: Two-way clustering (country + year).
- C: Country-only in headline + two-way as robustness row.

**Decision:** Option A — country-only clustering throughout. Do not
add a two-way row.

**Rationale:** Cameron-Gelbach-Miller (2011) and the applied-panel
literature agree that two-way clustering requires enough clusters on
the less-populous dimension for the asymptotic approximation to
hold. With T = 6 years, year-clustering has 6 clusters — below the
conventional rule-of-thumb minimum of 20–30 needed for stable
inference. Country-clustering with ~150 clusters is well within the
stable range. Running two-way clustering as a robustness row would
produce standard errors that are less reliable than the headline,
inverting the normal purpose of a robustness check.

**Dissenting view:** A methodological hawk could argue that any
time-series correlation in adoption shocks across countries (e.g.,
global crypto-market events in 2022) is ignored by country-only
clustering and could understate SEs. The counter is (i) year fixed
effects in specs 3–5 absorb common year shocks, removing a large
share of the cross-country correlation in residuals; (ii) HAC is
not a substitute here because H2 is a short-T panel, not a time
series within an entity (HAC is appropriate for H1/H3/H4 where T
is 70–2200; see D-09, D-17). For H2's short T, country-clustering
is the published standard.

**Consequences:** All H2 regressions use `.fit(cov_type='clustered',
cluster_entity=True)` (linearmodels) or `.fit(cov_type='cluster',
cov_kwds={'groups': country_codes})` (statsmodels for the pooled
spec 1). The master summary footnote states "standard errors
clustered on country throughout; two-way clustering not used
because the 6-year dimension is too short for stable two-way
inference."

**Referenced in code:** notebook 03 §4.3 through §4.11.

---

## D-29 — Pre-registered signs (before results are observed)

**Date:** 2026-04-19
**Phase 3 section:** §4 (H2 diffusion)
**Status:** Decided before results are observed

**Question:** H2 predicts "adoption accelerates in countries with
weak banking infrastructure, strengthening post-2022." What
coefficient signs does this translate to on the five-spec ladder,
and should those signs be pre-registered before running the
regressions?

**Options considered:**
- A: Do not pre-register; report what the data shows.
- B: Pre-register signs in the decision log; let "we found the
  expected sign" remain a substantive finding.
- C: Pre-register plus a full Bayesian prior specification.

**Decision:** Option B. Pre-register the following signs at
p < 0.05:
- `financial_account_baseline` main effect (specs 1, 2): **negative**
  — higher baseline (stronger banking) → lower adoption pressure.
- `post_2022` main effect (specs 1, 2): **positive** — crypto
  adoption trended up post-Nov 2022 on average.
- `baseline × post_2022` interaction (specs 3, 4): **negative and
  larger in magnitude than the spec-2 main effect** — the
  relationship strengthens post-2022, i.e. the negative link between
  banking strength and adoption gets more negative.
- `baseline × I(baseline_year == 2024)` interaction (spec 5): **no
  pre-registered sign** — spec 5 is a Findex-vintage sensitivity,
  not a hypothesis test.
- `log_gdp_per_capita_usd`: **no pre-registered sign** — crypto-
  adoption vs income is empirically ambiguous (developed economies:
  investment demand; developing economies: remittance / inflation
  hedging; cancel).
- `inflation_cpi_annual_pct`: **positive** — inflation-hedging
  demand should drive crypto adoption, though this is an auxiliary
  prediction not central to H2.
- `remittances_received_pct_gdp`: **positive** — high-remittance
  economies have more cross-border payment demand.

**Rationale:** Pre-registration at low methodological cost converts
"we found the expected sign" into genuine confirmatory evidence
rather than post-hoc rationalisation. It also commits Phase 4 to
discussing any sign-flip honestly rather than finessing around it.
The cost is one paragraph in the decision log; the gain is
viva-defence.

**Dissenting view:** A reader could argue that pre-registration in a
decision log written four days before execution is weaker than
pre-registration on a public registry (OSF, AEA RCT). This is true
— the decision log is not a third-party timestamp. We accept this
and mitigate by (i) committing the decision log to git before any
regression runs in Phase 3.5b, (ii) marking D-29's Status line
"Decided before results are observed", (iii) noting the sign-match
or sign-miss in every Phase 4 narrative paragraph that discusses
the corresponding coefficient.

**Consequences:** The §4.14 narrative markdown in Phase 3.5b
organises around the five pre-registered signs and explicitly flags
any mismatch. The coefficient plot (`fig_h2_coefficient_plot.png`)
shades the "expected sign" half-plane to make sign-conformance
visually obvious.

**Referenced in code:** notebook 03 §4.14 (narrative — Phase 3.5b),
`fig_h2_coefficient_plot.png` (Phase 3.5b).

---

## D-30 — Figure choice: coefficient plot + binscatter (not choropleth)

**Date:** 2026-04-19
**Phase 3 section:** §4 (H2 diffusion)
**Status:** Decided

**Question:** The Roadmap (line 228) suggests either a choropleth map
of adoption scores or a scatter of inflation vs adoption. D-04 is
silent on figures. Which figure(s) should accompany H2?

**Options considered:**
- A: Choropleth.
- B: Coefficient dot-and-whisker plot across the 5 specs.
- C: Scatter of `log_gdp` × `adoption_percentile` with
  pre/post-2022 highlighted.
- D: Binscatter of `financial_account_baseline` ×
  `adoption_percentile` split by pre/post-2022.
- E: Two figures: B + D.

**Decision:** Option E. Produce two figures:
`fig_h2_coefficient_plot.png` (dot-and-whisker for the
`baseline × post_2022` interaction coefficient with 95% CI whiskers
across specs 3, 4, 5 plus `baseline` main effect for specs 1, 2 as
auxiliary rows) and `fig_h2_binscatter.png` (two-panel binscatter of
adoption_percentile on `financial_account_baseline`, residualised
against log-GDP, pre-2022 and post-2022 panels side by side with OLS
fit lines). Additionally, §4.1 produces one descriptive figure
`fig_h2_descriptive.png` (adoption_percentile distribution by year,
faceted) which is included in this session's scope. No choropleth.

**Rationale:** A coefficient plot is the single figure that will
survive to the Phase 4 deck as the H2 headline — it visualises the
pre-registered sign hypothesis directly and makes spec-to-spec
stability (or instability) obvious. A binscatter of the headline
mechanism (banking weakness × post-2022) converts the interaction
coefficient into a picture that a non-econometrician can read. A
choropleth is pretty but non-inferential, adds 2–3 hours of
GeoPandas + shapefile + projection-choice work, introduces a
toolchain (GeoPandas) not otherwise in the project, and answers a
different question ("where is adoption?") from the one H2 asks
("does banking-inclusion-gap predict adoption?"). The cost-benefit
is unambiguously against the map.

**Dissenting view:** A critic could argue the deck benefits from a
striking visual opener for H2 and that a choropleth would do that
job. The counter is that Phase 4 deck re-styling is its own layer
(per D-05's dissenting view) — the notebook's job is to produce
defence-ready inferential figures, and a deck artist can build a
choropleth from the already-produced master dataset if the deck
narrative calls for it. Keeping the GeoPandas dependency out of the
notebook is consistent with minimising analysis-code fragility.

**Consequences:** Phase 3.5a produces `fig_h2_descriptive.png` only.
Phase 3.5b produces `fig_h2_coefficient_plot.png` and
`fig_h2_binscatter.png`. No `fig_h2_choropleth.png` is built at any
Phase 3 stage.

**Referenced in code:** notebook 03 §4.1 (descriptive, this session),
§4.13 (coefficient plot + binscatter, Phase 3.5b).

---

## D-31 — Robustness battery & regional panel

**Date:** 2026-04-19
**Phase 3 section:** §4 (H2 diffusion)
**Status:** Decided

**Question:** Beyond the 5-spec ladder, what additional rows and
slices should appear in the H2 master summary
(`tbl_h2_master_summary`)?

**Options considered:**
- A: 5 specs only, no additional rows.
- B: 5 specs + 2 robustness rows (drop "Among lowest"; winsorised
  inflation).
- C: 5 specs + 3 robustness rows + 1 separate regional table.
- D: 5 specs + 4 robustness rows + 1 regional table.

**Decision:** Option D. The §4.11 master summary has 8 rows:

1. Spec 1 — Pooled OLS (D-04, D-27)
2. Spec 2 — Country FE (D-04, D-27)
3. Spec 3 — Two-way FE with `baseline × post_2022` (D-04, headline)
4. Spec 4 — Spec 3 excluding forward-filled 2025 rows (D-04)
5. Spec 5 — Two-way FE with
   `baseline × I(baseline_year==2024)` (D-04)
6. Robustness — Spec 3 dropping the "Among lowest" rows that survive
   the D-26 cascade (6 of the 12 raw-panel rows; the other 6 are
   already removed via single-year-country drop or listwise deletion
   on controls — see D-24 Consequences) (D-24)
7. Robustness — Spec 3 with winsorised inflation (1st/99th
   percentile) (D-25)
8. Robustness — `overall_score` as DV, pooled OLS on 2020–2021
   subsample (D-24)

Plus a separate table `tbl_h2_regional_panel.csv/.tex` containing
spec 3 run on 3 regional splits: Sub-Saharan Africa, Latin America
& Caribbean, South Asia + East Asia & Pacific combined.

The regional panel is a separate table because row-counts,
controls-availability, and degrees-of-freedom vary across regions;
forcing them into the main summary schema would require NaN-padding
that would obscure the N per row.

**Rationale:** The main results table answers "does the interaction
survive across specifications?" and the robustness rows answer
"does it survive sample and DV perturbations?" Together they cover
the methodological surface an examiner will interrogate: sample
selection (row 6), control-form sensitivity (row 7), DV-choice
non-contingency (row 8), and regional heterogeneity (separate
table). The regional panel is descriptive rather than inferential —
low N per region means coefficient precision will be wide, and the
honest framing is "consistent with the headline where identifiable,
under-powered where not", not "region X confirms the hypothesis."

**Dissenting view:** A reader could argue that 8 rows in one table
plus a separate regional table is over-engineering — the hypothesis
test is the spec-3 coefficient, and everything else is decoration.
The counter is that H2's level claim is identification-weak (D-29
rationale) and its interaction claim leans heavily on six years of
data; robustness is where the hypothesis earns its empirical
credibility. A sparser table would lose the viva-defence payoff.

**Consequences:** Phase 3.5b produces `tbl_h2_master_summary.csv/.tex`
with the 8-row schema (rows 1–5 + 6–7–8) and
`tbl_h2_regional_panel.csv/.tex` with a 3-row regional schema. Both
are referenced in the §4.14 narrative.

**Referenced in code:** notebook 03 §4.8 (drop "Among lowest"),
§4.9 (overall_score DV), §4.10 (regional panel), §4.11 (master
summary consolidation).

---

## D-32 — Tolerated drift class on notebook re-execution (2026-04-21)

**Context.** Phase 3.5b-β Task E required `jupyter nbconvert --execute --inplace`
top-to-bottom. Task G required all non-session output files to byte-match HEAD.
These two tasks are formally in tension because `nbconvert --execute` re-runs
every H1/H2/H3/H4 cell and regenerates every output with harmless BLAS
non-determinism and matplotlib rasterisation variance.

**Observed drift characterisation** (measured across all four hypotheses):

- Numeric CSV/TEX coefficients drift in the 13th–15th decimal place
  (~1e-15 to 1e-17 magnitude) due to BLAS non-determinism in floating-point
  reductions (matrix inverse, clustered-SE computation).
- PNG figures drift sub-1% in byte size due to matplotlib rasterisation
  differences, even with `metadata={"Creation Time": None}` suppression.
- Statsmodels `.txt` dumps already on the known-drift list due to embedded
  timestamps (inherited from 3.5b-α).

**Decision.** This class of drift is formally tolerated. Affected file classes:

- `outputs/tables/*.csv` / `*.tex` — numeric precision drift.
- `outputs/figures/*.png` — rasterisation drift.
- `outputs/tables/*_summary.txt` / `*_regression_tables.txt` — timestamp drift.

**Consequences for future prompts.**

1. Byte-identity is not required on the file classes above. Value-identity
   at reporting precision (4 significant figures on coefficients; within
   ±1% on PNG file sizes) is the real standard.
2. When a session re-executes the notebook but only a subset of output
   files are in session scope, non-session files must be restored to HEAD
   via `git checkout HEAD -- <paths>` before commit. This is a git write
   and is executed by the user in VSCode, not by Claude Code (per
   CLAUDE.md §9).
3. Committing as-drifted (no restore) is not permitted — it pollutes git
   history with false-positive changes and makes future audits harder.

**Precedent.** Option 2 of the 3.5b-β fix prompt established the selective-
restore workflow. D-32 formalises that workflow as policy.
