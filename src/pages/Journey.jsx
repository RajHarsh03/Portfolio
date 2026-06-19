import { Helmet } from 'react-helmet-async';
import { useReveal } from '../hooks/useReveal.js';
import { useGistContent } from '../hooks/useGistContent.js';

function ExperienceCard({ item }) {
  return (
    <div className="exp-card reveal">
      <div className="exp-card-top">
        <span className="exp-card-label">{item.label}</span>
        <span className={`exp-card-badge ${item.typeColor}`}>{item.type}</span>
      </div>
      <div className="exp-card-company">
        <span className="exp-card-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <strong>{item.company}</strong>
      </div>
      <div className="exp-card-role">{item.role} &bull; {item.date}</div>
      <ul className="exp-card-bullets">
        {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
    </div>
  );
}

export default function Journey() {
  const ref = useReveal();
  const { data } = useGistContent();
  const { experiences, internships } = data;

  return (
    <>
      <Helmet>
        <title>Journey</title>
        <meta name="description" content="A timeline of my career - experiences, roles, and the internships that shaped me." />
      </Helmet>

      <div className="page-wrap" ref={ref}>
        <div className="journey-page-header">
          <h1>My Journey</h1>
          <p>A timeline of my career - experiences, roles, and the internships that shaped me.</p>
        </div>

        <div className="journey-content">

          {/* EXPERIENCE */}
          <div className="journey-block">
            <div className="journey-section-label reveal">// where i've worked</div>
            <div className="journey-section-title reveal">Experience</div>
            <div className="exp-cards-list">
              {experiences.map((item, i) => <ExperienceCard key={i} item={item} />)}
            </div>
          </div>

          {/* INTERNSHIPS */}
          <div className="journey-block">
            <div className="journey-section-label reveal">// where it started</div>
            <div className="journey-section-title reveal">Internships</div>
            <div className="exp-cards-list">
              {internships.map((item, i) => <ExperienceCard key={i} item={item} />)}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
