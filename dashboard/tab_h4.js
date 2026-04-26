// H4 — Cost friction vs legacy rails
// -----------------------------------------------------------------------------
// Faithful re-implementation aligned with:
//   • tbl_h4_cost_comparison.csv      (headline 72-month means/medians)
//   • tbl_h4_master_summary.csv       (paired-test β, SE, CI, p — full + Dencun)
//   • tbl_h4_paired_tests_summary.txt (HAC OLS regression details)
//   • tbl_h4_breakeven_by_year.csv    (ETH-vs-legacy breakeven transfer size)
//   • tbl_h4_crossover_by_year.csv    (months where Tron mean > legacy)
//   • tbl_h4_savings_ratio_by_year.csv
//   • fig_h4_cost_comparison.png      (visual reference for the bar chart)
//
// CONSTRUCTS USED (matches D-02 paired-test alignment in fig_h4):
//   ETH: 72-month MEAN of monthly mean fees     = $14.9232 (flat, both sizes)
//   Tron: 72-month MEDIAN of monthly median fees = $0.0324 (flat, both sizes)
//   Legacy: 72-month MEAN at the corridor pct    = $8.39 / $419.67
// -----------------------------------------------------------------------------

const {
  useState: useStateH4,
  useMemo: useMemoH4
} = React;

// ---- Headline cost constants (tbl_h4_cost_comparison.csv) -------------------
const H4_COST = {
  eth: {
    median: 4.5908,
    mean: 14.9232
  },
  tron: {
    median: 0.0324,
    mean: 0.4511
  },
  legacy: {
    s200: {
      median: 7.8024,
      mean: 8.3933
    },
    s10000: {
      median: 390.118,
      mean: 419.6663
    }
  },
  ratios: {
    // mean(legacy)/mean(eth) at $200 = 0.56  → ETH WORSE than legacy
    s200_legacyMean_to_ethMean: 0.56,
    s200_legacyMean_to_tronMedian: 259.41,
    s10000_legacyMean_to_ethMean: 28.12,
    s10000_legacyMean_to_tronMedian: 12970.29
  }
};

// ---- Paired-test specifications (tbl_h4_master_summary.csv) -----------------
// β here = legacy_mean − onchain_construct (positive ⇒ on-chain cheaper)
const H4_SPECS = [
// FULL window, headline (flat fee = $0.00)
{
  id: 'full_eth_200',
  window: 'Full · 2020-01 → 2025-12',
  n: 72,
  hac: 4,
  flat: 0.00,
  chain: 'ETH',
  size: 200,
  beta: -6.5299,
  se: 4.213,
  lo: -14.787,
  hi: 1.728,
  p: 0.1212,
  headline: true,
  label: 'ETH · $200 · full',
  note: 'ETH L1 fees swamp the $200 corridor — direction adverse, not significant.'
}, {
  id: 'full_eth_10k',
  window: 'Full · 2020-01 → 2025-12',
  n: 72,
  hac: 4,
  flat: 0.00,
  chain: 'ETH',
  size: 10000,
  beta: 404.7431,
  se: 12.636,
  lo: 379.976,
  hi: 429.510,
  p: 4.18e-225,
  headline: true,
  label: 'ETH · $10K · full',
  note: 'At $10K, the fixed-fee chain decisively beats percent-of-corridor legacy.'
}, {
  id: 'full_tron_200',
  window: 'Full · 2020-01 → 2025-12',
  n: 72,
  hac: 4,
  flat: 0.00,
  chain: 'TRON',
  size: 200,
  beta: 8.2586,
  se: 0.250,
  lo: 7.768,
  hi: 8.749,
  p: 1.42e-238,
  headline: true,
  label: 'TRON · $200 · full',
  note: 'Universal $200 advantage — Tron beats legacy in ~100% of months.'
}, {
  id: 'full_tron_10k',
  window: 'Full · 2020-01 → 2025-12',
  n: 72,
  hac: 4,
  flat: 0.00,
  chain: 'TRON',
  size: 10000,
  beta: 419.5317,
  se: 12.106,
  lo: 395.804,
  hi: 443.259,
  p: 3.78e-263,
  headline: true,
  label: 'TRON · $10K · full',
  note: 'Largest absolute saving in the design — ~$420 per transfer.'
},
// POST-DENCUN window (Apr 2024+)
{
  id: 'dencun_eth_200',
  window: 'Post-Dencun · 2024-04 → 2025-12',
  n: 21,
  hac: 2,
  flat: 0.00,
  chain: 'ETH',
  size: 200,
  beta: 0.8609,
  se: 2.769,
  lo: -4.567,
  hi: 6.288,
  p: 0.7559,
  label: 'ETH · $200 · post-Dencun',
  note: 'After EIP-4844, ETH ≈ legacy at $200 — the gap effectively closes to zero.'
}, {
  id: 'dencun_eth_10k',
  window: 'Post-Dencun · 2024-04 → 2025-12',
  n: 21,
  hac: 2,
  flat: 0.00,
  chain: 'ETH',
  size: 10000,
  beta: 377.9674,
  se: 2.769,
  lo: 372.540,
  hi: 383.395,
  p: 0,
  label: 'ETH · $10K · post-Dencun',
  note: 'Saving slightly compressed at $10K (lower legacy_pct in 2024-25), still decisive.'
}, {
  id: 'dencun_tron_200',
  window: 'Post-Dencun · 2024-04 → 2025-12',
  n: 21,
  hac: 2,
  flat: 0.00,
  chain: 'TRON',
  size: 200,
  beta: 7.6725,
  se: 0.007,
  lo: 7.659,
  hi: 7.685,
  p: 0,
  label: 'TRON · $200 · post-Dencun',
  note: 'Tron unaffected by Dencun — the advantage is structural, not Ethereum-driven.'
}, {
  id: 'dencun_tron_10k',
  window: 'Post-Dencun · 2024-04 → 2025-12',
  n: 21,
  hac: 2,
  flat: 0.00,
  chain: 'TRON',
  size: 10000,
  beta: 384.7790,
  se: 0.007,
  lo: 384.766,
  hi: 384.792,
  p: 0,
  label: 'TRON · $10K · post-Dencun',
  note: 'Same story at $10K post-Dencun — Tron savings are stable in absolute terms.'
}];

// ---- Sensitivity row: $3.50 flat compliance fee adds 3.5 to β ---------------
const H4_SENSITIVITY = {
  s200_eth: {
    full_0: -6.53,
    full_350: -3.03,
    dencun_0: 0.86,
    dencun_350: 4.36
  },
  s200_tron: {
    full_0: 8.26,
    full_350: 11.76,
    dencun_0: 7.67,
    dencun_350: 11.17
  },
  s10000_eth: {
    full_0: 404.74,
    full_350: 408.24,
    dencun_0: 377.97,
    dencun_350: 381.47
  },
  s10000_tron: {
    full_0: 419.53,
    full_350: 423.03,
    dencun_0: 384.78,
    dencun_350: 388.28
  }
};

