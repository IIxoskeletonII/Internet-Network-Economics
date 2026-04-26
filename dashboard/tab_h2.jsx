// H2 — Diffusion & institutional gaps (leapfrogging)
// ------------------------------------------------------------------------
// All coefficients lifted from tbl_h2_master_summary.csv.
// Coefficient plot rescales β × 10 (per-decimile readability) to mirror
// fig_h2_coefficient_plot.png — CIs also ×10.  Binscatter mirrors
// fig_h2_binscatter.png (x = financial_account_baseline 0-100, two panels).
// ------------------------------------------------------------------------

const { useState: useStateH2 } = React;

// Raw values from tbl_h2_master_summary.csv (one row per spec)
const H2_SPECS_RAW = [
  { id:1, label:'Pooled OLS (baseline main effect)',                  beta:  0.002747568648, se: 0.001494688395, lo: -0.000181966775, hi:  0.005677104072, p: 0.06602974, n:702, absorbed:false, term:'financial_account_baseline', type:'main'       },
  { id:2, label:'Country FE (baseline absorbed)',                     beta: null,            se: null,           lo: null,            hi: null,            p: null,      n:702, absorbed:true,  term:'financial_account_baseline', type:'absorbed'   },
  { id:3, label:'Two-way FE + baseline × post_2022 (HEADLINE)',       beta: -0.000507881537, se: 0.000688835145, lo: -0.001860846455, hi:  0.000845083382, p: 0.46124033, n:702, absorbed:false, term:'baseline × post_2022',       type:'interaction', headline:true },
  { id:4, label:'Two-way FE, excl. forward-filled 2025',              beta: -0.000554633287, se: 0.000714906698, lo: -0.001959513038, hi:  0.000850246464, p: 0.43825773, n:592, absorbed:false, term:'baseline × post_2022',       type:'interaction' },
  { id:5, label:'Triple interaction (between-cohort diff)',           beta: -0.003059478929, se: 0.000718263138, lo: -0.004470254955, hi: -0.001648702904, p: 2.40e-5,   n:702, absorbed:false, term:'baseline × post_2022 × 2024-vintage', type:'triple' },
  { id:6, label:'Drop Among-lowest survivors',                        beta: -0.000057804866, se: 0.000723114423, lo: -0.001478131050, hi:  0.001362521318, p: 0.93631432, n:696, absorbed:false, term:'baseline × post_2022',       type:'robust'      },
  { id:7, label:'Winsorised inflation (1st / 99th pct)',              beta: -0.000461179975, se: 0.000697344764, lo: -0.001830858929, hi:  0.000908498979, p: 0.50866337, n:702, absorbed:false, term:'baseline × post_2022',       type:'robust'      },
];

// ×10 rescaling — the reference figure shows coefficients "per-decimile"
const rescale10 = (x) => x == null ? null : x * 10;
const H2_SPECS = H2_SPECS_RAW.map(s => ({
  ...s,
  beta10: rescale10(s.beta),
  se10:   rescale10(s.se),
  lo10:   rescale10(s.lo),
  hi10:   rescale10(s.hi),
}));

const H2_REGIONAL = [
  { region:'Sub-Saharan Africa',     code:'SSA',    n:122, nC:24, beta:-0.000912, se:0.003009, lo:-0.006890, hi: 0.005066, p:0.7626, r2:0.179 },
  { region:'Latin America & Carib.', code:'LAC',    n:118, nC:20, beta: 0.001044, se:0.001459, lo:-0.001855, hi: 0.003944, p:0.4761, r2:0.036 },
  { region:'South Asia & East Asia Pacific', code:'SA_EAP', n:112, nC:19, beta: 1.02e-6,  se:0.001415, lo:-0.002813, hi: 0.002815, p:0.9994, r2:0.120 },
];

const H2_DESCRIPTIVE = [
  { year:2020, n:149, mean:0.4647, sd:0.3095 },
  { year:2021, n:148, mean:0.5149, sd:0.2850 },
  { year:2022, n:142, mean:0.5045, sd:0.2894 },
  { year:2023, n:148, mean:0.5049, sd:0.2911 },
  { year:2024, n:145, mean:0.5023, sd:0.2902 },
  { year:2025, n:129, mean:0.4917, sd:0.2939 },
];

