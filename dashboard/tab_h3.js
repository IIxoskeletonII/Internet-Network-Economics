// H3 — Market concentration
// -----------------------------------------------------------------------------
// Faithful recreation of fig_h3_hhi_timeseries.png + fig_h3_trend_overlays.png.
// All regression coefficients from tbl_h3_master_summary.csv and the two OLS
// summary .txt files. Events from tbl_h3_structural_events.csv. Top-3 endpoints
// from tbl_h3_top3_stablecoins.csv.
// -----------------------------------------------------------------------------

const {
  useState: useStateH3,
  useMemo: useMemoH3
} = React;

// ---- Regression specs (tbl_h3_master_summary.csv) ----
const H3_SPECS = [{
  id: 'full',
  label: 'Full window · OLS levels · HHI (all)',
  window: '2020-01 → 2025-12',
  n: 72,
  beta: -14.2244,
  se: 11.9142,
  lo: -37.5759,
  hi: 9.1271,
  p: 0.2325,
  r2: 0.0774,
  hac: 4,
  headline: true,
  desc: 'Full-sample trend — Newey-West HAC(4). Directionally down, insignificant; monotonic winner-takes-all rejected.'
}, {
  id: 'postJun22',
  label: 'Post-Jun-2022 · HHI (all)',
  window: '2022-07 → 2025-12',
  n: 42,
  beta: 20.4089,
  se: 15.5904,
  lo: -10.1478,
  hi: 50.9656,
  p: 0.1905,
  r2: 0.1401,
  hac: 3,
  desc: 'Post-Terra sub-window. Positive slope consistent with re-concentration narrative, but not significant at 5%.'
}, {
  id: 'postDec22',
  label: 'Post-Dec-2022 · HHI (all)',
  window: '2023-01 → 2025-12',
  n: 36,
  beta: -7.0876,
  se: 14.8060,
  lo: -36.1069,
  hi: 21.9317,
  p: 0.6321,
  r2: 0.0244,
  hac: 3,
  desc: 'Post-FTX sub-window. Essentially flat — after the acute re-concentration phase, the market stabilises.'
}, {
  id: 'chow',
  label: 'Chow interaction (slope diff)',
  window: '2020-01 → 2025-12',
  n: 72,
  beta: 119.4193,
  se: 19.4048,
  lo: 81.3866,
  hi: 157.4520,
  p: 7.55e-10,
  r2: 0.7702,
  hac: 4,
  headline: true,
  isInteraction: true,
  desc: 'Interaction coef = post-period slope − pre-period slope. Rejects slope stability at any conventional level — the market flips from de-concentrating to re-concentrating.'
}, {
  id: 'top5',
  label: 'Top-5 HHI (robustness)',
  window: '2020-01 → 2025-12',
  n: 72,
  beta: -5.8656,
  se: 11.8751,
  lo: -29.1403,
  hi: 17.4092,
  p: 0.6213,
  r2: 0.0139,
  hac: 4,
  desc: 'Robustness DV using only the top-5 issuers. Same qualitative null — the full-sample trend is not sensitive to the long tail.'
}, {
  id: 'firstDiff',
  label: 'First-difference HHI (robustness)',
  window: '2020-02 → 2025-12',
  n: 71,
  beta: 1.2369,
  se: 1.9364,
  lo: -2.5584,
  hi: 5.0322,
  p: 0.5230,
  r2: 0.0140,
  hac: 4,
  desc: 'First-difference robustness after ADF rejects unit root at 1%. Δ-HHI trend indistinguishable from zero — no drift.'
}];