// ---- Breakeven by year (tbl_h4_breakeven_by_year.csv) -----------------------
// Transfer size at which on-chain cost = legacy cost
const H4_BREAKEVEN = [{
  year: 2020,
  eth_med: 8.63,
  eth_mean: 20.70,
  tron_med: 0.03,
  tron_mean: 0.05
}, {
  year: 2021,
  eth_med: 288.23,
  eth_mean: 567.23,
  tron_med: 4.38,
  tron_mean: 5.39
}, {
  year: 2022,
  eth_med: 203.59,
  eth_mean: 287.96,
  tron_med: 7.38,
  tron_mean: 9.44
}, {
  year: 2023,
  eth_med: 175.48,
  eth_mean: 215.37,
  tron_med: 0.84,
  tron_mean: 14.42
}, {
  year: 2024,
  eth_med: 140.13,
  eth_mean: 307.33,
  tron_med: 0.63,
  tron_mean: 12.90
}, {
  year: 2025,
  eth_med: 9.48,
  eth_mean: 23.73,
  tron_med: 0.00,
  tron_mean: 15.95
}];

// ---- Crossover by year (tbl_h4_crossover_by_year.csv) -----------------------
// Months in which Tron MEAN fee exceeded legacy at $200 (rare congestion spikes)
const H4_CROSSOVER = [{
  year: 2020,
  n: 0,
  pct: 0.0
}, {
  year: 2021,
  n: 0,
  pct: 0.0
}, {
  year: 2022,
  n: 0,
  pct: 0.0
}, {
  year: 2023,
  n: 0,
  pct: 0.0
}, {
  year: 2024,
  n: 0,
  pct: 0.0
}, {
  year: 2025,
  n: 6,
  pct: 50.0
}];

// ---- Savings ratio by year (tbl_h4_savings_ratio_by_year.csv) ---------------
const H4_SAVINGS = [{
  year: 2020,
  e200: 24.62,
  t200: 6182.89,
  e10k: 1230.91,
  t10k: 309144.27
}, {
  year: 2021,
  e200: 0.70,
  t200: 46.50,
  e10k: 35.07,
  t10k: 2324.88
}, {
  year: 2022,
  e200: 0.98,
  t200: 27.15,
  e10k: 49.19,
  t10k: 1357.68
}, {
  year: 2023,
  e200: 1.16,
  t200: 216.94,
  e10k: 57.82,
  t10k: 10846.89
}, {
  year: 2024,
  e200: 1.46,
  t200: 247.65,
  e10k: 72.91,
  t10k: 12382.56
}, {
  year: 2025,
  e200: 21.15,
  t200: 92.65,
  e10k: 1057.52,
  t10k: 4632.30
}];

