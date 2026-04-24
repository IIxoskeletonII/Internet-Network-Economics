// Chart primitives & helpers
const { useState, useEffect, useMemo, useRef } = React;

const COLORS = {
  ink: '#0a0e1a', paper: '#f6f3ec', paper2: '#ebe6d9',
  accent: '#c9463a', green: '#1f5e4a', ochre: '#b07d2a', blue: '#2a4a7f',
  muted: 'rgba(10,14,26,0.56)', line: 'rgba(10,14,26,0.14)',
  usdc: '#2a4a7f', usdt: '#1f5e4a',
};

function fmt(n, d=2) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  if (Math.abs(n) >= 1e9) return (n/1e9).toFixed(1) + 'B';
  if (Math.abs(n) >= 1e6) return (n/1e6).toFixed(1) + 'M';
  if (Math.abs(n) >= 1e3) return (n/1e3).toFixed(1) + 'K';
  return n.toFixed(d);
}
function fmtP(p) {
  if (p === null || p === undefined) return '—';
  if (p < 1e-10) return '<1e-10';
  if (p < 0.001) return p.toExponential(2);
  return p.toFixed(3);
}
function fmt$(n, d=2) {
  if (n == null || isNaN(n)) return '—';
  const s = n < 0 ? '-' : '';
  const a = Math.abs(n);
  if (a >= 1000) return s + '$' + fmt(a, 0);
  return s + '$' + a.toFixed(d);
}

// scale helpers
function linScale(domain, range) {
  const [d0, d1] = domain, [r0, r1] = range;
  return v => r0 + (v - d0) / (d1 - d0) * (r1 - r0);
}
function logScale(domain, range) {
  const [d0, d1] = domain.map(Math.log10), [r0, r1] = range;
  return v => r0 + (Math.log10(Math.max(v, 1e-9)) - d0) / (d1 - d0) * (r1 - r0);
}

