import { Helmet } from 'react-helmet-async';
import { useReveal } from '../hooks/useReveal.js';
import { useGistContent } from '../hooks/useGistContent.js';

const GH_USER = 'RajHarsh03';

/* ── Rich cert card ── */
function AboutCertCard({ c }) {
  return (
    <div className="acert-card reveal">
      <div className="acert-top">
        <div className="acert-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        </div>
        <div className="acert-info">
          <div className="acert-title">{c.title}</div>
          <div className="acert-issuer">{c.issuer}</div>
        </div>
        <div className="acert-right">
          {c.date && <span className="acert-date">{c.date}</span>}
          {c.link && (
            <a href={c.link} target="_blank" rel="noopener noreferrer"
              className="acert-verify">
              Verify ↗
            </a>
          )}
        </div>
      </div>
      {c.desc && <p className="acert-desc">{c.desc}</p>}
    </div>
  );
}

/* ── Education card ── */
function EduCard({ e }) {
  return (
    <div className="about-edu-card reveal">
      <div className="about-edu-top">
        <div className="about-edu-info">
          <div className="about-edu-school">{e.school}</div>
          <div className="about-edu-degree">{e.degree}</div>
          {e.desc && <p className="about-edu-desc">{e.desc}</p>}
        </div>
        {e.year && <span className="about-edu-year">{e.year}</span>}
      </div>
    </div>
  );
}

/* ── Achievement card ── */
function AchievCard({ a }) {
  return (
    <div className="about-achiev-card reveal">
      <div className="about-achiev-top">
        <div className="about-achiev-info">
          <div className="about-achiev-title">{a.title}</div>
          {a.org && <div className="about-achiev-org">{a.org}</div>}
          {a.desc && <p className="about-achiev-desc">{a.desc}</p>}
        </div>
        {a.year && <span className="about-achiev-year">{a.year}</span>}
      </div>
    </div>
  );
}

export default function About() {
  const ref = useReveal();
  const { data } = useGistContent();
  const { certificates, education, achievements } = data;

  return (
    <>
      <Helmet>
        <title>About — Harsh Raj</title>
        <meta name="description" content="A full-stack developer and aspiring AI/ML engineer. Discover who I am, what I build, and what drives me." />
      </Helmet>

      <div style={{ paddingTop: '6.5rem' }} ref={ref}>

        {/* Header */}
        <div className="projects-page-header">
          <div className="projects-header-row">
            <h1 className="section-title">About</h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginTop: '.5rem' }}>
            A full-stack developer and aspiring AI/ML engineer — here's who I am
            and what drives me.
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="about-body">
          <div className="about-photo-col reveal">
            <div className="about-photo-wrap">
              <img src={`https://github.com/${GH_USER}.png?size=600`} alt="Harsh Raj" className="about-photo" />
            </div>
            <div className="about-photo-meta">
              <span className="about-photo-name">Harsh Raj</span>
              <span className="about-photo-role">Full Stack Dev &amp; AI/ML</span>
              <span className="about-photo-loc">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                Kolkata, India
              </span>
            </div>
          </div>

          <div className="about-bio-col reveal">
            <h2 className="about-who-title">Who I Am</h2>
            <p className="about-bio-para">
              I'm a Computer Science student and aspiring{' '}
              <strong className="about-highlight">Full Stack Developer &amp; AI/ML Engineer</strong>{' '}
              passionate about building real, useful technology — spanning web apps,
              intelligent systems, and everything in between.
            </p>
            <p className="about-bio-para">
              Right now I'm deep into{' '}
              <strong className="about-highlight">Generative AI</strong>,
              deep learning architectures, and scalable full-stack systems — shipping
              projects daily and growing through deliberate practice.
            </p>
            <p className="about-bio-para">
              Outside of writing code, I explore new ideas through reading, experiment
              with creative tools, and believe that{' '}
              <em>consistency and good daily habits</em> are the absolute foundation
              for getting better at anything.
            </p>
            <div className="about-chips">
              {['React', 'Node.js', 'Python', 'TypeScript', 'AI / ML', 'PostgreSQL'].map(t => (
                <span key={t} className="about-chip">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quote ── */}
        <div className="about-quote-block reveal">
          <p className="about-quote-main">"Ship it. Learn from it. Build better."</p>
          <p className="about-quote-sub">"Every great developer was once a beginner who refused to give up."</p>
        </div>

        {/* ── Education ── */}
        <div className="about-certs-section">
          <div className="projects-page-header" style={{ marginTop: '2rem' }}>
            <h2 className="section-title">Education</h2>
          </div>
          <div className="about-edu-list">
            {education.map((e, i) => <EduCard key={i} e={e} />)}
          </div>
        </div>

        {/* ── Certifications ── */}
        <div className="about-certs-section">
          <div className="projects-page-header" style={{ marginTop: '2rem' }}>
            <h2 className="section-title">Certifications</h2>
          </div>
          <div className="acert-list">
            {certificates.map((c, i) => <AboutCertCard key={i} c={c} />)}
          </div>
        </div>

        {/* ── Achievements ── */}
        <div className="about-certs-section">
          <div className="projects-page-header" style={{ marginTop: '2rem' }}>
            <h2 className="section-title">Achievements</h2>
          </div>
          <div className="about-achiev-list">
            {achievements.map((a, i) => <AchievCard key={i} a={a} />)}
          </div>
        </div>

      </div>
    </>
  );
}
