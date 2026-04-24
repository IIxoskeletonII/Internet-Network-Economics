// H1 — Network effects / Metcalfe's Law
// ------------------------------------------------------------------------
// Log-log scatters replicate the matplotlib reference figures
// (fig_h1_metcalfe_usdc.png, fig_h1_metcalfe_usdt.png,
//  fig_h1_metcalfe_scatter.png, fig_h1_prepost_structural_break.png).
//
// Axes show NATURAL log of Active Addresses (x) and Transfer Count (y)
// with integer ticks — matching the figures exactly.
// β values are lifted from tbl_h1_master_summary.csv.
// α (ln-space intercept) for full window matches tbl_h1_ols_fullwindow.csv;
// for sub-windows α is recomputed so the fitted line passes through the
// actual centroid of the daily data cloud for that window.
// ------------------------------------------------------------------------

const {
  useState: useStateH1,
  useMemo: useMemoH1
} = React;
const H1_SPECS = {
  USDC: {
    full: {
      beta: 0.9821,
      se: 0.0290,
      lo: 0.9253,
      hi: 1.0388,
      r2: 0.8741,
      n: 2192,
      p1: 0.5357,
      p2: 1.10e-270,
      cointegrated: true,
      alpha_ln: 1.5248
    },
    pre: {
      beta: 0.9164,
      se: 0.0546,
      lo: 0.8094,
      hi: 1.0234,
      r2: 0.6782,
      n: 1045,
      p1: 0.1255,
      p2: 1.03e-87,
      alpha_ln: 2.1959
    },
    post: {
      beta: 1.0882,
      se: 0.0203,
      lo: 1.0484,
      hi: 1.1280,
      r2: 0.9539,
      n: 1147,
      p1: 1.39e-5,
      p2: 0,
      alpha_ln: 0.1062
    },
    ex: {
      beta: 1.0426,
      se: 0.0213,
      lo: 1.0010,
      hi: 1.0843,
      r2: 0.9315,
      n: 2028,
      p1: 0.0449,
      p2: 0,
      alpha_ln: 0.7867
    },
    chow: {
      delta: 0.1718,
      se: 0.0582,
      p: 0.00317
    }
  },
  USDT: {
    full: {
      beta: 1.0145,
      se: 0.0073,
      lo: 1.0002,
      hi: 1.0288,
      r2: 0.9867,
      n: 2192,
      p1: 0.0471,
      p2: 0,
      cointegrated: true,
      alpha_ln: 0.5099
    },
    pre: {
      beta: 1.0249,
      se: 0.0085,
      lo: 1.0082,
      hi: 1.0415,
      r2: 0.9866,
      n: 1045,
      p1: 0.0035,
      p2: 0,
      alpha_ln: 0.3818
    },
    post: {
      beta: 1.1007,
      se: 0.0627,
      lo: 0.9778,
      hi: 1.2235,
      r2: 0.7542,
      n: 1147,
      p1: 0.1082,
      p2: 1.10e-46,
      alpha_ln: -0.6919
    },
    ex: {
      beta: 1.0200,
      se: 0.0049,
      lo: 1.0104,
      hi: 1.0296,
      r2: 0.9944,
      n: 2090,
      p1: 4.58e-5,
      p2: 0,
      alpha_ln: 0.4351
    },
    chow: {
      delta: 0.0758,
      se: 0.0633,
      p: 0.2307
    }
  }
};