// Axis component
function Axis({x, y, w, h, scale, ticks, orient='bottom', label, fmt: ff}) {
  ff = ff || (v => String(v));
  return (
    <g transform={`translate(${x},${y})`} className="axis">
      {orient === 'bottom' && (
        <>
          <line x1={0} x2={w} y1={0} y2={0} />
          {ticks.map((t, i) => (
            <g key={i} transform={`translate(${scale(t)},0)`}>
              <line y1={0} y2={4} />
              <text y={16} textAnchor="middle">{ff(t)}</text>
            </g>
          ))}
          {label && <text x={w/2} y={36} textAnchor="middle" style={{fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase'}}>{label}</text>}
        </>
      )}
      {orient === 'left' && (
        <>
          <line x1={0} x2={0} y1={0} y2={h} />
          {ticks.map((t, i) => (
            <g key={i} transform={`translate(0,${scale(t)})`}>
              <line x1={-4} x2={0} />
              <text x={-8} y={3} textAnchor="end">{ff(t)}</text>
            </g>
          ))}
          {label && <text transform={`rotate(-90) translate(${-h/2},${-44})`} textAnchor="middle" style={{fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase'}}>{label}</text>}
        </>
      )}
    </g>
  );
}

function GridLines({x, y, w, h, ticks, scale, orient='h'}) {
  return (
    <g transform={`translate(${x},${y})`}>
      {ticks.map((t, i) => (
        orient === 'h'
          ? <line key={i} className="grid-line" x1={0} x2={w} y1={scale(t)} y2={scale(t)} />
          : <line key={i} className="grid-line" x1={scale(t)} x2={scale(t)} y1={0} y2={h} />
      ))}
    </g>
  );
}

// Scatter plot with regression line
function ScatterLog({data, width=640, height=360, xLabel, yLabel, color=COLORS.ink, refLine, regLine, margin={t:20,r:20,b:50,l:60}}) {
  const w = width - margin.l - margin.r;
  const h = height - margin.t - margin.b;
  const xs = data.map(d => d[0]).filter(v => v > 0);
  const ys = data.map(d => d[1]).filter(v => v > 0);
  const xMin = Math.pow(10, Math.floor(Math.log10(Math.min(...xs))));
  const xMax = Math.pow(10, Math.ceil(Math.log10(Math.max(...xs))));
  const yMin = Math.pow(10, Math.floor(Math.log10(Math.min(...ys))));
  const yMax = Math.pow(10, Math.ceil(Math.log10(Math.max(...ys))));
  const sx = logScale([xMin, xMax], [0, w]);
  const sy = logScale([yMin, yMax], [h, 0]);
  // Major ticks at every decade, minor (2x, 5x) inside each for denser reading grid
  const xTicks = []; for (let p = Math.log10(xMin); p <= Math.log10(xMax); p++) xTicks.push(Math.pow(10, p));
  const yTicks = []; for (let p = Math.log10(yMin); p <= Math.log10(yMax); p++) yTicks.push(Math.pow(10, p));
  const xMinor = []; for (let p = Math.log10(xMin); p < Math.log10(xMax); p++) { xMinor.push(2*Math.pow(10,p)); xMinor.push(5*Math.pow(10,p)); }
  const yMinor = []; for (let p = Math.log10(yMin); p < Math.log10(yMax); p++) { yMinor.push(2*Math.pow(10,p)); yMinor.push(5*Math.pow(10,p)); }

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`}>
      <GridLines x={margin.l} y={margin.t} w={w} h={h} ticks={yTicks} scale={sy} />
      <g transform={`translate(${margin.l},${margin.t})`}>
        {/* minor log gridlines */}
        {yMinor.filter(v => v >= yMin && v <= yMax).map((v,i) => (
          <line key={'ym'+i} x1={0} x2={w} y1={sy(v)} y2={sy(v)} stroke={COLORS.line} strokeWidth={0.4} opacity={0.5} />
        ))}
        {xMinor.filter(v => v >= xMin && v <= xMax).map((v,i) => (
          <line key={'xm'+i} x1={sx(v)} x2={sx(v)} y1={0} y2={h} stroke={COLORS.line} strokeWidth={0.4} opacity={0.5} />
        ))}
        {data.map((d, i) => (
          <circle key={i} cx={sx(d[0])} cy={sy(d[1])} r={1.8} fill={color} opacity={0.35} />
        ))}
        {refLine && (() => {
          // β=2 Metcalfe line through median point
          const mx = Math.exp(xs.reduce((a,b)=>a+Math.log(b),0)/xs.length);
          const my = Math.exp(ys.reduce((a,b)=>a+Math.log(b),0)/ys.length);
          // y = k * x^2 -> log y = log k + 2 log x; pick k so line passes through (mx, my)
          const logk = Math.log10(my) - 2*Math.log10(mx);
          const x0 = xMin, x1 = xMax;
          const y0 = Math.pow(10, logk + 2*Math.log10(x0));
          const y1 = Math.pow(10, logk + 2*Math.log10(x1));
          return <line x1={sx(x0)} y1={sy(Math.max(yMin, Math.min(yMax,y0)))} x2={sx(x1)} y2={sy(Math.max(yMin, Math.min(yMax,y1)))} stroke={COLORS.accent} strokeWidth={1.2} strokeDasharray="4 3" />;
        })()}
        {regLine && (() => {
          const { beta, alpha } = regLine;
          const x0 = xMin, x1 = xMax;
          const y0 = Math.pow(10, alpha + beta*Math.log10(x0));
          const y1 = Math.pow(10, alpha + beta*Math.log10(x1));
          return <line x1={sx(x0)} y1={sy(Math.max(yMin, Math.min(yMax,y0)))} x2={sx(x1)} y2={sy(Math.max(yMin, Math.min(yMax,y1)))} stroke={color} strokeWidth={1.8} />;
        })()}
      </g>
      <Axis x={margin.l} y={margin.t+h} w={w} h={h} scale={sx} ticks={xTicks} orient="bottom" label={xLabel} fmt={v => '10^' + Math.round(Math.log10(v))} />
      <Axis x={margin.l} y={margin.t} w={w} h={h} scale={sy} ticks={yTicks} orient="left" label={yLabel} fmt={v => '10^' + Math.round(Math.log10(v))} />
    </svg>
  );
}

// Generic time series plot
function TimeSeries({series, width=920, height=360, yLabel, events=[], margin={t:30,r:24,b:48,l:60}, yDomain, yTicks, fmtY=fmt, annotations}) {
  const w = width - margin.l - margin.r;
  const h = height - margin.t - margin.b;
  const allPoints = series.flatMap(s => s.data);
  const xs = allPoints.map(p => new Date(p[0]).getTime());
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const ys = allPoints.map(p => p[1]);
  const y0 = yDomain ? yDomain[0] : Math.min(...ys);
  const y1 = yDomain ? yDomain[1] : Math.max(...ys);
  const sx = linScale([x0, x1], [0, w]);
  const sy = linScale([y0, y1], [h, 0]);

  // x ticks by year
  const xTicks = [];
  const startYear = new Date(x0).getUTCFullYear();
  const endYear = new Date(x1).getUTCFullYear();
  for (let y = startYear; y <= endYear; y++) xTicks.push(new Date(Date.UTC(y,0,1)).getTime());

  const yT = yTicks || (() => {
    const step = (y1-y0)/5;
    return [0,1,2,3,4,5].map(i => y0 + i*step);
  })();

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`}>
      <GridLines x={margin.l} y={margin.t} w={w} h={h} ticks={yT} scale={sy} />
      <g transform={`translate(${margin.l},${margin.t})`}>
        {events.map((e, i) => {
          const ex = sx(new Date(e.date).getTime());
          return (
            <g key={i}>
              <line className="event-line" x1={ex} x2={ex} y1={0} y2={h} />
              <text className="event-label" x={ex+4} y={12} style={{fontSize: 9.5}}>{e.label}</text>
            </g>
          );
        })}
        {series.map((s, i) => {
          const path = s.data.map((p, j) => {
            const px = sx(new Date(p[0]).getTime()), py = sy(p[1]);
            return (j === 0 ? 'M' : 'L') + px + ',' + py;
          }).join(' ');
          return (
            <g key={i}>
              <path d={path} fill="none" stroke={s.color} strokeWidth={s.strokeWidth || 1.8} strokeDasharray={s.dash || 'none'} />
              {s.showPoints && s.data.map((p, j) => (
                <circle key={j} cx={sx(new Date(p[0]).getTime())} cy={sy(p[1])} r={2} fill={s.color} />
              ))}
            </g>
          );
        })}
        {annotations && annotations.map((a, i) => (
          <g key={i} transform={`translate(${sx(new Date(a.date).getTime())},${sy(a.y)})`}>
            <circle r={4} fill={COLORS.accent} />
            <text x={8} y={4} style={{fontFamily:'JetBrains Mono',fontSize:10,fill:COLORS.ink}}>{a.label}</text>
          </g>
        ))}
      </g>
      <Axis x={margin.l} y={margin.t+h} w={w} h={h} scale={sx} ticks={xTicks} orient="bottom" fmt={v => new Date(v).getUTCFullYear()} />
      <Axis x={margin.l} y={margin.t} w={w} h={h} scale={sy} ticks={yT} orient="left" label={yLabel} fmt={fmtY} />
    </svg>
  );
}

// Coefficient forest plot
function CoefPlot({specs, width=780, height=320, domain, refLine=0, margin={t:30,r:30,b:50,l:300}}) {
  const w = width - margin.l - margin.r;
  const h = height - margin.t - margin.b;
  const sx = linScale(domain, [0, w]);
  const rowH = h / specs.length;
  const xTicks = [];
  const step = (domain[1] - domain[0]) / 4;
  for (let i = 0; i <= 4; i++) xTicks.push(domain[0] + i*step);

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${margin.l},${margin.t})`}>
        <line x1={sx(refLine)} x2={sx(refLine)} y1={0} y2={h} stroke={COLORS.ink} strokeWidth={0.75} />
        {specs.map((s, i) => {
          const y = rowH * i + rowH/2;
          const sig = s.p < 0.05;
          const col = sig ? (s.beta < 0 ? COLORS.accent : COLORS.green) : COLORS.muted;
          return (
            <g key={i}>
              <line x1={sx(s.lo)} x2={sx(s.hi)} y1={y} y2={y} stroke={col} strokeWidth={1.2} />
              <line x1={sx(s.lo)} x2={sx(s.lo)} y1={y-4} y2={y+4} stroke={col} />
              <line x1={sx(s.hi)} x2={sx(s.hi)} y1={y-4} y2={y+4} stroke={col} />
              <rect x={sx(s.beta)-4} y={y-4} width={8} height={8} fill={col} />
              <text x={-12} y={y+3} textAnchor="end" style={{fontFamily:'JetBrains Mono',fontSize:10.5,fill:COLORS.ink}}>
                {s.label}
              </text>
              <text x={w+8} y={y+3} style={{fontFamily:'JetBrains Mono',fontSize:10,fill:col}}>
                β={s.beta.toFixed(4)} · p={fmtP(s.p)}
              </text>
            </g>
          );
        })}
      </g>
      <Axis x={margin.l} y={margin.t+h} w={w} h={h} scale={sx} ticks={xTicks} orient="bottom" label="coefficient on baseline × post-2022" fmt={v => v.toFixed(4)} />
    </svg>
  );
}

// Stacked bar for cost comparison
function CostBars({rows, width=640, height=320, margin={t:30,r:30,b:80,l:80}, logY=true}) {
  const w = width - margin.l - margin.r;
  const h = height - margin.t - margin.b;
  const maxV = Math.max(...rows.map(r => r.value));
  const minV = 0.01;
  const sy = logY ? logScale([minV, maxV*1.2], [h, 0]) : linScale([0, maxV*1.1], [h, 0]);
  const barW = w / rows.length * 0.65;
  const gap = w / rows.length * 0.35;
  const yTicks = logY ? [0.01, 0.1, 1, 10, 100, 1000].filter(v => v <= maxV*1.2) : Array.from({length:6},(_,i)=>maxV*i/5);

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`}>
      <GridLines x={margin.l} y={margin.t} w={w} h={h} ticks={yTicks} scale={sy} />
      <g transform={`translate(${margin.l},${margin.t})`}>
        {rows.map((r, i) => {
          const x = (w / rows.length) * i + gap/2;
          const y = sy(Math.max(minV, r.value));
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h-y} fill={r.color || COLORS.ink} />
              <text x={x+barW/2} y={y-6} textAnchor="middle" style={{fontFamily:'Instrument Serif',fontSize:18,fill:COLORS.ink}}>
                {fmt$(r.value, r.value < 10 ? 2 : 0)}
              </text>
              <text x={x+barW/2} y={h+18} textAnchor="middle" style={{fontFamily:'JetBrains Mono',fontSize:10,fill:COLORS.muted,textTransform:'uppercase',letterSpacing:'0.08em'}}>
                {r.label}
              </text>
              {r.sub && <text x={x+barW/2} y={h+34} textAnchor="middle" style={{fontFamily:'Instrument Serif',fontStyle:'italic',fontSize:12,fill:COLORS.muted}}>{r.sub}</text>}
            </g>
          );
        })}
      </g>
      <Axis x={margin.l} y={margin.t} w={w} h={h} scale={sy} ticks={yTicks} orient="left" label="cost (usd, log)" fmt={v => '$' + (v >= 1 ? v.toFixed(0) : v.toFixed(2))} />
    </svg>
  );
}