// ---- Structural events (tbl_h3_structural_events.csv) ----
const H3_EVENTS = [{
  key: 'terra',
  event: 'Terra/UST collapse',
  start: '2022-04',
  end: '2022-06',
  type: 'event-triggered',
  hhi0: 3357.9,
  hhi1: 2971.5,
  delta: -386.4,
  topStart: 'USDT 49.1%',
  topEnd: 'USDT 42.5%',
  movers: 'USDT −6.7pp · USTC +5.6pp · USDC +3.4pp',
  mechanism: 'Flight-to-quality: USDT→USDC (mild)'
}, {
  key: 'ftx',
  event: 'FTX Chapter 11',
  start: '2022-10',
  end: '2022-12',
  type: 'event-triggered',
  hhi0: 3306.1,
  hhi1: 3327.9,
  delta: 21.7,
  topStart: 'USDT 45.8%',
  topEnd: 'USDT 46.3%',
  movers: 'BUSD +1.7pp · USDC −1.1pp · DAI −0.6pp',
  mechanism: 'Indirect — exchange failure, no stablecoin peg broken'
}, {
  key: 'svb',
  event: 'SVB / USDC depeg',
  start: '2023-02',
  end: '2023-04',
  type: 'event-triggered',
  hhi0: 3544.7,
  hhi1: 4335.1,
  delta: 790.4,
  topStart: 'USDT 49.5%',
  topEnd: 'USDT 60.7%',
  movers: 'USDT +11.1pp · USDC −6.0pp · BUSD −6.0pp',
  mechanism: 'USDC reserves at SVB broke peg → flight into USDT'
}, {
  key: 'busd',
  event: 'BUSD wind-down',
  start: '2023-01',
  end: '2023-12',
  type: 'event-triggered',
  hhi0: 3507.3,
  hhi1: 5216.0,
  delta: 1708.7,
  topStart: 'USDT 48.2%',
  topEnd: 'USDT 69.6%',
  movers: 'USDT +21.5pp · USDC −13.5pp · BUSD −10.7pp',
  mechanism: 'Paxos/NYDFS forced supply drain → no substitution crisis, pure flight'
}, {
  key: 'scaleIn',
  event: 'FDUSD/PYUSD scale-in',
  start: '2023-06',
  end: '2024-06',
  type: 'scale-in window',
  hhi0: 4681.0,
  hhi1: 5242.1,
  delta: 561.1,
  topStart: 'USDT 64.5%',
  topEnd: 'USDT 69.5%',
  movers: 'USDT +5.0pp · BUSD −4.0pp · USDC −2.4pp',
  mechanism: 'Mid-tier new entrants emerge — partial fragmentation offset'
}];

// ---- Top-3 endpoints (tbl_h3_top3_stablecoins.csv) ----
const H3_TOP3 = {
  start: {
    month: 'Jan 2020',
    total: 3952167565,
    rows: [{
      sym: 'USDT',
      share: 0.7681,
      supply: 3198834654
    }, {
      sym: 'USDC',
      share: 0.1240,
      supply: 516597712
    }, {
      sym: 'USDP',
      share: 0.0537,
      supply: 223522710
    }]
  },
  end: {
    month: 'Dec 2025',
    total: 307076789530,
    rows: [{
      sym: 'USDT',
      share: 0.6029,
      supply: 185087508752
    }, {
      sym: 'USDC',
      share: 0.2480,
      supply: 76143879054
    }, {
      sym: 'USDe',
      share: 0.0234,
      supply: 7184225197
    }]
  }
};

// ---- Chart markers for the timeseries ----
const H3_MARKERS = [{
  date: '2022-05-10',
  label: 'Terra/UST depeg'
}, {
  date: '2022-11-11',
  label: 'FTX Ch.11'
}, {
  date: '2023-02-13',
  label: 'BUSD wind-down'
}, {
  date: '2023-03-10',
  label: 'SVB/USDC depeg'
}];

