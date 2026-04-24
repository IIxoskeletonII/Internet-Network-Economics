// Synthesis + Answer
function SynthesisTab() {
  const cards = [
    { n:'H1', t:'Network effects', v:'Payment rail', vClass:'green', p:'β ≈ 1, not 2. Metcalfe rejected at p<1e-40 across all 8 specs. Stablecoins scale like Visa or ACH — linearly with transaction-issuing users — not like social networks.' },
    { n:'H2', t:'Leapfrogging', v:'Null · sign-opposite', vClass:'ochre', p:'0 of 5 pre-registered signs landed with p<0.05. Adoption correlates with banking depth, not its absence. Complement, not substitute.' },
    { n:'H3', t:'Concentration', v:'Plural market', vClass:'green', p:'Winner-takes-all rejected. HHI trajectory is U-shaped and event-driven; Chow interaction +119.4 (p<1e-9) confirms slope reversal.' },
    { n:'H4', t:'Cost friction', v:'Chain-bifurcated', vClass:'green', p:'Tron beats SWIFT universally (259× at $200). Ethereum L1 does NOT beat legacy at remittance sizes (0.56× at $200; β n.s.) but saves ~$405/tx at $10K. Post-Dencun the ETH·$200 gap collapses to zero.' },
  ];
  return (
    <div>
      <div className="hero">
        <div className="hnum" style={{fontSize:72}}>Σ</div>
        <div>
          <h1>Can stablecoins replace SWIFT?</h1>
          <p className="sub">Four hypotheses, four calibrated answers, one framing. The defensible claim is narrower — and more interesting — than the slogan.</p>
        </div>
        <div className="verdict">
          <div className="label">Overall verdict</div>
          <div className="val ochre" style={{fontSize:22}}>Qualified yes</div>
          <div style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:14, color:COLORS.muted, marginTop:6, lineHeight:1.3}}>Conditional on chain, corridor, and use case.</div>
        </div>
      </div>

      <div className="answer-hero" style={{marginTop:24}}>
        <div className="kicker">The overarching answer</div>
        <h2>Stablecoins are not replacing SWIFT — they are building a <em>parallel rail</em> alongside it, and that rail is already thick enough in specific corridors to matter.</h2>
        <p className="drop">
          H1 and H4 make the technical case: linear network scaling is the right shape for payment infrastructure, and the cost advantage — <em>on low-fee chains, or at large transfer sizes</em> — runs two to four orders of magnitude. The cost story is chain-bifurcated: Tron beats SWIFT universally, but Ethereum L1 only wins above ≈$200 in the high-gas era (closing to ≈$0 post-Dencun). H2 and H3 tighten the thesis in opposite directions. The "banking-the-unbanked" story is not what is happening empirically; adoption sits with dollar-demanding middle-income economies, not the unbanked world. And the market is plural rather than monopolistic — ironically favourable for SWIFT-substitution because it preserves competitive pressure on fees and standards, but meaning no single stablecoin has SWIFT's universal messaging reach.
        </p>
      </div>

      <div style={{marginTop:28}}>
        <div className="ctitle" style={{fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:COLORS.muted, marginBottom:12}}>Four-panel scorecard</div>
        <div className="scorecard">
          {cards.map((c,i) => (
            <div key={i} className="cell">
              <div className="hnum">{c.n}</div>
              <h3>{c.t}</h3>
              <span className={`verdict ${c.vClass}`}>{c.v}</span>
              <p>{c.p}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid c21" style={{marginTop:28}}>
        <div className="card">
          <div className="ctitle">Where stablecoins actually substitute for SWIFT</div>
          <div style={{marginTop:10}}>
            {[
              {k:'Mid-size transfers in EM currencies', v:'Tron/USDT dominant'},
              {k:'Institutional USD liquidity management', v:'USDC preferred'},
              {k:'Capital-controlled / inflationary economies', v:'Argentina, Turkey, Nigeria'},
              {k:'Global trade finance', v:'Not yet — compliance gap', red:true},
              {k:'Interbank settlement', v:'Not yet — messaging gap', red:true},
            ].map((r,i) => (
              <div key={i} className="stat-line">
                <span className="k">{r.k}</span>
                <span className="v" style={{color: r.red ? COLORS.accent : COLORS.green}}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card dark">
          <div className="ctitle">The honest reframing</div>
          <p style={{fontFamily:'var(--serif)', fontSize:18, fontStyle:'italic', lineHeight:1.4, marginTop:10, color:'rgba(246,243,236,0.92)'}}>
            Stablecoins are a <em style={{color:'#e7c468'}}>complementary</em> asset layer riding on existing financial plumbing — exchanges, custodians, payment processors, developer ecosystems — which are themselves correlated with banking depth.
          </p>
          <div style={{borderTop:'1px solid rgba(246,243,236,0.2)', marginTop:18, paddingTop:14}}>
            <div style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(246,243,236,0.55)', marginBottom:6}}>Policy read</div>
            <p style={{fontFamily:'var(--serif)', fontSize:15, color:'rgba(246,243,236,0.8)', lineHeight:1.45}}>
              Regulatory focus should shift from where theory predicted adoption (low-income, unbanked) to where it actually lives (middle-income, dollar-demanding, macro-unstable).
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:28}}>
        <div className="ctitle">Methodology at a glance</div>
        <table className="regtbl" style={{marginTop:10}}>
          <thead>
            <tr><th>ID</th><th>Hypothesis</th><th>Method</th><th>DV</th><th>Primary source</th><th className="num">n</th></tr>
          </thead>
          <tbody>
            <tr><td>H1</td><td>Metcalfe's Law</td><td>Log-log OLS, HAC(12), Wald, ADF, Engle-Granger</td><td>log(TxTfrCnt)</td><td>CoinMetrics</td><td className="num">2,192</td></tr>
            <tr><td>H2</td><td>Leapfrogging</td><td>Two-way FE panel, country-clustered SE, 7 specs</td><td>Chainalysis adoption percentile</td><td>Chainalysis + WB</td><td className="num">702</td></tr>
            <tr><td>H3</td><td>Concentration</td><td>OLS trend on monthly HHI, Newey-West, Chow</td><td>HHI across stablecoins</td><td>DefiLlama supply</td><td className="num">72</td></tr>
            <tr><td>H4</td><td>Cost friction</td><td>Paired diff-in-means, HAC OLS, 2 chains × 2 sizes × 2 windows + $3.50 sensitivity</td><td>Fee gap vs legacy (USD/tx)</td><td>Etherscan/Tronscan/RPW</td><td className="num">72</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
window.SynthesisTab = SynthesisTab;

// ---- App shell ----
function App() {
  const [tab, setTab] = React.useState(() => localStorage.getItem('stable_tab') || 'H1');
  React.useEffect(() => { localStorage.setItem('stable_tab', tab); }, [tab]);

  const tabs = [
    {id:'H1', n:'01', t:'Network effects'},
    {id:'H2', n:'02', t:'Leapfrogging'},
    {id:'H3', n:'03', t:'Concentration'},
    {id:'H4', n:'04', t:'Cost friction'},
    {id:'Σ',  n:'Σ',  t:'Synthesis'},
  ];

  return (
    <div className="shell">
      <div className="masthead">
        <div className="left">Internet &amp; Network Economics · 2026</div>
        <div className="mid">Can stablecoins replace <em>SWIFT</em>?</div>
        <div className="right">Empirical evidence · 2020–2025</div>
      </div>
      <div className="subbar">
        <span className="dot" /> Live dashboard
        <span style={{flex:1}} />
        <span>H1 · H2 · H3 · H4 + Synthesis</span>
        <span>·</span>
        <span>n = 72 months · 123 countries · 2,192 daily obs</span>
        <span>·</span>
        <span>OLS / Panel-FE / HAC-Newey-West</span>
      </div>
      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} className={`tab ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)} data-screen-label={t.n + ' ' + t.t}>
            <span className="num">{t.n}</span>{t.t}
          </button>
        ))}
      </div>
      <div data-screen-label={'Tab ' + tab}>
        {tab === 'H1' && <H1Tab />}
        {tab === 'H2' && <H2Tab />}
        {tab === 'H3' && <H3Tab />}
        {tab === 'H4' && <H4Tab />}
        {tab === 'Σ' && <SynthesisTab />}
      </div>
      <div className="footer">
        <span>Dashboard · research prototype</span>
        <span>Eliya Allam · Simone Filosofi · Mattia Cervelli</span>
        <span>Methodology: notebooks/03_empirical_analysis.ipynb</span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
