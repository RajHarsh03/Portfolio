import { useNavigate } from 'react-router-dom';
import { GH_USER, TECH_ICON_MAP } from '../../services/githubProjects.js';

/**
 * Compact project card component
 * Shows: thumbnail, title, short description, tech icons, and arrow to open details
 */
export default function CompactProjectCard({ project }) {
  const navigate = useNavigate();

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

  // Get tech icons from rawTopics (max 5)
  const techIcons = (project.rawTopics || [])
    .filter(t => {
      const lower = t.toLowerCase().replace(/[\s.-]/g, '');
      return TECH_ICON_MAP[lower] || TECH_ICON_MAP[t.toLowerCase()];
    })
    .slice(0, 5)
    .map(t => {
      const key = t.toLowerCase().replace(/[\s.-]/g, '');
      return {
        name: t.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
        url: TECH_ICON_MAP[key] || TECH_ICON_MAP[t.toLowerCase()],
      };
    });

  return (
    <div className="compact-project-card reveal">
      {/* Thumbnail */}
      <div className="cpc-thumbnail">
        <img
          src={ghImgUrl}
          alt={`${project.name} preview`}
          loading="eager"
          fetchPriority="high"
          onError={e => {
            if (e.currentTarget.src !== ghImgFallback) {
              e.currentTarget.src = ghImgFallback;
            }
          }}
        />
      </div>

      {/* Content */}
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
        </div>
        <p className="cpc-description">{shortDesc}</p>

        {/* Tech icons */}
        {techIcons.length > 0 && (
          <div className="cpc-tech-icons">
            {techIcons.map(({ name, url }) => (
              <div key={name} className="cpc-tech-icon-wrap" data-tooltip={name}>
                <img src={url} alt={name} width="18" height="18" loading="eager" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