// -----------------------------------------------------------------------------
// Combined HHI + USDT share chart (mirrors fig_h3_hhi_timeseries.png)
// -----------------------------------------------------------------------------
function H3DualPanel({
  d
}) {
  const W = 1380,
    H = 560;
  const mL = 68,
    mR = 28,
    mT = 26,
    mB = 44;
  const gap = 28;
  const topH = 320,
    botH = 140;
  const w = W - mL - mR;
  const xs = d.map(r => new Date(r.date).getTime());
  const x0 = Math.min(...xs),
    x1 = Math.max(...xs);
  const sx = linScale([x0, x1], [0, w]);

  // HHI panel
  const hhiTop = mT;
  const hhiDomain = [2500, 7500];
  const syH = linScale(hhiDomain, [topH, 0]);
  const hhiTicks = [3000, 4000, 5000, 6000, 7000];
  const hhiPath = d.map((r, i) => (i === 0 ? 'M' : 'L') + sx(new Date(r.date).getTime()) + ',' + syH(r.hhi)).join(' ');

  // Share panel
  const shareTop = mT + topH + gap;
  const shareDomain = [0, 1];
  const syS = linScale(shareDomain, [botH, 0]);
  const shareTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  const sharePath = d.map((r, i) => (i === 0 ? 'M' : 'L') + sx(new Date(r.date).getTime()) + ',' + syS(r.share)).join(' ');

  // X-axis (year ticks)
  const yearTicks = [];
  for (let y = 2020; y <= 2026; y++) yearTicks.push({
    t: new Date(Date.UTC(y, 0, 1)).getTime(),
    label: String(y)
  });
  return /*#__PURE__*/React.createElement("svg", {
    className: "chart",
    viewBox: `0 0 ${W} ${H}`
  }, /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${hhiTop})`
  }, hhiTicks.map((t, i) => /*#__PURE__*/React.createElement("line", {
    key: 'hg' + i,
    x1: 0,
    x2: w,
    y1: syH(t),
    y2: syH(t),
    stroke: COLORS.line,
    strokeWidth: 0.5,
    opacity: 0.55
  })), H3_MARKERS.map((e, i) => {
    const ex = sx(new Date(e.date).getTime());
    return /*#__PURE__*/React.createElement("g", {
      key: 'em' + i
    }, /*#__PURE__*/React.createElement("line", {
      x1: ex,
      x2: ex,
      y1: 0,
      y2: topH,
      stroke: COLORS.muted,
      strokeWidth: 0.8,
      strokeDasharray: "4 3",
      opacity: 0.65
    }), /*#__PURE__*/React.createElement("text", {
      x: ex + 3,
      y: 12,
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 9.5,
        fill: COLORS.muted,
        letterSpacing: '0.02em'
      }
    }, e.label));
  }), /*#__PURE__*/React.createElement("path", {
    d: hhiPath,
    stroke: "#3178b3",
    strokeWidth: 1.9,
    fill: "none"
  }), (() => {
    // find trough and peak post-2022
    let trough = d[0],
      peak = d[0];
    d.forEach(r => {
      if (r.hhi < trough.hhi) trough = r;
      if (new Date(r.date) >= new Date('2023-01-01') && r.hhi > peak.hhi) peak = r;
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("g", {
      transform: `translate(${sx(new Date(trough.date).getTime())},${syH(trough.hhi)})`
    }, /*#__PURE__*/React.createElement("circle", {
      r: 4,
      fill: COLORS.accent
    }), /*#__PURE__*/React.createElement("text", {
      x: 8,
      y: -4,
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 10.5,
        fill: COLORS.accent
      }
    }, "trough ", Math.round(trough.hhi), " \xB7 ", trough.date.slice(0, 7))), /*#__PURE__*/React.createElement("g", {
      transform: `translate(${sx(new Date(peak.date).getTime())},${syH(peak.hhi)})`
    }, /*#__PURE__*/React.createElement("circle", {
      r: 4,
      fill: COLORS.green
    }), /*#__PURE__*/React.createElement("text", {
      x: -8,
      y: -8,
      textAnchor: "end",
      style: {
        fontFamily: 'JetBrains Mono',
        fontSize: 10.5,
        fill: COLORS.green
      }
    }, "post-FTX peak ", Math.round(peak.hhi), " \xB7 ", peak.date.slice(0, 7))));
  })(), /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: topH,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), hhiTicks.map((t, i) => /*#__PURE__*/React.createElement("g", {
    key: 'ht' + i,
    transform: `translate(0,${syH(t)})`
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
  }, t.toLocaleString()))), /*#__PURE__*/React.createElement("text", {
    transform: `rotate(-90) translate(${-topH / 2},-48)`,
    textAnchor: "middle",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 11,
      fill: COLORS.ink
    }
  }, "HHI (index points, 0\u201310,000 scale)"), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${w - 220},6)`
  }, /*#__PURE__*/React.createElement("rect", {
    x: 0,
    y: 0,
    width: 220,
    height: 20,
    fill: COLORS.paper,
    stroke: COLORS.line,
    strokeWidth: 0.6
  }), /*#__PURE__*/React.createElement("line", {
    x1: 8,
    x2: 26,
    y1: 10,
    y2: 10,
    stroke: "#3178b3",
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("text", {
    x: 32,
    y: 13.5,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, "HHI (all stablecoins)"))), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${shareTop})`
  }, shareTicks.map((t, i) => /*#__PURE__*/React.createElement("line", {
    key: 'sg' + i,
    x1: 0,
    x2: w,
    y1: syS(t),
    y2: syS(t),
    stroke: COLORS.line,
    strokeWidth: 0.5,
    opacity: 0.55
  })), H3_MARKERS.map((e, i) => {
    const ex = sx(new Date(e.date).getTime());
    return /*#__PURE__*/React.createElement("line", {
      key: 'em2' + i,
      x1: ex,
      x2: ex,
      y1: 0,
      y2: botH,
      stroke: COLORS.muted,
      strokeWidth: 0.8,
      strokeDasharray: "4 3",
      opacity: 0.65
    });
  }), /*#__PURE__*/React.createElement("path", {
    d: sharePath,
    stroke: "#d97f2e",
    strokeWidth: 1.9,
    fill: "none"
  }), /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: botH,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), shareTicks.map((t, i) => /*#__PURE__*/React.createElement("g", {
    key: 'st' + i,
    transform: `translate(0,${syS(t)})`
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
  }, t.toFixed(1)))), /*#__PURE__*/React.createElement("text", {
    transform: `rotate(-90) translate(${-botH / 2},-48)`,
    textAnchor: "middle",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 11,
      fill: COLORS.ink
    }
  }, "Share of total supply"), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${w - 240},6)`
  }, /*#__PURE__*/React.createElement("rect", {
    x: 0,
    y: 0,
    width: 240,
    height: 20,
    fill: COLORS.paper,
    stroke: COLORS.line,
    strokeWidth: 0.6
  }), /*#__PURE__*/React.createElement("line", {
    x1: 8,
    x2: 26,
    y1: 10,
    y2: 10,
    stroke: "#d97f2e",
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("text", {
    x: 32,
    y: 13.5,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, "Top stablecoin share (USDT)"))), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${shareTop + botH})`
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
  }, t.label))), /*#__PURE__*/React.createElement("text", {
    x: w / 2,
    y: 38,
    textAnchor: "middle",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 11,
      fill: COLORS.ink,
      letterSpacing: '0.04em'
    }
  }, "Date")));
}

// -----------------------------------------------------------------------------
// Trend-overlay chart (mirrors fig_h3_trend_overlays.png)
// -----------------------------------------------------------------------------
function H3TrendOverlay({
  d
}) {
  const W = 1380,
    H = 440;
  const mL = 68,
    mR = 28,
    mT = 30,
    mB = 62;
  const w = W - mL - mR,
    h = H - mT - mB;
  const xs = d.map(r => new Date(r.date).getTime());
  const x0 = Math.min(...xs),
    x1 = Math.max(...xs);
  const sx = linScale([x0, x1], [0, w]);
  const yDomain = [2500, 7500];
  const sy = linScale(yDomain, [h, 0]);
  const yTicks = [3000, 4000, 5000, 6000, 7000];

  // HHI path
  const hhiPath = d.map((r, i) => (i === 0 ? 'M' : 'L') + sx(new Date(r.date).getTime()) + ',' + sy(r.hhi)).join(' ');

  // Helper: given a β in HHI-units-per-month and a window, fit mean-anchored line over that window
  const fitLine = (specBeta, startDate, endDate) => {
    const sub = d.filter(r => {
      const t = new Date(r.date).getTime();
      return t >= new Date(startDate).getTime() && t <= new Date(endDate).getTime();
    });
    if (sub.length === 0) return null;
    const meanY = sub.reduce((a, b) => a + b.hhi, 0) / sub.length;
    // months-from-start basis x (0..n-1) → use month index relative to startDate
    const startMs = new Date(startDate).getTime();
    const monthsFrom = ms => {
      const a = new Date(startMs),
        b = new Date(ms);
      return (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
    };
    const meanM = sub.reduce((a, b) => a + monthsFrom(new Date(b.date).getTime()), 0) / sub.length;
    const intercept = meanY - specBeta * meanM;
    const y0 = intercept + specBeta * monthsFrom(new Date(startDate).getTime());
    const y1 = intercept + specBeta * monthsFrom(new Date(endDate).getTime());
    return {
      x0: sx(new Date(startDate).getTime()),
      y0: sy(y0),
      x1: sx(new Date(endDate).getTime()),
      y1: sy(y1)
    };
  };
  const fullLine = fitLine(-14.2244, '2020-01-01', '2025-12-01');
  const postDec22Line = fitLine(-7.0876, '2023-01-01', '2025-12-01');
  const postJun22Line = fitLine(20.4089, '2022-07-01', '2025-12-01');
  const breakX = sx(new Date('2023-01-01').getTime());
  return /*#__PURE__*/React.createElement("svg", {
    className: "chart",
    viewBox: `0 0 ${W} ${H}`
  }, /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${mT})`
  }, yTicks.map((t, i) => /*#__PURE__*/React.createElement("line", {
    key: 'gh' + i,
    x1: 0,
    x2: w,
    y1: sy(t),
    y2: sy(t),
    stroke: COLORS.line,
    strokeWidth: 0.5,
    opacity: 0.55
  })), /*#__PURE__*/React.createElement("line", {
    x1: breakX,
    x2: breakX,
    y1: 0,
    y2: h,
    stroke: COLORS.muted,
    strokeWidth: 0.9,
    strokeDasharray: "3 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: breakX + 6,
    y: 16,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.muted
    }
  }, "Dec 2022 break"), /*#__PURE__*/React.createElement("path", {
    d: hhiPath,
    stroke: "#b8bcc2",
    strokeWidth: 1.6,
    fill: "none"
  }), fullLine && /*#__PURE__*/React.createElement("line", {
    x1: fullLine.x0,
    y1: fullLine.y0,
    x2: fullLine.x1,
    y2: fullLine.y1,
    stroke: "#3178b3",
    strokeWidth: 2.2
  }), postDec22Line && /*#__PURE__*/React.createElement("line", {
    x1: postDec22Line.x0,
    y1: postDec22Line.y0,
    x2: postDec22Line.x1,
    y2: postDec22Line.y1,
    stroke: "#d97f2e",
    strokeWidth: 2.2
  }), postJun22Line && /*#__PURE__*/React.createElement("line", {
    x1: postJun22Line.x0,
    y1: postJun22Line.y0,
    x2: postJun22Line.x1,
    y2: postJun22Line.y1,
    stroke: "#3c7d58",
    strokeWidth: 2.0,
    strokeDasharray: "7 5"
  }), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${w - 520},6)`
  }, /*#__PURE__*/React.createElement("rect", {
    x: 0,
    y: 0,
    width: 520,
    height: 74,
    fill: COLORS.paper,
    stroke: COLORS.line,
    strokeWidth: 0.6
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(12,18)"
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: 22,
    y1: 0,
    y2: 0,
    stroke: "#b8bcc2",
    strokeWidth: 1.6
  }), /*#__PURE__*/React.createElement("text", {
    x: 30,
    y: 3.5,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, "HHI (all stablecoins)")), /*#__PURE__*/React.createElement("g", {
    transform: "translate(12,35)"
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: 22,
    y1: 0,
    y2: 0,
    stroke: "#3178b3",
    strokeWidth: 2.2
  }), /*#__PURE__*/React.createElement("text", {
    x: 30,
    y: 3.5,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, "Full window (n=72): \u03B2 = \u221214.22/mo, p = 0.233")), /*#__PURE__*/React.createElement("g", {
    transform: "translate(12,52)"
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: 22,
    y1: 0,
    y2: 0,
    stroke: "#d97f2e",
    strokeWidth: 2.2
  }), /*#__PURE__*/React.createElement("text", {
    x: 30,
    y: 3.5,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, "Post-Dec-2022 (n=36): \u03B2 = \u22127.09/mo, p = 0.632")), /*#__PURE__*/React.createElement("g", {
    transform: "translate(12,69)"
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: 22,
    y1: 0,
    y2: 0,
    stroke: "#3c7d58",
    strokeWidth: 2.0,
    strokeDasharray: "7 5"
  }), /*#__PURE__*/React.createElement("text", {
    x: 30,
    y: 3.5,
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      fill: COLORS.ink
    }
  }, "Post-Jun-2022 (n=42): \u03B2 = +20.41/mo, p = 0.191")))), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${mL},${mT + h})`
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    x2: w,
    y1: 0,
    y2: 0,
    stroke: COLORS.ink,
    strokeWidth: 0.8
  }), [2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y, i) => {
    const t = new Date(Date.UTC(y, 0, 1)).getTime();
    if (t < x0 - 31 * 86400000 || t > x1 + 40 * 86400000) return null;
    return /*#__PURE__*/React.createElement("g", {
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
        fontSize: 10.5,
        fill: COLORS.ink
      }
    }, y));
  }), /*#__PURE__*/React.createElement("text", {
    x: w / 2,
    y: 36,
    textAnchor: "middle",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 11,
      fill: COLORS.ink
    }
  }, "Date"), /*#__PURE__*/React.createElement("text", {
    x: w / 2,
    y: 54,
    textAnchor: "middle",
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 11.5,
      fill: COLORS.muted
    }
  }, "Chow interaction test (full sample, n=72): \u03B2_interaction = +119.42, p < 0.0001. Slope reversal confirmed.")), /*#__PURE__*/React.createElement("g", {
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
  }, t.toLocaleString()))), /*#__PURE__*/React.createElement("text", {
    transform: `rotate(-90) translate(${-h / 2},-48)`,
    textAnchor: "middle",
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 11,
      fill: COLORS.ink
    }
  }, "HHI (index points)")));
}

