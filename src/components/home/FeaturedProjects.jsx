import { Link } from 'react-router-dom';import { useProjects } from '../../hooks/useProjects.js';
import { TECH_ICON_MAP, GH_USER } from '../../services/githubProjects.js';
import { useReveal } from '../../hooks/useReveal.js';

/** Skeleton card shown while loading */
function SkeletonCard() {
  return (
    <div className="project-card">
      <div className="project-card-glow" />
      <div className="project-body">
        <div className="skel-block" style={{ width: '60%', height: 22, borderRadius: 6, marginBottom: '1rem' }} />
        <div className="skel-block" style={{ width: '100%', height: 12, borderRadius: 4, marginBottom: '.5rem' }} />
        <div className="skel-block" style={{ width: '88%', height: 12, borderRadius: 4, marginBottom: '.5rem' }} />
        <div className="skel-block" style={{ width: '72%', height: 12, borderRadius: 4, marginBottom: '1.2rem' }} />
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <div className="skel-block" style={{ width: 64, height: 24, borderRadius: 999 }} />
          <div className="skel-block" style={{ width: 72, height: 24, borderRadius: 999 }} />
        </div>
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

/** Full project card */
function ProjectCard({ p }) {
  const ghImgUrl      = `https://raw.githubusercontent.com/${GH_USER}/${p.repoName}/HEAD/preview.png`;
  const ghImgFallback = `https://opengraph.githubassets.com/1/${GH_USER}/${p.repoName}`;

  const techIcons = (p.rawTopics || [])
    .filter(t => TECH_ICON_MAP[t])
    .slice(0, 6);

  return (
    <div
      className="project-card reveal"
      data-category={p.category}
      data-rank={p.rank}
    >
      <div className="project-card-glow" />

      {/* Status badge */}
      <div className={`project-status${p.completed ? ' completed' : ''}`}>
        {p.completed ? 'Completed' : 'In Progress'}
      </div>

      {/* Preview image */}
      <div className="project-img-wrap">
        <img
          src={ghImgUrl}
          alt={`${p.name} preview`}
          loading="lazy"
          onError={e => {
            if (e.currentTarget.src !== ghImgFallback) {
              e.currentTarget.src = ghImgFallback;
            } else {
              e.currentTarget.closest('.project-img-wrap').style.display = 'none';
            }
          }}
        />
      </div>

      {/* Body */}
      <div className="project-body">
        <div className="project-title-row">
          <div className="project-title">{p.name}</div>
          {p.projectType && (
            <span className={`project-type-pill ${p.projectType.cls}`}>
              {p.projectType.label}
            </span>
          )}
        </div>
        <div className="project-desc">{p.description}</div>
        {techIcons.length > 0 && (
          <div className="project-tech-row">
            {techIcons.map(t => (
              <img
                key={t}
                className="proj-tech-icon"
                src={TECH_ICON_MAP[t]}
                alt={t}
                title={t}
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="project-footer">
        <a
          className="proj-btn proj-btn-gh"
          href={p.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>
        {p.live ? (
          <a className="proj-btn proj-btn-live" href={p.live} target="_blank" rel="noopener noreferrer">
            Live ↗
          </a>
        ) : <span />}
      </div>
    </div>
  );
}

export default function FeaturedProjects() {
  const { projects, loading, error } = useProjects({ limit: 2 });
  const ref = useReveal();

  return (
    <section id="projects" ref={ref}>
      <div className="section-label">// featured work</div>
      <h2 className="section-title reveal">Projects</h2>

      <div className="projects-grid" id="homeProjectsGrid">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {!loading && error && (
          <p style={{ gridColumn: '1/-1', fontFamily: 'DM Mono,monospace', fontSize: '.85rem', color: 'var(--muted)', textAlign: 'center', padding: '2rem 0' }}>
            Could not load projects.{' '}
            <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
              View on GitHub ↗
            </a>
          </p>
        )}
        {!loading && !error && projects.length === 0 && (
          <p style={{ gridColumn: '1/-1', fontFamily: 'DM Mono,monospace', fontSize: '.85rem', color: 'var(--muted)', textAlign: 'center', padding: '2rem 0' }}>
            No projects tagged "portfolio" yet.
          </p>
        )}
        {!loading && projects.map(p => <ProjectCard key={p.repoName} p={p} />)}
      </div>

      <div className="projects-view-all">
        <Link to="/projects" className="projects-view-all-btn">
          Show all projects
        </Link>
      </div>
    </section>
  );
}
