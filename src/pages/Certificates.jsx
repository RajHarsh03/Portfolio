import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useReveal } from '../hooks/useReveal.js';
import { useGistContent } from '../hooks/useGistContent.js';
import CertModal from '../components/home/CertModal.jsx';

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
          <h1 className="section-title">Certificates &amp; Achievements</h1>
          <p>A curated list of professional certifications and achievements I've earned.</p>
        </div>

        <section id="allCerts">
          <div className="edu-certs-list">
            {certificates.map((c, i) => <CertRow key={i} c={c} />)}
          </div>
        </section>
      </div>
    </>
  );
}
