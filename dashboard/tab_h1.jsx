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

const { useState: useStateH1, useMemo: useMemoH1 } = React;

const H1_SPECS = {
  USDC: {
    full: { beta: 0.9821, se: 0.0290, lo: 0.9253, hi: 1.0388, r2: 0.8741, n: 2192, p1: 0.5357, p2: 1.10e-270, cointegrated: true, alpha_ln: 1.5248 },
    pre:  { beta: 0.9164, se: 0.0546, lo: 0.8094, hi: 1.0234, r2: 0.6782, n: 1045, p1: 0.1255, p2: 1.03e-87,  alpha_ln: 2.1959 },
    post: { beta: 1.0882, se: 0.0203, lo: 1.0484, hi: 1.1280, r2: 0.9539, n: 1147, p1: 1.39e-5, p2: 0,        alpha_ln: 0.1062 },
    ex:   { beta: 1.0426, se: 0.0213, lo: 1.0010, hi: 1.0843, r2: 0.9315, n: 2028, p1: 0.0449, p2: 0,         alpha_ln: 0.7867 },
    chow: { delta: 0.1718, se: 0.0582, p: 0.00317 }
  },
  USDT: {
    full: { beta: 1.0145, se: 0.0073, lo: 1.0002, hi: 1.0288, r2: 0.9867, n: 2192, p1: 0.0471, p2: 0,         cointegrated: true, alpha_ln: 0.5099 },
    pre:  { beta: 1.0249, se: 0.0085, lo: 1.0082, hi: 1.0415, r2: 0.9866, n: 1045, p1: 0.0035, p2: 0,         alpha_ln: 0.3818 },
    post: { beta: 1.1007, se: 0.0627, lo: 0.9778, hi: 1.2235, r2: 0.7542, n: 1147, p1: 0.1082, p2: 1.10e-46,  alpha_ln: -0.6919 },
    ex:   { beta: 1.0200, se: 0.0049, lo: 1.0104, hi: 1.0296, r2: 0.9944, n: 2090, p1: 4.58e-5, p2: 0,        alpha_ln: 0.4351 },
    chow: { delta: 0.0758, se: 0.0633, p: 0.2307 }
  }
};

// For drawing the strict Metcalfe (β=2) reference line, we pin its intercept
// so it passes through the centroid of the FULL-window data cloud of each asset.
// This matches the reference figures exactly (dotted grey line going through
// the middle of the data cloud).
const METCALFE_ALPHA = {
  // α_ln such that ln y = α + 2·ln x passes through (mean_ln_x, mean_ln_y)
  USDC: 13.444 - 2 * 12.141,  // = -10.838
  USDT: 13.963 - 2 * 13.263,  // = -12.563
};

