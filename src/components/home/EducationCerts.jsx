import { useGistContent } from '../../hooks/useGistContent.js';
import { useReveal } from '../../hooks/useReveal.js';

function shortYear(y) {
  // "2023 - 2027" → "23 - 27",  "2024" → "24"
  return y.replace(/\b\d{2}(\d{2})\b/g, '$1');
}

const EDUCATION = [
  {
    school: 'Heritage Institute of Technology, Kolkata',
    degree: 'B.Tech in Computer Science & Business Systems',
    year: '2023 - 2027',
  },
];


function CertRow({ c }) {
  return (
    <div className="edu-certs-row reveal">
      <div className="edu-certs-left">
        <div className="edu-certs-name">{c.title}</div>
        <div className="about-cert-issuer">
          {c.issuer}
          {c.date && <span className="edu-certs-date">&nbsp;{c.date}</span>}
        </div>
      </div>
      <div className="edu-certs-row-right">
        {c.link && (
          <a href={c.link} target="_blank" rel="noopener noreferrer"
            className="about-cert-verify"
            aria-label="Verify certificate">
            <span className="verify-text">Verify </span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7"/>
              <path d="M7 7h10v10"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export default function EducationCerts() {
  const ref = useReveal();
  const { data } = useGistContent();
  const certificates = (data.certificates ?? []).slice(0, 2);
  const education    = (data.education    ?? EDUCATION).slice(0, 1);

  return (
    <section id="edu-certs" ref={ref}>
      <div className="container">
        <div className="section-label reveal">// background</div>
        <h2 className="section-title reveal">Education &amp; Certifications</h2>

        {/* Education */}
        <div className="edu-certs-group">
          <div className="edu-certs-group-title reveal">Education</div>
          <div className="edu-certs-list">
            {education.map((e, i) => (
              <div key={i} className="edu-certs-row reveal">
                <div className="edu-certs-left">
                  <div className="edu-certs-name">{e.school}</div>
                  <div className="edu-certs-sub">{e.degree}</div>
                </div>
                <div className="edu-certs-year">
                  <span className="year-full">{e.year}</span>
                  <span className="year-short">{shortYear(e.year)}</span>
                </div>
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
      </div>
    </section>
  );
}
