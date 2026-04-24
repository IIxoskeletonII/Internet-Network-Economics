// H2 — Diffusion & institutional gaps (leapfrogging)
// ------------------------------------------------------------------------
// All coefficients lifted from tbl_h2_master_summary.csv.
// Coefficient plot rescales β × 10 (per-decimile readability) to mirror
// fig_h2_coefficient_plot.png — CIs also ×10.  Binscatter mirrors
// fig_h2_binscatter.png (x = financial_account_baseline 0-100, two panels).
// ------------------------------------------------------------------------

const {
  useState: useStateH2
} = React;

// Raw values from tbl_h2_master_summary.csv (one row per spec)
const H2_SPECS_RAW = [{
  id: 1,
  label: 'Pooled OLS (baseline main effect)',
  beta: 0.002747568648,
  se: 0.001494688395,
  lo: -0.000181966775,
  hi: 0.005677104072,
  p: 0.06602974,
  n: 702,
  absorbed: false,
  term: 'financial_account_baseline',
  type: 'main'
}, {
  id: 2,
  label: 'Country FE (baseline absorbed)',
  beta: null,
  se: null,
  lo: null,
  hi: null,
  p: null,
  n: 702,
  absorbed: true,
  term: 'financial_account_baseline',
  type: 'absorbed'
}, {
  id: 3,
  label: 'Two-way FE + baseline × post_2022 (HEADLINE)',
  beta: -0.000507881537,
  se: 0.000688835145,
  lo: -0.001860846455,
  hi: 0.000845083382,
  p: 0.46124033,
  n: 702,
  absorbed: false,
  term: 'baseline × post_2022',
  type: 'interaction',
  headline: true
}, {
  id: 4,
  label: 'Two-way FE, excl. forward-filled 2025',
  beta: -0.000554633287,
  se: 0.000714906698,
  lo: -0.001959513038,
  hi: 0.000850246464,
  p: 0.43825773,
  n: 592,
  absorbed: false,
  term: 'baseline × post_2022',
  type: 'interaction'
}, {
  id: 5,
  label: 'Triple interaction (between-cohort diff)',
  beta: -0.003059478929,
  se: 0.000718263138,
  lo: -0.004470254955,
  hi: -0.001648702904,
  p: 2.40e-5,
  n: 702,
  absorbed: false,
  term: 'baseline × post_2022 × 2024-vintage',
  type: 'triple'
}, {
  id: 6,
  label: 'Drop Among-lowest survivors',
  beta: -0.000057804866,
  se: 0.000723114423,
  lo: -0.001478131050,
  hi: 0.001362521318,
  p: 0.93631432,
  n: 696,
  absorbed: false,
  term: 'baseline × post_2022',
  type: 'robust'
}, {
  id: 7,
  label: 'Winsorised inflation (1st / 99th pct)',
  beta: -0.000461179975,
  se: 0.000697344764,
  lo: -0.001830858929,
  hi: 0.000908498979,
  p: 0.50866337,
  n: 702,
  absorbed: false,
  term: 'baseline × post_2022',
  type: 'robust'
}];

// ×10 rescaling — the reference figure shows coefficients "per-decimile"
const rescale10 = x => x == null ? null : x * 10;
const H2_SPECS = H2_SPECS_RAW.map(s => ({
  ...s,
  beta10: rescale10(s.beta),
  se10: rescale10(s.se),
  lo10: rescale10(s.lo),
  hi10: rescale10(s.hi)
}));
const H2_REGIONAL = [{
  region: 'Sub-Saharan Africa',
  code: 'SSA',
  n: 122,
  nC: 24,
  beta: -0.000912,
  se: 0.003009,
  lo: -0.006890,
  hi: 0.005066,
  p: 0.7626,
  r2: 0.179
}, {
  region: 'Latin America & Carib.',
  code: 'LAC',
  n: 118,
  nC: 20,
  beta: 0.001044,
  se: 0.001459,
  lo: -0.001855,
  hi: 0.003944,
  p: 0.4761,
  r2: 0.036
}, {
  region: 'South Asia & East Asia Pacific',
  code: 'SA_EAP',
  n: 112,
  nC: 19,
  beta: 1.02e-6,
  se: 0.001415,
  lo: -0.002813,
  hi: 0.002815,
  p: 0.9994,
  r2: 0.120
}];
const H2_DESCRIPTIVE = [{
  year: 2020,
  n: 149,
  mean: 0.4647,
  sd: 0.3095
}, {
  year: 2021,
  n: 148,
  mean: 0.5149,
  sd: 0.2850
}, {
  year: 2022,
  n: 142,
  mean: 0.5045,
  sd: 0.2894
}, {
  year: 2023,
  n: 148,
  mean: 0.5049,
  sd: 0.2911
}, {
  year: 2024,
  n: 145,
  mean: 0.5023,
  sd: 0.2902
}, {
  year: 2025,
  n: 129,
  mean: 0.4917,
  sd: 0.2939
}];

