import { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useProjects } from '../hooks/useProjects.js';
import { GH_USER } from '../services/githubProjects.js';
import { useReveal } from '../hooks/useReveal.js';
import CompactProjectCard from '../components/projects/CompactProjectCard.jsx';

const SHOW_LIMIT_DESKTOP = 6;
const SHOW_LIMIT_MOBILE_INITIAL = 3;
const SHOW_LIMIT_MOBILE_INCREMENT = 3;

const FILTERS = [
  { value: 'all',       label: 'All'         },
  { value: 'fullstack', label: 'Web Apps'    },
  { value: 'ai',        label: 'AI & ML'     },
  { value: 'data',      label: 'Data Science'}
];

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

export default function Projects() {
  const { projects, loading, error } = useProjects();
  const ref = useReveal();

  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCount, setVisibleCount] = useState(SHOW_LIMIT_MOBILE_INITIAL);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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


  const visible = useMemo(() => {
    if (isMobile) {
      return filtered.slice(0, visibleCount);
    } else {
      return expanded ? filtered : filtered.slice(0, SHOW_LIMIT_DESKTOP);
    }
  }, [filtered, expanded, isMobile, visibleCount]);

  const handleShowMore = () => {
    if (isMobile) {
      setVisibleCount(prev => prev + SHOW_LIMIT_MOBILE_INCREMENT);
    } else {
      setExpanded(true);
    }
  };

  const handleShowLess = () => {
    // Smooth scroll to projects section
    const projectsSection = document.getElementById('allProjects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Delay the collapse slightly to allow scroll
    setTimeout(() => {
      if (isMobile) {
        setVisibleCount(SHOW_LIMIT_MOBILE_INITIAL);
      } else {
        setExpanded(false);
      }
    }, 300);
  };

  const hasMore = isMobile 
    ? visibleCount < filtered.length 
    : !expanded && filtered.length > SHOW_LIMIT_DESKTOP;

  const canShowLess = isMobile 
    ? visibleCount >= filtered.length && visibleCount > SHOW_LIMIT_MOBILE_INITIAL 
    : expanded;

  const remainingCount = isMobile 
    ? filtered.length - visibleCount 
    : filtered.length - SHOW_LIMIT_DESKTOP;

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(SHOW_LIMIT_MOBILE_INITIAL);
    setExpanded(false);
  }, [filter]);

  return (
    <>
      <Helmet>
        <title>Projects</title>
        <meta name="description" content="A complete collection of everything I've built - filtered by category." />
      </Helmet>

      <div style={{ paddingTop: '4.5rem' }} ref={ref}>
        <div className="projects-page-header">
          <div className="projects-header-row">
            <h1 className="section-title">Projects</h1>
            <span className="projects-count-badge">{loading ? '-' : `${filtered.length.toString().padStart(2,'0')} BUILT`}</span>
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
          <div className="compact-projects-grid">
            {loading && <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>}

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

            {!loading && !error && visible.map(p => (
              <CompactProjectCard 
                key={p.repoName} 
                project={p}
              />
            ))}
          </div>

          {/* Show More / Less */}
          {!loading && !error && (hasMore || canShowLess) && (
            <div className="show-more-wrap">
              {hasMore && (
                <button className="show-more-btn" onClick={handleShowMore}>
                  Show More {remainingCount > 0 && <span style={{ opacity: .55, fontSize: '.82em' }}>({Math.min(remainingCount, isMobile ? SHOW_LIMIT_MOBILE_INCREMENT : remainingCount)} more)</span>}
                </button>
              )}
              {canShowLess && (
                <button className="show-more-btn" onClick={handleShowLess} style={{ marginLeft: hasMore ? '.5rem' : '0' }}>
                  Show Less
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
