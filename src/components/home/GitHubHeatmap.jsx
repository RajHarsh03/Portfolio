import { useEffect, useRef, useState } from 'react';
import { fetchContributions, GH_USER } from '../../services/githubContributions.js';
import { useReveal } from '../../hooks/useReveal.js';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// CSS variable names for each level — defined in index.css per theme
const LEVEL_VARS = [
  'var(--hm-0)',
  'var(--hm-1)',
  'var(--hm-2)',
  'var(--hm-3)',
  'var(--hm-4)',
];

function pickLevel(count) {
  if (count === 0) return 0;
  if (count <= 3)  return 1;
  if (count <= 6)  return 2;
  if (count <= 9)  return 3;
  return 4;
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
  for (let i = 0; i < oneYearAgo.getDay(); i++) week.push(null);
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

// Build month label row: one label per column, only shown when month changes
function buildMonthLabels(weeks) {
  let lastMonth = -1;
  return weeks.map((week, wi) => {
    const first = week.find(c => c);
    if (first && first.month !== lastMonth) {
      lastMonth = first.month;
      return { wi, label: MONTHS[first.month] };
    }
    return null;
  }).filter(Boolean);
}

export default function GitHubHeatmap() {
  const wrapRef = useRef(null);
  const ref     = useReveal();

  const [weeks,        setWeeks]        = useState(null);
  const [contribTotal, setContribTotal] = useState(null);
  const [failed,       setFailed]       = useState(false);
  const [tooltip,      setTooltip]      = useState(null);

  useEffect(() => {
    fetchContributions()
      .then(({ contributions, total }) => {
        setWeeks(buildWeeks(contributions));
        setContribTotal(total);
      })
      .catch(() => setFailed(true));
  }, []);

  function handleMouseEnter(e, cell) {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    const cellRect = e.currentTarget.getBoundingClientRect();
    const cx = cellRect.left + cellRect.width / 2 - wrapRect.left + wrap.scrollLeft;
    const cy = cellRect.top - wrapRect.top + wrap.scrollTop;
    const text = cell.count === 0
      ? `No contributions on ${formatDate(cell.date)}`
      : `${cell.count} contribution${cell.count > 1 ? 's' : ''} on ${formatDate(cell.date)}`;
    // Clamp tooltip x so it stays inside the visible card area
    const cardWidth = wrap.offsetWidth;
    const tx = Math.min(Math.max(cx - wrap.scrollLeft, 80), cardWidth - 80);
    setTooltip({ text, x: tx, y: cy - 4 + 48 });
  }

  const year        = new Date().getFullYear();
  const monthLabels = weeks ? buildMonthLabels(weeks) : [];
  const labelMap    = Object.fromEntries(monthLabels.map(m => [m.wi, m.label]));

  return (
    <section className="gh-activity-section" id="ghActivity" ref={ref}>
      <div className="section-label">// contribution</div>
      <h2 className="section-title reveal">GitHub Activity</h2>

      <div className="gh-heatmap-card">
        {/* Top */}
        <div className="gh-heatmap-top">
          <span className="gh-contrib-count">
            {contribTotal != null
              ? `${Number(contribTotal).toLocaleString()} contributions in ${year}`
              : failed ? '' : 'Loading…'}
          </span>
        </div>

        {/* Grid */}
        <div className="gh-canvas-wrap" style={{ position: 'relative' }}
          onMouseLeave={() => setTooltip(null)}
        >
          <div className="gh-scroll-inner" ref={wrapRef}>
          {!failed && weeks && (
            <div className="gh-grid">
              {/* Month label row */}
              <div className="gh-month-row">
                {weeks.map((_, wi) => (
                  <div key={wi} className="gh-month-cell">
                    {labelMap[wi] || ''}
                  </div>
                ))}
              </div>

              {/* 7 day-rows */}
              {[0,1,2,3,4,5,6].map(di => (
                <div key={di} className="gh-day-row">
                  {weeks.map((week, wi) => {
                    const cell = week[di];
                    if (!cell) {
                      return <div key={wi} className="gh-cell gh-cell--empty" />;
                    }
                    return (
                      <div
                        key={wi}
                        className="gh-cell"
                        style={{ background: LEVEL_VARS[pickLevel(cell.count)] }}
                        onMouseEnter={e => handleMouseEnter(e, cell)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          )}
          </div>{/* gh-scroll-inner */}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div className="gh-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            {tooltip.text}
          </div>
        )}

        {/* Legend */}
        <div className="gh-heatmap-footer">
          <div className="gh-legend">
            <span>Less</span>
            <div className="gh-legend-squares">
              {LEVEL_VARS.map((v, i) => (
                <div key={i} className="gh-legend-sq" style={{ background: v }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
