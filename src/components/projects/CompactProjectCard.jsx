import { useNavigate } from 'react-router-dom';
import { GH_USER } from '../../services/githubProjects.js';

/**
 * Compact project card component
 * Shows: thumbnail, title, type label, short description, and arrow to open details
 */
export default function CompactProjectCard({ project }) {
  const navigate = useNavigate();
  const isLive = project.completed;
  const typeLabel = project.projectType?.label || 'Personal Project';
  
  // Truncate description to ~100 chars
  const shortDesc = project.description.length > 100 
    ? project.description.substring(0, 100) + '...'
    : project.description;

  const ghImgUrl = `https://raw.githubusercontent.com/${GH_USER}/${project.repoName}/HEAD/preview.png`;
  const ghImgFallback = `https://opengraph.githubassets.com/1/${GH_USER}/${project.repoName}`;

  const handleArrowClick = (e) => {
    e.stopPropagation();
    navigate(`/projects/${project.repoName}`);
  };

  return (
    <div className="compact-project-card reveal">
      {/* Left: Thumbnail */}
      <div className="cpc-thumbnail">
        <img
          src={ghImgUrl}
          alt={`${project.name} preview`}
          loading="lazy"
          onError={e => {
            if (e.currentTarget.src !== ghImgFallback) {
              e.currentTarget.src = ghImgFallback;
            }
          }}
        />
        {isLive && (
          <div className="cpc-live-badge">
            <span className="cpc-live-dot" />
            Live
          </div>
        )}
      </div>

      {/* Right: Content */}
      <div className="cpc-content">
        <div className="cpc-header">
          <div className="cpc-title-row">
            <h3 className="cpc-title">{project.name}</h3>
            <button className="cpc-arrow" aria-label="View details" onClick={handleArrowClick}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7"/>
                <path d="M7 7h10v10"/>
              </svg>
            </button>
          </div>
          <div className="cpc-type">{typeLabel}</div>
        </div>
        <p className="cpc-description">{shortDesc}</p>
        
        {/* Tech tags - max 3 to keep single row, hide status/rank badges but keep personal/client type tags */}
        {project.rawTopics && project.rawTopics.length > 0 && (
          <div className="cpc-tech-tags">
            {project.rawTopics
              .filter(t => {
                const lower = t.toLowerCase();
                if (['portfolio', 'featured', 'completed', 'in-progress', 'wip', 'archived'].includes(lower)) return false;
                if (/^(rank[-]?\d+|top\d+|winner|hackathon-\w+)$/i.test(lower)) return false;
                return true;
              })
              .slice(0, 3)
              .map(tag => (
                <span key={tag} className="cpc-tech-tag">{tag}</span>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}