// ----- Coefficient forest plot (matches fig_h2_coefficient_plot.png) -----
function H2CoefPlot({
  specs,
  width = 960,
  height = 440
}) {
  const mL = 300,
    mR = 110,
    mT = 24,
    mB = 78;
  const w = width - mL - mR,
    h = height - mT - mB;
  // ×10 domain from the figure: -0.06 to +0.06
  const xdom = [-0.06, 0.06];
  const sx = linScale(xdom, [0, w]);
  const rowH = h / specs.length;
  const xTicks = [-0.06, -0.04, -0.02, 0, 0.02, 0.04, 0.06];
  return /*#__PURE__*/React.createElement("svg", {
    className: "chart",
    viewBox: `0 0 ${width} ${height}`
  }, /*#__PURE__*/React.createElement("rect", {
    x: mL,
    y: mT,
    width: sx(0),
    height: h,
    fill: "#2f6a4e",
    opacity: 0.08
  }), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${mT})`
  }, xTicks.map((t, i) => /*#__PURE__*/React.createElement("line", {
    key: 'g' + i,
    x1: sx(t),
    x2: sx(t),
    y1: 0,
    y2: h,
    stroke: COLORS.line,
    strokeWidth: 0.5
  })), /*#__PURE__*/React.createElement("line", {
    x1: sx(0),
    x2: sx(0),
    y1: 0,
    y2: h,
    stroke: COLORS.muted,
    strokeWidth: 1.1,
    strokeDasharray: "5 4"
  }), specs.map((s, i) => {
    if (s.id === 5 || s.id === 6) {
      return /*#__PURE__*/React.createElement("line", {
        key: 'sep' + i,
        x1: 0,
        x2: w,
        y1: rowH * i,
        y2: rowH * i,
        stroke: COLORS.line,
        strokeWidth: 0.6,
        strokeDasharray: "2 3"
      });
    }
    return null;
  }), specs.map((s, i) => {
    const y = rowH * i + rowH / 2;
    // Color code: spec 5 (cohort diff) uses main blue; robustness 6/7 use orange; others blue
    const col = s.type === 'robust' ? '#d97f2e' : '#3178b3';
    if (s.absorbed) {
      // Grey marker at zero with explanatory caption to the right
      return /*#__PURE__*/React.createElement("g", {
        key: 'r' + i
      }, /*#__PURE__*/React.createElement("rect", {
        x: sx(0) - 4,
        y: y - 4,
        width: 8,
        height: 8,
        fill: COLORS.muted,
        opacity: 0.7
      }), /*#__PURE__*/React.createElement("text", {
        x: sx(0) + 14,
        y: y + 3.5,
        style: {
          fontFamily: 'JetBrains Mono',
          fontSize: 10.5,
          fill: COLORS.muted
        }
      }, "absorbed by entity FE (D-27)"), /*#__PURE__*/React.createElement("text", {
        x: -12,
        y: y + 3.5,
        textAnchor: "end",
        style: {
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          fill: COLORS.ink
        }
      }, "Spec ", s.id, " \u2014 ", s.label.replace(' (baseline absorbed)', '')));
    }
    return /*#__PURE__*/React.createElement("g", {
      key: 'r' + i
    }, /*#__PURE__*/React.createElement("line", {
      x1: sx(s.lo10),
      x2: sx(s.hi10),
      y1: y,
      y2: y,
      stroke: col,
      strokeWidth: 1.8
    }), /*#__PURE__*/React.createElement("line", {
      x1: sx(s.lo10),
      x2: sx(s.lo10),
      y1: y - 5,
      y2: y + 5,
      stroke: col,
      strokeWidth: 1.4
    }), /*#__PURE__*/React.createElement("line", {
      x1: sx(s.hi10),
      x2: sx(s.hi10),
      y1: y - 5,
      y2: y + 5,
      stroke: col,
      strokeWidth: 1.4
    }), /*#__PURE__*/React.createElement("circle", {
      cx: sx(s.beta10),
      cy: y,
      r: 4.5,
      fill: col
    }), /*#__PURE__*/React.createElement("text", {
      x: -12,
      y: y + 3.5,
      textAnchor: "end",
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 11,
        fill: COLORS.ink
      }
    }, "Spec ", s.id, " \u2014 ", s.label));
  })), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${mT + h})`
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: w,
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
  }, t.toFixed(2)))), /*#__PURE__*/React.createElement("text", {
    x: w / 2,
    y: 42,
    textAnchor: "middle",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 11,
      fill: COLORS.ink,
      letterSpacing: '0.03em'
    }
  }, "Coefficient \xD7 10 (effect of +10-percentage-point baseline on DV)"), /*#__PURE__*/React.createElement("text", {
    x: w / 2,
    y: 60,
    textAnchor: "middle",
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 11.5,
      fill: COLORS.muted
    }
  }, "Green shading = D-29 pre-registered negative-sign region \xB7 blue = primary specs \xB7 orange = robustness")));
}