// -----------------------------------------------------------------------------
// Main tab
// -----------------------------------------------------------------------------
function H3Tab() {
  const [specSel, setSpecSel] = useStateH3('full');
  const d = window.DATA.h3;

  // Sanity metrics from data
  const stats = useMemoH3(() => {
    if (!d || d.length === 0) return {};
    const hhiFirst = d[0].hhi,
      hhiLast = d[d.length - 1].hhi;
    let peak = d[0],
      trough = d[0],
      postPeak = d[0];
    d.forEach(r => {
      if (r.hhi > peak.hhi) peak = r;
      if (r.hhi < trough.hhi) trough = r;
      if (new Date(r.date) >= new Date('2023-01-01') && r.hhi > postPeak.hhi) postPeak = r;
    });
    const shareFirst = d[0].share,
      shareLast = d[d.length - 1].share;
    let shareMin = d[0];
    d.forEach(r => {
      if (r.share < shareMin.share) shareMin = r;
    });
    return {
      hhiFirst,
      hhiLast,
      peak,
      trough,
      postPeak,
      shareFirst,
      shareLast,
      shareMin
    };
  }, [d]);
  const spec = H3_SPECS.find(s => s.id === specSel);
  const usd = v => '$' + (v / 1e9).toFixed(2) + 'B';
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hnum"
  }, "H3"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "The market is ", /*#__PURE__*/React.createElement("em", null, "plural"), ", not monopolistic \u2014 HHI responds to shocks, not to network gravity."), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Winner-takes-all predicts monotonic HHI rise. We observe a U-shape: de-concentration 2021 \u2192 mid-2022, event-driven re-concentration through 2023, partial reversal in 2024-25. The full-sample trend is directionally ", /*#__PURE__*/React.createElement("em", null, "down"), ", and statistically insignificant.")), /*#__PURE__*/React.createElement("div", {
    className: "verdict"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Verdict"), /*#__PURE__*/React.createElement("div", {
    className: "val green"
  }, "Plural market"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 14,
      color: COLORS.muted,
      marginTop: 6,
      lineHeight: 1.3
    }
  }, "Winner-takes-all ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: COLORS.accent
    }
  }, "rejected"), "."), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, "Conditional dynamics"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "HHI 2020-01 \u2192 2025-12"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, Math.round(stats.hhiFirst), " ", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "\u2192"), " ", Math.round(stats.hhiLast)), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "peak ", Math.round(stats.peak.hhi), " \xB7 trough ", Math.round(stats.trough.hhi))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Full-window \u03B2 (HAC-4)"), /*#__PURE__*/React.createElement("div", {
    className: "v",
    style: {
      color: COLORS.muted
    }
  }, "\u221214.22", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "/mo")), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "p = 0.233 \xB7 insignificant")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Chow slope reversal"), /*#__PURE__*/React.createElement("div", {
    className: "v sig",
    style: {
      color: COLORS.green
    }
  }, "+119.4"), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "p = 7.5e-10 \xB7 slope flip confirmed")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "USDT share \u2014 2020 / trough / now"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, (stats.shareFirst * 100).toFixed(0), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "%"), " \u2192 ", (stats.shareMin.share * 100).toFixed(0), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "%"), " \u2192 ", (stats.shareLast * 100).toFixed(0), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "%")), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, stats.shareMin.date.slice(0, 7), " trough \xB7 still plural today"))), /*#__PURE__*/React.createElement("div", {
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
  }, "?"), "What winner-takes-all would look like"), /*#__PURE__*/React.createElement("h4", null, "The pre-registered hypothesis predicts a ", /*#__PURE__*/React.createElement("em", null, "monotonically rising"), " HHI trend as network effects compound the leader."), /*#__PURE__*/React.createElement("div", {
    className: "plain"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "In plain terms"), "If stablecoins were a social-network\u2013style platform, the leader would accrete share steadily: liquidity begets liquidity, integrations beget integrations. HHI should rise over time and USDT's share should march toward 100%. We observe the opposite trajectory for most of the sample."), /*#__PURE__*/React.createElement("div", {
    className: "tech"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "Technically"), "Newey-West OLS on monthly HHI with HAC(4) SEs:", /*#__PURE__*/React.createElement("div", {
    className: "formula"
  }, "HHI", /*#__PURE__*/React.createElement("sub", null, "t"), " = \u03B1 + \u03B2\xB7t + \u03B5", /*#__PURE__*/React.createElement("sub", null, "t"), " \xB7 \u03B2 = \u221214.22 (p = 0.233)"), "Full-sample trend is directionally ", /*#__PURE__*/React.createElement("em", null, "down"), ", R\xB2 = 0.077. Null not rejected \u2014 and sign is wrong even so."), /*#__PURE__*/React.createElement("div", {
    className: "verdict-mini"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag-txt"
  }, "H\u2080: \u03B2 \u2264 0 (no monotonic rise)"), /*#__PURE__*/React.createElement("span", {
    className: "res nul"
  }, "not rejected \xB7 p = 0.233"))), /*#__PURE__*/React.createElement("div", {
    className: "ex"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ribbon"
  }, /*#__PURE__*/React.createElement("span", {
    className: "glyph"
  }, "!"), "What we actually see"), /*#__PURE__*/React.createElement("h4", null, "A slope reversal, not a trend. Chow interaction: \u03B2", /*#__PURE__*/React.createElement("sub", null, "diff"), " = ", /*#__PURE__*/React.createElement("em", null, "+119.4"), " (p = 7.5e-10)."), /*#__PURE__*/React.createElement("div", {
    className: "plain"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "In plain terms"), "HHI falls through 2021 on USDC's regulated-compliance rise, troughs at 2,943 in May 2022 during the Terra/UST collapse, then climbs sharply through 2023 as a cascade of trust shocks (FTX, BUSD wind-down, SVB/USDC depeg) drives a flight to USDT. After the acute phase, the series stabilises \u2014 and USDT's share has since drifted back from 70% toward 60%."), /*#__PURE__*/React.createElement("div", {
    className: "tech"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "Technically"), "Chow test with a Dec-2022 break:", /*#__PURE__*/React.createElement("div", {
    className: "formula"
  }, "\u03B2", /*#__PURE__*/React.createElement("sub", null, "post"), " \u2212 \u03B2", /*#__PURE__*/React.createElement("sub", null, "pre"), " = +119.42 \xB7 z = 6.15 \xB7 p = 7.5e-10"), "Pre-break slope \u2212126.5/mo, post-break slope \u22127.1/mo. The market is piecewise, not trending."), /*#__PURE__*/React.createElement("div", {
    className: "verdict-mini"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag-txt"
  }, "slope stability"), /*#__PURE__*/React.createElement("span", {
    className: "res rej"
  }, "rejected \xB7 event-driven regime")))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "H3 \xB7 HHI (all stablecoins) & top-stablecoin share \u2014 monthly, 2020\u20132025"), /*#__PURE__*/React.createElement("span", null, "n = 72 months \xB7 DefiLlama supply")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Dashed lines: UST depeg (May 2022), FTX Ch.11 (Nov 2022), BUSD wind-down trigger (Feb 2023), SVB/USDC depeg (Mar 2023). HHI computed across all tracked stablecoins (one grain per issuer, not per symbol)."), /*#__PURE__*/React.createElement(H3DualPanel, {
    d: d
  })), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "H3 \xB7 HHI with fitted OLS trends \u2014 full window vs. sub-windows"), /*#__PURE__*/React.createElement("span", null, "Newey-West HAC SEs")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Three fits: the full-window OLS (negative slope, insignificant), the post-Dec-2022 sub-window (essentially flat), and the post-Jun-2022 robustness split (positive slope, insignificant). The Chow interaction on the full sample confirms slope reversal at Dec 2022."), /*#__PURE__*/React.createElement(H3TrendOverlay, {
    d: d
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid c12",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Regression specifications \xB7 click to inspect"), /*#__PURE__*/React.createElement("span", null, "coefficients from tbl_h3_master_summary.csv")), /*#__PURE__*/React.createElement("div", {
    className: "pill-row",
    style: {
      marginTop: 12,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, H3_SPECS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: `pill ${specSel === s.id ? 'active' : ''}`,
    onClick: () => setSpecSel(s.id),
    style: {
      padding: '6px 10px',
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      letterSpacing: '0.04em'
    }
  }, s.id === 'full' ? 'FULL' : s.id === 'postJun22' ? 'POST-JUN-22' : s.id === 'postDec22' ? 'POST-DEC-22' : s.id === 'chow' ? 'CHOW' : s.id === 'top5' ? 'TOP-5 HHI' : 'Δ-HHI'))), /*#__PURE__*/React.createElement("div", {
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
  }, spec.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 11,
      color: COLORS.muted,
      marginTop: 6,
      letterSpacing: '0.04em'
    }
  }, "window \xB7 ", spec.window, " \xB7 n = ", spec.n, " \xB7 HAC(", spec.hac, ")"), /*#__PURE__*/React.createElement("div", {
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
  }, spec.isInteraction ? 'β (interaction)' : 'β (slope, pts / month)'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 44,
      letterSpacing: '-0.02em',
      lineHeight: 1,
      color: spec.p < 0.05 ? spec.beta > 0 ? COLORS.green : COLORS.accent : COLORS.ink
    }
  }, spec.beta >= 0 ? '+' : '', spec.beta.toFixed(3)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 11,
      color: COLORS.muted,
      marginTop: 4,
      letterSpacing: '0.04em'
    }
  }, "SE = ", spec.se.toFixed(3), " \xB7 95% CI [", spec.lo.toFixed(2), ", ", spec.hi.toFixed(2), "]")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "p-value"), /*#__PURE__*/React.createElement("span", {
    className: `v ${spec.p < 0.05 ? 'sig' : 'nul'}`
  }, fmtP(spec.p), " ", spec.p < 0.05 ? '(reject H₀)' : '(fail to reject)')), /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "R\xB2"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, spec.r2.toFixed(3))), /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "n"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, spec.n)), /*#__PURE__*/React.createElement("div", {
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "HAC lags"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, spec.hac)))), /*#__PURE__*/React.createElement("div", {
    className: "footnote",
    style: {
      marginTop: 14,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      lineHeight: 1.5
    }
  }, spec.desc))), /*#__PURE__*/React.createElement("div", {
    className: "card dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, "Structural events ledger"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 14,
      color: 'rgba(246,243,236,0.72)',
      marginTop: 6,
      marginBottom: 12,
      lineHeight: 1.45
    }
  }, "Re-concentration through 2023 was trust-shock-driven, not organic network reinforcement."), H3_EVENTS.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '10px 0',
      borderBottom: i === H3_EVENTS.length - 1 ? 'none' : '1px dotted rgba(246,243,236,0.2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 8,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 14.5,
      color: '#fff'
    }
  }, e.event), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10.5,
      color: e.delta > 0 ? '#e89a4d' : '#8cc7b0',
      whiteSpace: 'nowrap'
    }
  }, "\u0394HHI ", e.delta >= 0 ? '+' : '', Math.round(e.delta))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10,
      color: 'rgba(246,243,236,0.55)',
      marginTop: 3,
      letterSpacing: '0.04em'
    }
  }, e.start, " \u2192 ", e.end, " \xB7 ", e.topStart, " \u2192 ", e.topEnd), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10,
      color: 'rgba(246,243,236,0.62)',
      marginTop: 4,
      lineHeight: 1.5
    }
  }, e.movers), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 12,
      color: 'rgba(246,243,236,0.72)',
      marginTop: 4,
      lineHeight: 1.4
    }
  }, e.mechanism))))), /*#__PURE__*/React.createElement("div", {
    className: "grid c21",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Why plural, not monopolistic \u2014 course linkage"), /*#__PURE__*/React.createElement("span", null, "Eisenmann-Parker-Van Alstyne (2006)")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Winner-takes-all in platform markets requires three conditions. Stablecoins satisfy ", /*#__PURE__*/React.createElement("em", null, "none"), " of them cleanly."), /*#__PURE__*/React.createElement("table", {
    className: "regtbl",
    style: {
      marginTop: 10,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Condition"), /*#__PURE__*/React.createElement("th", null, "Required for WTA"), /*#__PURE__*/React.createElement("th", null, "Observed in stablecoins"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Assessment"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Same-side network effects"), /*#__PURE__*/React.createElement("td", null, "Strong (Metcalfe-like)"), /*#__PURE__*/React.createElement("td", null, "Weak \u2014 H1 finds \u03B2 \u2248 1, not 2"), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: COLORS.accent
    }
  }, "not satisfied")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Multi-homing costs"), /*#__PURE__*/React.createElement("td", null, "High (lock-in)"), /*#__PURE__*/React.createElement("td", null, "Near-zero \u2014 wallets, exchanges, DeFi all accept multiple"), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: COLORS.accent
    }
  }, "not satisfied")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Horizontal differentiation"), /*#__PURE__*/React.createElement("td", null, "Limited (commodity)"), /*#__PURE__*/React.createElement("td", null, "Real \u2014 USDC = compliance, USDT = EM/liquidity, DAI = decentralised"), /*#__PURE__*/React.createElement("td", {
    className: "num",
    style: {
      color: COLORS.accent
    }
  }, "not satisfied")))), /*#__PURE__*/React.createElement("div", {
    className: "pullquote",
    style: {
      marginTop: 18,
      fontSize: 19,
      lineHeight: 1.35
    }
  }, "The correct theoretical analogue is oligopolistic competition with episodic shocks \u2014 closer to the wireless-carrier model than to the social-network model."), /*#__PURE__*/React.createElement("div", {
    className: "footnote",
    style: {
      marginTop: 12,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      lineHeight: 1.5
    }
  }, "For the SWIFT-substitution question this is ironically favourable: a plural stablecoin market preserves competitive pressure on fees and interoperability standards that a monopoly would erode.")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, /*#__PURE__*/React.createElement("span", null, "Top-3 issuers \xB7 endpoint composition"), /*#__PURE__*/React.createElement("span", null, "tbl_h3_top3_stablecoins.csv")), /*#__PURE__*/React.createElement("div", {
    className: "csub"
  }, "Supply grew ~78\xD7; USDT's share fell 77 \u2192 60%."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      marginTop: 12
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
  }, H3_TOP3.start.month), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 18,
      marginBottom: 4
    }
  }, "total supply"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 13,
      color: COLORS.muted,
      marginBottom: 10
    }
  }, usd(H3_TOP3.start.total)), H3_TOP3.start.rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, r.sym), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, (r.share * 100).toFixed(2), "% ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.muted,
      fontWeight: 'normal',
      fontSize: 10
    }
  }, "\xB7 ", usd(r.supply)))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: COLORS.muted,
      marginBottom: 6
    }
  }, H3_TOP3.end.month), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 18,
      marginBottom: 4
    }
  }, "total supply"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 13,
      color: COLORS.muted,
      marginBottom: 10
    }
  }, usd(H3_TOP3.end.total), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.green
    }
  }, "\xB7 ~", Math.round(H3_TOP3.end.total / H3_TOP3.start.total), "\xD7 growth")), H3_TOP3.end.rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, r.sym), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, (r.share * 100).toFixed(2), "% ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.muted,
      fontWeight: 'normal',
      fontSize: 10
    }
  }, "\xB7 ", usd(r.supply))))))), /*#__PURE__*/React.createElement("div", {
    className: "footnote",
    style: {
      marginTop: 16,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      lineHeight: 1.5
    }
  }, "USDP's place in the top-3 was taken by USDe \u2014 a yield-bearing synthetic dollar that did not exist in 2020. New entrants continue to appear and scale, which is itself evidence against winner-takes-all."))));
}
window.H3Tab = H3Tab;