// ----- Coefficient forest plot (matches fig_h2_coefficient_plot.png) -----
function H2CoefPlot({ specs, width = 960, height = 440 }) {
  const mL = 300, mR = 110, mT = 24, mB = 78;
  const w = width - mL - mR, h = height - mT - mB;
  // ×10 domain from the figure: -0.06 to +0.06
  const xdom = [-0.06, 0.06];
  const sx = linScale(xdom, [0, w]);
  const rowH = h / specs.length;
  const xTicks = [-0.06, -0.04, -0.02, 0, 0.02, 0.04, 0.06];

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`}>
      {/* pre-registered negative-sign region — soft green */}
      <rect
        x={mL} y={mT}
        width={sx(0)} height={h}
        fill="#B8860B" opacity={0.08}
      />
      <g transform={`translate(${mL},${mT})`}>
        {/* vertical gridlines at every tick */}
        {xTicks.map((t, i) => (
          <line key={'g'+i} x1={sx(t)} x2={sx(t)} y1={0} y2={h}
                stroke={COLORS.line} strokeWidth={0.5} />
        ))}
        {/* β=0 reference (dashed) */}
        <line x1={sx(0)} x2={sx(0)} y1={0} y2={h} stroke={COLORS.muted} strokeWidth={1.1} strokeDasharray="5 4" />

        {/* separator lines matching reference: after S4 (between specs 4 & 5) and after S5 */}
        {specs.map((s, i) => {
          if (s.id === 5 || s.id === 6) {
            return <line key={'sep'+i} x1={0} x2={w} y1={rowH * i} y2={rowH * i}
                         stroke={COLORS.line} strokeWidth={0.6} strokeDasharray="2 3" />;
          }
          return null;
        })}

        {specs.map((s, i) => {
          const y = rowH * i + rowH / 2;
          // Color code: spec 5 (cohort diff) uses main blue; robustness 6/7 use orange; others blue
          const col = s.type === 'robust' ? '#B8860B' : '#1F3A5F';
          if (s.absorbed) {
            // Grey marker at zero with explanatory caption to the right
            return (
              <g key={'r'+i}>
                <rect x={sx(0) - 4} y={y - 4} width={8} height={8} fill={COLORS.muted} opacity={0.7} />
                <text x={sx(0) + 14} y={y + 3.5}
                      style={{fontFamily:'JetBrains Mono', fontSize:10.5, fill:COLORS.muted}}>
                  absorbed by entity FE (D-27)
                </text>
                <text x={-12} y={y + 3.5} textAnchor="end"
                      style={{fontFamily:'JetBrains Mono', fontSize:11, fill:COLORS.ink}}>
                  Spec {s.id} — {s.label.replace(' (baseline absorbed)','')}
                </text>
              </g>
            );
          }
          return (
            <g key={'r'+i}>
              {/* CI bar */}
              <line x1={sx(s.lo10)} x2={sx(s.hi10)} y1={y} y2={y} stroke={col} strokeWidth={1.8} />
              {/* caps */}
              <line x1={sx(s.lo10)} x2={sx(s.lo10)} y1={y-5} y2={y+5} stroke={col} strokeWidth={1.4} />
              <line x1={sx(s.hi10)} x2={sx(s.hi10)} y1={y-5} y2={y+5} stroke={col} strokeWidth={1.4} />
              {/* point */}
              <circle cx={sx(s.beta10)} cy={y} r={4.5} fill={col} />
              {/* label on the left — fits in 300px margin */}
              <text x={-12} y={y + 3.5} textAnchor="end"
                    style={{fontFamily:'JetBrains Mono', fontSize:11, fill:COLORS.ink}}>
                Spec {s.id} — {s.label}
              </text>
            </g>
          );
        })}
      </g>
      {/* x axis */}
      <g transform={`translate(${mL},${mT + h})`}>
        <line x1={0} x2={w} y1={0} y2={0} stroke={COLORS.ink} strokeWidth={0.8} />
        {xTicks.map((t, i) => (
          <g key={i} transform={`translate(${sx(t)},0)`}>
            <line y1={0} y2={5} stroke={COLORS.ink} strokeWidth={0.8} />
            <text y={18} textAnchor="middle" style={{fontFamily:'JetBrains Mono', fontSize:11, fill:COLORS.ink}}>{t.toFixed(2)}</text>
          </g>
        ))}
        <text x={w/2} y={42} textAnchor="middle" style={{fontFamily:'JetBrains Mono', fontSize:11, fill:COLORS.ink, letterSpacing:'0.03em'}}>
          Coefficient × 10 (effect of +10-percentage-point baseline on DV)
        </text>
        <text x={w/2} y={60} textAnchor="middle" style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:11.5, fill:COLORS.muted}}>
          Green shading = D-29 pre-registered negative-sign region · blue = primary specs · orange = robustness
        </text>
      </g>
    </svg>
  );
}

// ----- Binscatter (matches fig_h2_binscatter.png) -----
function H2Binscatter() {
  // Two panels: Pre-2022 (2020–2022) and Post-2022 (2023–2025)
  // x = financial_account_baseline (%, 0–100), y = adoption_percentile bin mean
  // Bubble size ∝ n in bin. Slopes: pre +0.0020 (SE 0.0006, n=356); post +0.0010 (SE 0.0007, n=346).
  // Reference: fig_h2_binscatter.png
  const preBins = [
    { x:  9, y: 0.29, n: 10 },
    { x: 22, y: 0.35, n: 20 },
    { x: 28, y: 0.63, n: 12 },
    { x: 38, y: 0.46, n: 40 },
    { x: 44, y: 0.56, n: 45 },
    { x: 52, y: 0.44, n: 35 },
    { x: 57, y: 0.59, n: 60 },
    { x: 63, y: 0.57, n: 40 },
    { x: 71, y: 0.45, n: 35 },
    { x: 77, y: 0.43, n: 35 },
    { x: 82, y: 0.71, n: 60 },
    { x: 89, y: 0.66, n: 80 },
    { x: 97, y: 0.55, n: 100 },
  ];
  const postBins = [
    { x:  9, y: 0.05, n: 8  },
    { x: 22, y: 0.26, n: 14 },
    { x: 38, y: 0.51, n: 42 },
    { x: 44, y: 0.46, n: 38 },
    { x: 51, y: 0.56, n: 55 },
    { x: 55, y: 0.67, n: 40 },
    { x: 58, y: 0.55, n: 55 },
    { x: 63, y: 0.43, n: 35 },
    { x: 70, y: 0.41, n: 40 },
    { x: 76, y: 0.45, n: 25 },
    { x: 82, y: 0.70, n: 72 },
    { x: 89, y: 0.64, n: 82 },
    { x: 97, y: 0.54, n: 100 },
  ];

  const renderPanel = (bins, slope, se, nObs, col, title, yearLabel) => {
    const W = 500, H = 400;
    const mL = 56, mR = 16, mT = 34, mB = 54;
    const w = W - mL - mR, h = H - mT - mB;
    const xdom = [0, 100], ydom = [0, 0.8];
    const sx = linScale(xdom, [0, w]), sy = linScale(ydom, [h, 0]);
    const xTicks = [0, 20, 40, 60, 80, 100];
    const yTicks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
    // regression line (intercept so it passes through bin-centroid)
    const meanX = bins.reduce((a,b)=>a+b.x*b.n, 0) / bins.reduce((a,b)=>a+b.n, 0);
    const meanY = bins.reduce((a,b)=>a+b.y*b.n, 0) / bins.reduce((a,b)=>a+b.n, 0);
    const alpha = meanY - slope * meanX;
    const lineX0 = 0, lineX1 = 100;
    const lineY0 = alpha + slope * lineX0, lineY1 = alpha + slope * lineX1;
    const maxN = Math.max(...bins.map(b => b.n));
    const rScale = (n) => 5 + Math.sqrt(n / maxN) * 16;
    return (
      <svg className="chart" viewBox={`0 0 ${W} ${H}`}>
        <text x={W/2} y={16} textAnchor="middle" style={{fontFamily:'var(--serif)', fontSize:16, fill:COLORS.ink}}>{title}</text>
        {/* slope annotation box */}
        <g transform={`translate(${mL + 6},${mT + 6})`}>
          <rect x={0} y={0} width={200} height={36} fill={COLORS.paper} stroke={COLORS.line} strokeWidth={0.8} />
          <text x={8} y={15} style={{fontFamily:'JetBrains Mono', fontSize:10.5, fill:COLORS.ink}}>
            OLS slope = {slope >= 0 ? '+' : ''}{slope.toFixed(4)} (SE {se.toFixed(4)})
          </text>
          <text x={8} y={29} style={{fontFamily:'JetBrains Mono', fontSize:10.5, fill:COLORS.ink}}>
            n = {nObs}
          </text>
        </g>
        <g transform={`translate(${mL},${mT})`}>
          {/* grid */}
          {yTicks.map((t, i) => (
            <line key={'gy'+i} x1={0} x2={w} y1={sy(t)} y2={sy(t)} stroke={COLORS.line} strokeWidth={0.4} opacity={0.6} />
          ))}
          {/* regression line */}
          <line x1={sx(lineX0)} y1={sy(lineY0)} x2={sx(lineX1)} y2={sy(lineY1)}
                stroke={col} strokeWidth={1.8} />
          {/* bubbles */}
          {bins.map((b, i) => (
            <circle key={i} cx={sx(b.x)} cy={sy(b.y)} r={rScale(b.n)}
                    fill={col} opacity={0.65} stroke={col} strokeWidth={0.8} />
          ))}
        </g>
        {/* axes */}
        <g transform={`translate(${mL},${mT + h})`}>
          <line x1={0} x2={w} y1={0} y2={0} stroke={COLORS.ink} strokeWidth={0.8} />
          {xTicks.map((t, i) => (
            <g key={i} transform={`translate(${sx(t)},0)`}>
              <line y1={0} y2={4} stroke={COLORS.ink} strokeWidth={0.8} />
              <text y={16} textAnchor="middle" style={{fontFamily:'JetBrains Mono', fontSize:10.5, fill:COLORS.ink}}>{t}</text>
            </g>
          ))}
          <text x={w/2} y={40} textAnchor="middle" style={{fontFamily:'JetBrains Mono', fontSize:10.5, fill:COLORS.ink}}>
            financial_account_baseline (% of adults, 0–100)
          </text>
        </g>
        <g transform={`translate(${mL},${mT})`}>
          <line x1={0} x2={0} y1={0} y2={h} stroke={COLORS.ink} strokeWidth={0.8} />
          {yTicks.map((t, i) => (
            <g key={i} transform={`translate(0,${sy(t)})`}>
              <line x1={-4} x2={0} stroke={COLORS.ink} strokeWidth={0.8} />
              <text x={-8} y={3.5} textAnchor="end" style={{fontFamily:'JetBrains Mono', fontSize:10.5, fill:COLORS.ink}}>{t.toFixed(1)}</text>
            </g>
          ))}
          <text transform={`rotate(-90) translate(${-h/2},-40)`} textAnchor="middle"
                style={{fontFamily:'JetBrains Mono', fontSize:10.5, fill:COLORS.ink}}>
            adoption_percentile (bin mean)
          </text>
        </g>
      </svg>
    );
  };

  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
      {renderPanel(preBins,  0.0020, 0.0006, 356, '#1F3A5F', 'Pre-2022 (2020–2022)',  'pre')}
      {renderPanel(postBins, 0.0010, 0.0007, 346, '#B8860B', 'Post-2022 (2023–2025)', 'post')}
    </div>
  );
}

// ----- Descriptive histogram (compact, mirrors fig_h2_descriptive.png) -----
function H2YearMeans() {
  const W = 820, H = 200;
  const mL = 54, mR = 14, mT = 20, mB = 40;
  const w = W - mL - mR, h = H - mT - mB;
  const xdom = [0, H2_DESCRIPTIVE.length - 1];
  const sx = linScale(xdom, [0, w]);
  const ydom = [0.40, 0.55];
  const sy = linScale(ydom, [h, 0]);
  const bw = w / H2_DESCRIPTIVE.length * 0.58;
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`}>
      <g transform={`translate(${mL},${mT})`}>
        {[0.40, 0.45, 0.50, 0.55].map((t, i) => (
          <line key={i} x1={0} x2={w} y1={sy(t)} y2={sy(t)} stroke={COLORS.line} strokeWidth={0.5} />
        ))}
        {H2_DESCRIPTIVE.map((d, i) => {
          const cx = sx(i);
          // 95% CI = 1.96 * sd / sqrt(n)
          const ciHW = 1.96 * d.sd / Math.sqrt(d.n);
          return (
            <g key={i}>
              <rect x={cx - bw/2} y={sy(d.mean)} width={bw} height={h - sy(d.mean)}
                    fill="#1F3A5F" opacity={0.85} />
              {/* CI whisker */}
              <line x1={cx} x2={cx} y1={sy(d.mean - ciHW)} y2={sy(d.mean + ciHW)} stroke={COLORS.ink} strokeWidth={1} />
              <line x1={cx-4} x2={cx+4} y1={sy(d.mean - ciHW)} y2={sy(d.mean - ciHW)} stroke={COLORS.ink} />
              <line x1={cx-4} x2={cx+4} y1={sy(d.mean + ciHW)} y2={sy(d.mean + ciHW)} stroke={COLORS.ink} />
              <text x={cx} y={sy(d.mean) - 6} textAnchor="middle" style={{fontFamily:'JetBrains Mono', fontSize:10, fill:COLORS.ink}}>
                {d.mean.toFixed(3)}
              </text>
            </g>
          );
        })}
      </g>
      <g transform={`translate(${mL},${mT + h})`}>
        <line x1={0} x2={w} y1={0} y2={0} stroke={COLORS.ink} strokeWidth={0.8} />
        {H2_DESCRIPTIVE.map((d, i) => (
          <g key={i} transform={`translate(${sx(i)},0)`}>
            <line y1={0} y2={4} stroke={COLORS.ink} strokeWidth={0.8} />
            <text y={16} textAnchor="middle" style={{fontFamily:'JetBrains Mono', fontSize:10.5, fill:COLORS.ink}}>{d.year}</text>
            <text y={30} textAnchor="middle" style={{fontFamily:'JetBrains Mono', fontSize:9.5, fill:COLORS.muted}}>n={d.n}</text>
          </g>
        ))}
      </g>
      <g transform={`translate(${mL},${mT})`}>
        <line x1={0} x2={0} y1={0} y2={h} stroke={COLORS.ink} strokeWidth={0.8} />
        {[0.40, 0.45, 0.50, 0.55].map((t, i) => (
          <g key={i} transform={`translate(0,${sy(t)})`}>
            <line x1={-4} x2={0} stroke={COLORS.ink} strokeWidth={0.8} />
            <text x={-8} y={3.5} textAnchor="end" style={{fontFamily:'JetBrains Mono', fontSize:10.5, fill:COLORS.ink}}>{t.toFixed(2)}</text>
          </g>
        ))}
        <text transform={`rotate(-90) translate(${-h/2},-40)`} textAnchor="middle"
              style={{fontFamily:'JetBrains Mono', fontSize:10.5, fill:COLORS.ink}}>
          mean adoption_percentile (95% CI)
        </text>
      </g>
    </svg>
  );
}

