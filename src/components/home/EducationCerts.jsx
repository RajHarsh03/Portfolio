import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGistContent } from '../../hooks/useGistContent.js';
import { useReveal } from '../../hooks/useReveal.js';
import CertModal from './CertModal.jsx';

const EDUCATION = [
  {
    school: 'Heritage Institute of Technology, Kolkata',
    degree: 'B.Tech in Computer Science & Business System',
    year: '2023 - 2027',
  },
];

function CertRow({ c }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="edu-certs-row reveal" onClick={() => setOpen(true)}>
        <div className="edu-certs-left">
          <div className="edu-certs-name">{c.title}</div>
          <div className="edu-certs-sub">
            {c.issuer}
            {c.date && <span className="edu-certs-date">&nbsp;{c.date}</span>}
          </div>
        </div>
        <div className="edu-certs-row-right">
          <span className="edu-certs-view-hint">View details</span>
          {c.link && (
            <a href={c.link} target="_blank" rel="noopener noreferrer"
              className="edu-certs-verify"
              aria-label="Verify certificate"
              onClick={e => e.stopPropagation()}>
              Verify ↗
            </a>
          )}
        </div>
      </div>
      {open && <CertModal cert={c} onClose={() => setOpen(false)} />}
    </>
  );
}

export default function EducationCerts() {
  const ref = useReveal();
  const { data } = useGistContent();
  const { certificates } = data;

  return (
    <section id="edu-certs" ref={ref}>
      <div className="container">
        <div className="section-label reveal">// background</div>
        <h2 className="section-title reveal">Education &amp; Certifications</h2>

        {/* Education */}
        <div className="edu-certs-group">
          <div className="edu-certs-group-title reveal">Education</div>
          <div className="edu-certs-list">
            {EDUCATION.map((e, i) => (
              <div key={i} className="edu-certs-row reveal">
                <div className="edu-certs-left">
                  <div className="edu-certs-name">{e.school}</div>
                  <div className="edu-certs-sub">{e.degree}</div>
                </div>
                <div className="edu-certs-year">{e.year}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="edu-certs-group">
          <div className="edu-certs-group-title reveal">Certifications</div>
          <div className="edu-certs-list">
            {certificates.map((c, i) => <CertRow key={i} c={c} />)}
          </div>
        </div>

        {/* View all link */}
        <div className="journey-view-all reveal">
          <Link to="/certificates" className="projects-view-all-btn">
            View all certificates
          </Link>
        </div>
      </div>
    </section>
  );
}
