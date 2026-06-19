import { Helmet } from 'react-helmet-async';
import { useReveal } from '../hooks/useReveal.js';
import { useGistContent } from '../hooks/useGistContent.js';

function CertCard({ c }) {
  return (
    <div className="exp-card cert-card-item reveal">
      <div className="exp-card-top">
        <span className="exp-card-label">{c.label}</span>
        <span className={`exp-card-badge ${c.typeColor}`}>{c.type}</span>
      </div>
      <div className="exp-card-company">
        <span className="exp-card-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        </span>
        <strong>{c.title}</strong>
      </div>
      <div className="exp-card-role">{c.issuer} &bull; {c.date}</div>
      <p className="exp-card-desc-text">{c.desc}</p>
      <div className="cert-link-row">
        <a href={c.link} target="_blank" rel="noopener noreferrer" className="cert-ext-btn" aria-label="View certificate">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function Certificates() {
  const ref = useReveal();
  const { data } = useGistContent();
  const { certificates } = data;

  return (
    <>
      <Helmet>
        <title>Certificates</title>
        <meta name="description" content="Credentials earned by Harsh Raj, Full Stack Engineer." />
      </Helmet>

      <div className="page-wrap" ref={ref}>
        <div className="certs-page-header">
          <h1>Certificates &amp; Achievements</h1>
          <p>A curated list of professional certifications and achievements I've earned.</p>
        </div>

        <section id="allCerts">
          <div className="exp-cards-list">
            {certificates.map((c, i) => <CertCard key={i} c={c} />)}
          </div>
        </section>
      </div>
    </>
  );
}
