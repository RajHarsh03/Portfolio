import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useProjects } from '../hooks/useProjects.js';
import { GH_USER } from '../services/githubProjects.js';
import { useReveal } from '../hooks/useReveal.js';

const SHOW_LIMIT = 4;
const FILTERS = [
  { value: 'all',       label: 'All'         },
  { value: 'fullstack', label: 'Web Apps'    },
  { value: 'ai',        label: 'AI & ML'     },
  { value: 'data',      label: 'Data Science'}
];

function ProjectCard({ p }) {
  const ghImg      = `https://raw.githubusercontent.com/${GH_USER}/${p.repoName}/HEAD/preview.png`;
  const ghFallback = `https://opengraph.githubassets.com/1/${GH_USER}/${p.repoName}`;
  const techTags   = (p.rawTopics || []).filter(t => !['portfolio','featured'].includes(t)).slice(0, 5);
  const isLive     = p.completed;

  return (
    <div className="project-card reveal" data-category={p.category} data-rank={p.rank}>
      <div className="project-card-glow" />

      {/* Preview image */}
      <div className="project-img-wrap">
        <img src={ghImg} alt={`${p.name} preview`} loading="lazy"
          onError={e => {
            if (e.currentTarget.src !== ghFallback) e.currentTarget.src = ghFallback;
            else e.currentTarget.closest('.project-img-wrap').style.display = 'none';
          }}
        />
      </div>

      {/* Body */}
      <div className="project-body">
        <div className="project-title-row">
          <div className="project-title">{p.name}</div>
          <div className={`project-status-dot${isLive ? ' live' : ''}`}>
            <span className="status-dot" />
            {isLive ? 'Live' : 'Building'}
          </div>
        </div>
        {p.projectType && <div className="project-subtitle">{p.projectType.label}</div>}
        <div className="project-desc">{p.description}</div>
        {techTags.length > 0 && (
          <div className="project-tech-tags">
            {techTags.map(t => <span key={t} className="project-tech-tag">{t}</span>)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="project-footer">
        {p.live
          ? <a className="proj-footer-btn" href={p.live} target="_blank" rel="noopener noreferrer">Live link</a>
          : <span className="proj-footer-btn disabled">Live link</span>
        }
        <div className="proj-footer-divider" />
        <a className="proj-footer-btn" href={p.github} target="_blank" rel="noopener noreferrer">
          GitHub
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        </a>
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

  const [filter,     setFilter]     = useState('all');
  const [expanded,   setExpanded]   = useState(false);

  const filtered = useMemo(() => {
    let list = [...projects];
    if (filter !== 'all') list = list.filter(p => p.category === filter);
    list.sort((a, b) => {
      const ra = Number.isFinite(a.rank) ? a.rank : 9999;
      const rb = Number.isFinite(b.rank) ? b.rank : 9999;
      return ra !== rb ? ra - rb : new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    return list;
  }, [projects, filter]);

  const showAll     = expanded;
  const visible     = showAll ? filtered : filtered.slice(0, SHOW_LIMIT);
  const hiddenCount = filtered.length - SHOW_LIMIT;

  return (
    <>
      <Helmet>
        <title>Projects</title>
        <meta name="description" content="A complete collection of everything I've built — filtered by category." />
      </Helmet>

      <div style={{ paddingTop: '4.5rem' }} ref={ref}>
        <div className="projects-page-header">
          <div className="projects-header-row">
            <h1 className="section-title">Projects</h1>
            <span className="projects-count-badge">{loading ? '—' : `${filtered.length.toString().padStart(2,'0')} BUILT`}</span>
          </div>
          {/* Filter pills */}
          <div className="projects-filter-pills">
            {FILTERS.map(f => (
              <button
                key={f.value}
                className={`filter-pill${filter === f.value ? ' active' : ''}`}
                onClick={() => { setFilter(f.value); setExpanded(false); }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <section id="allProjects">
          {/* Grid */}
          <div className="projects-grid">
            {loading && <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>}

            {!loading && error && (
              <div className="no-results">
                <span className="nr-title">Could not load projects</span>
                <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                  View on GitHub ↗
                </a>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="no-results">
                <span className="nr-title">No projects found</span>
                Try a different search term or filter.
              </div>
            )}

            {!loading && !error && visible.map(p => <ProjectCard key={p.repoName} p={p} />)}
          </div>

          {/* Show More / Less */}
          {!loading && !error && filtered.length > SHOW_LIMIT && (
            <div className="show-more-wrap">
              <button className="show-more-btn" onClick={() => setExpanded(e => !e)}>
                {expanded
                  ? 'Show Less'
                  : <>Show More <span style={{ opacity: .55, fontSize: '.82em' }}>({hiddenCount} more)</span></>
                }
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
