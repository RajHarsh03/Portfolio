import { useGistContent } from '../../hooks/useGistContent.js';
import { useReveal } from '../../hooks/useReveal.js';

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

export default function JourneyPreview() {
  const ref = useReveal();
  const { data } = useGistContent();
  const items = (data.experiences ?? []).slice(0, 1);

  return (
    <section id="journey" ref={ref}>
      <div className="container">
        <div className="section-label reveal">// work</div>
        <h2 className="section-title reveal">Experience</h2>
        <div className="exp-cards-list">
          {items.map((item, i) => <ExperienceCard key={i} item={item} />)}
        </div>
      </div>
    </section>
  );
}