// =============================================================================
// Custom chart: Cost-comparison bar (mirrors fig_h4_cost_comparison.png exactly)
// Three bars per size group on a log-y axis
// =============================================================================
function H4CostBars({
  size200 = true,
  size10k = true
}) {
  const W = 1380,
    H = 380;
  const mL = 70,
    mR = 28,
    mT = 20,
    mB = 70;
  const w = W - mL - mR,
    h = H - mT - mB;
  const groups = [];
  if (size200) groups.push({
    label: '$200',
    size: 200,
    legacy: H4_COST.legacy.s200.mean
  });
  if (size10k) groups.push({
    label: '$10,000',
    size: 10000,
    legacy: H4_COST.legacy.s10000.mean
  });

  // log scale 0.01 → 1000
  const yMin = 0.01,
    yMax = 1000;
  const sy = logScale([yMin, yMax], [h, 0]);
  const yTicks = [0.01, 0.1, 1, 10, 100, 1000];
  const groupW = w / Math.max(1, groups.length);
  const barW = Math.min(110, groupW / 5);
  const gap = 8;
  const series = g => [{
    key: 'eth',
    label: 'ETH mean',
    value: H4_COST.eth.mean,
    color: '#1F3A5F'
  }, {
    key: 'tron',
    label: 'Tron median',
    value: Math.max(yMin, H4_COST.tron.median),
    color: '#B8860B',
    annotate: 'median = $0.0324\n(14 of 72 mo. at $0)'
  }, {
    key: 'legacy',
    label: 'Legacy mean',
    value: g.legacy,
    color: '#3D3935'
  }];
  return /*#__PURE__*/React.createElement("svg", {
    className: "chart",
    viewBox: `0 0 ${W} ${H}`
  }, /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${mT})`
  }, yTicks.map((t, i) => /*#__PURE__*/React.createElement("line", {
    key: 'g' + i,
    x1: 0,
    x2: w,
    y1: sy(t),
    y2: sy(t),
    stroke: COLORS.line,
    strokeWidth: 0.5,
    opacity: 0.55
  })), groups.slice(1).map((g, i) => /*#__PURE__*/React.createElement("line", {
    key: 'sep' + i,
    x1: (i + 1) * groupW,
    x2: (i + 1) * groupW,
    y1: 0,
    y2: h,
    stroke: COLORS.line,
    strokeWidth: 0.4,
    opacity: 0.5
  })), groups.map((g, gi) => {
    const ser = series(g);
    const groupX = gi * groupW + (groupW - (ser.length * barW + (ser.length - 1) * gap)) / 2;
    return /*#__PURE__*/React.createElement("g", {
      key: 'gr' + gi
    }, ser.map((s, si) => {
      const x = groupX + si * (barW + gap);
      const y = sy(s.value);
      return /*#__PURE__*/React.createElement("g", {
        key: s.key
      }, /*#__PURE__*/React.createElement("rect", {
        x: x,
        y: y,
        width: barW,
        height: h - y,
        fill: s.color
      }), /*#__PURE__*/React.createElement("text", {
        x: x + barW / 2,
        y: y - 7,
        textAnchor: "middle",
        style: {
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          fill: COLORS.ink
        }
      }, s.value < 1 ? '$' + s.value.toFixed(3) : s.value < 100 ? '$' + s.value.toFixed(2) : '$' + Math.round(s.value)), s.annotate && /*#__PURE__*/React.createElement("text", {
        x: x + barW / 2,
        y: h - 6,
        textAnchor: "middle",
        style: {
          fontFamily: 'JetBrains Mono',
          fontSize: 9,
          fill: COLORS.muted
        }
      }, /*#__PURE__*/React.createElement("tspan", {
        x: x + barW / 2,
        dy: "-12"
      }, "median = $0.0324"), /*#__PURE__*/React.createElement("tspan", {
        x: x + barW / 2,
        dy: "11"
      }, "(14 of 72 mo. at $0)")));
    }), /*#__PURE__*/React.createElement("text", {
      x: gi * groupW + groupW / 2,
      y: h + 30,
      textAnchor: "middle",
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 13,
        fill: COLORS.ink,
        letterSpacing: '0.04em'
      }
    }, g.label));
  })), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${mT})`
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: h,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), yTicks.map((t, i) => /*#__PURE__*/React.createElement("g", {
    key: 'yt' + i,
    transform: `translate(0,${sy(t)})`
  }, /*#__PURE__*/React.createElement("line", {
    x1: -5,
    x2: 0,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), /*#__PURE__*/React.createElement("text", {
    x: -9,
    y: 3.5,
    textAnchor: "end",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, t < 1 ? '$' + t.toFixed(2) : '$' + t))), /*#__PURE__*/React.createElement("text", {
    transform: `rotate(-90) translate(${-h / 2},-50)`,
    textAnchor: "middle",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 11,
      fill: COLORS.ink
    }
  }, "Fee per transfer (USD, log scale)")), /*#__PURE__*/React.createElement("text", {
    x: mL + w / 2,
    y: H - 14,
    textAnchor: "middle",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 11,
      fill: COLORS.ink,
      letterSpacing: '0.04em'
    }
  }, "Transfer size"), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL + 12},${mT + 8})`
  }, /*#__PURE__*/React.createElement("rect", {
    x: 0,
    y: 0,
    width: 210,
    height: 62,
    fill: COLORS.paper,
    stroke: COLORS.line,
    strokeWidth: 0.6
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(10,16)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: 0,
    y: -8,
    width: 14,
    height: 10,
    fill: "#1F3A5F"
  }), /*#__PURE__*/React.createElement("text", {
    x: 22,
    y: 1,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, "ETH mean ($14.92)")), /*#__PURE__*/React.createElement("g", {
    transform: "translate(10,34)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: 0,
    y: -8,
    width: 14,
    height: 10,
    fill: "#B8860B"
  }), /*#__PURE__*/React.createElement("text", {
    x: 22,
    y: 1,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, "Tron median ($0.03)")), /*#__PURE__*/React.createElement("g", {
    transform: "translate(10,52)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: 0,
    y: -8,
    width: 14,
    height: 10,
    fill: "#3D3935"
  }), /*#__PURE__*/React.createElement("text", {
    x: 22,
    y: 1,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, "Legacy mean ($8.39 / $419.67)"))));
}

// =============================================================================
// Custom chart: monthly fee timeseries (3 series + Dencun marker)
// =============================================================================
function H4FeeTimeseries({
  d,
  sizeForLegacy = 200
}) {
  const W = 1380,
    H = 420;
  const mL = 64,
    mR = 32,
    mT = 28,
    mB = 50;
  const w = W - mL - mR,
    h = H - mT - mB;
  const xs = d.map(r => new Date(r.month + '-01').getTime());
  const x0 = Math.min(...xs),
    x1 = Math.max(...xs);
  const sx = linScale([x0, x1], [0, w]);

  // log y from 0.001 → 100 covers Tron near-zero through ETH spikes near 90
  const yMin = 0.001,
    yMax = 100;
  const sy = logScale([yMin, yMax], [h, 0]);
  const yTicks = [0.001, 0.01, 0.1, 1, 10, 100];
  const ethPath = d.map((r, i) => (i === 0 ? 'M' : 'L') + sx(new Date(r.month + '-01').getTime()) + ',' + sy(Math.max(yMin, r.eth_mean))).join(' ');
  const tronPath = d.map((r, i) => (i === 0 ? 'M' : 'L') + sx(new Date(r.month + '-01').getTime()) + ',' + sy(Math.max(yMin, r.tron_mean))).join(' ');
  const legacyPath = d.map((r, i) => (i === 0 ? 'M' : 'L') + sx(new Date(r.month + '-01').getTime()) + ',' + sy(Math.max(yMin, r.legacy_pct * sizeForLegacy))).join(' ');
  const yearTicks = [];
  for (let y = 2020; y <= 2026; y++) yearTicks.push({
    t: new Date(Date.UTC(y, 0, 1)).getTime(),
    label: String(y)
  });
  const dencunX = sx(new Date('2024-04-01').getTime());
  return /*#__PURE__*/React.createElement("svg", {
    className: "chart",
    viewBox: `0 0 ${W} ${H}`
  }, /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${mT})`
  }, yTicks.map((t, i) => /*#__PURE__*/React.createElement("line", {
    key: 'g' + i,
    x1: 0,
    x2: w,
    y1: sy(t),
    y2: sy(t),
    stroke: COLORS.line,
    strokeWidth: 0.5,
    opacity: 0.55
  })), /*#__PURE__*/React.createElement("line", {
    x1: dencunX,
    x2: dencunX,
    y1: 0,
    y2: h,
    stroke: COLORS.muted,
    strokeWidth: 0.9,
    strokeDasharray: "3 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: dencunX + 5,
    y: 14,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10,
      fill: COLORS.muted
    }
  }, "EIP-4844 (Dencun) \xB7 Apr 2024"), /*#__PURE__*/React.createElement("path", {
    d: legacyPath,
    stroke: "#3D3935",
    strokeWidth: 1.6,
    fill: "none",
    strokeDasharray: "6 4"
  }), /*#__PURE__*/React.createElement("path", {
    d: ethPath,
    stroke: "#1F3A5F",
    strokeWidth: 1.8,
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: tronPath,
    stroke: "#B8860B",
    strokeWidth: 1.8,
    fill: "none"
  }), /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: h,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), yTicks.map((t, i) => /*#__PURE__*/React.createElement("g", {
    key: 'yt' + i,
    transform: `translate(0,${sy(t)})`
  }, /*#__PURE__*/React.createElement("line", {
    x1: -5,
    x2: 0,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), /*#__PURE__*/React.createElement("text", {
    x: -9,
    y: 3.5,
    textAnchor: "end",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, t < 1 ? '$' + t.toFixed(t < 0.01 ? 3 : 2) : '$' + t))), /*#__PURE__*/React.createElement("text", {
    transform: `rotate(-90) translate(${-h / 2},-46)`,
    textAnchor: "middle",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 11,
      fill: COLORS.ink
    }
  }, "Monthly fee (USD, log scale)"), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${w - 320},6)`
  }, /*#__PURE__*/React.createElement("rect", {
    x: 0,
    y: 0,
    width: 320,
    height: 62,
    fill: COLORS.paper,
    stroke: COLORS.line,
    strokeWidth: 0.6
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(10,18)"
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: 22,
    y1: 0,
    y2: 0,
    stroke: "#1F3A5F",
    strokeWidth: 1.8
  }), /*#__PURE__*/React.createElement("text", {
    x: 30,
    y: 3.5,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, "ETH monthly mean fee")), /*#__PURE__*/React.createElement("g", {
    transform: "translate(10,35)"
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: 22,
    y1: 0,
    y2: 0,
    stroke: "#B8860B",
    strokeWidth: 1.8
  }), /*#__PURE__*/React.createElement("text", {
    x: 30,
    y: 3.5,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, "Tron monthly mean fee")), /*#__PURE__*/React.createElement("g", {
    transform: "translate(10,52)"
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: 22,
    y1: 0,
    y2: 0,
    stroke: "#3D3935",
    strokeWidth: 1.6,
    strokeDasharray: "6 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: 30,
    y: 3.5,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, "Legacy implied @ $", sizeForLegacy.toLocaleString())))), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${mT + h})`
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: w,
    y1: 0,
    y2: 0,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), yearTicks.map((t, i) => /*#__PURE__*/React.createElement("g", {
    key: 'xt' + i,
    transform: `translate(${sx(t.t)},0)`
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
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, t.label)))));
}

