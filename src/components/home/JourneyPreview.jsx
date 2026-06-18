import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal.js';

export default function JourneyPreview() {
  const ref = useReveal();

  return (
    <section id="journey" ref={ref}>
      <div className="container">
        <div className="section-label">// my path</div>
        <h2 className="section-title reveal">My Journey</h2>


       <div className="journey-cards">
          {/* Journey card */}
          <Link to="/journey" className="journey-card reveal">
            <div className="journey-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="journey-card-text">
              <div className="journey-card-title">My Journey</div>
              <div className="journey-card-desc">Overview of my learning and career journey.</div>
            </div>
            <div className="journey-card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>

           {/* Certificates card */}
          <Link to="/certificates" className="journey-card reveal">
            <div className="journey-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div className="journey-card-text">
              <div className="journey-card-title">Certificates &amp; Achievements</div>
              <div className="journey-card-desc">A curated list of certificates and achievements.</div>
            </div>
            <div className="journey-card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