// ----- Binscatter (matches fig_h2_binscatter.png) -----
function H2Binscatter() {
  // Two panels: Pre-2022 (2020–2022) and Post-2022 (2023–2025)
  // x = financial_account_baseline (%, 0–100), y = adoption_percentile bin mean
  // Bubble size ∝ n in bin. Slopes: pre +0.0020 (SE 0.0006, n=356); post +0.0010 (SE 0.0007, n=346).
  // Reference: fig_h2_binscatter.png
  const preBins = [{
    x: 9,
    y: 0.29,
    n: 10
  }, {
    x: 22,
    y: 0.35,
    n: 20
  }, {
    x: 28,
    y: 0.63,
    n: 12
  }, {
    x: 38,
    y: 0.46,
    n: 40
  }, {
    x: 44,
    y: 0.56,
    n: 45
  }, {
    x: 52,
    y: 0.44,
    n: 35
  }, {
    x: 57,
    y: 0.59,
    n: 60
  }, {
    x: 63,
    y: 0.57,
    n: 40
  }, {
    x: 71,
    y: 0.45,
    n: 35
  }, {
    x: 77,
    y: 0.43,
    n: 35
  }, {
    x: 82,
    y: 0.71,
    n: 60
  }, {
    x: 89,
    y: 0.66,
    n: 80
  }, {
    x: 97,
    y: 0.55,
    n: 100
  }];
  const postBins = [{
    x: 9,
    y: 0.05,
    n: 8
  }, {
    x: 22,
    y: 0.26,
    n: 14
  }, {
    x: 38,
    y: 0.51,
    n: 42
  }, {
    x: 44,
    y: 0.46,
    n: 38
  }, {
    x: 51,
    y: 0.56,
    n: 55
  }, {
    x: 55,
    y: 0.67,
    n: 40
  }, {
    x: 58,
    y: 0.55,
    n: 55
  }, {
    x: 63,
    y: 0.43,
    n: 35
  }, {
    x: 70,
    y: 0.41,
    n: 40
  }, {
    x: 76,
    y: 0.45,
    n: 25
  }, {
    x: 82,
    y: 0.70,
    n: 72
  }, {
    x: 89,
    y: 0.64,
    n: 82
  }, {
    x: 97,
    y: 0.54,
    n: 100
  }];
  const renderPanel = (bins, slope, se, nObs, col, title, yearLabel) => {
    const W = 500,
      H = 400;
    const mL = 56,
      mR = 16,
      mT = 34,
      mB = 54;
    const w = W - mL - mR,
      h = H - mT - mB;
    const xdom = [0, 100],
      ydom = [0, 0.8];
    const sx = linScale(xdom, [0, w]),
      sy = linScale(ydom, [h, 0]);
    const xTicks = [0, 20, 40, 60, 80, 100];
    const yTicks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
    // regression line (intercept so it passes through bin-centroid)
    const meanX = bins.reduce((a, b) => a + b.x * b.n, 0) / bins.reduce((a, b) => a + b.n, 0);
    const meanY = bins.reduce((a, b) => a + b.y * b.n, 0) / bins.reduce((a, b) => a + b.n, 0);
    const alpha = meanY - slope * meanX;
    const lineX0 = 0,
      lineX1 = 100;
    const lineY0 = alpha + slope * lineX0,
      lineY1 = alpha + slope * lineX1;
    const maxN = Math.max(...bins.map(b => b.n));
    const rScale = n => 5 + Math.sqrt(n / maxN) * 16;
    return /*#__PURE__*/React.createElement("svg", {
      className: "chart",
      viewBox: `0 0 ${W} ${H}`
    }, /*#__PURE__*/React.createElement("text", {
      x: W / 2,
      y: 16,
      textAnchor: "middle",
      style: {
        fontFamily: 'var(--serif)',
        fontSize: 16,
        fill: COLORS.ink
      }
    }, title), /*#__PURE__*/React.createElement("g", {
      transform: `translate(${mL + 6},${mT + 6})`
    }, /*#__PURE__*/React.createElement("rect", {
      x: 0,
      y: 0,
      width: 200,
      height: 36,
      fill: COLORS.paper,
      stroke: COLORS.line,
      strokeWidth: 0.8
    }), /*#__PURE__*/React.createElement("text", {
      x: 8,
      y: 15,
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 10.5,
        fill: COLORS.ink
      }
    }, "OLS slope = ", slope >= 0 ? '+' : '', slope.toFixed(4), " (SE ", se.toFixed(4), ")"), /*#__PURE__*/React.createElement("text", {
      x: 8,
      y: 29,
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 10.5,
        fill: COLORS.ink
      }
    }, "n = ", nObs)), /*#__PURE__*/React.createElement("g", {
      transform: `translate(${mL},${mT})`
    }, yTicks.map((t, i) => /*#__PURE__*/React.createElement("line", {
      key: 'gy' + i,
      x1: 0,
      x2: w,
      y1: sy(t),
      y2: sy(t),
      stroke: COLORS.line,
      strokeWidth: 0.4,
      opacity: 0.6
    })), /*#__PURE__*/React.createElement("line", {
      x1: sx(lineX0),
      y1: sy(lineY0),
      x2: sx(lineX1),
      y2: sy(lineY1),
      stroke: col,
      strokeWidth: 1.8
    }), bins.map((b, i) => /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: sx(b.x),
      cy: sy(b.y),
      r: rScale(b.n),
      fill: col,
      opacity: 0.65,
      stroke: col,
      strokeWidth: 0.8
    }))), /*#__PURE__*/React.createElement("g", {
      transform: `translate(${mL},${mT + h})`
    }, /*#__PURE__*/React.createElement("line", {
      x1: 0,
      x2: w,
      y1: 0,
      y2: 0,
      stroke: COLORS.ink,
      strokeWidth: 0.8
    }), xTicks.map((t, i) => /*#__PURE__*/React.createElement("g", {
      key: i,
      transform: `translate(${sx(t)},0)`
    }, /*#__PURE__*/React.createElement("line", {
      y1: 0,
      y2: 4,
      stroke: COLORS.ink,
      strokeWidth: 0.8
    }), /*#__PURE__*/React.createElement("text", {
      y: 16,
      textAnchor: "middle",
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 10.5,
        fill: COLORS.ink
      }
    }, t))), /*#__PURE__*/React.createElement("text", {
      x: w / 2,
      y: 40,
      textAnchor: "middle",
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 10.5,
        fill: COLORS.ink
      }
    }, "financial_account_baseline (% of adults, 0\u2013100)")), /*#__PURE__*/React.createElement("g", {
      transform: `translate(${mL},${mT})`
    }, /*#__PURE__*/React.createElement("line", {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: h,
      stroke: COLORS.ink,
      strokeWidth: 0.8
    }), yTicks.map((t, i) => /*#__PURE__*/React.createElement("g", {
      key: i,
      transform: `translate(0,${sy(t)})`
    }, /*#__PURE__*/React.createElement("line", {
      x1: -4,
      x2: 0,
      stroke: COLORS.ink,
      strokeWidth: 0.8
    }), /*#__PURE__*/React.createElement("text", {
      x: -8,
      y: 3.5,
      textAnchor: "end",
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 10.5,
        fill: COLORS.ink
      }
    }, t.toFixed(1)))), /*#__PURE__*/React.createElement("text", {
      transform: `rotate(-90) translate(${-h / 2},-40)`,
      textAnchor: "middle",
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 10.5,
        fill: COLORS.ink
      }
    }, "adoption_percentile (bin mean)")));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, renderPanel(preBins, 0.0020, 0.0006, 356, '#3178b3', 'Pre-2022 (2020–2022)', 'pre'), renderPanel(postBins, 0.0010, 0.0007, 346, '#d97f2e', 'Post-2022 (2023–2025)', 'post'));
}