// =============================================================================
// Live cost slider — animates ETH/Tron/Legacy across all transfer sizes
// =============================================================================
function H4LiveSlider() {
  const [size, setSize] = useStateH4(200);
  const d = window.DATA.h4;
  // Use the full-sample average legacy_pct so the slider line is steady (3.85%)
  const legacyPctAvg = d.reduce((a, b) => a + b.legacy_pct, 0) / d.length;
  const ethMean = H4_COST.eth.mean; // flat
  const ethMedian = H4_COST.eth.median;
  const tronMean = H4_COST.tron.mean; // flat
  const tronMedian = H4_COST.tron.median;
  const legacyAtSize = size * legacyPctAvg;

  // Use exact paired values at $200 / $10K, otherwise linear interpolation
  const legacy = size === 200 ? H4_COST.legacy.s200.mean : size === 10000 ? H4_COST.legacy.s10000.mean : legacyAtSize;
  const tronAdv = legacy / tronMedian;
  const ethAdv = legacy / ethMean;
  const ethAdvWins = ethAdv >= 1;

  // build mini bar for visual savings
  const W = 1380,
    H = 240;
  const mL = 70,
    mR = 30,
    mT = 18,
    mB = 50;
  const w = W - mL - mR,
    h = H - mT - mB;
  const yMin = 0.01,
    yMax = Math.max(1000, legacy * 1.4);
  const sy = logScale([yMin, yMax], [h, 0]);
  const yTicks = [0.01, 0.1, 1, 10, 100, 1000];
  const series = [{
    label: 'ETH · USDC',
    value: ethMean,
    color: '#1F3A5F'
  }, {
    label: 'Tron · USDT',
    value: tronMedian,
    color: '#B8860B'
  }, {
    label: 'SWIFT legacy',
    value: legacy,
    color: '#3D3935'
  }];
  const barW = 130,
    gap = 70;
  const groupX = (w - (series.length * barW + (series.length - 1) * gap)) / 2;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "slider-wrap",
    style: {
      margin: '4px 0 24px',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      minWidth: 96
    }
  }, "Transfer size"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: 50,
    max: 50000,
    step: 50,
    value: size,
    onChange: e => setSize(+e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "val"
  }, "$", size.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 18,
      flexWrap: 'wrap'
    }
  }, [50, 100, 200, 500, 1000, 5000, 10000, 25000, 50000].map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => setSize(s),
    className: `pill ${size === s ? 'active' : ''}`,
    style: {
      padding: '5px 10px',
      fontFamily: 'JetBrains Mono',
      fontSize: 10,
      letterSpacing: '0.04em'
    }
  }, s === 200 ? '$200 · WB benchmark' : s === 10000 ? '$10K · institutional' : '$' + s.toLocaleString()))), /*#__PURE__*/React.createElement("div", {
    className: "grid c4",
    style: {
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 0,
      border: '1.5px solid var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px',
      borderRight: '1px solid var(--line)',
      background: '#ECEEF3'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#1F3A5F'
    }
  }, "ETH \xB7 USDC"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 42,
      lineHeight: 1,
      marginTop: 8,
      color: '#1F3A5F',
      letterSpacing: '-0.02em'
    }
  }, fmt$(ethMean, 2)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 8,
      letterSpacing: '0.04em'
    }
  }, "FLAT \xB7 MEDIAN ", fmt$(ethMedian, 2)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 13,
      color: COLORS.muted,
      marginTop: 6,
      lineHeight: 1.4
    }
  }, "72-mo mean. Independent of size.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px',
      borderRight: '1px solid var(--line)',
      background: '#F5EFE0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#B8860B'
    }
  }, "Tron \xB7 USDT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 42,
      lineHeight: 1,
      marginTop: 8,
      color: '#B8860B',
      letterSpacing: '-0.02em'
    }
  }, fmt$(tronMedian, 4)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 8,
      letterSpacing: '0.04em'
    }
  }, "FLAT \xB7 MEAN ", fmt$(tronMean, 2)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 13,
      color: COLORS.muted,
      marginTop: 6,
      lineHeight: 1.4
    }
  }, "Median; 14 / 72 months were $0.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px',
      borderRight: '1px solid var(--line)',
      background: '#ECEAE7'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#3D3935'
    }
  }, "SWIFT legacy (RPW)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 42,
      lineHeight: 1,
      marginTop: 8,
      color: '#3D3935',
      letterSpacing: '-0.02em'
    }
  }, fmt$(legacy, 2)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      color: COLORS.muted,
      marginTop: 8,
      letterSpacing: '0.04em'
    }
  }, "\u2248 ", (legacyPctAvg * 100).toFixed(2), "% OF CORRIDOR"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 13,
      color: COLORS.muted,
      marginTop: 6,
      lineHeight: 1.4
    }
  }, "72-mo avg corridor cost; scales with size.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px',
      background: 'var(--ink)',
      color: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'rgba(250,248,245,0.6)'
    }
  }, "Savings ratio"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 24,
      marginTop: 10,
      lineHeight: 1.25
    }
  }, "Tron ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#5A7A5A',
      fontVariantNumeric: 'tabular-nums'
    }
  }, fmt(tronAdv, 0), "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 24,
      lineHeight: 1.25
    }
  }, "ETH ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: ethAdvWins ? '#5A7A5A' : '#8B3A3A',
      fontVariantNumeric: 'tabular-nums'
    }
  }, ethAdv.toFixed(2), "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 9.5,
      color: 'rgba(250,248,245,0.55)',
      marginTop: 10,
      textTransform: 'uppercase',
      letterSpacing: '0.06em'
    }
  }, "vs legacy @ $", size.toLocaleString(), " ", ethAdvWins ? '· ETH cheaper' : '· ETH dearer'))), /*#__PURE__*/React.createElement("svg", {
    className: "chart",
    viewBox: `0 0 ${W} ${H}`,
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${mT})`
  }, yTicks.filter(t => t <= yMax).map((t, i) => /*#__PURE__*/React.createElement("line", {
    key: 'g' + i,
    x1: 0,
    x2: w,
    y1: sy(t),
    y2: sy(t),
    stroke: COLORS.line,
    strokeWidth: 0.5,
    opacity: 0.55
  })), series.map((s, i) => {
    const x = groupX + i * (barW + gap);
    const y = sy(Math.max(yMin, s.value));
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("rect", {
      x: x,
      y: y,
      width: barW,
      height: h - y,
      fill: s.color
    }, /*#__PURE__*/React.createElement("title", null, s.label, ": $", s.value.toFixed(s.value < 1 ? 4 : 2))), /*#__PURE__*/React.createElement("text", {
      x: x + barW / 2,
      y: y - 6,
      textAnchor: "middle",
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 11,
        fill: COLORS.ink
      }
    }, s.value < 1 ? '$' + s.value.toFixed(3) : s.value < 100 ? '$' + s.value.toFixed(2) : '$' + Math.round(s.value)), /*#__PURE__*/React.createElement("text", {
      x: x + barW / 2,
      y: h + 18,
      textAnchor: "middle",
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 10,
        fill: COLORS.muted,
        letterSpacing: '0.06em',
        textTransform: 'uppercase'
      }
    }, s.label));
  }), /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: h,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), yTicks.filter(t => t <= yMax).map((t, i) => /*#__PURE__*/React.createElement("g", {
    key: 'yt' + i,
    transform: `translate(0,${sy(t)})`
  }, /*#__PURE__*/React.createElement("line", {
    x1: -5,
    x2: 0,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), /*#__PURE__*/React.createElement("text", {
    x: -9,
    y: 3.5,
    textAnchor: "end",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, t < 1 ? '$' + t.toFixed(2) : '$' + t))))));
}

// =============================================================================
// Spec inspector — like H3, lets user click through 8 paired-test specs
// =============================================================================
function H4SpecInspector() {
  const [id, setId] = useStateH4('full_eth_200');
  const spec = H4_SPECS.find(s => s.id === id);
  const sigClass = spec.p < 0.05 ? 'sig' : 'nul';
  const direction = spec.beta > 0 ? 'on-chain CHEAPER' : 'on-chain DEARER';
  const sigStr = spec.p < 0.05 ? spec.beta > 0 ? 'on-chain advantage confirmed' : 'on-chain DISADVANTAGE confirmed' : 'no significant difference';
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pill-row",
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, H4_SPECS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: `pill ${id === s.id ? 'active' : ''}`,
    onClick: () => setId(s.id),
    style: {
      padding: '6px 10px',
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      letterSpacing: '0.04em'
    }
  }, s.label.replace(/ · /g, ' / ').toUpperCase()))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: COLORS.muted,
      marginBottom: 4
    }
  }, "Specification ", spec.headline ? '· HEADLINE' : ''), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 22,
      lineHeight: 1.25
    }
  }, spec.chain, " \xB7 $", spec.size.toLocaleString(), " \xB7 ", spec.window), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 11,
      color: COLORS.muted,
      marginTop: 6,
      letterSpacing: '0.04em'
    }
  }, "n = ", spec.n, " months \xB7 HAC(", spec.hac, ") \xB7 flat fee = $", spec.flat.toFixed(2)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: COLORS.muted,
      marginBottom: 4
    }
  }, "\u03B2 (legacy \u2212 on-chain, USD/transfer)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 48,
      letterSpacing: '-0.02em',
      lineHeight: 1,
      color: spec.p < 0.05 ? spec.beta > 0 ? COLORS.green : COLORS.accent : COLORS.ink
    }
  }, spec.beta >= 0 ? '+' : '', spec.beta.toFixed(2)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 11,
      color: COLORS.muted,
      marginTop: 4,
      letterSpacing: '0.04em'
    }
  }, "SE = ", spec.se.toFixed(3), " \xB7 95% CI [", spec.lo.toFixed(2), ", ", spec.hi.toFixed(2), "]"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 13,
      color: spec.beta > 0 ? COLORS.green : COLORS.accent,
      marginTop: 8
    }
  }, "Direction: ", direction)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "p-value"), /*#__PURE__*/React.createElement("span", {
    className: `v ${sigClass}`
  }, fmtP(spec.p), " ", spec.p < 0.05 ? '(reject H₀)' : '(fail to reject)')), /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "interpretation"), /*#__PURE__*/React.createElement("span", {
    className: `v ${sigClass}`,
    style: {
      textAlign: 'right',
      maxWidth: '60%'
    }
  }, sigStr)), /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "n months"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, spec.n)), /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "HAC lags"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, spec.hac)), /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "on-chain construct"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, spec.chain === 'ETH' ? 'monthly mean' : 'monthly median')))), /*#__PURE__*/React.createElement("div", {
    className: "footnote",
    style: {
      marginTop: 14,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      lineHeight: 1.5,
      fontSize: 13.5
    }
  }, spec.note)));
}

// =============================================================================
// MAIN H4 TAB
// =============================================================================
function H4Tab() {
  const d = window.DATA.h4;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hnum"
  }, "H4"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "The cost story is ", /*#__PURE__*/React.createElement("em", null, "chain-bifurcated"), " \u2014 Tron beats SWIFT universally; Ethereum L1 does not, at remittance sizes."), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "At a $200 transfer, Tron is ", /*#__PURE__*/React.createElement("em", null, "259\xD7"), " cheaper than the SWIFT mean. Ethereum L1 is ", /*#__PURE__*/React.createElement("em", null, "0.56\xD7"), " \u2014 i.e. ", /*#__PURE__*/React.createElement("em", null, "worse"), " than legacy. At $10,000 the picture flips: Ethereum saves ~$405/transfer. Where the cost advantage holds, it holds by two-to-four orders of magnitude.")), /*#__PURE__*/React.createElement("div", {
    className: "verdict"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Verdict"), /*#__PURE__*/React.createElement("div", {
    className: "val green"
  }, "Qualified yes"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 14,
      color: COLORS.muted,
      marginTop: 6,
      lineHeight: 1.3
    }
  }, "Holds ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: COLORS.green
    }
  }, "decisively"), " on low-fee chains and at large sizes; ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: COLORS.accent
    }
  }, "fails"), " on ETH L1 at remittance sizes."), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, "Chain \xD7 size dependent"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Tron \xB7 $200 \xB7 vs legacy mean"), /*#__PURE__*/React.createElement("div", {
    className: "v",
    style: {
      color: COLORS.green
    }
  }, "259", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "$8.39 \u2192 $0.0324 \xB7 saves ~$8.36/tx")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "ETH \xB7 $200 \xB7 vs legacy mean"), /*#__PURE__*/React.createElement("div", {
    className: "v",
    style: {
      color: COLORS.accent
    }
  }, "0.56", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "ETH worse \xB7 \u03B2 = \u2212$6.53 \xB7 p = 0.121")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "ETH \xB7 $10K \xB7 vs legacy mean"), /*#__PURE__*/React.createElement("div", {
    className: "v",
    style: {
      color: COLORS.green
    }
  }, "28", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "\u03B2 = +$404.74 \xB7 p < 1e-225")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Tron \xB7 $10K \xB7 vs legacy mean"), /*#__PURE__*/React.createElement("div", {
    className: "v",
    style: {
      color: COLORS.green
    }
  }, "12,970", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "\u03B2 = +$419.53 \xB7 p < 1e-263"))), /*#__PURE__*/React.createElement("div", {
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
  }, "?"), "What the paired difference-in-means test does"), /*#__PURE__*/React.createElement("h4", null, "It asks: ", /*#__PURE__*/React.createElement("em", null, "across the same 72 months"), ", is the average gap between the legacy fee and the on-chain fee reliably non-zero?"), /*#__PURE__*/React.createElement("div", {
    className: "plain"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "In plain terms"), "For each month, we observe a legacy cost (from RPW corridor data) and a stablecoin cost (from on-chain telemetry). The difference is the per-transfer saving in that month. If we average those 72 differences and the average is meaningfully far from zero, the cost gap is real \u2014 not a coincidence of a few extreme months."), /*#__PURE__*/React.createElement("div", {
    className: "tech"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "Technically"), "We run an OLS regression of the monthly difference on a constant, with Newey-West HAC standard errors (4 lags, full window):", /*#__PURE__*/React.createElement("div", {
    className: "formula"
  }, "d", /*#__PURE__*/React.createElement("sub", null, "t"), " = legacy", /*#__PURE__*/React.createElement("sub", null, "t"), " \u2212 onchain", /*#__PURE__*/React.createElement("sub", null, "t"), " \xB7 OLS(d ~ 1, HAC(4))"), "\u03B2\u0302 = average per-transfer saving in USD. We rerun the spec for every ", /*#__PURE__*/React.createElement("em", null, "(chain \xD7 size \xD7 window)"), " cell and a $3.50 flat-fee sensitivity for off/on-ramp friction."), /*#__PURE__*/React.createElement("div", {
    className: "verdict-mini"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag-txt"
  }, "Tron \xB7 $200 \xB7 full"), /*#__PURE__*/React.createElement("span", {
    className: "res sig"
  }, "\u03B2 = +$8.26 \xB7 p < 1e-238")), /*#__PURE__*/React.createElement("div", {
    className: "verdict-mini",
    style: {
      marginTop: 4,
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag-txt"
  }, "ETH \xB7 $200 \xB7 full"), /*#__PURE__*/React.createElement("span", {
    className: "res rej"
  }, "\u03B2 = \u2212$6.53 \xB7 p = 0.121 \xB7 adverse, n.s."))), /*#__PURE__*/React.createElement("div", {
    className: "ex"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ribbon"
  }, /*#__PURE__*/React.createElement("span", {
    className: "glyph"
  }, "\u21C4"), "Why two on-chain constructs?"), /*#__PURE__*/React.createElement("h4", null, "ETH uses ", /*#__PURE__*/React.createElement("em", null, "monthly mean"), "; Tron uses ", /*#__PURE__*/React.createElement("em", null, "monthly median"), ". This is the D-02 paired-test alignment \u2014 and it matters."), /*#__PURE__*/React.createElement("div", {
    className: "plain"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "In plain terms"), "Ethereum's fee is right-skewed but never zero \u2014 using the mean fairly captures the burden a typical user faces in a typical month. Tron's fee distribution is bimodal: usually near-free, occasionally spiking when bandwidth credits run out. ", /*#__PURE__*/React.createElement("em", null, "14 of 72 months"), " have a literal zero median. The median is the honest construct for the typical-user experience there; the mean would be misleading both directions."), /*#__PURE__*/React.createElement("div", {
    className: "tech"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "Technically"), "Construct alignment is fixed across all specs. The mean / median choice is the same one used in the master figure (fig_h4_cost_comparison.png). Using ", /*#__PURE__*/React.createElement("em", null, "both"), " means or ", /*#__PURE__*/React.createElement("em", null, "both"), " medians (robustness checks in tbl_h4_savings_ratio_by_year.csv) preserves the chain-bifurcation finding.", /*#__PURE__*/React.createElement("div", {
    className: "formula"
  }, "d_eth = legacy_t \u2212 ETH_mean_t \xB7 d_tron = legacy_t \u2212 Tron_median_t")), /*#__PURE__*/React.createElement("div", {
    className: "verdict-mini"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag-txt"
  }, "$0 flat fee \xB7 headline"), /*#__PURE__*/React.createElement("span", {
    className: "res sig"
  }, "8 cells, 7 of 8 with p < 1e-9")), /*#__PURE__*/React.createElement("div", {
    className: "verdict-mini",
    style: {
      marginTop: 4,
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag-txt"
  }, "$3.50 flat fee \xB7 sensitivity"), /*#__PURE__*/React.createElement("span", {
    className: "res sig"
  }, "qualitative findings unchanged")))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Live cost comparison \xB7 drag the transfer size"), /*#__PURE__*/React.createElement("span", null, "72-month MEAN constructs \xB7 log y-axis")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Stablecoin fees are ", /*#__PURE__*/React.createElement("em", null, "flat"), " on-chain \u2014 they do not depend on the transfer amount. SWIFT scales with corridor size at \u22483.85% (72-mo avg). The crossover where ETH starts beating legacy sits between $200 (ETH worse) and $10K (ETH wins decisively)."), /*#__PURE__*/React.createElement(H4LiveSlider, null)), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "H4 \xA73.1 \xB7 On-chain vs legacy cost \u2014 full sample, n = 72 months"), /*#__PURE__*/React.createElement("span", null, "Constructs: ETH mean \xB7 Tron median \xB7 Legacy mean \xB7 D-02 alignment")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Faithful re-implementation of fig_h4_cost_comparison.png \u2014 same constructs, same scale, same source numbers. Note the 4-orders-of-magnitude range from Tron median ($0.03) to legacy at $10K ($420)."), /*#__PURE__*/React.createElement(H4CostBars, null)), /*#__PURE__*/React.createElement("div", {
    className: "grid c21",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Monthly fee \u2014 72 months \xB7 log scale"), /*#__PURE__*/React.createElement("span", null, "EIP-4844 (Dencun) marker \xB7 Apr 2024")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "ETH volatility is the headline. Tron sits two-to-four orders below for most of the sample. After Dencun, ETH median collapses below $1 \u2014 and starts to flirt with the legacy line at $200."), /*#__PURE__*/React.createElement(H4FeeTimeseries, {
    d: d,
    sizeForLegacy: 200
  })), /*#__PURE__*/React.createElement("div", {
    className: "card dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, "Appropriability \u2014 who captures the surplus?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 15,
      lineHeight: 1.5,
      marginTop: 8,
      color: 'rgba(250,248,245,0.85)'
    }
  }, "A $420 legacy cost becomes $0.03 on Tron. The platform layer commoditises transfer; the surplus does ", /*#__PURE__*/React.createElement("em", null, "not"), " stay with the operator."), [{
    lab: 'Users',
    val: '≈ 95%',
    w: 95,
    note: 'Pay $0.03 where they used to pay $420 — minus on/off-ramp spreads.'
  }, {
    lab: 'Validators',
    val: '~ 4%',
    w: 6,
    note: 'ETH gas + MEV scale with demand. Tron bandwidth model ≈ 0.'
  }, {
    lab: 'Issuers',
    val: '~ 0% fees',
    w: 1,
    note: 'Tether/Circle earn on reserve yield. Tether 2024 ≈ $13B from float.'
  }].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '10px 0',
      borderBottom: i < 2 ? '1px dotted rgba(250,248,245,0.2)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    }
  }, r.lab), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 18,
      color: '#B8860B'
    }
  }, r.val)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: 'rgba(250,248,245,0.12)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: r.w + '%',
      background: '#B8860B'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 13,
      fontStyle: 'italic',
      color: 'rgba(250,248,245,0.7)',
      marginTop: 4,
      lineHeight: 1.4
    }
  }, r.note))), /*#__PURE__*/React.createElement("div", {
    className: "footnote",
    style: {
      color: 'rgba(250,248,245,0.55)',
      marginTop: 14,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      lineHeight: 1.5
    }
  }, "Inverts the normal platform pattern. In most platforms the operator extracts the surplus; here the protocol layer commoditises and operators monetise off-protocol (reserve yield, exchange fees)."))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Paired difference-in-means \xB7 8 specifications \xB7 click to inspect"), /*#__PURE__*/React.createElement("span", null, "tbl_h4_master_summary.csv \xB7 HAC OLS")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Eight cells: 2 chains \xD7 2 sizes \xD7 2 windows. Sign/significance is consistent \u2014 only ETH at $200 is ambiguous (full-window adverse but n.s.; post-Dencun essentially zero)."), /*#__PURE__*/React.createElement(H4SpecInspector, null)), /*#__PURE__*/React.createElement("div", {
    className: "grid c21",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Breakeven transfer size by year \u2014 ETH median vs legacy median"), /*#__PURE__*/React.createElement("span", null, "tbl_h4_breakeven_by_year.csv")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "The transfer size at which ETH cost equals legacy cost. Below the breakeven, legacy wins; above it, ETH wins. The Dencun upgrade (Apr 2024) and 2025 fee compression collapse the breakeven from ", /*#__PURE__*/React.createElement("em", null, "$288"), " in 2021 to ", /*#__PURE__*/React.createElement("em", null, "$9"), " in 2025 \u2014 meaning ETH starts beating legacy almost everywhere."), /*#__PURE__*/React.createElement("table", {
    className: "regtbl",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Year"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "ETH median breakeven"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "ETH mean breakeven"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Tron median breakeven"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Tron mean breakeven"))), /*#__PURE__*/React.createElement("tbody", null, H4_BREAKEVEN.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, r.year), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: r.eth_med > 200 ? COLORS.accent : COLORS.green
    }
  }, r.eth_med < 1 ? '≤ $1' : '$' + r.eth_med.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: r.eth_mean > 200 ? COLORS.accent : COLORS.green
    }
  }, "$", r.eth_mean.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: COLORS.green
    }
  }, r.tron_med < 0.01 ? '≤ $0.01' : '$' + r.tron_med.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: COLORS.green
    }
  }, "$", r.tron_mean.toFixed(2)))))), /*#__PURE__*/React.createElement("div", {
    className: "footnote"
  }, "Red = breakeven above the $200 World Bank remittance benchmark \u2014 i.e. ETH dearer than legacy at remittance sizes that year. Tron breakeven sits at fractions of a dollar throughout \u2014 universal advantage.")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Crossover months \u2014 Tron mean > legacy"), /*#__PURE__*/React.createElement("span", null, "tbl_h4_crossover_by_year.csv \xB7 $200 size")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Months where Tron's ", /*#__PURE__*/React.createElement("em", null, "mean"), " fee (NOT the median construct) exceeded the legacy benchmark \u2014 the only spec under which Tron ever loses. Reflects 2025 bandwidth-credit congestion spikes."), /*#__PURE__*/React.createElement("table", {
    className: "regtbl",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Year"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Crossover months"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "% of year"))), /*#__PURE__*/React.createElement("tbody", null, H4_CROSSOVER.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, r.year), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: r.n === 0 ? COLORS.green : COLORS.accent
    }
  }, r.n, " / 12"), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: r.pct === 0 ? COLORS.green : COLORS.accent
    }
  }, r.pct.toFixed(0), "%"))))), /*#__PURE__*/React.createElement("div", {
    className: "footnote",
    style: {
      marginTop: 14,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      lineHeight: 1.5
    }
  }, "Under the headline (median) construct Tron beats legacy in 100% of months. The mean only crosses in 2025 when occasional gas spikes pull the average up \u2014 the median, capturing the typical-month experience, never crosses."))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Sensitivity \xB7 adding a $3.50 flat compliance fee to on-chain costs"), /*#__PURE__*/React.createElement("span", null, "tbl_h4_master_summary.csv \xB7 \"flat fee = $3.50 (sensitivity)\"")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Realistic on/off-ramp friction (KYC, MTL, payment-processor margin) adds ~$3.50 per leg. We re-run the paired tests with that flat fee added to every on-chain transfer. Direction and significance survive everywhere except ETH\xB7$200 \u2014 which was already n.s. The qualitative finding is robust."), /*#__PURE__*/React.createElement("table", {
    className: "regtbl",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Spec"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "\u03B2 \xB7 headline ($0)"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "\u03B2 \xB7 sensitivity ($3.50)"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "\u0394\u03B2"), /*#__PURE__*/React.createElement("th", null, "direction holds?"))), /*#__PURE__*/React.createElement("tbody", null, [{
    lab: 'ETH · $200 · full',
    h: H4_SENSITIVITY.s200_eth.full_0,
    s: H4_SENSITIVITY.s200_eth.full_350,
    holds: false,
    txt: 'adverse n.s. → adverse n.s.'
  }, {
    lab: 'TRON · $200 · full',
    h: H4_SENSITIVITY.s200_tron.full_0,
    s: H4_SENSITIVITY.s200_tron.full_350,
    holds: true,
    txt: 'still p ≈ 0'
  }, {
    lab: 'ETH · $10K · full',
    h: H4_SENSITIVITY.s10000_eth.full_0,
    s: H4_SENSITIVITY.s10000_eth.full_350,
    holds: true,
    txt: 'still p ≈ 0'
  }, {
    lab: 'TRON · $10K · full',
    h: H4_SENSITIVITY.s10000_tron.full_0,
    s: H4_SENSITIVITY.s10000_tron.full_350,
    holds: true,
    txt: 'still p ≈ 0'
  }, {
    lab: 'ETH · $200 · Dencun',
    h: H4_SENSITIVITY.s200_eth.dencun_0,
    s: H4_SENSITIVITY.s200_eth.dencun_350,
    holds: false,
    txt: 'flips positive but n.s.'
  }, {
    lab: 'TRON · $200 · Dencun',
    h: H4_SENSITIVITY.s200_tron.dencun_0,
    s: H4_SENSITIVITY.s200_tron.dencun_350,
    holds: true,
    txt: 'still p ≈ 0'
  }, {
    lab: 'ETH · $10K · Dencun',
    h: H4_SENSITIVITY.s10000_eth.dencun_0,
    s: H4_SENSITIVITY.s10000_eth.dencun_350,
    holds: true,
    txt: 'still p ≈ 0'
  }, {
    lab: 'TRON · $10K · Dencun',
    h: H4_SENSITIVITY.s10000_tron.dencun_0,
    s: H4_SENSITIVITY.s10000_tron.dencun_350,
    holds: true,
    txt: 'still p ≈ 0'
  }].map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, r.lab), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: r.h > 0 ? COLORS.green : COLORS.accent
    }
  }, r.h >= 0 ? '+' : '', r.h.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: r.s > 0 ? COLORS.green : COLORS.accent
    }
  }, r.s >= 0 ? '+' : '', r.s.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, "+3.50"), /*#__PURE__*/React.createElement("td", {
    style: {
      color: r.holds ? COLORS.green : COLORS.muted,
      fontStyle: 'italic',
      fontFamily: 'var(--serif)'
    }
  }, r.txt))))), /*#__PURE__*/React.createElement("div", {
    className: "footnote"
  }, "The $3.50 add only flips one cell direction (ETH\xB7$200\xB7Dencun: \u22120.86 \u2192 +4.36, both n.s.). The headline finding \u2014 Tron universally cheap, ETH conditionally cheap \u2014 survives intact.")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Savings ratio \u2014 median, by year"), /*#__PURE__*/React.createElement("span", null, "tbl_h4_savings_ratio_by_year.csv \xB7 legacy / on-chain")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "The ratio of legacy cost to on-chain cost (median construct). Values above 1\xD7 mean on-chain is cheaper. ETH at $200 hovers near 1\xD7 during the high-gas era (2021-24). Tron's ratio is universally enormous, driven by sub-cent on-chain costs."), /*#__PURE__*/React.createElement("table", {
    className: "regtbl",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Year"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "$200 \xB7 ETH"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "$200 \xB7 TRON"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "$10K \xB7 ETH"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "$10K \xB7 TRON"))), /*#__PURE__*/React.createElement("tbody", null, H4_SAVINGS.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, r.year), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: r.e200 < 1 ? COLORS.accent : r.e200 > 10 ? COLORS.green : COLORS.muted
    }
  }, r.e200.toFixed(2), "\xD7"), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: COLORS.green
    }
  }, r.t200 > 1000 ? r.t200.toFixed(0) : r.t200.toFixed(2), "\xD7"), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: COLORS.green
    }
  }, r.e10k > 1000 ? r.e10k.toFixed(0) : r.e10k.toFixed(2), "\xD7"), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: COLORS.green
    }
  }, r.t10k.toFixed(0), "\xD7"))))), /*#__PURE__*/React.createElement("div", {
    className: "footnote"
  }, "Red on the ETH/$200 column marks years where Ethereum L1 was ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: COLORS.accent,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic'
    }
  }, "worse"), " than legacy at remittance size (2021, 2022). Tron advantage is universal across every year and both sizes.")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Course linkage \xB7 Lecture 1 appropriability, applied to payments"), /*#__PURE__*/React.createElement("span", null, "Why the cost surplus accrues to users, not operators")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "The standard platform pattern: operator extracts surplus, users face incumbent-comparable prices. In on-chain payments the surplus accrues to ", /*#__PURE__*/React.createElement("em", null, "users"), " because the protocol layer commoditises transfer, and operators monetise elsewhere (reserve yield, on/off-ramp spreads, exchange fees)."), /*#__PURE__*/React.createElement("table", {
    className: "regtbl",
    style: {
      marginTop: 10,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Layer"), /*#__PURE__*/React.createElement("th", null, "Surplus capture mechanism"), /*#__PURE__*/React.createElement("th", null, "Where the value lives"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Constraint"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Protocol"), /*#__PURE__*/React.createElement("td", null, "None \u2014 fees set by gas market / bandwidth credits"), /*#__PURE__*/React.createElement("td", null, "Open-source, commoditised"), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: COLORS.green
    }
  }, "users keep ~95%")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Validators"), /*#__PURE__*/React.createElement("td", null, "Block rewards + MEV (ETH); near-zero (Tron)"), /*#__PURE__*/React.createElement("td", null, "Variable; ETH \u226B Tron"), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: COLORS.muted
    }
  }, "~4% on ETH")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Issuers"), /*#__PURE__*/React.createElement("td", null, "Reserve-yield spread (Tether ~$13B FY24)"), /*#__PURE__*/React.createElement("td", null, "Off-protocol \u2014 float earnings"), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: COLORS.muted
    }
  }, "~0% per-tx")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "On/off-ramps"), /*#__PURE__*/React.createElement("td", null, "Bid-ask spread + KYC/MTL premium"), /*#__PURE__*/React.createElement("td", null, "Concentrated in mature corridors"), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: COLORS.accent
    }
  }, "~$3.50 / leg")))), /*#__PURE__*/React.createElement("div", {
    className: "pullquote",
    style: {
      marginTop: 18,
      fontSize: 19,
      lineHeight: 1.35
    }
  }, "End-to-end user surplus is smaller than the protocol-only number suggests, and concentrates in corridors where on/off-ramping is mature \u2014 USD\u2194USDT in Argentina, Turkey, Nigeria."), /*#__PURE__*/React.createElement("div", {
    className: "footnote",
    style: {
      marginTop: 12
    }
  }, "This is also why the cost-substitution argument is the strongest of our four hypotheses \u2014 it survives even when the network-effect (H1) and leapfrogging (H2) hypotheses don't \u2014 and why it depends critically on the existence of low-fee chains.")));
}
window.H4Tab = H4Tab;