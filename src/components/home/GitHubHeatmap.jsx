import { useEffect, useRef, useState } from 'react';
import { fetchContributions, GH_USER } from '../../services/githubContributions.js';
import { useReveal } from '../../hooks/useReveal.js';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const COLORS_DARK  = ['#1e2a1e','#0e4429','#006d32','#26a641','#39d353'];
const COLORS_LIGHT = ['#dadfe5','#9be9a8','#40c463','#30a14e','#216e39'];

function pickColor(count, colors) {
  if (count === 0) return colors[0];
  if (count <= 3)  return colors[1];
  if (count <= 6)  return colors[2];
  if (count <= 9)  return colors[3];
  return colors[4];
}

function buildWeeks(contributions) {
  const contribMap = {};
  contributions.forEach(c => { contribMap[c.date] = c.count; });

  const today      = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  oneYearAgo.setDate(oneYearAgo.getDate() + 1);

  const weeks = [];
  let week    = [];

  // Pad start of first week
  const startDay = oneYearAgo.getDay();
  for (let i = 0; i < startDay; i++) week.push(null);

  const d = new Date(oneYearAgo);
  while (d <= today) {
    const key = d.toISOString().slice(0, 10);
    week.push({ date: key, count: contribMap[key] || 0, month: d.getMonth() });
    if (week.length === 7) { weeks.push(week); week = []; }
    d.setDate(d.getDate() + 1);
  }
  if (week.length > 0) weeks.push(week);

  return weeks;
}

function renderHeatmap(canvas, contributions, theme) {
  if (!canvas || !contributions.length) return;

  const ctx        = canvas.getContext('2d');
  const dpr        = window.devicePixelRatio || 1;
  const container  = canvas.parentElement;
  const availWidth = container.clientWidth;
  const isLight    = theme === 'light';
  const colors     = isLight ? COLORS_LIGHT : COLORS_DARK;
  const textColor  = isLight ? '#656d76' : '#8b949e';

  const weeks   = buildWeeks(contributions);
  const cols    = weeks.length;
  const padding = 8;

  const MIN_CELL = 9;
  const fitCell  = Math.floor((availWidth - 2 * padding) / (cols + (cols - 1) * 0.28));
  const cellSize = Math.max(MIN_CELL, fitCell);
  const gap      = Math.max(2, Math.round(cellSize * 0.28));
  const step     = cellSize + gap;
  const radius   = Math.max(2, Math.round(cellSize * 0.22));
  const labelTop = Math.max(16, Math.round(cellSize * 1.6));
  const gridW    = cols * step - gap;
  const width    = Math.max(availWidth, gridW + 2 * padding);
  const height   = labelTop + 7 * step + gap;

  canvas.width  = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width  = width  + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const offsetX = width > gridW + 2 * padding
    ? Math.floor((width - gridW) / 2)
    : padding;

  const fontSize   = Math.max(9, Math.min(12, Math.round(cellSize * 0.85)));
  const minLabelGap = fontSize * 3.2;
  ctx.font          = `${fontSize}px "DM Mono", monospace`;
  ctx.fillStyle     = textColor;
  ctx.textBaseline  = 'top';

  let lastMonth  = -1;
  let lastLabelX = -100;

  weeks.forEach((week, wi) => {
    const first = week.find(c => c);
    if (first && first.month !== lastMonth) {
      const x = offsetX + wi * step;
      if (x - lastLabelX > minLabelGap) {
        ctx.fillText(MONTHS[first.month], x, 2);
        lastLabelX = x;
      }
      lastMonth = first.month;
    }
  });

  weeks.forEach((week, wi) => {
    week.forEach((cell, di) => {
      if (!cell) return;
      const x = offsetX + wi * step;
      const y = labelTop + di * step;
      ctx.fillStyle = pickColor(cell.count, colors);
      ctx.beginPath();
      ctx.roundRect(x, y, cellSize, cellSize, radius);
      ctx.fill();
      if (cell.count === 0) {
        ctx.strokeStyle = isLight ? '#c4cad0' : 'rgba(255,255,255,.04)';
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      }
    });
  });
}

export default function GitHubHeatmap() {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const ref       = useReveal();

  const [contribData, setContribData]   = useState(null);
  const [contribTotal, setContribTotal] = useState(null);
  const [failed, setFailed]             = useState(false);

  // Fetch contribution data once
  useEffect(() => {
    fetchContributions()
      .then(({ contributions, total }) => {
        setContribData(contributions);
        setContribTotal(total);
      })
      .catch(() => setFailed(true));
  }, []);

  // Draw / redraw on data, theme change, or resize
  useEffect(() => {
    if (!contribData?.length) return;

    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    renderHeatmap(canvasRef.current, contribData, theme);

    // Re-draw on theme mutation
    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute('data-theme') || 'light';
      renderHeatmap(canvasRef.current, contribData, t);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Re-draw on resize
    function onResize() {
      const t = document.documentElement.getAttribute('data-theme') || 'light';
      renderHeatmap(canvasRef.current, contribData, t);
    }
    window.addEventListener('resize', onResize);

    return () => { observer.disconnect(); window.removeEventListener('resize', onResize); };
  }, [contribData]);

  // Responsive contribution text
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width:520px)').matches;
  let contribText = "RajHarsh03's coding journey";
  if (contribTotal != null) {
    contribText = isMobile
      ? `${Number(contribTotal).toLocaleString()} contributions`
      : `${Number(contribTotal).toLocaleString()} contributions in the last year`;
  }

  return (
    <section className="gh-activity-section" id="ghActivity" ref={ref}>
      <div className="section-label">// contribution</div>
      <h2 className="section-title reveal">GitHub Activity</h2>

      <div className="gh-activity-card">
        <div className="gh-activity-header">
          <div className="gh-activity-meta">
            <span className="gh-activity-stat">
              <span className="stat-dot-green" />
              <span id="ghContribText">
                {contribTotal == null && !failed ? 'Loading contributions…' : contribText}
              </span>
            </span>
          </div>
          <a
            href={`https://github.com/${GH_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gh-profile-link"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            @{GH_USER}
          </a>
        </div>

        <div className="gh-chart-wrap" ref={wrapRef}>
          {failed ? null : <canvas ref={canvasRef} id="ghChartCanvas" height="140" />}
        </div>

        {!failed && (
          <div className="gh-legend">
            Less
            <div className="gh-legend-squares">
              {[0,1,2,3,4].map(n => (
                <div key={n} className={`gh-legend-sq gh-lv${n}`} />
              ))}
            </div>
            More
          </div>
        )}
      </div>
    </section>
  );
}