function H2Tab() {
  const [specSel, setSpecSel] = useStateH2(3);
  const spec = H2_SPECS.find(s => s.id === specSel);

  const preRegSigns = [
    { id:1, label:'Pooled OLS — β on baseline (expected: −)',         actual: '+0.0027', p: 0.066,  matched: false },
    { id:3, label:'Two-way FE — β on baseline × post_2022 (HEADLINE)', actual: '−0.0005', p: 0.461,  matched: false },
    { id:4, label:'Two-way FE, excl. ff 2025 — same interaction',     actual: '−0.0006', p: 0.438,  matched: false },
    { id:6, label:'Robustness — drop Among-lowest',                    actual: '−0.0001', p: 0.936,  matched: false },
    { id:7, label:'Robustness — winsorised inflation',                 actual: '−0.0005', p: 0.509,  matched: false },
  ];

  return (
    <div>
      <div className="hero">
        <div className="hnum">H2</div>
        <div>
          <h1>Leapfrogging fails. Adoption <em>complements</em> banking depth — it doesn't substitute for it.</h1>
          <p className="sub">Pre-registered prediction: stablecoins accelerate where banking is weakest. Evidence: 0 of 5 pre-registered signs land with p&lt;0.05. The headline two-way FE interaction is null; the descriptive sign runs the <em>opposite</em> direction.</p>
        </div>
        <div className="verdict">
          <div className="label">Verdict</div>
          <div className="val ochre">Null on identification</div>
          <div style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:14, color:COLORS.muted, marginTop:6, lineHeight:1.3}}>Descriptive slope <em style={{color:COLORS.accent}}>positive</em>, not negative.</div>
          <span className="tag">Complement, not substitute</span>
        </div>
      </div>

      <div className="kpi" style={{marginTop:20}}>
        <div>
          <div className="k">Headline interaction β <span className="sub">(spec 3)</span></div>
          <div className="v">−0.0005</div>
          <div className="hint">p = 0.461 · CI [−0.0019, +0.0008]</div>
        </div>
        <div>
          <div className="k">Pooled OLS β <span className="sub">(spec 1)</span></div>
          <div className="v" style={{color:COLORS.accent}}>+0.0027</div>
          <div className="hint">sign-opposite · p = 0.066</div>
        </div>
        <div>
          <div className="k">Pre-reg signs landed</div>
          <div className="v">0 <span className="sub">/ 5</span></div>
          <div className="hint">matching sign &amp; p &lt; 0.05</div>
        </div>
        <div>
          <div className="k">Panel size</div>
          <div className="v">123 <span className="sub">× 6</span></div>
          <div className="hint">countries × years · n = 702</div>
        </div>
      </div>

      {/* Explainer — identification vs interpretation */}
      <div className="explainer" style={{marginTop:20}}>
        <div className="ex">
          <span className="ribbon"><span className="glyph">?</span>What "leapfrogging" would look like</span>
          <h4>The pre-registered hypothesis predicts a <em>negative</em> interaction: adoption grows faster in weak-banking countries after FTX.</h4>
          <div className="plain">
            <span className="lab">In plain terms</span>
            "Leapfrogging" is the M-Pesa logic applied to stablecoins — the idea that new digital infrastructure spreads fastest where the legacy is weakest. If true, we'd see countries with <em>lower</em> baseline financial-account ownership gaining adoption <em>faster</em> after 2022. The sign of the interaction would be negative and sharp.
          </div>
          <div className="tech">
            <span className="lab">Technically</span>
            Headline specification 3 is a two-way fixed-effects panel with country-clustered SEs:
            <div className="formula">AdoptionPct<sub>it</sub> = α<sub>i</sub> + λ<sub>t</sub> + β·(baseline<sub>i</sub> × post2022<sub>t</sub>) + X<sub>it</sub>γ + ε<sub>it</sub></div>
            The main effect of baseline is absorbed by country FE (time-invariant), which is why spec 2 reports an absorbed coefficient.
          </div>
          <div className="verdict-mini">
            <span className="tag-txt">H₀: β ≥ 0 (no leapfrog)</span>
            <span className="res nul">not rejected · p = 0.461</span>
          </div>
        </div>

        <div className="ex">
          <span className="ribbon"><span className="glyph">!</span>Why spec 5 is <em>not</em> evidence of the mechanism</span>
          <h4>Spec 5's significant −0.0031 is a cross-cohort difference, not a slope.</h4>
          <div className="plain">
            <span className="lab">In plain terms</span>
            Spec 5 separates countries whose Findex baseline comes from the 2021/22 survey wave (≈21 countries) from those on the 2024 wave (the majority). The 2021/22-vintage cohort actually has a <em>positive</em> slope (+0.0023). The −0.0031 is just the difference between cohorts, and the 2024-vintage net slope is +0.0023 + (−0.0031) = −0.0008 — also null.
          </div>
          <div className="tech">
            <span className="lab">Technically</span>
            <div className="formula">β<sub>triple</sub> = −0.00306 (p = 2.4e-05)</div>
            but <em>neither</em> cohort exhibits a mechanism-consistent negative slope that is statistically distinct from zero. The "significant" finding is <em>between</em> cohorts, not <em>within</em> the modal country.
          </div>
          <div className="verdict-mini">
            <span className="tag-txt">spec 5 · H₀: leapfrogging</span>
            <span className="res nul">not evidence · cross-cohort artefact</span>
          </div>
        </div>
      </div>

      {/* Coefficient plot */}
      <div className="card" style={{marginTop:24}}>
        <div className="ctitle">
          <span>H2 — coefficient plot · baseline × post_2022 interaction</span>
          <span>95% CI · rescaled × 10 for readability</span>
        </div>
        <div className="csub">
          Point estimate · 95% CI on the pre-registered interaction term. Vertical dashed line at β = 0; green shading marks the D-29 pre-registered negative-sign region. Zero of the five applicable specs lands in green with p&lt;0.05.
        </div>
        <H2CoefPlot specs={H2_SPECS} />
        <div className="footnote" style={{marginTop:8}}>
          All coefficients and CIs multiplied by 10 (effect of a +10-percentage-point baseline). Raw values in tbl_h2_master_summary.csv. Spec 2 omitted — baseline absorbed by entity FE (D-27). Spec 5 reports a between-cohort differential, not a slope (see §4.14 narrative). Spec 8 (overall_score DV, 2020-2021) returns sign-flipped β = +0.0023 (p = 0.008); see §4.14.
        </div>
      </div>

      {/* Binscatter */}
      <div className="card" style={{marginTop:24}}>
        <div className="ctitle">
          <span>H2 — pre/post binscatter · adoption vs. baseline banking depth</span>
          <span>bubble size ∝ n in bin</span>
        </div>
        <div className="csub">
          Both pre-FTX (2020–2022) and post-FTX (2023–2025) sub-samples show <em>positive</em> slopes of adoption on baseline financial-account ownership — the descriptive evidence runs opposite to leapfrogging.
        </div>
        <H2Binscatter />
        <div className="footnote" style={{marginTop:8, fontFamily:'var(--serif)', fontStyle:'italic'}}>
          Spec-3 interaction β = −0.0005 (p = 0.461, n.s.). Pure binscatter shown; regression adjusts for log-GDP, inflation, remittances + country &amp; year FE (see §4.5). Visual pattern is suggestive, not statistically distinguishable from zero.
        </div>
      </div>

      {/* Regional heterogeneity */}
      <div className="grid c12" style={{marginTop:24}}>
        <div className="card">
          <div className="ctitle">
            <span>Regional heterogeneity — spec 3 re-fit by region</span>
            <span>descriptive · D-31</span>
          </div>
          <div className="csub">
            Even within the regions where leapfrogging should show most strongly (Sub-Saharan Africa), the interaction is null.
          </div>
          <table className="regtbl" style={{marginTop:12, width:'100%'}}>
            <thead>
              <tr>
                <th>Region</th>
                <th className="num">n</th>
                <th className="num">countries</th>
                <th className="num">β (interaction)</th>
                <th className="num">SE</th>
                <th className="num">95% CI</th>
                <th className="num">p</th>
                <th className="num">R²</th>
              </tr>
            </thead>
            <tbody>
              {H2_REGIONAL.map(r => (
                <tr key={r.code}>
                  <td>{r.region}</td>
                  <td className="num">{r.n}</td>
                  <td className="num">{r.nC}</td>
                  <td className="num">{r.beta >= 0 ? '+' : ''}{r.beta.toExponential(2)}</td>
                  <td className="num">{r.se.toFixed(4)}</td>
                  <td className="num">[{r.lo.toFixed(4)}, {r.hi.toFixed(4)}]</td>
                  <td className="num" style={{color: r.p < 0.05 ? COLORS.accent : COLORS.muted}}>{r.p.toFixed(3)}</td>
                  <td className="num">{r.r2.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="footnote" style={{marginTop:10, fontFamily:'var(--serif)', fontStyle:'italic'}}>
            SSA β = −0.0009 (p = 0.76), LAC β = +0.0010 (p = 0.48), SA_EAP β ≈ 0 (p = 1.00). Even the narrowest region-level re-fit delivers the same null, and signs are inconsistent across regions.
          </div>
        </div>

        <div className="card">
          <div className="ctitle">
            <span>Panel descriptives — adoption percentile by year</span>
            <span>n = 702 country-year obs</span>
          </div>
          <div className="csub">Mean adoption percentile is flat across years — there is no visible mass migration toward high-adoption regimes.</div>
          <H2YearMeans />
          <div className="footnote" style={{marginTop:8, fontFamily:'var(--serif)', fontStyle:'italic'}}>
            Mean adoption is ~0.50 across every year in the panel (the Chainalysis percentile is approximately uniform by construction). The temporal stability is what makes the leapfrogging interaction hard to identify: within-country variation in the time-invariant baseline is mechanically absorbed by country FE.
          </div>
        </div>
      </div>

      {/* Pre-registered signs scorecard */}
      <div className="card" style={{marginTop:24}}>
        <div className="ctitle">
          <span>Pre-registered signs scorecard — D-29</span>
          <span>0 of 5 landed with matching sign &amp; p &lt; 0.05</span>
        </div>
        <div className="csub">
          Each row reports whether the spec's point estimate matched the pre-registered negative sign AND cleared p &lt; 0.05.
        </div>
        <table className="regtbl" style={{marginTop:12, width:'100%'}}>
          <thead>
            <tr>
              <th>Spec</th>
              <th>Pre-registered test</th>
              <th className="num">Observed β</th>
              <th className="num">p</th>
              <th className="num">Matched?</th>
            </tr>
          </thead>
          <tbody>
            {preRegSigns.map(r => (
              <tr key={r.id}>
                <td>Spec {r.id}</td>
                <td>{r.label}</td>
                <td className="num">{r.actual}</td>
                <td className="num">{r.p.toFixed(3)}</td>
                <td className="num" style={{color: r.matched ? COLORS.green : COLORS.accent, fontFamily:'JetBrains Mono'}}>
                  {r.matched ? '✓' : '✗'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive spec selector */}
      <div className="grid c21" style={{marginTop:24}}>
        <div className="card">
          <div className="ctitle">
            <span>Inspect any specification</span>
            <span>click a chip to view its regression readout</span>
          </div>
          <div className="pill-row" style={{marginTop:12, display:'flex', flexWrap:'wrap', gap:6}}>
            {H2_SPECS.map(s => (
              <button key={s.id}
                      className={`pill ${specSel===s.id?'active':''}`}
                      onClick={()=>setSpecSel(s.id)}
                      style={{padding:'6px 10px', fontFamily:'JetBrains Mono', fontSize:11, letterSpacing:'0.04em'}}>
                SPEC {s.id}
              </button>
            ))}
          </div>
          <div style={{marginTop:18, display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
            <div>
              <div style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:COLORS.muted, marginBottom:6}}>
                Specification
              </div>
              <div style={{fontFamily:'var(--serif)', fontSize:20, lineHeight:1.25}}>
                {spec.label}
              </div>
              <div style={{fontFamily:'var(--mono)', fontSize:11, color:COLORS.muted, marginTop:8, letterSpacing:'0.04em'}}>
                term · {spec.term}
              </div>
            </div>
            <div>
              {spec.absorbed ? (
                <>
                  <div style={{fontFamily:'var(--serif)', fontSize:32, letterSpacing:'-0.02em', lineHeight:1}}>
                    absorbed
                  </div>
                  <div style={{fontFamily:'var(--mono)', fontSize:11, color:COLORS.muted, marginTop:6}}>
                    The main effect of <code>financial_account_baseline</code> is time-invariant and therefore fully absorbed by country fixed effects (D-27). Use the interaction term in spec 3 instead.
                  </div>
                </>
              ) : (
                <>
                  <div style={{fontFamily:'var(--serif)', fontSize:44, letterSpacing:'-0.02em', lineHeight:1}}>
                    β = {spec.beta >= 0 ? '+' : ''}{spec.beta.toFixed(5)}
                  </div>
                  <div style={{fontFamily:'var(--mono)', fontSize:11, color:COLORS.muted, marginTop:4, letterSpacing:'0.04em'}}>
                    SE = {spec.se.toFixed(5)} · 95% CI [{spec.lo.toFixed(5)}, {spec.hi.toFixed(5)}]
                  </div>
                </>
              )}
            </div>
          </div>
          <div style={{marginTop:16}}>
            <div className="stat-line">
              <span className="k">observations</span>
              <span className="v">{spec.n}</span>
            </div>
            {!spec.absorbed && (
              <>
                <div className="stat-line">
                  <span className="k">p-value</span>
                  <span className={`v ${spec.p < 0.05 ? 'sig' : 'nul'}`}>{fmtP(spec.p)} {spec.p < 0.05 ? '(reject β=0)' : '(cannot reject β=0)'}</span>
                </div>
                <div className="stat-line">
                  <span className="k">sign vs. pre-registered</span>
                  <span className="v" style={{color: (spec.type === 'interaction' || spec.type === 'main' || spec.type === 'robust') ? (spec.beta < 0 ? COLORS.green : COLORS.accent) : COLORS.muted}}>
                    {spec.type === 'triple' ? 'no pre-reg sign (between-cohort diff)'
                      : spec.beta < 0 ? 'matched (negative)' : 'sign-opposite (positive)'}
                  </span>
                </div>
              </>
            )}
          </div>
          {spec.headline && (
            <div className="footnote" style={{marginTop:14, fontFamily:'var(--serif)', fontStyle:'italic'}}>
              Headline specification — reported throughout the paper and deck.
            </div>
          )}
          {spec.id === 5 && (
            <div className="footnote" style={{marginTop:14, fontFamily:'var(--serif)', fontStyle:'italic'}}>
              Deliberately excluded from "signs landed" accounting — no pre-registered sign, and the significant coefficient is a cross-cohort differential between 2021/22- and 2024-vintage Findex samples, not a mechanism-level slope (§4.14).
            </div>
          )}
        </div>

        <div className="card dark">
          <div className="ctitle">Who is adopting, really — course linkage</div>
          <p style={{fontFamily:'var(--serif)', fontSize:15.5, lineHeight:1.5, marginTop:10, color:'rgba(250,248,245,0.88)'}}>
            Cross-border crypto flows concentrate not in the unbanked world but in <em style={{color:'#B8860B'}}>middle-income economies</em> with active retail investment cultures, capital-control pressures, or USD-access frictions.
          </p>
          <p style={{fontFamily:'var(--serif)', fontSize:15.5, lineHeight:1.5, marginTop:10, color:'rgba(250,248,245,0.88)'}}>
            The binding constraint is macro instability and demand for dollar exposure — not absence of basic banking. This aligns with Graf von Luckner, Reinhart &amp; Rogoff (2023) and Aquilina, Frost &amp; Schrimpf (2024).
          </p>
          <div style={{borderTop:'1px solid rgba(250,248,245,0.2)', marginTop:16, paddingTop:14}}>
            <div style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(250,248,245,0.55)', marginBottom:6}}>Honest framing</div>
            <div style={{fontFamily:'var(--serif)', fontSize:17, fontStyle:'italic', lineHeight:1.35, color:'var(--bg-base)'}}>
              "We cannot identify leapfrogging in this panel" — not "leapfrogging does not exist."
            </div>
            <div style={{fontFamily:'var(--serif)', fontSize:13.5, lineHeight:1.5, color:'rgba(250,248,245,0.72)', marginTop:10}}>
              The null is partly a consequence of identification: within-country variation in a time-invariant baseline is mechanically absorbed by the country fixed effect, leaving little signal for the interaction term to pick up.
            </div>
          </div>

          <div style={{borderTop:'1px solid rgba(250,248,245,0.2)', marginTop:16, paddingTop:14}}>
            <div style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(250,248,245,0.55)', marginBottom:6}}>Policy implication</div>
            <div style={{fontFamily:'var(--serif)', fontSize:13.5, lineHeight:1.5, color:'rgba(250,248,245,0.85)'}}>
              Expecting stablecoins to close financial-inclusion gaps in low-income countries is empirically unsupported. The regulatory conversation should refocus on where adoption actually occurs — middle-income, dollar-demanding economies.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.H2Tab = H2Tab;