// ----- Descriptive histogram (compact, mirrors fig_h2_descriptive.png) -----
function H2YearMeans() {
  const W = 820,
    H = 200;
  const mL = 54,
    mR = 14,
    mT = 20,
    mB = 40;
  const w = W - mL - mR,
    h = H - mT - mB;
  const xdom = [0, H2_DESCRIPTIVE.length - 1];
  const sx = linScale(xdom, [0, w]);
  const ydom = [0.40, 0.55];
  const sy = linScale(ydom, [h, 0]);
  const bw = w / H2_DESCRIPTIVE.length * 0.58;
  return /*#__PURE__*/React.createElement("svg", {
    className: "chart",
    viewBox: `0 0 ${W} ${H}`
  }, /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${mT})`
  }, [0.40, 0.45, 0.50, 0.55].map((t, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: 0,
    x2: w,
    y1: sy(t),
    y2: sy(t),
    stroke: COLORS.line,
    strokeWidth: 0.5
  })), H2_DESCRIPTIVE.map((d, i) => {
    const cx = sx(i);
    // 95% CI = 1.96 * sd / sqrt(n)
    const ciHW = 1.96 * d.sd / Math.sqrt(d.n);
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("rect", {
      x: cx - bw / 2,
      y: sy(d.mean),
      width: bw,
      height: h - sy(d.mean),
      fill: "#3178b3",
      opacity: 0.85
    }), /*#__PURE__*/React.createElement("line", {
      x1: cx,
      x2: cx,
      y1: sy(d.mean - ciHW),
      y2: sy(d.mean + ciHW),
      stroke: COLORS.ink,
      strokeWidth: 1
    }), /*#__PURE__*/React.createElement("line", {
      x1: cx - 4,
      x2: cx + 4,
      y1: sy(d.mean - ciHW),
      y2: sy(d.mean - ciHW),
      stroke: COLORS.ink
    }), /*#__PURE__*/React.createElement("line", {
      x1: cx - 4,
      x2: cx + 4,
      y1: sy(d.mean + ciHW),
      y2: sy(d.mean + ciHW),
      stroke: COLORS.ink
    }), /*#__PURE__*/React.createElement("text", {
      x: cx,
      y: sy(d.mean) - 6,
      textAnchor: "middle",
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 10,
        fill: COLORS.ink
      }
    }, d.mean.toFixed(3)));
  })), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${mT + h})`
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: w,
    y1: 0,
    y2: 0,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), H2_DESCRIPTIVE.map((d, i) => /*#__PURE__*/React.createElement("g", {
    key: i,
    transform: `translate(${sx(i)},0)`
  }, /*#__PURE__*/React.createElement("line", {
    y1: 0,
    y2: 4,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), /*#__PURE__*/React.createElement("text", {
    y: 16,
    textAnchor: "middle",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, d.year), /*#__PURE__*/React.createElement("text", {
    y: 30,
    textAnchor: "middle",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 9.5,
      fill: COLORS.muted
    }
  }, "n=", d.n)))), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${mT})`
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: h,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), [0.40, 0.45, 0.50, 0.55].map((t, i) => /*#__PURE__*/React.createElement("g", {
    key: i,
    transform: `translate(0,${sy(t)})`
  }, /*#__PURE__*/React.createElement("line", {
    x1: -4,
    x2: 0,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), /*#__PURE__*/React.createElement("text", {
    x: -8,
    y: 3.5,
    textAnchor: "end",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, t.toFixed(2)))), /*#__PURE__*/React.createElement("text", {
    transform: `rotate(-90) translate(${-h / 2},-40)`,
    textAnchor: "middle",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, "mean adoption_percentile (95% CI)")));
}
function H2Tab() {
  const [specSel, setSpecSel] = useStateH2(3);
  const spec = H2_SPECS.find(s => s.id === specSel);
  const preRegSigns = [{
    id: 1,
    label: 'Pooled OLS — β on baseline (expected: −)',
    actual: '+0.0027',
    p: 0.066,
    matched: false
  }, {
    id: 3,
    label: 'Two-way FE — β on baseline × post_2022 (HEADLINE)',
    actual: '−0.0005',
    p: 0.461,
    matched: false
  }, {
    id: 4,
    label: 'Two-way FE, excl. ff 2025 — same interaction',
    actual: '−0.0006',
    p: 0.438,
    matched: false
  }, {
    id: 6,
    label: 'Robustness — drop Among-lowest',
    actual: '−0.0001',
    p: 0.936,
    matched: false
  }, {
    id: 7,
    label: 'Robustness — winsorised inflation',
    actual: '−0.0005',
    p: 0.509,
    matched: false
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hnum"
  }, "H2"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Leapfrogging fails. Adoption ", /*#__PURE__*/React.createElement("em", null, "complements"), " banking depth \u2014 it doesn't substitute for it."), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Pre-registered prediction: stablecoins accelerate where banking is weakest. Evidence: 0 of 5 pre-registered signs land with p<0.05. The headline two-way FE interaction is null; the descriptive sign runs the ", /*#__PURE__*/React.createElement("em", null, "opposite"), " direction.")), /*#__PURE__*/React.createElement("div", {
    className: "verdict"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Verdict"), /*#__PURE__*/React.createElement("div", {
    className: "val ochre"
  }, "Null on identification"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 14,
      color: COLORS.muted,
      marginTop: 6,
      lineHeight: 1.3
    }
  }, "Descriptive slope ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: COLORS.accent
    }
  }, "positive"), ", not negative."), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, "Complement, not substitute"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Headline interaction \u03B2 ", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "(spec 3)")), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "\u22120.0005"), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "p = 0.461 \xB7 CI [\u22120.0019, +0.0008]")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Pooled OLS \u03B2 ", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "(spec 1)")), /*#__PURE__*/React.createElement("div", {
    className: "v",
    style: {
      color: COLORS.accent
    }
  }, "+0.0027"), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "sign-opposite \xB7 p = 0.066")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Pre-reg signs landed"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "0 ", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "/ 5")), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "matching sign & p < 0.05")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Panel size"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "123 ", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "\xD7 6")), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "countries \xD7 years \xB7 n = 702"))), /*#__PURE__*/React.createElement("div", {
    className: "explainer",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ex"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ribbon"
  }, /*#__PURE__*/React.createElement("span", {
    className: "glyph"
  }, "?"), "What \"leapfrogging\" would look like"), /*#__PURE__*/React.createElement("h4", null, "The pre-registered hypothesis predicts a ", /*#__PURE__*/React.createElement("em", null, "negative"), " interaction: adoption grows faster in weak-banking countries after FTX."), /*#__PURE__*/React.createElement("div", {
    className: "plain"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "In plain terms"), "\"Leapfrogging\" is the M-Pesa logic applied to stablecoins \u2014 the idea that new digital infrastructure spreads fastest where the legacy is weakest. If true, we'd see countries with ", /*#__PURE__*/React.createElement("em", null, "lower"), " baseline financial-account ownership gaining adoption ", /*#__PURE__*/React.createElement("em", null, "faster"), " after 2022. The sign of the interaction would be negative and sharp."), /*#__PURE__*/React.createElement("div", {
    className: "tech"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "Technically"), "Headline specification 3 is a two-way fixed-effects panel with country-clustered SEs:", /*#__PURE__*/React.createElement("div", {
    className: "formula"
  }, "AdoptionPct", /*#__PURE__*/React.createElement("sub", null, "it"), " = \u03B1", /*#__PURE__*/React.createElement("sub", null, "i"), " + \u03BB", /*#__PURE__*/React.createElement("sub", null, "t"), " + \u03B2\xB7(baseline", /*#__PURE__*/React.createElement("sub", null, "i"), " \xD7 post2022", /*#__PURE__*/React.createElement("sub", null, "t"), ") + X", /*#__PURE__*/React.createElement("sub", null, "it"), "\u03B3 + \u03B5", /*#__PURE__*/React.createElement("sub", null, "it")), "The main effect of baseline is absorbed by country FE (time-invariant), which is why spec 2 reports an absorbed coefficient."), /*#__PURE__*/React.createElement("div", {
    className: "verdict-mini"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag-txt"
  }, "H\u2080: \u03B2 \u2265 0 (no leapfrog)"), /*#__PURE__*/React.createElement("span", {
    className: "res nul"
  }, "not rejected \xB7 p = 0.461"))), /*#__PURE__*/React.createElement("div", {
    className: "ex"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ribbon"
  }, /*#__PURE__*/React.createElement("span", {
    className: "glyph"
  }, "!"), "Why spec 5 is ", /*#__PURE__*/React.createElement("em", null, "not"), " evidence of the mechanism"), /*#__PURE__*/React.createElement("h4", null, "Spec 5's significant \u22120.0031 is a cross-cohort difference, not a slope."), /*#__PURE__*/React.createElement("div", {
    className: "plain"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "In plain terms"), "Spec 5 separates countries whose Findex baseline comes from the 2021/22 survey wave (\u224821 countries) from those on the 2024 wave (the majority). The 2021/22-vintage cohort actually has a ", /*#__PURE__*/React.createElement("em", null, "positive"), " slope (+0.0023). The \u22120.0031 is just the difference between cohorts, and the 2024-vintage net slope is +0.0023 + (\u22120.0031) = \u22120.0008 \u2014 also null."), /*#__PURE__*/React.createElement("div", {
    className: "tech"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "Technically"), /*#__PURE__*/React.createElement("div", {
    className: "formula"
  }, "\u03B2", /*#__PURE__*/React.createElement("sub", null, "triple"), " = \u22120.00306 (p = 2.4e-05)"), "but ", /*#__PURE__*/React.createElement("em", null, "neither"), " cohort exhibits a mechanism-consistent negative slope that is statistically distinct from zero. The \"significant\" finding is ", /*#__PURE__*/React.createElement("em", null, "between"), " cohorts, not ", /*#__PURE__*/React.createElement("em", null, "within"), " the modal country."), /*#__PURE__*/React.createElement("div", {
    className: "verdict-mini"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag-txt"
  }, "spec 5 \xB7 H\u2080: leapfrogging"), /*#__PURE__*/React.createElement("span", {
    className: "res nul"
  }, "not evidence \xB7 cross-cohort artefact")))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "H2 \u2014 coefficient plot \xB7 baseline \xD7 post_2022 interaction"), /*#__PURE__*/React.createElement("span", null, "95% CI \xB7 rescaled \xD7 10 for readability")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Point estimate \xB7 95% CI on the pre-registered interaction term. Vertical dashed line at \u03B2 = 0; green shading marks the D-29 pre-registered negative-sign region. Zero of the five applicable specs lands in green with p<0.05."), /*#__PURE__*/React.createElement(H2CoefPlot, {
    specs: H2_SPECS
  }), /*#__PURE__*/React.createElement("div", {
    className: "footnote",
    style: {
      marginTop: 8
    }
  }, "All coefficients and CIs multiplied by 10 (effect of a +10-percentage-point baseline). Raw values in tbl_h2_master_summary.csv. Spec 2 omitted \u2014 baseline absorbed by entity FE (D-27). Spec 5 reports a between-cohort differential, not a slope (see \xA74.14 narrative). Spec 8 (overall_score DV, 2020-2021) returns sign-flipped \u03B2 = +0.0023 (p = 0.008); see \xA74.14.")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "H2 \u2014 pre/post binscatter \xB7 adoption vs. baseline banking depth"), /*#__PURE__*/React.createElement("span", null, "bubble size \u221D n in bin")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Both pre-FTX (2020\u20132022) and post-FTX (2023\u20132025) sub-samples show ", /*#__PURE__*/React.createElement("em", null, "positive"), " slopes of adoption on baseline financial-account ownership \u2014 the descriptive evidence runs opposite to leapfrogging."), /*#__PURE__*/React.createElement(H2Binscatter, null), /*#__PURE__*/React.createElement("div", {
    className: "footnote",
    style: {
      marginTop: 8,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic'
    }
  }, "Spec-3 interaction \u03B2 = \u22120.0005 (p = 0.461, n.s.). Pure binscatter shown; regression adjusts for log-GDP, inflation, remittances + country & year FE (see \xA74.5). Visual pattern is suggestive, not statistically distinguishable from zero.")), /*#__PURE__*/React.createElement("div", {
    className: "grid c12",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Regional heterogeneity \u2014 spec 3 re-fit by region"), /*#__PURE__*/React.createElement("span", null, "descriptive \xB7 D-31")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Even within the regions where leapfrogging should show most strongly (Sub-Saharan Africa), the interaction is null."), /*#__PURE__*/React.createElement("table", {
    className: "regtbl",
    style: {
      marginTop: 12,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Region"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "n"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "countries"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "\u03B2 (interaction)"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "SE"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "95% CI"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "p"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "R\xB2"))), /*#__PURE__*/React.createElement("tbody", null, H2_REGIONAL.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.code
  }, /*#__PURE__*/React.createElement("td", null, r.region), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, r.n), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, r.nC), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, r.beta >= 0 ? '+' : '', r.beta.toExponential(2)), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, r.se.toFixed(4)), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, "[", r.lo.toFixed(4), ", ", r.hi.toFixed(4), "]"), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: r.p < 0.05 ? COLORS.accent : COLORS.muted
    }
  }, r.p.toFixed(3)), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, r.r2.toFixed(3)))))), /*#__PURE__*/React.createElement("div", {
    className: "footnote",
    style: {
      marginTop: 10,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic'
    }
  }, "SSA \u03B2 = \u22120.0009 (p = 0.76), LAC \u03B2 = +0.0010 (p = 0.48), SA_EAP \u03B2 \u2248 0 (p = 1.00). Even the narrowest region-level re-fit delivers the same null, and signs are inconsistent across regions.")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Panel descriptives \u2014 adoption percentile by year"), /*#__PURE__*/React.createElement("span", null, "n = 702 country-year obs")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Mean adoption percentile is flat across years \u2014 there is no visible mass migration toward high-adoption regimes."), /*#__PURE__*/React.createElement(H2YearMeans, null), /*#__PURE__*/React.createElement("div", {
    className: "footnote",
    style: {
      marginTop: 8,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic'
    }
  }, "Mean adoption is ~0.50 across every year in the panel (the Chainalysis percentile is approximately uniform by construction). The temporal stability is what makes the leapfrogging interaction hard to identify: within-country variation in the time-invariant baseline is mechanically absorbed by country FE."))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Pre-registered signs scorecard \u2014 D-29"), /*#__PURE__*/React.createElement("span", null, "0 of 5 landed with matching sign & p < 0.05")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Each row reports whether the spec's point estimate matched the pre-registered negative sign AND cleared p < 0.05."), /*#__PURE__*/React.createElement("table", {
    className: "regtbl",
    style: {
      marginTop: 12,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Spec"), /*#__PURE__*/React.createElement("th", null, "Pre-registered test"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Observed \u03B2"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "p"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Matched?"))), /*#__PURE__*/React.createElement("tbody", null, preRegSigns.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id
  }, /*#__PURE__*/React.createElement("td", null, "Spec ", r.id), /*#__PURE__*/React.createElement("td", null, r.label), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, r.actual), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, r.p.toFixed(3)), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: r.matched ? COLORS.green : COLORS.accent,
      fontFamily: 'JetBrains Mono'
    }
  }, r.matched ? '✓' : '✗')))))), /*#__PURE__*/React.createElement("div", {
    className: "grid c21",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Inspect any specification"), /*#__PURE__*/React.createElement("span", null, "click a chip to view its regression readout")), /*#__PURE__*/React.createElement("div", {
    className: "pill-row",
    style: {
      marginTop: 12,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, H2_SPECS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: `pill ${specSel === s.id ? 'active' : ''}`,
    onClick: () => setSpecSel(s.id),
    style: {
      padding: '6px 10px',
      fontFamily: 'JetBrains Mono',
      fontSize: 11,
      letterSpacing: '0.04em'
    }
  }, "SPEC ", s.id))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: COLORS.muted,
      marginBottom: 6
    }
  }, "Specification"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 20,
      lineHeight: 1.25
    }
  }, spec.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 11,
      color: COLORS.muted,
      marginTop: 8,
      letterSpacing: '0.04em'
    }
  }, "term \xB7 ", spec.term)), /*#__PURE__*/React.createElement("div", null, spec.absorbed ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 32,
      letterSpacing: '-0.02em',
      lineHeight: 1
    }
  }, "absorbed"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 11,
      color: COLORS.muted,
      marginTop: 6
    }
  }, "The main effect of ", /*#__PURE__*/React.createElement("code", null, "financial_account_baseline"), " is time-invariant and therefore fully absorbed by country fixed effects (D-27). Use the interaction term in spec 3 instead.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 44,
      letterSpacing: '-0.02em',
      lineHeight: 1
    }
  }, "\u03B2 = ", spec.beta >= 0 ? '+' : '', spec.beta.toFixed(5)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 11,
      color: COLORS.muted,
      marginTop: 4,
      letterSpacing: '0.04em'
    }
  }, "SE = ", spec.se.toFixed(5), " \xB7 95% CI [", spec.lo.toFixed(5), ", ", spec.hi.toFixed(5), "]")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "observations"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, spec.n)), !spec.absorbed && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "p-value"), /*#__PURE__*/React.createElement("span", {
    className: `v ${spec.p < 0.05 ? 'sig' : 'nul'}`
  }, fmtP(spec.p), " ", spec.p < 0.05 ? '(reject β=0)' : '(cannot reject β=0)')), /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "sign vs. pre-registered"), /*#__PURE__*/React.createElement("span", {
    className: "v",
    style: {
      color: spec.type === 'interaction' || spec.type === 'main' || spec.type === 'robust' ? spec.beta < 0 ? COLORS.green : COLORS.accent : COLORS.muted
    }
  }, spec.type === 'triple' ? 'no pre-reg sign (between-cohort diff)' : spec.beta < 0 ? 'matched (negative)' : 'sign-opposite (positive)')))), spec.headline && /*#__PURE__*/React.createElement("div", {
    className: "footnote",
    style: {
      marginTop: 14,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic'
    }
  }, "Headline specification \u2014 reported throughout the paper and deck."), spec.id === 5 && /*#__PURE__*/React.createElement("div", {
    className: "footnote",
    style: {
      marginTop: 14,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic'
    }
  }, "Deliberately excluded from \"signs landed\" accounting \u2014 no pre-registered sign, and the significant coefficient is a cross-cohort differential between 2021/22- and 2024-vintage Findex samples, not a mechanism-level slope (\xA74.14).")), /*#__PURE__*/React.createElement("div", {
    className: "card dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, "Who is adopting, really \u2014 course linkage"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 15.5,
      lineHeight: 1.5,
      marginTop: 10,
      color: 'rgba(246,243,236,0.88)'
    }
  }, "Cross-border crypto flows concentrate not in the unbanked world but in ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: '#e7c468'
    }
  }, "middle-income economies"), " with active retail investment cultures, capital-control pressures, or USD-access frictions."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 15.5,
      lineHeight: 1.5,
      marginTop: 10,
      color: 'rgba(246,243,236,0.88)'
    }
  }, "The binding constraint is macro instability and demand for dollar exposure \u2014 not absence of basic banking. This aligns with Graf von Luckner, Reinhart & Rogoff (2023) and Aquilina, Frost & Schrimpf (2024)."), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(246,243,236,0.2)',
      marginTop: 16,
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'rgba(246,243,236,0.55)',
      marginBottom: 6
    }
  }, "Honest framing"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 17,
      fontStyle: 'italic',
      lineHeight: 1.35,
      color: '#fff'
    }
  }, "\"We cannot identify leapfrogging in this panel\" \u2014 not \"leapfrogging does not exist.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 13.5,
      lineHeight: 1.5,
      color: 'rgba(246,243,236,0.72)',
      marginTop: 10
    }
  }, "The null is partly a consequence of identification: within-country variation in a time-invariant baseline is mechanically absorbed by the country fixed effect, leaving little signal for the interaction term to pick up.")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(246,243,236,0.2)',
      marginTop: 16,
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'rgba(246,243,236,0.55)',
      marginBottom: 6
    }
  }, "Policy implication"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 13.5,
      lineHeight: 1.5,
      color: 'rgba(246,243,236,0.85)'
    }
  }, "Expecting stablecoins to close financial-inclusion gaps in low-income countries is empirically unsupported. The regulatory conversation should refocus on where adoption actually occurs \u2014 middle-income, dollar-demanding economies.")))));
}
window.H2Tab = H2Tab;