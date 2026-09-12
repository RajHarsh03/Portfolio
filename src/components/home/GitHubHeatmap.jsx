import { useEffect, useRef, useState, useCallback } from 'react';
import { fetchContributions, GH_USER } from '../../services/githubContributions.js';
import { useReveal } from '../../hooks/useReveal.js';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const COLORS_DARK  = ['#2d333b','#0e4429','#006d32','#26a641','#39d353'];
const COLORS_LIGHT = ['#c8d0d8','#9be9a8','#40c463','#30a14e','#216e39'];

function pickColor(count, colors) {
  if (count === 0) return colors[0];
  if (count <= 3)  return colors[1];
  if (count <= 6)  return colors[2];
  if (count <= 9)  return colors[3];
  return colors[4];
}

function buildWeeks(contributions) {
  const map = {};
  contributions.forEach(c => { map[c.date] = c.count; });

  const today      = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  oneYearAgo.setDate(oneYearAgo.getDate() + 1);

  const weeks = [];
  let week = [];
  const startDay = oneYearAgo.getDay();
  for (let i = 0; i < startDay; i++) week.push(null);

  const d = new Date(oneYearAgo);
  while (d <= today) {
    const key = d.toISOString().slice(0, 10);
    week.push({ date: key, count: map[key] || 0, month: d.getMonth() });
    if (week.length === 7) { weeks.push(week); week = []; }
    d.setDate(d.getDate() + 1);
  }
  if (week.length > 0) weeks.push(week);
  return weeks;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function GitHubHeatmap() {
  const canvasRef  = useRef(null);
  const wrapRef    = useRef(null);
  const layoutRef  = useRef({});
  const ref        = useReveal();

  const [contribData,  setContribData]  = useState(null);
  const [contribTotal, setContribTotal] = useState(null);
  const [failed,       setFailed]       = useState(false);
  const [tooltip,      setTooltip]      = useState(null); // {text, x, y}

  useEffect(() => {
    fetchContributions()
      .then(({ contributions, total }) => { setContribData(contributions); setContribTotal(total); })
      .catch(() => setFailed(true));
  }, []);

  const draw = useCallback((contributions) => {
    const canvas = canvasRef.current;
    if (!canvas || !contributions?.length) return;

    const ctx       = canvas.getContext('2d');
    const dpr       = window.devicePixelRatio || 1;
    const container = canvas.parentElement;
    const avail     = container.clientWidth;
    const theme     = document.documentElement.getAttribute('data-theme') || 'light';
    const isLight   = theme === 'light';
    const colors    = isLight ? COLORS_LIGHT : COLORS_DARK;
    const textColor = isLight ? '#57606a' : '#8b949e';

    const weeks   = buildWeeks(contributions);
    const cols    = weeks.length;
    const padding = 4;
    const cellSize = Math.max(9, Math.floor((avail - 2 * padding) / (cols * 1.22)));
    const gap      = Math.max(2, Math.round(cellSize * 0.22));
    const step     = cellSize + gap;
    const radius   = Math.max(2, Math.round(cellSize * 0.2));
    const labelTop = 16;
    const gridW    = cols * step - gap;
    const width    = avail;
    const height   = labelTop + 7 * step;

    canvas.width  = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const offsetX = Math.floor((width - gridW) / 2);

    // Store layout for tooltip hit-testing
    layoutRef.current = { weeks, offsetX, step, cellSize, labelTop, cols };

    // Month labels
    const fontSize = 11;
    ctx.font = `${fontSize}px "DM Mono", monospace`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'top';
    let lastMonth = -1;
    let lastLabelX = -100;
    weeks.forEach((week, wi) => {
      const first = week.find(c => c);
      if (first && first.month !== lastMonth) {
        const x = offsetX + wi * step;
        if (x - lastLabelX > fontSize * 3.5) {
          ctx.fillText(MONTHS[first.month], x, 0);
          lastLabelX = x;
        }
        lastMonth = first.month;
      }
    });

    // Cells
    weeks.forEach((week, wi) => {
      week.forEach((cell, di) => {
        if (!cell) return;
        const x = offsetX + wi * step;
        const y = labelTop + di * step;
        ctx.fillStyle = pickColor(cell.count, colors);
        ctx.beginPath();
        ctx.roundRect(x, y, cellSize, cellSize, radius);
        ctx.fill();
      });
    });
  }, []);

  useEffect(() => {
    if (!contribData?.length) return;
    draw(contribData);

    const mo = new MutationObserver(() => draw(contribData));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const ro = new ResizeObserver(() => draw(contribData));
    if (wrapRef.current) ro.observe(wrapRef.current);

    return () => { mo.disconnect(); ro.disconnect(); };
  }, [contribData, draw]);

  // Tooltip on mouse move
  function handleMouseMove(e) {
    const canvas = canvasRef.current;
    if (!canvas || !layoutRef.current.weeks) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { weeks, offsetX, step, cellSize, labelTop } = layoutRef.current;

    let found = null;
    outer: for (let wi = 0; wi < weeks.length; wi++) {
      for (let di = 0; di < weeks[wi].length; di++) {
        const cell = weeks[wi][di];
        if (!cell) continue;
        const x = offsetX + wi * step;
        const y = labelTop + di * step;
        if (mx >= x && mx <= x + cellSize && my >= y && my <= y + cellSize) {
          found = { cell, cx: x + cellSize / 2, cy: y };
          break outer;
        }
      }
    }

    if (found) {
      const { cell, cx, cy } = found;
      const text = cell.count === 0
        ? `No contributions on ${formatDate(cell.date)}`
        : `${cell.count} contribution${cell.count > 1 ? 's' : ''} on ${formatDate(cell.date)}`;
      setTooltip({ text, x: cx, y: cy - 8 });
    } else {
      setTooltip(null);
    }
  }

  const year = new Date().getFullYear();
  const isLight = typeof document !== 'undefined'
    ? document.documentElement.getAttribute('data-theme') === 'light'
    : true;
  const legendColors = isLight ? COLORS_LIGHT : COLORS_DARK;

  return (
    <section className="gh-activity-section" id="ghActivity" ref={ref}>
      <div className="section-label">// contribution</div>
      <h2 className="section-title reveal">GitHub Activity</h2>

      <div className="gh-heatmap-card">
        {/* Top: contribution count + year */}
        <div className="gh-heatmap-top">
          {contribTotal != null
            ? <span className="gh-contrib-count">{Number(contribTotal).toLocaleString()} contributions in {year}</span>
            : <span className="gh-contrib-count">{failed ? '' : 'Loading…'}</span>
          }
        </div>

        {/* Canvas */}
        <div className="gh-canvas-wrap" ref={wrapRef} style={{ position: 'relative' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
        >
          {!failed && <canvas ref={canvasRef} />}

          {/* Tooltip */}
          {tooltip && (
            <div className="gh-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
              {tooltip.text}
            </div>
          )}
        </div>

        {/* Footer: username left, Less/More legend right */}
        <div className="gh-heatmap-footer">
          <a
            href={`https://github.com/${GH_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gh-username-link"
          >
            @{GH_USER}
          </a>
          <div className="gh-legend">
            <span>Less</span>
            <div className="gh-legend-squares">
              {legendColors.map((c, i) => (
                <div key={i} className="gh-legend-sq" style={{ background: c }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