function H1Tab() {
  const [asset, setAsset] = useStateH1('USDC');
  const [window_, setWindow_] = useStateH1('full');

  // Filter scatter points to the active window
  const filtered = useMemoH1(() => {
    const arr = asset === 'USDC' ? window.DATA.h1_usdc : window.DATA.h1_usdt;
    const ftx = new Date('2022-11-10').getTime();
    const clean = arr.filter(d => d[1] > 0 && d[2] > 0);
    if (window_ === 'pre')  return clean.filter(d => new Date(d[0]).getTime() <= ftx);
    if (window_ === 'post') return clean.filter(d => new Date(d[0]).getTime() >  ftx);
    if (window_ === 'ex') {
      // Drop largest-residual observations against the full-window fit, at the
      // percentage Cook's-D flagged in the master CSV (USDC 7.48%, USDT 4.65%).
      const fullSpec = H1_SPECS[asset].full;
      const withRes = clean.map(d => {
        const lx = Math.log(d[1]), ly = Math.log(d[2]);
        return { d, r: Math.abs(ly - (fullSpec.alpha_ln + fullSpec.beta * lx)) };
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
    out.push({ beta: spec.beta, alpha: spec.alpha_ln, color, width: 2.2 });
    // If viewing full, also overlay ex-influentials fit (dashed)
    if (window_ === 'full') {
      const exSpec = H1_SPECS[asset].ex;
      out.push({ beta: exSpec.beta, alpha: exSpec.alpha_ln, color, width: 1.5, dash: '6 4', opacity: 0.85 });
    }
    // Metcalfe reference (β=2, dotted grey) anchored at full-window centroid
    out.push({ beta: 2, alpha: METCALFE_ALPHA[asset], color: 'rgba(10,14,26,0.45)', width: 1.2, dash: '2 4' });
    return out;
  }, [asset, window_, spec, color]);

  // Scatter domain — keep stable so comparisons are visually honest
  const xDomain = asset === 'USDC' ? [7, 16] : [10, 15.5];
  const yDomain = asset === 'USDC' ? [5, 21]  : [7.5, 18];

  // Annotation for USDC DeFi-peak cluster (only meaningful in full / pre views)
  const annotations = (asset === 'USDC' && (window_ === 'full' || window_ === 'pre'))
    ? [{ lnX: 10.3, lnY: 13.7, tx: -110, ty: -4, label: 'Nov 2021 DeFi peak cluster' }]
    : [];

  const windowLabel = {
    full: 'Full window · 2020–2025',
    pre:  'Pre-FTX · ≤ 2022-11-10',
    post: 'Post-FTX · ≥ 2022-11-11',
    ex:   'Ex-influentials · Cook\'s D > 4/n removed',
  }[window_];

  return (
    <div>
      <div className="hero">
        <div className="hnum">H1</div>
        <div>
          <h1>Stablecoins scale like payment rails, <em>not</em> like social networks.</h1>
          <p className="sub">Metcalfe's Law predicts value grows quadratically with users (β=2). We find linear scaling (β≈1) — the fingerprint of transactional utility, not pairwise network value.</p>
        </div>
        <div className="verdict">
          <div className="label">Verdict</div>
          <div className="val red">β=2 rejected</div>
          <div className="val green" style={{fontSize:20,marginTop:4}}>β≈1 consistent</div>
          <span className="tag">Payment infrastructure</span>
        </div>
      </div>

      <div className="kpi" style={{marginTop:20}}>
        <div>
          <div className="k">USDC β (full)</div>
          <div className="v">0.982<span className="sub">± 0.029</span></div>
          <div className="hint">CI [0.925, 1.039]</div>
        </div>
        <div>
          <div className="k">USDT β (full)</div>
          <div className="v">1.014<span className="sub">± 0.007</span></div>
          <div className="hint">CI [1.000, 1.029]</div>
        </div>
        <div>
          <div className="k">Wald p(β=2)</div>
          <div className="v" style={{color:COLORS.accent}}>&lt;1e-40</div>
          <div className="hint">rejected in all 8 specs</div>
        </div>
        <div>
          <div className="k">Cointegration</div>
          <div className="v">Yes</div>
          <div className="hint">EG p=0.014 / &lt;0.001</div>
        </div>
      </div>

      {/* Plain-language explainers for the two econometric pillars */}
      <div className="explainer">
        <div className="ex">
          <span className="ribbon"><span className="glyph">?</span>What the Wald test does</span>
          <h4>The Wald test asks: <em>is our estimate far enough from a specific number to call it different?</em></h4>
          <div className="plain">
            <span className="lab">In plain terms</span>
            Imagine Metcalfe's Law — the classic "value scales with users-squared" rule — sets a target of β = 2. Our data gives β ≈ 1. The Wald test formalises the question: given how noisy our estimate is, could we have landed on ≈1 by chance if the true value were really 2? The answer: essentially never.
          </div>
          <div className="tech">
            <span className="lab">Technically</span>
            The statistic measures how many standard errors our estimate sits from the hypothesised value, squared:
            <div className="formula">W = (β̂ − β₀)² / Var(β̂) ∼ χ²₁</div>
            Under H₀, W follows a χ² with one degree of freedom. A tiny p-value means the null is implausible — the estimate is too far from β₀ to attribute to sampling noise.
          </div>
          <div className="verdict-mini">
            <span className="tag-txt">USDC · H₀: β = 2 (Metcalfe)</span>
            <span className="res rej">rejected · p &lt; 1e-270</span>
          </div>
          <div className="verdict-mini" style={{marginTop:4, paddingTop:8}}>
            <span className="tag-txt">USDC · H₀: β = 1 (linear rail)</span>
            <span className="res sig">consistent · p = 0.536</span>
          </div>
        </div>

        <div className="ex">
          <span className="ribbon"><span className="glyph">≈</span>What cointegration means</span>
          <h4>Cointegration says the log-log relationship is <em>real</em>, not a statistical mirage.</h4>
          <div className="plain">
            <span className="lab">In plain terms</span>
            When two variables both drift upward over time — like transfer count and active addresses — a naïve regression can "find" a relationship between them even when none exists (a "spurious regression"). Cointegration is the formal check that the two series move <em>together</em> in a long-run equilibrium, not just coincidentally trending up together.
          </div>
          <div className="tech">
            <span className="lab">Technically</span>
            We run the Engle–Granger two-step test: fit the OLS, then run an Augmented Dickey–Fuller test on the residuals. If the residuals are stationary (mean-reverting), the series are cointegrated — the β we estimated is a valid long-run elasticity rather than a product of shared trends.
            <div className="formula">ADF(residuals) → reject unit root → series are cointegrated</div>
            Both USDC (p = 0.014) and USDT (p &lt; 0.001) pass at the 5% level.
          </div>
          <div className="verdict-mini">
            <span className="tag-txt">USDC · Engle-Granger</span>
            <span className="res sig">p = 0.014 · cointegrated</span>
          </div>
          <div className="verdict-mini" style={{marginTop:4, paddingTop:8}}>
            <span className="tag-txt">USDT · Engle-Granger</span>
            <span className="res sig">p &lt; 0.001 · cointegrated</span>
          </div>
        </div>
      </div>

      <div className="grid c12" style={{marginTop:24}}>
        <div className="card">
          <div className="ctitle">
            <span>H1 — Metcalfe scaling · log–log scatter</span>
            <span>{filtered.length.toLocaleString()} points shown · OLS n = {spec.n.toLocaleString()}</span>
          </div>
          <div className="csub">{asset} · {windowLabel}. x = ln(Active Addresses), y = ln(Transfer Count).</div>

          <div className="controls">
            <div className="seg">
              <button className={asset==='USDC'?'active':''} onClick={()=>setAsset('USDC')}>USDC</button>
              <button className={asset==='USDT'?'active':''} onClick={()=>setAsset('USDT')}>USDT</button>
            </div>
            <div className="seg">
              <button className={window_==='full'?'active':''} onClick={()=>setWindow_('full')}>Full (2020–25)</button>
              <button className={window_==='pre'?'active':''}  onClick={()=>setWindow_('pre')}>Pre-FTX</button>
              <button className={window_==='post'?'active':''} onClick={()=>setWindow_('post')}>Post-FTX</button>
              <button className={window_==='ex'?'active':''}   onClick={()=>setWindow_('ex')}>Ex-influentials</button>
            </div>
          </div>

          <ScatterLnPlot
            series={[{ points, color, opacity: 0.42, r: 1.8 }]}
            lines={mainLines}
            xDomain={xDomain}
            yDomain={yDomain}
            annotations={annotations}
            width={760}
            height={460}
          />

          <div className="legend" style={{marginTop:8}}>
            <span>
              <span className="sw" style={{background:color, width:16, height:2, display:'inline-block', verticalAlign:'middle'}} />
              {asset} {window_}: β = {spec.beta.toFixed(3)} (95% CI [{spec.lo.toFixed(3)}, {spec.hi.toFixed(3)}])
            </span>
            {window_==='full' && (
              <span>
                <span style={{display:'inline-block', width:16, height:0, borderTop:`2px dashed ${color}`, verticalAlign:'middle', marginRight:6}} />
                {asset} ex-influentials: β = {H1_SPECS[asset].ex.beta.toFixed(3)}
              </span>
            )}
            <span>
              <span style={{display:'inline-block', width:16, height:0, borderTop:'2px dotted rgba(10,14,26,0.55)', verticalAlign:'middle', marginRight:6}} />
              Metcalfe reference: β = 2
            </span>
          </div>

          <div className="caption" style={{fontFamily:'var(--serif)', fontSize:12.5, color:COLORS.muted, marginTop:10, lineHeight:1.5, fontStyle:'italic'}}>
            {asset==='USDC'
              ? <>Wald tests: H₀:β=1 {spec.p1 < 0.05 ? 'rejected' : 'not rejected'} (p={fmtP(spec.p1)}). H₀:β=2 rejected (p&lt;1e-80). Full-window cointegrated (Engle-Granger p=0.014).</>
              : <>Wald tests: H₀:β=1 {spec.p1 < 0.05 ? 'rejected' : 'not rejected'} (p={fmtP(spec.p1)}, economically trivial). H₀:β=2 rejected (p&lt;1e-100). Full-window cointegrated (Engle-Granger p&lt;0.001).</>
            }
          </div>
        </div>

        <div className="card">
          <div className="ctitle">Regression readout</div>
          <div className="csub">{asset} · {windowLabel}</div>

          <div style={{fontFamily:'var(--serif)', fontSize:56, lineHeight:1, letterSpacing:'-0.02em', marginTop:8}}>
            β = {spec.beta.toFixed(3)}
          </div>
          <div style={{fontFamily:'var(--mono)', fontSize:11, color:COLORS.muted, marginTop:4, letterSpacing:'0.04em'}}>
            SE = {spec.se.toFixed(4)} · 95% CI [{spec.lo.toFixed(3)}, {spec.hi.toFixed(3)}]
          </div>

          <div style={{marginTop:18}}>
            <div className="stat-line">
              <span className="k">observations</span>
              <span className="v">{spec.n.toLocaleString()}</span>
            </div>
            <div className="stat-line">
              <span className="k">R²</span>
              <span className="v">{spec.r2.toFixed(4)}</span>
            </div>
            <div className="stat-line">
              <span className="k">intercept (α, ln-space)</span>
              <span className="v">{spec.alpha_ln.toFixed(3)}</span>
            </div>
            <div className="stat-line">
              <span className="k">Wald H₀: β=1</span>
              <span className={`v ${spec.p1 < 0.05 ? 'pos' : 'nul'}`}>p = {fmtP(spec.p1)} {spec.p1 < 0.05 ? '(reject)' : '(cannot reject)'}</span>
            </div>
            <div className="stat-line">
              <span className="k">Wald H₀: β=2 (Metcalfe)</span>
              <span className="v sig">p = {fmtP(spec.p2)} (reject)</span>
            </div>
            {window_==='full' && (
              <div className="stat-line">
                <span className="k">Engle-Granger cointeg.</span>
                <span className="v sig">{asset==='USDC' ? 'p = 0.014' : 'p < 0.001'}</span>
              </div>
            )}
          </div>

          <div className="pullquote" style={{marginTop:20, fontSize:22}}>
            Linear scaling is not a failed hypothesis — it's a diagnostic of what kind of network this is.
          </div>
        </div>
      </div>

      {/* Combined USDC vs USDT scatter — matches fig_h1_metcalfe_scatter.png */}
      <div className="card" style={{marginTop:24}}>
        <div className="ctitle">
          <span>H1 — Metcalfe scaling comparison · USDC vs USDT</span>
          <span>log–log · full window · 2020–2025</span>
        </div>
        <div className="csub">Both assets on one panel. x = ln(Active Addresses), y = ln(Transfer Count).</div>

        <ScatterLnPlot
          series={[
            { points: window.DATA.h1_usdc.filter(d => d[1]>0 && d[2]>0).map(d => [d[1], d[2]]), color: COLORS.usdc, opacity: 0.38, r: 1.6 },
            { points: window.DATA.h1_usdt.filter(d => d[1]>0 && d[2]>0).map(d => [d[1], d[2]]), color: COLORS.usdt, opacity: 0.38, r: 1.6 },
          ]}
          lines={[
            { beta: H1_SPECS.USDC.full.beta, alpha: H1_SPECS.USDC.full.alpha_ln, color: COLORS.usdc, width: 2.2 },
            { beta: H1_SPECS.USDT.full.beta, alpha: H1_SPECS.USDT.full.alpha_ln, color: COLORS.usdt, width: 2.2 },
          ]}
          xDomain={[7, 16]}
          yDomain={[7, 17.5]}
          width={1100}
          height={480}
          margin={{ t: 20, r: 24, b: 56, l: 62 }}
        />

        <div className="legend" style={{marginTop:8}}>
          <span>
            <span className="sw" style={{background:COLORS.usdc, width:16, height:2, display:'inline-block', verticalAlign:'middle'}} />
            USDC: β = 0.982 (95% CI [0.925, 1.039])
          </span>
          <span>
            <span className="sw" style={{background:COLORS.usdt, width:16, height:2, display:'inline-block', verticalAlign:'middle'}} />
            USDT: β = 1.014 (95% CI [1.000, 1.029])
          </span>
        </div>
        <div className="caption" style={{fontFamily:'var(--serif)', fontSize:12.5, color:COLORS.muted, marginTop:10, lineHeight:1.5, fontStyle:'italic'}}>
          Both assets exhibit approximately linear scaling (β ≈ 1), consistent with payment-rail economics rather than strict Metcalfe network effects (β = 2, rejected at p &lt; 1e-80 for both).
        </div>
      </div>

      {/* Pre / post structural break — two-panel scatter matching fig_h1_prepost_structural_break.png */}
      <div className="card" style={{marginTop:24}}>
        <div className="ctitle">
          <span>H1 — Structural break at Nov 11, 2022 (FTX Chapter 11)</span>
          <span>pre-FTX n = 1,045 · post-FTX n = 1,147</span>
        </div>
        <div className="csub">Did the November 2022 FTX collapse <em>change</em> how stablecoin usage scales with users? Chow interaction test.</div>

        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:16,
          background:'var(--paper-2)', border:'1px solid var(--line)',
          padding:'16px 18px', margin:'14px 0 18px'
        }}>
          <div style={{borderLeft:'2px solid var(--accent)', paddingLeft:12}}>
            <div style={{fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--muted)',marginBottom:4}}>In plain terms</div>
            <div style={{fontFamily:'var(--serif)',fontSize:14.5,lineHeight:1.5}}>
              Fit the log-log line <em>twice</em> — once on data before FTX (Nov 11, 2022), once after — and ask whether the <em>slopes</em> are statistically different. A significant Δ means the market-structure shock actually re-wrote the usage curve; an insignificant Δ means the rail kept humming along as before.
            </div>
          </div>
          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--muted)',marginBottom:6}}>Chow interaction test</div>
            <div style={{fontFamily:'var(--mono)',fontSize:11.5,background:'var(--paper)',border:'1px solid var(--line)',padding:'8px 10px',display:'inline-block',marginBottom:8}}>
              ln TC = α + β·ln AA + δ·(Post × ln AA) + γ·Post + ε
            </div>
            <div style={{fontFamily:'var(--sans)',fontSize:12.5,lineHeight:1.5}}>
              δ is the slope <em>difference</em>; H₀: δ = 0 (no break). A rejection pins regime change on the interaction term itself, not just on a level shift.
            </div>
          </div>
        </div>

        {/* Two-panel pre/post scatter */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
          {['USDC','USDT'].map(a => {
            const ftx = new Date('2022-11-10').getTime();
            const arr = a === 'USDC' ? window.DATA.h1_usdc : window.DATA.h1_usdt;
            const clean = arr.filter(d => d[1]>0 && d[2]>0);
            const prePts  = clean.filter(d => new Date(d[0]).getTime() <= ftx).map(d => [d[1], d[2]]);
            const postPts = clean.filter(d => new Date(d[0]).getTime() >  ftx).map(d => [d[1], d[2]]);
            const pre = H1_SPECS[a].pre, post = H1_SPECS[a].post, chow = H1_SPECS[a].chow;
            const col = a === 'USDC' ? COLORS.usdc : COLORS.usdt;
            // darker tone for "post"
            const colDark = a === 'USDC' ? '#14294d' : '#123a2d';
            const colLight = a === 'USDC' ? '#6f89b3' : '#6b9282';
            const xd = a === 'USDC' ? [7, 16] : [10, 15.5];
            const yd = a === 'USDC' ? [7.5, 17.5] : [10.5, 15.5];
            return (
              <div key={a}>
                <div style={{fontFamily:'var(--serif)', fontSize:16, marginBottom:4}}>
                  {a} · Metcalfe scaling by regime
                </div>
                <div style={{fontFamily:'var(--mono)', fontSize:10.5, color:COLORS.muted, marginBottom:6, letterSpacing:'0.04em'}}>
                  pre-FTX β = {pre.beta.toFixed(3)}  ·  post-FTX β = {post.beta.toFixed(3)}  ·  Δ = {chow.delta.toFixed(3)}  ·  p = {fmtP(chow.p)}
                </div>
                <ScatterLnPlot
                  series={[
                    { points: prePts,  color: colLight, opacity: 0.45, r: 1.5 },
                    { points: postPts, color: colDark,  opacity: 0.55, r: 1.5 },
                  ]}
                  lines={[
                    { beta: pre.beta,  alpha: pre.alpha_ln,  color: colLight, width: 2 },
                    { beta: post.beta, alpha: post.alpha_ln, color: colDark,  width: 2 },
                  ]}
                  xDomain={xd}
                  yDomain={yd}
                  width={540}
                  height={360}
                  margin={{ t: 14, r: 14, b: 50, l: 54 }}
                />
                <div style={{display:'flex', gap:14, flexWrap:'wrap', fontFamily:'var(--mono)', fontSize:10.5, color:COLORS.muted, marginTop:6}}>
                  <span><span style={{display:'inline-block', width:14, height:2, background:colLight, verticalAlign:'middle', marginRight:6}} />Pre-FTX (n={pre.n.toLocaleString()}): β = {pre.beta.toFixed(3)}</span>
                  <span><span style={{display:'inline-block', width:14, height:2, background:colDark, verticalAlign:'middle', marginRight:6}} />Post-FTX (n={post.n.toLocaleString()}): β = {post.beta.toFixed(3)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:18, borderTop:'1px dotted var(--line)', paddingTop:14}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:10}}>
            <span style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--muted)'}}>USDC · H₀: δ = 0</span>
            <span style={{fontFamily:'var(--mono)',fontSize:11,color:COLORS.accent}}>rejected · p = 0.003</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:10}}>
            <span style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--muted)'}}>USDT · H₀: δ = 0</span>
            <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--ink)'}}>not rejected · p = 0.231</span>
          </div>
        </div>
        <div style={{fontFamily:'var(--serif)', fontSize:14, lineHeight:1.5, marginTop:12, color:'var(--ink)'}}>
          <strong style={{fontFamily:'var(--serif)'}}>Reading:</strong> USDC's slope steepened by +0.172 after FTX — a real regime shift toward <em>linear-plus</em> scaling as institutions replaced speculators. USDT was already linear pre-FTX and stayed there; its rails didn't re-wire. In both cases the strict Metcalfe β = 2 stays rejected in <em>every</em> sub-window (p &lt; 1e-40).
        </div>
      </div>

      {/* β forest plot across 8 specifications — matches fig_h1_beta_comparison.png */}
      <div className="card" style={{marginTop:24}}>
        <div className="ctitle">
          <span>H1 — β estimates across specifications and sub-samples</span>
          <span>8 specifications · 2 assets × 4 windows</span>
        </div>
        <div className="csub">All 8 specifications reject strict Metcalfe (β = 2) at p &lt; 1e-40. Headline: β ≈ 1 for both assets, robust to outlier treatment and structural break.</div>

        {(() => {
          const rows = [
            { asset:'USDC', label:'USDC full-window',      ...H1_SPECS.USDC.full },
            { asset:'USDC', label:'USDC ex-influentials',  ...H1_SPECS.USDC.ex },
            { asset:'USDC', label:'USDC pre-FTX',          ...H1_SPECS.USDC.pre },
            { asset:'USDC', label:'USDC post-FTX',         ...H1_SPECS.USDC.post },
            { asset:'USDT', label:'USDT full-window',      ...H1_SPECS.USDT.full },
            { asset:'USDT', label:'USDT ex-influentials',  ...H1_SPECS.USDT.ex },
            { asset:'USDT', label:'USDT pre-FTX',          ...H1_SPECS.USDT.pre },
            { asset:'USDT', label:'USDT post-FTX',         ...H1_SPECS.USDT.post },
          ];
          const W = 960, H = 380;
          const mL = 180, mR = 60, mT = 20, mB = 52;
          const iw = W - mL - mR, ih = H - mT - mB;
          const xdom = [0.5, 2.2];
          const sx = linScale(xdom, [0, iw]);
          const rowH = ih / rows.length;
          const xTicks = [0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2];
          return (
            <svg className="chart" viewBox={`0 0 ${W} ${H}`}>
              {/* grid */}
              <g transform={`translate(${mL},${mT})`}>
                {xTicks.map((t, i) => (
                  <line key={i} x1={sx(t)} x2={sx(t)} y1={0} y2={ih} stroke={COLORS.line} strokeWidth={0.5} />
                ))}
                {/* β=1 vertical reference */}
                <line x1={sx(1)} x2={sx(1)} y1={0} y2={ih} stroke={COLORS.ink} strokeWidth={1} />
                <text x={sx(1)+4} y={ih-4} style={{fontFamily:'JetBrains Mono', fontSize:9.5, fill:COLORS.muted}}>linear (β = 1)</text>
                {/* β=2 vertical reference (dashed) */}
                <line x1={sx(2)} x2={sx(2)} y1={0} y2={ih} stroke={COLORS.muted} strokeWidth={1} strokeDasharray="4 4" />
                <text x={sx(2)+4} y={ih-4} style={{fontFamily:'JetBrains Mono', fontSize:9.5, fill:COLORS.muted}}>strict Metcalfe (β = 2)</text>

                {rows.map((r, i) => {
                  const y = rowH * i + rowH/2;
                  const col = r.asset === 'USDC' ? COLORS.usdc : COLORS.usdt;
                  return (
                    <g key={i}>
                      <line x1={sx(r.lo)} x2={sx(r.hi)} y1={y} y2={y} stroke={col} strokeWidth={1.8} />
                      <circle cx={sx(r.beta)} cy={y} r={4} fill={col} />
                      <text x={-10} y={y+3.5} textAnchor="end" style={{fontFamily:'JetBrains Mono', fontSize:11.5, fill:COLORS.ink}}>
                        {r.label}
                      </text>
                    </g>
                  );
                })}
              </g>
              {/* x axis */}
              <g transform={`translate(${mL},${mT+ih})`}>
                <line x1={0} x2={iw} y1={0} y2={0} stroke={COLORS.ink} strokeWidth={0.8} />
                {xTicks.map((t, i) => (
                  <g key={i} transform={`translate(${sx(t)},0)`}>
                    <line y1={0} y2={5} stroke={COLORS.ink} strokeWidth={0.8} />
                    <text y={18} textAnchor="middle" style={{fontFamily:'JetBrains Mono', fontSize:11, fill:COLORS.ink}}>{t.toFixed(1)}</text>
                  </g>
                ))}
                <text x={iw/2} y={40} textAnchor="middle" style={{fontFamily:'JetBrains Mono', fontSize:11, fill:COLORS.ink, letterSpacing:'0.04em'}}>
                  β estimate (with 95% CI)
                </text>
              </g>
            </svg>
          );
        })()}

        <div className="caption" style={{fontFamily:'var(--serif)', fontSize:12.5, color:COLORS.muted, marginTop:10, lineHeight:1.5, fontStyle:'italic'}}>
          All 8 specifications reject strict Metcalfe (β = 2) at p &lt; 1e-40. Headline finding: β ≈ 1 for both assets, robust to outlier treatment and structural break.
        </div>
      </div>

      {/* Course linkage */}
      <div className="grid c21" style={{marginTop:24}}>
        <div className="card">
          <div className="ctitle">
            <span>Econometric diagnostics · at a glance</span>
            <span>full-window · HAC(12) standard errors</span>
          </div>
          <div style={{marginTop:14}}>
            <table className="regtbl" style={{width:'100%'}}>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Spec</th>
                  <th className="num">n</th>
                  <th className="num">β</th>
                  <th className="num">SE</th>
                  <th className="num">95% CI</th>
                  <th className="num">R²</th>
                  <th className="num">p(β=1)</th>
                  <th className="num">p(β=2)</th>
                </tr>
              </thead>
              <tbody>
                {['USDC','USDT'].flatMap(a => ['full','ex','pre','post'].map(w => {
                  const s = H1_SPECS[a][w];
                  const labels = { full:'full window', ex:'ex-influentials', pre:'pre-FTX', post:'post-FTX' };
                  return (
                    <tr key={a+w}>
                      <td>{a}</td>
                      <td>{labels[w]}</td>
                      <td className="num">{s.n.toLocaleString()}</td>
                      <td className="num">{s.beta.toFixed(4)}</td>
                      <td className="num">{s.se.toFixed(4)}</td>
                      <td className="num">[{s.lo.toFixed(3)}, {s.hi.toFixed(3)}]</td>
                      <td className="num">{s.r2.toFixed(4)}</td>
                      <td className="num" style={{color: s.p1 < 0.05 ? COLORS.accent : COLORS.muted}}>{fmtP(s.p1)}</td>
                      <td className="num" style={{color: COLORS.accent}}>{fmtP(s.p2)}</td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
          <div style={{fontFamily:'var(--mono)', fontSize:10.5, color:COLORS.muted, marginTop:14, lineHeight:1.6, letterSpacing:'0.02em'}}>
            ADF (levels): USDC log(TC) non-stationary (p=0.219), USDT log(TC) stationary (p&lt;0.001). After first-differencing, both stationary (p&lt;1e-18). Engle-Granger cointegration holds for both series at 5%.
          </div>
        </div>

        <div className="card dark">
          <div className="ctitle">Course linkage — <em style={{fontFamily:'var(--serif)', fontStyle:'italic', color:'#fff'}}>who captures the value?</em></div>
          <p style={{fontFamily:'var(--serif)', fontSize:15.5, lineHeight:1.5, marginTop:10, color:'rgba(246,243,236,0.88)'}}>
            The scaling exponent β tells us <em>where</em> network value accrues. Under β ≈ 2 (Metcalfe), each new user raises the value of the network for every other user — a classic winner-takes-all dynamic the operator can internalise. Under β ≈ 1, the marginal user just adds a unit of throughput; there is no quadratic externality to capture. Value instead leaks out to the <em style={{color:'#e7c468'}}>complementors</em> — validators earning per-transaction gas, issuers earning yield on reserve float.
          </p>

          <div style={{borderTop:'1px solid rgba(246,243,236,0.2)', marginTop:18, paddingTop:14}}>
            <div style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(246,243,236,0.55)', marginBottom:10}}>Which analogue fits stablecoins?</div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div style={{border:'1px solid rgba(231,196,104,0.55)', padding:'12px 14px', background:'rgba(231,196,104,0.06)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
                  <span style={{fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'0.12em',textTransform:'uppercase',color:'#e7c468'}}>β ≈ 1 · linear</span>
                  <span style={{fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'0.08em',textTransform:'uppercase',color:'#e7c468'}}>✓ fits</span>
                </div>
                <div style={{fontFamily:'var(--serif)', fontSize:17, color:'#fff', marginBottom:6}}>Payment rails</div>
                <div style={{fontFamily:'var(--serif)', fontSize:13.5, lineHeight:1.45, color:'rgba(246,243,236,0.78)'}}>
                  Visa, SWIFT, ACH. Value per user is roughly constant — each transaction is worth about the same regardless of how many other people use the network. Operators earn thin per-transaction margins; issuers and acquirers share the rest.
                </div>
              </div>

              <div style={{border:'1px solid rgba(246,243,236,0.22)', padding:'12px 14px', opacity:0.72}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
                  <span style={{fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(246,243,236,0.5)'}}>β ≈ 2 · quadratic</span>
                  <span style={{fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'0.08em',textTransform:'uppercase',color:'#c96a5a'}}>✗ rejected</span>
                </div>
                <div style={{fontFamily:'var(--serif)', fontSize:17, color:'rgba(246,243,236,0.85)', marginBottom:6, textDecoration:'line-through', textDecorationColor:'rgba(201,106,90,0.6)'}}>Social networks</div>
                <div style={{fontFamily:'var(--serif)', fontSize:13.5, lineHeight:1.45, color:'rgba(246,243,236,0.62)'}}>
                  Facebook, WeChat, Twitter. Value scales with <em>pairs</em> of users because communication is peer-to-peer, so each new user increases utility for all existing users. Operators own the graph and capture nearly all the surplus — a model our data decisively rules out for stablecoins.
                </div>
              </div>
            </div>

            <div style={{fontFamily:'var(--serif)', fontSize:13.5, lineHeight:1.5, marginTop:14, color:'rgba(246,243,236,0.75)', fontStyle:'italic'}}>
              Implication for the course: stablecoins are infrastructure, not platforms. The interesting appropriability questions sit <em>one layer up</em> — at the issuer, the L1 validator set, and the exchange on-ramp — not at the "stablecoin network operator," which is not really a party that exists.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.H1Tab = H1Tab;
