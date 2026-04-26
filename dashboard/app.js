// Synthesis + Answer
function SynthesisTab() {
  const cards = [{
    n: 'H1',
    t: 'Network effects',
    v: 'Payment rail',
    vClass: 'green',
    p: 'β ≈ 1, not 2. Metcalfe rejected at p<1e-40 across all 8 specs. Stablecoins scale like Visa or ACH — linearly with transaction-issuing users — not like social networks.'
  }, {
    n: 'H2',
    t: 'Leapfrogging',
    v: 'Null · sign-opposite',
    vClass: 'ochre',
    p: '0 of 5 pre-registered signs landed with p<0.05. Adoption correlates with banking depth, not its absence. Complement, not substitute.'
  }, {
    n: 'H3',
    t: 'Concentration',
    v: 'Plural market',
    vClass: 'green',
    p: 'Winner-takes-all rejected. HHI trajectory is U-shaped and event-driven; Chow interaction +119.4 (p<1e-9) confirms slope reversal.'
  }, {
    n: 'H4',
    t: 'Cost friction',
    v: 'Chain-bifurcated',
    vClass: 'green',
    p: 'Tron beats SWIFT universally (259× at $200). Ethereum L1 does NOT beat legacy at remittance sizes (0.56× at $200; β n.s.) but saves ~$405/tx at $10K. Post-Dencun the ETH·$200 gap collapses to zero.'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hnum",
    style: {
      fontSize: 72
    }
  }, "\u03A3"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Can stablecoins replace SWIFT?"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Four hypotheses, four calibrated answers, one framing. The defensible claim is narrower \u2014 and more interesting \u2014 than the slogan.")), /*#__PURE__*/React.createElement("div", {
    className: "verdict"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Overall verdict"), /*#__PURE__*/React.createElement("div", {
    className: "val ochre",
    style: {
      fontSize: 22
    }
  }, "Qualified yes"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 14,
      color: COLORS.muted,
      marginTop: 6,
      lineHeight: 1.3
    }
  }, "Conditional on chain, corridor, and use case."))), /*#__PURE__*/React.createElement("div", {
    className: "answer-hero",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kicker"
  }, "The overarching answer"), /*#__PURE__*/React.createElement("h2", null, "Stablecoins are not replacing SWIFT \u2014 they are building a ", /*#__PURE__*/React.createElement("em", null, "parallel rail"), " alongside it, and that rail is already thick enough in specific corridors to matter."), /*#__PURE__*/React.createElement("p", {
    className: "drop"
  }, "H1 and H4 make the technical case: linear network scaling is the right shape for payment infrastructure, and the cost advantage \u2014 ", /*#__PURE__*/React.createElement("em", null, "on low-fee chains, or at large transfer sizes"), " \u2014 runs two to four orders of magnitude. The cost story is chain-bifurcated: Tron beats SWIFT universally, but Ethereum L1 only wins above \u2248$200 in the high-gas era (closing to \u2248$0 post-Dencun). H2 and H3 tighten the thesis in opposite directions. The \"banking-the-unbanked\" story is not what is happening empirically; adoption sits with dollar-demanding middle-income economies, not the unbanked world. And the market is plural rather than monopolistic \u2014 ironically favourable for SWIFT-substitution because it preserves competitive pressure on fees and standards, but meaning no single stablecoin has SWIFT's universal messaging reach.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle",
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: COLORS.muted,
      marginBottom: 12
    }
  }, "Four-panel scorecard"), /*#__PURE__*/React.createElement("div", {
    className: "scorecard"
  }, cards.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hnum"
  }, c.n), /*#__PURE__*/React.createElement("h3", null, c.t), /*#__PURE__*/React.createElement("span", {
    className: `verdict ${c.vClass}`
  }, c.v), /*#__PURE__*/React.createElement("p", null, c.p))))), /*#__PURE__*/React.createElement("div", {
    className: "grid c21",
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, "Where stablecoins actually substitute for SWIFT"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, [{
    k: 'Mid-size transfers in EM currencies',
    v: 'Tron/USDT dominant'
  }, {
    k: 'Institutional USD liquidity management',
    v: 'USDC preferred'
  }, {
    k: 'Capital-controlled / inflationary economies',
    v: 'Argentina, Turkey, Nigeria'
  }, {
    k: 'Global trade finance',
    v: 'Not yet — compliance gap',
    red: true
  }, {
    k: 'Interbank settlement',
    v: 'Not yet — messaging gap',
    red: true
  }].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "stat-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, r.k), /*#__PURE__*/React.createElement("span", {
    className: "v",
    style: {
      color: r.red ? COLORS.accent : COLORS.green
    }
  }, r.v))))), /*#__PURE__*/React.createElement("div", {
    className: "card dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, "The honest reframing"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 18,
      fontStyle: 'italic',
      lineHeight: 1.4,
      marginTop: 10,
      color: 'rgba(250,248,245,0.92)'
    }
  }, "Stablecoins are a ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: '#B8860B'
    }
  }, "complementary"), " asset layer riding on existing financial plumbing \u2014 exchanges, custodians, payment processors, developer ecosystems \u2014 which are themselves correlated with banking depth."), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(250,248,245,0.2)',
      marginTop: 18,
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'rgba(250,248,245,0.55)',
      marginBottom: 6
    }
  }, "Policy read"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 15,
      color: 'rgba(250,248,245,0.8)',
      lineHeight: 1.45
    }
  }, "Regulatory focus should shift from where theory predicted adoption (low-income, unbanked) to where it actually lives (middle-income, dollar-demanding, macro-unstable).")))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctitle"
  }, "Methodology at a glance"), /*#__PURE__*/React.createElement("table", {
    className: "regtbl",
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Hypothesis"), /*#__PURE__*/React.createElement("th", null, "Method"), /*#__PURE__*/React.createElement("th", null, "DV"), /*#__PURE__*/React.createElement("th", null, "Primary source"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "n"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "H1"), /*#__PURE__*/React.createElement("td", null, "Metcalfe's Law"), /*#__PURE__*/React.createElement("td", null, "Log-log OLS, HAC(12), Wald, ADF, Engle-Granger"), /*#__PURE__*/React.createElement("td", null, "log(TxTfrCnt)"), /*#__PURE__*/React.createElement("td", null, "CoinMetrics"), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, "2,192")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "H2"), /*#__PURE__*/React.createElement("td", null, "Leapfrogging"), /*#__PURE__*/React.createElement("td", null, "Two-way FE panel, country-clustered SE, 7 specs"), /*#__PURE__*/React.createElement("td", null, "Chainalysis adoption percentile"), /*#__PURE__*/React.createElement("td", null, "Chainalysis + WB"), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, "702")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "H3"), /*#__PURE__*/React.createElement("td", null, "Concentration"), /*#__PURE__*/React.createElement("td", null, "OLS trend on monthly HHI, Newey-West, Chow"), /*#__PURE__*/React.createElement("td", null, "HHI across stablecoins"), /*#__PURE__*/React.createElement("td", null, "DefiLlama supply"), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, "72")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "H4"), /*#__PURE__*/React.createElement("td", null, "Cost friction"), /*#__PURE__*/React.createElement("td", null, "Paired diff-in-means, HAC OLS, 2 chains \xD7 2 sizes \xD7 2 windows + $3.50 sensitivity"), /*#__PURE__*/React.createElement("td", null, "Fee gap vs legacy (USD/tx)"), /*#__PURE__*/React.createElement("td", null, "Etherscan/Tronscan/RPW"), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, "72"))))));
}
window.SynthesisTab = SynthesisTab;

// ---- App shell ----
function App() {
  const [tab, setTab] = React.useState(() => localStorage.getItem('stable_tab') || 'H1');
  React.useEffect(() => {
    localStorage.setItem('stable_tab', tab);
  }, [tab]);
  const tabs = [{
    id: 'H1',
    n: '01',
    t: 'Network effects'
  }, {
    id: 'H2',
    n: '02',
    t: 'Leapfrogging'
  }, {
    id: 'H3',
    n: '03',
    t: 'Concentration'
  }, {
    id: 'H4',
    n: '04',
    t: 'Cost friction'
  }, {
    id: 'Σ',
    n: 'Σ',
    t: 'Synthesis'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "masthead"
  }, /*#__PURE__*/React.createElement("div", {
    className: "left"
  }, "Internet & Network Economics \xB7 2026"), /*#__PURE__*/React.createElement("div", {
    className: "mid"
  }, "Can stablecoins replace ", /*#__PURE__*/React.createElement("em", null, "SWIFT"), "?"), /*#__PURE__*/React.createElement("div", {
    className: "right"
  }, "Empirical evidence \xB7 2020\u20132025")), /*#__PURE__*/React.createElement("div", {
    className: "subbar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " Live dashboard", /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", null, "H1 \xB7 H2 \xB7 H3 \xB7 H4 + Synthesis"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, "n = 72 months \xB7 123 countries \xB7 2,192 daily obs"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, "OLS / Panel-FE / HAC-Newey-West")), /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: `tab ${tab === t.id ? 'active' : ''}`,
    onClick: () => setTab(t.id),
    "data-screen-label": t.n + ' ' + t.t
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, t.n), t.t))), /*#__PURE__*/React.createElement("div", {
    "data-screen-label": 'Tab ' + tab
  }, tab === 'H1' && /*#__PURE__*/React.createElement(H1Tab, null), tab === 'H2' && /*#__PURE__*/React.createElement(H2Tab, null), tab === 'H3' && /*#__PURE__*/React.createElement(H3Tab, null), tab === 'H4' && /*#__PURE__*/React.createElement(H4Tab, null), tab === 'Σ' && /*#__PURE__*/React.createElement(SynthesisTab, null)), /*#__PURE__*/React.createElement("div", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("span", null, "Dashboard \xB7 research prototype"), /*#__PURE__*/React.createElement("span", null, "Eliya Allam \xB7 Simone Filosofi \xB7 Mattia Cervelli"), /*#__PURE__*/React.createElement("span", null, "Methodology: notebooks/03_empirical_analysis.ipynb")));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));