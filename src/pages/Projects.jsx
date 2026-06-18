import { useState, useMemo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useProjects } from '../hooks/useProjects.js';
import { TECH_ICON_MAP, GH_USER } from '../services/githubProjects.js';
import { useReveal } from '../hooks/useReveal.js';

const SHOW_LIMIT = 4;
const FILTERS = [
  { value: 'all',       label: 'All'       },
  { value: 'frontend',  label: 'Frontend'  },
  { value: 'fullstack', label: 'Full Stack' },
  { value: 'ai',        label: 'AI / ML'   },
];
const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'a-z',    label: 'A → Z'        },
  { value: 'z-a',    label: 'Z → A'        },
];

function ProjectCard({ p }) {
  const ghImg     = `https://raw.githubusercontent.com/${GH_USER}/${p.repoName}/HEAD/preview.png`;
  const ghFallback = `https://opengraph.githubassets.com/1/${GH_USER}/${p.repoName}`;
  const techIcons  = (p.rawTopics || []).filter(t => TECH_ICON_MAP[t]).slice(0, 6);

  return (
    <div className="project-card reveal" data-category={p.category} data-rank={p.rank}>
      <div className="project-card-glow" />
      <div className={`project-status${p.completed ? ' completed' : ''}`}>
        {p.completed ? 'Completed' : 'In Progress'}
      </div>
      <div className="project-img-wrap">
        <img src={ghImg} alt={`${p.name} preview`} loading="lazy"
          onError={e => {
            if (e.currentTarget.src !== ghFallback) e.currentTarget.src = ghFallback;
            else e.currentTarget.closest('.project-img-wrap').style.display = 'none';
          }}
        />
      </div>
      <div className="project-body">
        <div className="project-title-row">
          <div className="project-title">{p.name}</div>
          {p.projectType && (
            <span className={`project-type-pill ${p.projectType.cls}`}>{p.projectType.label}</span>
          )}
        </div>
        <div className="project-desc">{p.description}</div>
        {techIcons.length > 0 && (
          <div className="project-tech-row">
            {techIcons.map(t => (
              <img key={t} className="proj-tech-icon" src={TECH_ICON_MAP[t]} alt={t} title={t} loading="lazy" />
            ))}
          </div>
        )}
      </div>
      <div className="project-footer">
        <a className="proj-btn proj-btn-gh" href={p.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        </a>
        {p.live
          ? <a className="proj-btn proj-btn-live" href={p.live} target="_blank" rel="noopener noreferrer">Live ↗</a>
          : <span />}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="project-card">
      <div className="project-body">
        <div className="skel-block" style={{ width: '60%', height: 22, borderRadius: 6, marginBottom: '1rem' }} />
        <div className="skel-block" style={{ width: '100%', height: 12, borderRadius: 4, marginBottom: '.5rem' }} />
        <div className="skel-block" style={{ width: '80%', height: 12, borderRadius: 4, marginBottom: '.5rem' }} />
        <div className="skel-block" style={{ width: '65%', height: 12, borderRadius: 4 }} />
      </div>
      <div className="project-footer" style={{ borderTop: '1px solid var(--border)', padding: '1rem', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <div className="skel-block" style={{ width: 78, height: 28, borderRadius: 8 }} />
          <div className="skel-block" style={{ width: 60, height: 28, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { projects, loading, error } = useProjects();
  const ref = useReveal();

  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('all');
  const [sort,       setSort]       = useState('newest');
  const [expanded,   setExpanded]   = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen,   setSortOpen]   = useState(false);

  const filterRef = useRef(null);
  const sortRef   = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
      if (sortRef.current   && !sortRef.current.contains(e.target))   setSortOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    let list = [...projects];

    if (filter !== 'all') list = list.filter(p => p.category === filter);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.stack.join(' ').toLowerCase().includes(q)
      );
    }

    if (sort === 'newest') {
      list.sort((a, b) => {
        const ra = Number.isFinite(a.rank) ? a.rank : 9999;
        const rb = Number.isFinite(b.rank) ? b.rank : 9999;
        return ra !== rb ? ra - rb : new Date(b.updatedAt) - new Date(a.updatedAt);
      });
    } else if (sort === 'oldest') {
      list.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    } else if (sort === 'a-z') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }

    return list;
  }, [projects, filter, search, sort]);

  const hasActive  = search.trim() || filter !== 'all';
  const showAll    = hasActive || expanded;
  const visible    = showAll ? filtered : filtered.slice(0, SHOW_LIMIT);
  const hiddenCount = filtered.length - SHOW_LIMIT;

  return (
    <>
      <Helmet>
        <title>Projects</title>
        <meta name="description" content="A complete collection of everything I've built — filtered by category." />
      </Helmet>

      <div style={{ paddingTop: '5rem' }} ref={ref}>
        <div className="projects-page-header">
          <h1>All Projects</h1>
          <p>A complete collection of everything I've built — filtered by category.</p>
        </div>

        <section id="allProjects">
          {/* Toolbar */}
          <div className="toolbar-row">
            {/* Search */}
            <div className="toolbar-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={e => { setSearch(e.target.value); setExpanded(false); }}
                autoComplete="off"
              />
            </div>

            {/* Sort */}
            <div className="sort-wrap" ref={sortRef}>
              <button className={`sort-toggle${sortOpen ? ' open' : ''}`} onClick={() => { setSortOpen(o => !o); setFilterOpen(false); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5h10M11 9h7M11 13h4M3 17l4 4 4-4M7 3v18"/>
                </svg>
                Sort
              </button>
              <div className={`sort-dropdown${sortOpen ? ' show' : ''}`}>
                {SORTS.map(s => (
                  <button key={s.value}
                    className={`sort-option${sort === s.value ? ' active' : ''}`}
                    onClick={() => { setSort(s.value); setSortOpen(false); setExpanded(false); }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter */}
            <div className="filter-wrap" ref={filterRef}>
              <button className={`filter-toggle${filterOpen ? ' open' : ''}`} onClick={() => { setFilterOpen(o => !o); setSortOpen(false); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filter
              </button>
              <div className={`filter-dropdown${filterOpen ? ' show' : ''}`}>
                {FILTERS.map(f => (
                  <button key={f.value}
                    className={`filter-option${filter === f.value ? ' active' : ''}`}
                    onClick={() => { setFilter(f.value); setFilterOpen(false); setExpanded(false); }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Count row */}
          <div className="count-row">
            <span className="projects-count">
              {loading ? 'Loading…' : (
                visible.length < filtered.length
                  ? <>Showing <strong>{visible.length}</strong> of <strong>{filtered.length}</strong> projects</>
                  : <>Showing <strong>{filtered.length}</strong> project{filtered.length !== 1 ? 's' : ''}</>
              )}
            </span>
          </div>

          {/* Grid */}
          <div className="projects-grid">
            {loading && <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>}

            {!loading && error && (
              <div className="no-results">
                <span className="nr-icon">⚠️</span>
                <span className="nr-title">Could not load projects</span>
                <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                  View on GitHub ↗
                </a>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="no-results">
                <span className="nr-icon">🔍</span>
                <span className="nr-title">No projects found</span>
                Try a different search term or filter.
              </div>
            )}

            {!loading && !error && visible.map(p => <ProjectCard key={p.repoName} p={p} />)}
          </div>

          {/* Show More / Less */}
          {!loading && !error && !hasActive && filtered.length > SHOW_LIMIT && (
            <div className="show-more-wrap">
              <button className="show-more-btn" onClick={() => setExpanded(e => !e)}>
                {expanded
                  ? 'Show Less ↑'
                  : <>Show More <span style={{ opacity: .55, fontSize: '.82em' }}>({hiddenCount} more)</span> ↓</>
                }
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
