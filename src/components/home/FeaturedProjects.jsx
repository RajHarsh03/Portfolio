import { useProjects } from '../../hooks/useProjects.js';
import { GH_USER } from '../../services/githubProjects.js';
import { useReveal } from '../../hooks/useReveal.js';
import CompactProjectCard from '../projects/CompactProjectCard.jsx';

/** Skeleton card shown while loading */
function SkeletonCard() {
  return (
    <div className="compact-project-card">
      <div className="cpc-thumbnail">
        <div className="skel-block" style={{ width: '100%', height: '100%', borderRadius: 12 }} />
      </div>
      <div className="cpc-content">
        <div className="cpc-header">
          <div className="skel-block" style={{ width: '70%', height: 20, borderRadius: 6, marginBottom: '.5rem' }} />
          <div className="skel-block" style={{ width: '40%', height: 14, borderRadius: 4, marginBottom: '.75rem' }} />
        </div>
        <div className="skel-block" style={{ width: '100%', height: 12, borderRadius: 4, marginBottom: '.4rem' }} />
        <div className="skel-block" style={{ width: '90%', height: 12, borderRadius: 4 }} />
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

      <div className="compact-projects-list" id="homeProjectsGrid">
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
        {!loading && projects.map(p => (
          <CompactProjectCard 
            key={p.repoName} 
            project={p}
          />
        ))}
      </div>
    </section>
  );
}