// Natural-log scatter — axes show ln(x) / ln(y) directly with numeric ticks,
// mirroring the matplotlib reference figures (fig_h1_metcalfe_*.png).
// `series` is an array of { points: [[x_raw, y_raw], ...], color, opacity?, label? }
// `lines` is an array of { beta, alpha, color, dash?, width?, label? } where the
// line is plotted in NATURAL-log space: ln(y) = alpha + beta * ln(x).
// Pass intercepts from the OLS fullwindow table (in ln space) for accurate placement.
function ScatterLnPlot({
  series, lines = [], width = 720, height = 440,
  xLabel = 'log(Active Addresses)', yLabel = 'log(Transfer Count)',
  xDomain, yDomain, annotations = [],
  margin = { t: 26, r: 20, b: 56, l: 62 },
}) {
  const w = width - margin.l - margin.r;
  const h = height - margin.t - margin.b;

  // Compute domain in ln space from all points if not provided
  const allPts = series.flatMap(s => s.points).filter(p => p[0] > 0 && p[1] > 0);
  const lnXs = allPts.map(p => Math.log(p[0]));
  const lnYs = allPts.map(p => Math.log(p[1]));
  const xd = xDomain || [Math.min(...lnXs) - 0.3, Math.max(...lnXs) + 0.3];
  const yd = yDomain || [Math.min(...lnYs) - 0.5, Math.max(...lnYs) + 0.5];
  const sx = linScale(xd, [0, w]);
  const sy = linScale(yd, [h, 0]);

  // Integer ticks, stepped by 2 if range > 6
  const tickStep = (d) => {
    const range = d[1] - d[0];
    if (range > 12) return 4;
    if (range > 6) return 2;
    return 1;
  };
  const makeTicks = (d, step) => {
    const t = [];
    const lo = Math.ceil(d[0] / step) * step;
    for (let v = lo; v <= d[1]; v += step) t.push(v);
    return t;
  };
  const xTicks = makeTicks(xd, tickStep(xd));
  const yTicks = makeTicks(yd, tickStep(yd));

  // Build line endpoints clipped to viewport
  const clipLine = (beta, alpha) => {
    // ln(y) = alpha + beta * ln(x); we're drawing across xd
    const lx0 = xd[0], lx1 = xd[1];
    const ly0 = alpha + beta * lx0;
    const ly1 = alpha + beta * lx1;
    // clip to yd
    const clip = (lx, ly, lxOther, lyOther) => {
      if (ly < yd[0]) {
        const t = (yd[0] - ly) / (lyOther - ly);
        return [lx + t * (lxOther - lx), yd[0]];
      }
      if (ly > yd[1]) {
        const t = (yd[1] - ly) / (lyOther - ly);
        return [lx + t * (lxOther - lx), yd[1]];
      }
      return [lx, ly];
    };
    const [p0x, p0y] = clip(lx0, ly0, lx1, ly1);
    const [p1x, p1y] = clip(lx1, ly1, lx0, ly0);
    return [p0x, p0y, p1x, p1y];
  };

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`}>
      {/* Grid */}
      <g transform={`translate(${margin.l},${margin.t})`}>
        {yTicks.map((t, i) => (
          <line key={'gh' + i} x1={0} x2={w} y1={sy(t)} y2={sy(t)} stroke={COLORS.line} strokeWidth={0.6} opacity={0.5} />
        ))}
        {xTicks.map((t, i) => (
          <line key={'gv' + i} x1={sx(t)} x2={sx(t)} y1={0} y2={h} stroke={COLORS.line} strokeWidth={0.6} opacity={0.5} />
        ))}
        {/* Points */}
        {series.map((s, si) => (
          <g key={'s' + si}>
            {s.points.filter(p => p[0] > 0 && p[1] > 0).map((p, i) => (
              <circle key={i}
                cx={sx(Math.log(p[0]))}
                cy={sy(Math.log(p[1]))}
                r={s.r || 1.6}
                fill={s.color}
                opacity={s.opacity != null ? s.opacity : 0.42}
              />
            ))}
          </g>
        ))}
        {/* Lines */}
        {lines.map((L, i) => {
          const [x0, y0, x1, y1] = clipLine(L.beta, L.alpha);
          return (
            <line key={'L' + i}
              x1={sx(x0)} y1={sy(y0)}
              x2={sx(x1)} y2={sy(y1)}
              stroke={L.color}
              strokeWidth={L.width || 1.8}
              strokeDasharray={L.dash || 'none'}
              opacity={L.opacity != null ? L.opacity : 1}
            />
          );
        })}
        {/* Annotations (ln-space coords) */}
        {annotations.map((a, i) => (
          <g key={'a' + i} transform={`translate(${sx(a.lnX)},${sy(a.lnY)})`}>
            {a.arrowTo && (() => {
              const dx = sx(a.arrowTo[0]) - sx(a.lnX);
              const dy = sy(a.arrowTo[1]) - sy(a.lnY);
              return <line x1={0} y1={0} x2={dx} y2={dy} stroke={COLORS.muted} strokeWidth={0.7} />;
            })()}
            <text x={a.tx || 0} y={a.ty || 0} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: COLORS.muted }}>
              {a.label}
            </text>
          </g>
        ))}
      </g>
      {/* Axes */}
      <g transform={`translate(${margin.l},${margin.t + h})`}>
        <line x1={0} x2={w} y1={0} y2={0} stroke={COLORS.ink} strokeWidth={0.8} />
        {xTicks.map((t, i) => (
          <g key={i} transform={`translate(${sx(t)},0)`}>
            <line y1={0} y2={5} stroke={COLORS.ink} strokeWidth={0.8} />
            <text y={18} textAnchor="middle" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: COLORS.ink }}>{t}</text>
          </g>
        ))}
        <text x={w / 2} y={42} textAnchor="middle" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: COLORS.ink, letterSpacing: '0.04em' }}>{xLabel}</text>
      </g>
      <g transform={`translate(${margin.l},${margin.t})`}>
        <line x1={0} x2={0} y1={0} y2={h} stroke={COLORS.ink} strokeWidth={0.8} />
        {yTicks.map((t, i) => (
          <g key={i} transform={`translate(0,${sy(t)})`}>
            <line x1={-5} x2={0} stroke={COLORS.ink} strokeWidth={0.8} />
            <text x={-10} y={4} textAnchor="end" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: COLORS.ink }}>{t}</text>
          </g>
        ))}
        <text transform={`rotate(-90) translate(${-h / 2},${-46})`} textAnchor="middle" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: COLORS.ink, letterSpacing: '0.04em' }}>{yLabel}</text>
      </g>
    </svg>
  );
}

Object.assign(window, { COLORS, fmt, fmtP, fmt$, linScale, logScale, Axis, GridLines, ScatterLog, ScatterLnPlot, TimeSeries, CoefPlot, CostBars });