// For drawing the strict Metcalfe (β=2) reference line, we pin its intercept
// so it passes through the centroid of the FULL-window data cloud of each asset.
// This matches the reference figures exactly (dotted grey line going through
// the middle of the data cloud).
const METCALFE_ALPHA = {
  // α_ln such that ln y = α + 2·ln x passes through (mean_ln_x, mean_ln_y)
  USDC: 13.444 - 2 * 12.141,
  // = -10.838
  USDT: 13.963 - 2 * 13.263 // = -12.563
};
function H1Tab() {
  const [asset, setAsset] = useStateH1('USDC');
  const [window_, setWindow_] = useStateH1('full');

  // Filter scatter points to the active window
  const filtered = useMemoH1(() => {
    const arr = asset === 'USDC' ? window.DATA.h1_usdc : window.DATA.h1_usdt;
    const ftx = new Date('2022-11-10').getTime();
    const clean = arr.filter(d => d[1] > 0 && d[2] > 0);
    if (window_ === 'pre') return clean.filter(d => new Date(d[0]).getTime() <= ftx);
    if (window_ === 'post') return clean.filter(d => new Date(d[0]).getTime() > ftx);
    if (window_ === 'ex') {
      // Drop largest-residual observations against the full-window fit, at the
      // percentage Cook's-D flagged in the master CSV (USDC 7.48%, USDT 4.65%).
      const fullSpec = H1_SPECS[asset].full;
      const withRes = clean.map(d => {
        const lx = Math.log(d[1]),
          ly = Math.log(d[2]);
        return {
          d,
          r: Math.abs(ly - (fullSpec.alpha_ln + fullSpec.beta * lx))
        };
      }).sort((a, b) => b.r - a.r);
      const dropPct = asset === 'USDC' ? 7.48 : 4.65;
      const nDrop = Math.round(clean.length * dropPct / 100);
      const dropDates = new Set(withRes.slice(0, nDrop).map(o => o.d[0]));
      return clean.filter(d => !dropDates.has(d[0]));
    }
    return clean;
  }, [asset, window_]);
  const points = useMemoH1(() => filtered.map(d => [d[1], d[2]]), [filtered]);
  const spec = H1_SPECS[asset][window_];
  const color = asset === 'USDC' ? COLORS.usdc : COLORS.usdt;

  // Build series/lines for the scatter plot — exactly matching reference figure pattern.
  // Full view: show main fit (solid) + ex-influentials fit (dashed) + Metcalfe β=2 (dotted).
  // Pre/Post/Ex views: show just that window's fit + Metcalfe β=2 reference.
  const mainLines = useMemoH1(() => {
    const out = [];
    // Primary fit for selected window
    out.push({
      beta: spec.beta,
      alpha: spec.alpha_ln,
      color,
      width: 2.2
    });
    // If viewing full, also overlay ex-influentials fit (dashed)
    if (window_ === 'full') {
      const exSpec = H1_SPECS[asset].ex;
      out.push({
        beta: exSpec.beta,
        alpha: exSpec.alpha_ln,
        color,
        width: 1.5,
        dash: '6 4',
        opacity: 0.85
      });
    }
    // Metcalfe reference (β=2, dotted grey) anchored at full-window centroid
    out.push({
      beta: 2,
      alpha: METCALFE_ALPHA[asset],
      color: 'rgba(10,14,26,0.45)',
      width: 1.2,
      dash: '2 4'
    });
    return out;
  }, [asset, window_, spec, color]);

  // Scatter domain — keep stable so comparisons are visually honest
  const xDomain = asset === 'USDC' ? [7, 16] : [10, 15.5];
  const yDomain = asset === 'USDC' ? [5, 21] : [7.5, 18];

  // Annotation for USDC DeFi-peak cluster (only meaningful in full / pre views)
  const annotations = asset === 'USDC' && (window_ === 'full' || window_ === 'pre') ? [{
    lnX: 10.3,
    lnY: 13.7,
    tx: -110,
    ty: -4,
    label: 'Nov 2021 DeFi peak cluster'
  }] : [];
  const windowLabel = {
    full: 'Full window · 2020–2025',
    pre: 'Pre-FTX · ≤ 2022-11-10',
    post: 'Post-FTX · ≥ 2022-11-11',
    ex: 'Ex-influentials · Cook\'s D > 4/n removed'
  }[window_];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hnum"
  }, "H1"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Stablecoins scale like payment rails, ", /*#__PURE__*/React.createElement("em", null, "not"), " like social networks."), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Metcalfe's Law predicts value grows quadratically with users (\u03B2=2). We find linear scaling (\u03B2\u22481) \u2014 the fingerprint of transactional utility, not pairwise network value.")), /*#__PURE__*/React.createElement("div", {
    className: "verdict"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Verdict"), /*#__PURE__*/React.createElement("div", {
    className: "val red"
  }, "\u03B2=2 rejected"), /*#__PURE__*/React.createElement("div", {
    className: "val green",
    style: {
      fontSize: 20,
      marginTop: 4
    }
  }, "\u03B2\u22481 consistent"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, "Payment infrastructure"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "USDC \u03B2 (full)"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "0.982", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "\xB1 0.029")), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "CI [0.925, 1.039]")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "USDT \u03B2 (full)"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "1.014", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "\xB1 0.007")), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "CI [1.000, 1.029]")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Wald p(\u03B2=2)"), /*#__PURE__*/React.createElement("div", {
    className: "v",
    style: {
      color: COLORS.accent
    }
  }, "<1e-40"), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "rejected in all 8 specs")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Cointegration"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "Yes"), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "EG p=0.014 / <0.001"))), /*#__PURE__*/React.createElement("div", {
    className: "explainer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ex"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ribbon"
  }, /*#__PURE__*/React.createElement("span", {
    className: "glyph"
  }, "?"), "What the Wald test does"), /*#__PURE__*/React.createElement("h4", null, "The Wald test asks: ", /*#__PURE__*/React.createElement("em", null, "is our estimate far enough from a specific number to call it different?")), /*#__PURE__*/React.createElement("div", {
    className: "plain"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "In plain terms"), "Imagine Metcalfe's Law \u2014 the classic \"value scales with users-squared\" rule \u2014 sets a target of \u03B2 = 2. Our data gives \u03B2 \u2248 1. The Wald test formalises the question: given how noisy our estimate is, could we have landed on \u22481 by chance if the true value were really 2? The answer: essentially never."), /*#__PURE__*/React.createElement("div", {
    className: "tech"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "Technically"), "The statistic measures how many standard errors our estimate sits from the hypothesised value, squared:", /*#__PURE__*/React.createElement("div", {
    className: "formula"
  }, "W = (\u03B2\u0302 \u2212 \u03B2\u2080)\xB2 / Var(\u03B2\u0302) \u223C \u03C7\xB2\u2081"), "Under H\u2080, W follows a \u03C7\xB2 with one degree of freedom. A tiny p-value means the null is implausible \u2014 the estimate is too far from \u03B2\u2080 to attribute to sampling noise."), /*#__PURE__*/React.createElement("div", {
    className: "verdict-mini"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag-txt"
  }, "USDC \xB7 H\u2080: \u03B2 = 2 (Metcalfe)"), /*#__PURE__*/React.createElement("span", {
    className: "res rej"
  }, "rejected \xB7 p < 1e-270")), /*#__PURE__*/React.createElement("div", {
    className: "verdict-mini",
    style: {
      marginTop: 4,
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag-txt"
  }, "USDC \xB7 H\u2080: \u03B2 = 1 (linear rail)"), /*#__PURE__*/React.createElement("span", {
    className: "res sig"
  }, "consistent \xB7 p = 0.536"))), /*#__PURE__*/React.createElement("div", {
    className: "ex"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ribbon"
  }, /*#__PURE__*/React.createElement("span", {
    className: "glyph"
  }, "\u2248"), "What cointegration means"), /*#__PURE__*/React.createElement("h4", null, "Cointegration says the log-log relationship is ", /*#__PURE__*/React.createElement("em", null, "real"), ", not a statistical mirage."), /*#__PURE__*/React.createElement("div", {
    className: "plain"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "In plain terms"), "When two variables both drift upward over time \u2014 like transfer count and active addresses \u2014 a na\xEFve regression can \"find\" a relationship between them even when none exists (a \"spurious regression\"). Cointegration is the formal check that the two series move ", /*#__PURE__*/React.createElement("em", null, "together"), " in a long-run equilibrium, not just coincidentally trending up together."), /*#__PURE__*/React.createElement("div", {
    className: "tech"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "Technically"), "We run the Engle\u2013Granger two-step test: fit the OLS, then run an Augmented Dickey\u2013Fuller test on the residuals. If the residuals are stationary (mean-reverting), the series are cointegrated \u2014 the \u03B2 we estimated is a valid long-run elasticity rather than a product of shared trends.", /*#__PURE__*/React.createElement("div", {
    className: "formula"
  }, "ADF(residuals) \u2192 reject unit root \u2192 series are cointegrated"), "Both USDC (p = 0.014) and USDT (p < 0.001) pass at the 5% level."), /*#__PURE__*/React.createElement("div", {
    className: "verdict-mini"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag-txt"
  }, "USDC \xB7 Engle-Granger"), /*#__PURE__*/React.createElement("span", {
    className: "res sig"
  }, "p = 0.014 \xB7 cointegrated")), /*#__PURE__*/React.createElement("div", {
    className: "verdict-mini",
    style: {
      marginTop: 4,
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag-txt"
  }, "USDT \xB7 Engle-Granger"), /*#__PURE__*/React.createElement("span", {
    className: "res sig"
  }, "p < 0.001 \xB7 cointegrated")))), /*#__PURE__*/React.createElement("div", {
    className: "grid c12",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "H1 \u2014 Metcalfe scaling \xB7 log\u2013log scatter"), /*#__PURE__*/React.createElement("span", null, filtered.length.toLocaleString(), " points shown \xB7 OLS n = ", spec.n.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, asset, " \xB7 ", windowLabel, ". x = ln(Active Addresses), y = ln(Transfer Count)."), /*#__PURE__*/React.createElement("div", {
    className: "controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: asset === 'USDC' ? 'active' : '',
    onClick: () => setAsset('USDC')
  }, "USDC"), /*#__PURE__*/React.createElement("button", {
    className: asset === 'USDT' ? 'active' : '',
    onClick: () => setAsset('USDT')
  }, "USDT")), /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: window_ === 'full' ? 'active' : '',
    onClick: () => setWindow_('full')
  }, "Full (2020\u201325)"), /*#__PURE__*/React.createElement("button", {
    className: window_ === 'pre' ? 'active' : '',
    onClick: () => setWindow_('pre')
  }, "Pre-FTX"), /*#__PURE__*/React.createElement("button", {
    className: window_ === 'post' ? 'active' : '',
    onClick: () => setWindow_('post')
  }, "Post-FTX"), /*#__PURE__*/React.createElement("button", {
    className: window_ === 'ex' ? 'active' : '',
    onClick: () => setWindow_('ex')
  }, "Ex-influentials"))), /*#__PURE__*/React.createElement(ScatterLnPlot, {
    series: [{
      points,
      color,
      opacity: 0.42,
      r: 1.8
    }],
    lines: mainLines,
    xDomain: xDomain,
    yDomain: yDomain,
    annotations: annotations,
    width: 760,
    height: 460
  }), /*#__PURE__*/React.createElement("div", {
    className: "legend",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "sw",
    style: {
      background: color,
      width: 16,
      height: 2,
      display: 'inline-block',
      verticalAlign: 'middle'
    }
  }), asset, " ", window_, ": \u03B2 = ", spec.beta.toFixed(3), " (95% CI [", spec.lo.toFixed(3), ", ", spec.hi.toFixed(3), "])"), window_ === 'full' && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 16,
      height: 0,
      borderTop: `2px dashed ${color}`,
      verticalAlign: 'middle',
      marginRight: 6
    }
  }), asset, " ex-influentials: \u03B2 = ", H1_SPECS[asset].ex.beta.toFixed(3)), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 16,
      height: 0,
      borderTop: '2px dotted rgba(10,14,26,0.55)',
      verticalAlign: 'middle',
      marginRight: 6
    }
  }), "Metcalfe reference: \u03B2 = 2")), /*#__PURE__*/React.createElement("div", {
    className: "caption",
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 12.5,
      color: COLORS.muted,
      marginTop: 10,
      lineHeight: 1.5,
      fontStyle: 'italic'
    }
  }, asset === 'USDC' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Wald tests: H\u2080:\u03B2=1 ", spec.p1 < 0.05 ? 'rejected' : 'not rejected', " (p=", fmtP(spec.p1), "). H\u2080:\u03B2=2 rejected (p<1e-80). Full-window cointegrated (Engle-Granger p=0.014).") : /*#__PURE__*/React.createElement(React.Fragment, null, "Wald tests: H\u2080:\u03B2=1 ", spec.p1 < 0.05 ? 'rejected' : 'not rejected', " (p=", fmtP(spec.p1), ", economically trivial). H\u2080:\u03B2=2 rejected (p<1e-100). Full-window cointegrated (Engle-Granger p<0.001)."))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, "Regression readout"), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, asset, " \xB7 ", windowLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 56,
      lineHeight: 1,
      letterSpacing: '-0.02em',
      marginTop: 8
    }
  }, "\u03B2 = ", spec.beta.toFixed(3)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 11,
      color: COLORS.muted,
      marginTop: 4,
      letterSpacing: '0.04em'
    }
  }, "SE = ", spec.se.toFixed(4), " \xB7 95% CI [", spec.lo.toFixed(3), ", ", spec.hi.toFixed(3), "]"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "observations"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, spec.n.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "R\xB2"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, spec.r2.toFixed(4))), /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "intercept (\u03B1, ln-space)"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, spec.alpha_ln.toFixed(3))), /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Wald H\u2080: \u03B2=1"), /*#__PURE__*/React.createElement("span", {
    className: `v ${spec.p1 < 0.05 ? 'pos' : 'nul'}`
  }, "p = ", fmtP(spec.p1), " ", spec.p1 < 0.05 ? '(reject)' : '(cannot reject)')), /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Wald H\u2080: \u03B2=2 (Metcalfe)"), /*#__PURE__*/React.createElement("span", {
    className: "v sig"
  }, "p = ", fmtP(spec.p2), " (reject)")), window_ === 'full' && /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Engle-Granger cointeg."), /*#__PURE__*/React.createElement("span", {
    className: "v sig"
  }, asset === 'USDC' ? 'p = 0.014' : 'p < 0.001'))), /*#__PURE__*/React.createElement("div", {
    className: "pullquote",
    style: {
      marginTop: 20,
      fontSize: 22
    }
  }, "Linear scaling is not a failed hypothesis \u2014 it's a diagnostic of what kind of network this is."))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "H1 \u2014 Metcalfe scaling comparison \xB7 USDC vs USDT"), /*#__PURE__*/React.createElement("span", null, "log\u2013log \xB7 full window \xB7 2020\u20132025")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Both assets on one panel. x = ln(Active Addresses), y = ln(Transfer Count)."), /*#__PURE__*/React.createElement(ScatterLnPlot, {
    series: [{
      points: window.DATA.h1_usdc.filter(d => d[1] > 0 && d[2] > 0).map(d => [d[1], d[2]]),
      color: COLORS.usdc,
      opacity: 0.38,
      r: 1.6
    }, {
      points: window.DATA.h1_usdt.filter(d => d[1] > 0 && d[2] > 0).map(d => [d[1], d[2]]),
      color: COLORS.usdt,
      opacity: 0.38,
      r: 1.6
    }],
    lines: [{
      beta: H1_SPECS.USDC.full.beta,
      alpha: H1_SPECS.USDC.full.alpha_ln,
      color: COLORS.usdc,
      width: 2.2
    }, {
      beta: H1_SPECS.USDT.full.beta,
      alpha: H1_SPECS.USDT.full.alpha_ln,
      color: COLORS.usdt,
      width: 2.2
    }],
    xDomain: [7, 16],
    yDomain: [7, 17.5],
    width: 1100,
    height: 480,
    margin: {
      t: 20,
      r: 24,
      b: 56,
      l: 62
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "legend",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "sw",
    style: {
      background: COLORS.usdc,
      width: 16,
      height: 2,
      display: 'inline-block',
      verticalAlign: 'middle'
    }
  }), "USDC: \u03B2 = 0.982 (95% CI [0.925, 1.039])"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "sw",
    style: {
      background: COLORS.usdt,
      width: 16,
      height: 2,
      display: 'inline-block',
      verticalAlign: 'middle'
    }
  }), "USDT: \u03B2 = 1.014 (95% CI [1.000, 1.029])")), /*#__PURE__*/React.createElement("div", {
    className: "caption",
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 12.5,
      color: COLORS.muted,
      marginTop: 10,
      lineHeight: 1.5,
      fontStyle: 'italic'
    }
  }, "Both assets exhibit approximately linear scaling (\u03B2 \u2248 1), consistent with payment-rail economics rather than strict Metcalfe network effects (\u03B2 = 2, rejected at p < 1e-80 for both).")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "H1 \u2014 Structural break at Nov 11, 2022 (FTX Chapter 11)"), /*#__PURE__*/React.createElement("span", null, "pre-FTX n = 1,045 \xB7 post-FTX n = 1,147")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Did the November 2022 FTX collapse ", /*#__PURE__*/React.createElement("em", null, "change"), " how stablecoin usage scales with users? Chow interaction test."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      background: 'var(--paper-2)',
      border: '1px solid var(--line)',
      padding: '16px 18px',
      margin: '14px 0 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: '2px solid var(--accent)',
      paddingLeft: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 9.5,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--muted)',
      marginBottom: 4
    }
  }, "In plain terms"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 14.5,
      lineHeight: 1.5
    }
  }, "Fit the log-log line ", /*#__PURE__*/React.createElement("em", null, "twice"), " \u2014 once on data before FTX (Nov 11, 2022), once after \u2014 and ask whether the ", /*#__PURE__*/React.createElement("em", null, "slopes"), " are statistically different. A significant \u0394 means the market-structure shock actually re-wrote the usage curve; an insignificant \u0394 means the rail kept humming along as before.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 9.5,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--muted)',
      marginBottom: 6
    }
  }, "Chow interaction test"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 11.5,
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      padding: '8px 10px',
      display: 'inline-block',
      marginBottom: 8
    }
  }, "ln TC = \u03B1 + \u03B2\xB7ln AA + \u03B4\xB7(Post \xD7 ln AA) + \u03B3\xB7Post + \u03B5"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sans)',
      fontSize: 12.5,
      lineHeight: 1.5
    }
  }, "\u03B4 is the slope ", /*#__PURE__*/React.createElement("em", null, "difference"), "; H\u2080: \u03B4 = 0 (no break). A rejection pins regime change on the interaction term itself, not just on a level shift."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 18
    }
  }, ['USDC', 'USDT'].map(a => {
    const ftx = new Date('2022-11-10').getTime();
    const arr = a === 'USDC' ? window.DATA.h1_usdc : window.DATA.h1_usdt;
    const clean = arr.filter(d => d[1] > 0 && d[2] > 0);
    const prePts = clean.filter(d => new Date(d[0]).getTime() <= ftx).map(d => [d[1], d[2]]);
    const postPts = clean.filter(d => new Date(d[0]).getTime() > ftx).map(d => [d[1], d[2]]);
    const pre = H1_SPECS[a].pre,
      post = H1_SPECS[a].post,
      chow = H1_SPECS[a].chow;
    const col = a === 'USDC' ? COLORS.usdc : COLORS.usdt;
    // darker tone for "post"
    const colDark = a === 'USDC' ? '#14294d' : '#123a2d';
    const colLight = a === 'USDC' ? '#6f89b3' : '#6b9282';
    const xd = a === 'USDC' ? [7, 16] : [10, 15.5];
    const yd = a === 'USDC' ? [7.5, 17.5] : [10.5, 15.5];
    return /*#__PURE__*/React.createElement("div", {
      key: a
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--serif)',
        fontSize: 16,
        marginBottom: 4
      }
    }, a, " \xB7 Metcalfe scaling by regime"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--mono)',
        fontSize: 10.5,
        color: COLORS.muted,
        marginBottom: 6,
        letterSpacing: '0.04em'
      }
    }, "pre-FTX \u03B2 = ", pre.beta.toFixed(3), "  \xB7  post-FTX \u03B2 = ", post.beta.toFixed(3), "  \xB7  \u0394 = ", chow.delta.toFixed(3), "  \xB7  p = ", fmtP(chow.p)), /*#__PURE__*/React.createElement(ScatterLnPlot, {
      series: [{
        points: prePts,
        color: colLight,
        opacity: 0.45,
        r: 1.5
      }, {
        points: postPts,
        color: colDark,
        opacity: 0.55,
        r: 1.5
      }],
      lines: [{
        beta: pre.beta,
        alpha: pre.alpha_ln,
        color: colLight,
        width: 2
      }, {
        beta: post.beta,
        alpha: post.alpha_ln,
        color: colDark,
        width: 2
      }],
      xDomain: xd,
      yDomain: yd,
      width: 540,
      height: 360,
      margin: {
        t: 14,
        r: 14,
        b: 50,
        l: 54
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        flexWrap: 'wrap',
        fontFamily: 'var(--mono)',
        fontSize: 10.5,
        color: COLORS.muted,
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        width: 14,
        height: 2,
        background: colLight,
        verticalAlign: 'middle',
        marginRight: 6
      }
    }), "Pre-FTX (n=", pre.n.toLocaleString(), "): \u03B2 = ", pre.beta.toFixed(3)), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        width: 14,
        height: 2,
        background: colDark,
        verticalAlign: 'middle',
        marginRight: 6
      }
    }), "Post-FTX (n=", post.n.toLocaleString(), "): \u03B2 = ", post.beta.toFixed(3))));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      marginTop: 18,
      borderTop: '1px dotted var(--line)',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--muted)'
    }
  }, "USDC \xB7 H\u2080: \u03B4 = 0"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 11,
      color: COLORS.accent
    }
  }, "rejected \xB7 p = 0.003")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--muted)'
    }
  }, "USDT \xB7 H\u2080: \u03B4 = 0"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 11,
      color: 'var(--ink)'
    }
  }, "not rejected \xB7 p = 0.231"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 14,
      lineHeight: 1.5,
      marginTop: 12,
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: 'var(--serif)'
    }
  }, "Reading:"), " USDC's slope steepened by +0.172 after FTX \u2014 a real regime shift toward ", /*#__PURE__*/React.createElement("em", null, "linear-plus"), " scaling as institutions replaced speculators. USDT was already linear pre-FTX and stayed there; its rails didn't re-wire. In both cases the strict Metcalfe \u03B2 = 2 stays rejected in ", /*#__PURE__*/React.createElement("em", null, "every"), " sub-window (p < 1e-40).")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "H1 \u2014 \u03B2 estimates across specifications and sub-samples"), /*#__PURE__*/React.createElement("span", null, "8 specifications \xB7 2 assets \xD7 4 windows")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "All 8 specifications reject strict Metcalfe (\u03B2 = 2) at p < 1e-40. Headline: \u03B2 \u2248 1 for both assets, robust to outlier treatment and structural break."), (() => {
    const rows = [{
      asset: 'USDC',
      label: 'USDC full-window',
      ...H1_SPECS.USDC.full
    }, {
      asset: 'USDC',
      label: 'USDC ex-influentials',
      ...H1_SPECS.USDC.ex
    }, {
      asset: 'USDC',
      label: 'USDC pre-FTX',
      ...H1_SPECS.USDC.pre
    }, {
      asset: 'USDC',
      label: 'USDC post-FTX',
      ...H1_SPECS.USDC.post
    }, {
      asset: 'USDT',
      label: 'USDT full-window',
      ...H1_SPECS.USDT.full
    }, {
      asset: 'USDT',
      label: 'USDT ex-influentials',
      ...H1_SPECS.USDT.ex
    }, {
      asset: 'USDT',
      label: 'USDT pre-FTX',
      ...H1_SPECS.USDT.pre
    }, {
      asset: 'USDT',
      label: 'USDT post-FTX',
      ...H1_SPECS.USDT.post
    }];
    const W = 960,
      H = 380;
    const mL = 180,
      mR = 60,
      mT = 20,
      mB = 52;
    const iw = W - mL - mR,
      ih = H - mT - mB;
    const xdom = [0.5, 2.2];
    const sx = linScale(xdom, [0, iw]);
    const rowH = ih / rows.length;
    const xTicks = [0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2];
    return /*#__PURE__*/React.createElement("svg", {
      className: "chart",
      viewBox: `0 0 ${W} ${H}`
    }, /*#__PURE__*/React.createElement("g", {
      transform: `translate(${mL},${mT})`
    }, xTicks.map((t, i) => /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: sx(t),
      x2: sx(t),
      y1: 0,
      y2: ih,
      stroke: COLORS.line,
      strokeWidth: 0.5
    })), /*#__PURE__*/React.createElement("line", {
      x1: sx(1),
      x2: sx(1),
      y1: 0,
      y2: ih,
      stroke: COLORS.ink,
      strokeWidth: 1
    }), /*#__PURE__*/React.createElement("text", {
      x: sx(1) + 4,
      y: ih - 4,
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 9.5,
        fill: COLORS.muted
      }
    }, "linear (\u03B2 = 1)"), /*#__PURE__*/React.createElement("line", {
      x1: sx(2),
      x2: sx(2),
      y1: 0,
      y2: ih,
      stroke: COLORS.muted,
      strokeWidth: 1,
      strokeDasharray: "4 4"
    }), /*#__PURE__*/React.createElement("text", {
      x: sx(2) + 4,
      y: ih - 4,
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 9.5,
        fill: COLORS.muted
      }
    }, "strict Metcalfe (\u03B2 = 2)"), rows.map((r, i) => {
      const y = rowH * i + rowH / 2;
      const col = r.asset === 'USDC' ? COLORS.usdc : COLORS.usdt;
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, /*#__PURE__*/React.createElement("line", {
        x1: sx(r.lo),
        x2: sx(r.hi),
        y1: y,
        y2: y,
        stroke: col,
        strokeWidth: 1.8
      }), /*#__PURE__*/React.createElement("circle", {
        cx: sx(r.beta),
        cy: y,
        r: 4,
        fill: col
      }), /*#__PURE__*/React.createElement("text", {
        x: -10,
        y: y + 3.5,
        textAnchor: "end",
        style: {
          fontFamily: 'JetBrains Mono',
          fontSize: 11.5,
          fill: COLORS.ink
        }
      }, r.label));
    })), /*#__PURE__*/React.createElement("g", {
      transform: `translate(${mL},${mT + ih})`
    }, /*#__PURE__*/React.createElement("line", {
      x1: 0,
      x2: iw,
      y1: 0,
      y2: 0,
      stroke: COLORS.ink,
      strokeWidth: 0.8
    }), xTicks.map((t, i) => /*#__PURE__*/React.createElement("g", {
      key: i,
      transform: `translate(${sx(t)},0)`
    }, /*#__PURE__*/React.createElement("line", {
      y1: 0,
      y2: 5,
      stroke: COLORS.ink,
      strokeWidth: 0.8
    }), /*#__PURE__*/React.createElement("text", {
      y: 18,
      textAnchor: "middle",
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 11,
        fill: COLORS.ink
      }
    }, t.toFixed(1)))), /*#__PURE__*/React.createElement("text", {
      x: iw / 2,
      y: 40,
      textAnchor: "middle",
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 11,
        fill: COLORS.ink,
        letterSpacing: '0.04em'
      }
    }, "\u03B2 estimate (with 95% CI)")));
  })(), /*#__PURE__*/React.createElement("div", {
    className: "caption",
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 12.5,
      color: COLORS.muted,
      marginTop: 10,
      lineHeight: 1.5,
      fontStyle: 'italic'
    }
  }, "All 8 specifications reject strict Metcalfe (\u03B2 = 2) at p < 1e-40. Headline finding: \u03B2 \u2248 1 for both assets, robust to outlier treatment and structural break.")), /*#__PURE__*/React.createElement("div", {
    className: "grid c21",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Econometric diagnostics \xB7 at a glance"), /*#__PURE__*/React.createElement("span", null, "full-window \xB7 HAC(12) standard errors")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "regtbl",
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Asset"), /*#__PURE__*/React.createElement("th", null, "Spec"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "n"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "\u03B2"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "SE"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "95% CI"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "R\xB2"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "p(\u03B2=1)"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "p(\u03B2=2)"))), /*#__PURE__*/React.createElement("tbody", null, ['USDC', 'USDT'].flatMap(a => ['full', 'ex', 'pre', 'post'].map(w => {
    const s = H1_SPECS[a][w];
    const labels = {
      full: 'full window',
      ex: 'ex-influentials',
      pre: 'pre-FTX',
      post: 'post-FTX'
    };
    return /*#__PURE__*/React.createElement("tr", {
      key: a + w
    }, /*#__PURE__*/React.createElement("td", null, a), /*#__PURE__*/React.createElement("td", null, labels[w]), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, s.n.toLocaleString()), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, s.beta.toFixed(4)), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, s.se.toFixed(4)), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, "[", s.lo.toFixed(3), ", ", s.hi.toFixed(3), "]"), /*#__PURE__*/React.createElement("td", {
      className: "num"
    }, s.r2.toFixed(4)), /*#__PURE__*/React.createElement("td", {
      className: "num",
      style: {
        color: s.p1 < 0.05 ? COLORS.accent : COLORS.muted
      }
    }, fmtP(s.p1)), /*#__PURE__*/React.createElement("td", {
      className: "num",
      style: {
        color: COLORS.accent
      }
    }, fmtP(s.p2)));
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10.5,
      color: COLORS.muted,
      marginTop: 14,
      lineHeight: 1.6,
      letterSpacing: '0.02em'
    }
  }, "ADF (levels): USDC log(TC) non-stationary (p=0.219), USDT log(TC) stationary (p<0.001). After first-differencing, both stationary (p<1e-18). Engle-Granger cointegration holds for both series at 5%.")), /*#__PURE__*/React.createElement("div", {
    className: "card dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, "Course linkage \u2014 ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      color: '#fff'
    }
  }, "who captures the value?")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 15.5,
      lineHeight: 1.5,
      marginTop: 10,
      color: 'rgba(246,243,236,0.88)'
    }
  }, "The scaling exponent \u03B2 tells us ", /*#__PURE__*/React.createElement("em", null, "where"), " network value accrues. Under \u03B2 \u2248 2 (Metcalfe), each new user raises the value of the network for every other user \u2014 a classic winner-takes-all dynamic the operator can internalise. Under \u03B2 \u2248 1, the marginal user just adds a unit of throughput; there is no quadratic externality to capture. Value instead leaks out to the ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: '#e7c468'
    }
  }, "complementors"), " \u2014 validators earning per-transaction gas, issuers earning yield on reserve float."), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(246,243,236,0.2)',
      marginTop: 18,
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'rgba(246,243,236,0.55)',
      marginBottom: 10
    }
  }, "Which analogue fits stablecoins?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid rgba(231,196,104,0.55)',
      padding: '12px 14px',
      background: 'rgba(231,196,104,0.06)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 9.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#e7c468'
    }
  }, "\u03B2 \u2248 1 \xB7 linear"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 9.5,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#e7c468'
    }
  }, "\u2713 fits")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 17,
      color: '#fff',
      marginBottom: 6
    }
  }, "Payment rails"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 13.5,
      lineHeight: 1.45,
      color: 'rgba(246,243,236,0.78)'
    }
  }, "Visa, SWIFT, ACH. Value per user is roughly constant \u2014 each transaction is worth about the same regardless of how many other people use the network. Operators earn thin per-transaction margins; issuers and acquirers share the rest.")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid rgba(246,243,236,0.22)',
      padding: '12px 14px',
      opacity: 0.72
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 9.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'rgba(246,243,236,0.5)'
    }
  }, "\u03B2 \u2248 2 \xB7 quadratic"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 9.5,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#c96a5a'
    }
  }, "\u2717 rejected")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 17,
      color: 'rgba(246,243,236,0.85)',
      marginBottom: 6,
      textDecoration: 'line-through',
      textDecorationColor: 'rgba(201,106,90,0.6)'
    }
  }, "Social networks"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 13.5,
      lineHeight: 1.45,
      color: 'rgba(246,243,236,0.62)'
    }
  }, "Facebook, WeChat, Twitter. Value scales with ", /*#__PURE__*/React.createElement("em", null, "pairs"), " of users because communication is peer-to-peer, so each new user increases utility for all existing users. Operators own the graph and capture nearly all the surplus \u2014 a model our data decisively rules out for stablecoins."))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 13.5,
      lineHeight: 1.5,
      marginTop: 14,
      color: 'rgba(246,243,236,0.75)',
      fontStyle: 'italic'
    }
  }, "Implication for the course: stablecoins are infrastructure, not platforms. The interesting appropriability questions sit ", /*#__PURE__*/React.createElement("em", null, "one layer up"), " \u2014 at the issuer, the L1 validator set, and the exchange on-ramp \u2014 not at the \"stablecoin network operator,\" which is not really a party that exists.")))));
}
window.H1Tab = H1Tab;