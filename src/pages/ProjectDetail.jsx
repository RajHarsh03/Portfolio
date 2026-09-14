import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProjects } from '../hooks/useProjects.js';
import { GH_USER } from '../services/githubProjects.js';
import { useReveal } from '../hooks/useReveal.js';
import { useProjectDetails } from '../hooks/useProjectDetails.js';

export default function ProjectDetail() {
  const { id } = useParams();
  const { projects, loading, error } = useProjects();
  const { details: projectDetailsMap } = useProjectDetails();
  const ref = useReveal();

  if (loading) {
    return (
      <div style={{ paddingTop: '4.5rem', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="container" style={{ padding: '3rem 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', color: 'var(--text)', fontSize: '1rem' }}>
            Loading project...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '4.5rem', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="container" style={{ padding: '3rem 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', color: 'var(--text)', fontSize: '1rem' }}>
            Error loading project. Please try again.
          </div>
        </div>
      </div>
    );
  }

  // Find project by repoName (use as ID)
  const project = projects.find(p => p.repoName === id);

  if (!project && !loading) {
    return <Navigate to="/projects" replace />;
  }

  if (!project) {
    return (
      <div style={{ paddingTop: '4.5rem', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="container" style={{ padding: '3rem 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', color: 'var(--text)' }}>
            Project not found...
          </div>
        </div>
      </div>
    );
  }

  const isLive = project.completed;
  const ghImgUrl = `https://raw.githubusercontent.com/${GH_USER}/${project.repoName}/HEAD/preview.png`;
  const ghImgFallback = `https://opengraph.githubassets.com/1/${GH_USER}/${project.repoName}`;
  const techTags = (project.rawTopics || []).filter(t => 
    !['portfolio', 'featured', 'completed', 'rank-1', 'rank1', 'personal', 'rank-2', 'rank2', 'rank-3', 'rank3'].includes(t.toLowerCase())
  );

  // Get additional details from Gist
  const projectDetails = projectDetailsMap[project.repoName] || {};
  const features = projectDetails.features || [];
  const highlights = projectDetails.highlights || [];
  const challenges = projectDetails.challenges || [];

  return (
    <>
      <Helmet>
        <title>{project.name} — Harsh Raj</title>
        <meta name="description" content={project.description} />
      </Helmet>

      <div className="project-detail-wrapper" ref={ref}>
        {/* Hero Section with Large Preview */}
        <div className="pd-hero-section">
          <div className="container">
            <div className="pd-header-row reveal">
              <div className="pd-header-left">
                <h1 className="pd-hero-title">{project.name}</h1>
                <span className={`pd-status-badge ${isLive ? 'live' : 'dev'}`}>
                  <span className="pd-status-dot" />
                  {isLive ? 'Live' : 'In Development'}
                </span>
              </div>
              <div className="pd-header-right">
                {project.live && (
                  <a 
                    href={project.live} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="pd-action-btn pd-primary"
                    style={{ background: '#1a1a1a', color: '#fff' }}
                  >
                    <span>Live</span>
                    <svg className="pd-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 7h10v10M7 17L17 7"/>
                    </svg>
                  </a>
                )}
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="pd-action-btn pd-secondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  <span>Code</span>
                </a>
              </div>
            </div>
            
            {/* Large Preview Image */}
            <div className="pd-preview-image reveal">
              <img
                src={ghImgUrl}
                alt={`${project.name} preview`}
                onError={e => {
                  if (e.currentTarget.src !== ghImgFallback) {
                    e.currentTarget.src = ghImgFallback;
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="pd-content-section">
          <div className="container">
            {/* Overview */}
            <div className="pd-block reveal">
              <h2 className="pd-block-title">OVERVIEW</h2>
              <p className="pd-block-text">{project.description}</p>
            </div>

            {/* Technologies Used */}
            {techTags.length > 0 && (
              <div className="pd-block reveal">
                <h2 className="pd-block-title">TECHNOLOGIES USED</h2>
                <div className="pd-tech-tags">
                  {techTags.map(tag => (
                    <span key={tag} className="pd-tech-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            {features.length > 0 && (
              <div className="pd-block reveal">
                <h2 className="pd-block-title">KEY FEATURES</h2>
                <ul className="pd-feature-list">
                  {features.map((feature, idx) => (
                    <li key={idx} className="pd-feature-item">
                      <span className="pd-bullet">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Highlights */}
            {highlights.length > 0 && (
              <div className="pd-block reveal">
                <h2 className="pd-block-title">KEY HIGHLIGHTS</h2>
                <div className="pd-numbered-list">
                  {highlights.map((highlight, idx) => (
                    <div key={idx} className="pd-numbered-item">
                      <span className="pd-number">{idx + 1}</span>
                      <p>{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges Overcome */}
            {challenges.length > 0 && (
              <div className="pd-block reveal">
                <h2 className="pd-block-title">CHALLENGES OVERCOME</h2>
                <ul className="pd-feature-list">
                  {challenges.map((challenge, idx) => (
                    <li key={idx} className="pd-feature-item">
                      <span className="pd-bullet">•</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Status Badge */}
            <div className="pd-status-row reveal">
              <span className="pd-meta-text">
                Last updated: {new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
