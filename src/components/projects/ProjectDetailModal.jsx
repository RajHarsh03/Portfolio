import { useEffect } from 'react';
import { GH_USER } from '../../services/githubProjects.js';

/**
 * Full-screen modal showing detailed project information
 * Includes: banner, description, technologies, features, highlights, challenges, links
 */
export default function ProjectDetailModal({ project, onClose }) {
  const isLive = project.completed;
  const ghImgUrl = `https://raw.githubusercontent.com/${GH_USER}/${project.repoName}/HEAD/preview.png`;
  const ghImgFallback = `https://opengraph.githubassets.com/1/${GH_USER}/${project.repoName}`;

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const techTags = (project.rawTopics || []).filter(t => {
    const lower = t.toLowerCase();
    if (['portfolio', 'featured', 'completed', 'in-progress', 'wip', 'archived'].includes(lower)) return false;
    if (/^(rank[-]?\d+|top\d+|winner|hackathon-\w+)$/i.test(lower)) return false;
    return true;
  });

  return (
    <div className="project-detail-modal" onClick={onClose}>
      <div className="pdm-overlay" />
      
      <div className="pdm-container" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="pdm-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="pdm-content">
          {/* Header Section */}
          <div className="pdm-header">
            <div className="pdm-category-badge">
              {project.projectType?.label || 'Personal Project'}
            </div>
            <h1 className="pdm-title">{project.name}</h1>
            <p className="pdm-subtitle">{project.description}</p>
            
            {/* Status and links */}
            <div className="pdm-meta-row">
              <div className={`pdm-status-badge${isLive ? ' live' : ''}`}>
                <span className="pdm-status-dot" />
                {isLive ? 'Live' : 'In Development'}
              </div>
              <div className="pdm-links">
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="pdm-link-btn pdm-link-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Visit Live Site
                  </a>
                )}
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="pdm-link-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  View Code
                </a>
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div className="pdm-banner">
            <img
              src={ghImgUrl}
              alt={`${project.name} banner`}
              onError={e => {
                if (e.currentTarget.src !== ghImgFallback) {
                  e.currentTarget.src = ghImgFallback;
                }
              }}
            />
          </div>

          {/* Technologies Section */}
          {techTags.length > 0 && (
            <div className="pdm-section">
              <h2 className="pdm-section-title">Technologies Used</h2>
              <div className="pdm-tech-grid">
                {techTags.map(tag => (
                  <span key={tag} className="pdm-tech-badge">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Key Features Section */}
          {project.features && project.features.length > 0 && (
            <div className="pdm-section">
              <h2 className="pdm-section-title">Key Features</h2>
              <ul className="pdm-list">
                {project.features.map((feature, idx) => (
                  <li key={idx} className="pdm-list-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Highlights Section */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="pdm-section">
              <h2 className="pdm-section-title">Key Highlights</h2>
              <div className="pdm-highlights">
                {project.highlights.map((highlight, idx) => (
                  <div key={idx} className="pdm-highlight-item">
                    <div className="pdm-highlight-num">{idx + 1}</div>
                    <p className="pdm-highlight-text">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges Section */}
          {project.challenges && project.challenges.length > 0 && (
            <div className="pdm-section">
              <h2 className="pdm-section-title">Challenges Overcome</h2>
              <ul className="pdm-list pdm-list-challenges">
                {project.challenges.map((challenge, idx) => (
                  <li key={idx} className="pdm-list-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer with repository info */}
          <div className="pdm-footer">
            <div className="pdm-footer-info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Last updated: {new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
