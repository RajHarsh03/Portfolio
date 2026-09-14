import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useReveal } from '../hooks/useReveal.js';
import { useGistContent } from '../hooks/useGistContent.js';

const GH_USER = 'RajHarsh03';

/* ── Rich cert card ── */
function AboutCertCard({ c }) {
  return (
    <div className="acert-card reveal">
      <div className="acert-top">
        {/* Icon — hidden on mobile */}
        <div className="acert-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        </div>
        <div className="acert-info">
          <div className="acert-title">{c.title}</div>
          {/* Desktop: issuer only; Mobile: issuer + date inline */}
          <div className="acert-issuer-row">
            <span className="acert-issuer">{c.issuer}</span>
            {c.date && <span className="acert-date-inline">&nbsp;{c.date}</span>}
          </div>
        </div>
        <div className="acert-right">
          {/* Date column — desktop only */}
          {c.date && <span className="acert-date">{c.date}</span>}
          {c.link && (
            <a href={c.link} target="_blank" rel="noopener noreferrer"
              className="acert-verify">
              <span className="verify-text">Verify </span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7"/>
                <path d="M7 7h10v10"/>
              </svg>
            </a>
          )}
        </div>
      </div>
      {c.desc && <p className="acert-desc">{c.desc}</p>}
    </div>
  );
}

/* ── Education card ── */
function shortYear(y) {
  // "2023 - 2027" → "23 - 27",  "2024" → "24"
  return y.replace(/\b\d{2}(\d{2})\b/g, '$1');
}

function EduCard({ e }) {
  return (
    <div className="about-edu-card reveal">
      <div className="about-edu-top">
        <div className="about-edu-info">
          <div className="about-edu-school">{e.school}</div>
          <div className="about-edu-degree">{e.degree}</div>
          {e.desc && <p className="about-edu-desc">{e.desc}</p>}
        </div>
        {e.year && (
          <span className="about-edu-year">
            <span className="year-full">{e.year}</span>
            <span className="year-short">{shortYear(e.year)}</span>
          </span>
        )}
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

/* ── Devicon helper ── */
const ICON_MAP = {
  html:         'html5/html5-original',
  html5:        'html5/html5-original',
  css:          'css3/css3-original',
  css3:         'css3/css3-original',
  javascript:   'javascript/javascript-original',
  js:           'javascript/javascript-original',
  typescript:   'typescript/typescript-original',
  ts:           'typescript/typescript-original',
  react:        'react/react-original',
  nextjs:       'nextjs/nextjs-original',
  python:       'python/python-original',
  figma:        'figma/figma-original',
  tailwind:     'tailwindcss/tailwindcss-original',
  tailwindcss:  'tailwindcss/tailwindcss-original',
  nodejs:       'nodejs/nodejs-original',
  git:          'git/git-original',
  mongodb:      'mongodb/mongodb-original',
  mysql:        'mysql/mysql-original',
  firebase:     'firebase/firebase-plain',
  pandas:       'pandas/pandas-original',
  numpy:        'numpy/numpy-original',
  scikitlearn:  'scikitlearn/scikitlearn-original',
  sklearn:      'scikitlearn/scikitlearn-original',
  matplotlib:   'matplotlib/matplotlib-plain',
  jupyter:      'jupyter/jupyter-original-wordmark',
  flask:        'flask/flask-original',
  fastapi:      'fastapi/fastapi-original',
  docker:       'docker/docker-original',
  postgresql:   'postgresql/postgresql-original',
  redux:        'redux/redux-original',
};
function stackIcon(name) {
  const key = name.toLowerCase().replace(/[\s.]/g, '');
  const path = ICON_MAP[key];
  if (!path) return null;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${path}.svg`;
}

/* ── Collapsible experience card ── */
function ExpCard({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="exp-card reveal">
      <div className="exp-card-top">
        <span className="exp-card-label">{item.label}</span>
        <span className={`exp-card-badge ${item.typeColor}`}>{item.type}</span>
      </div>
      <div className="exp-card-company-row">
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
        <button
          className="exp-card-chevron"
          aria-label={open ? 'Collapse' : 'Expand'}
          onClick={() => setOpen(o => !o)}
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(-90deg)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </button>
      </div>
      <div className="exp-card-role">
        {item.role}
        <span className="role-date-meta"> &bull; {item.date}{item.duration && <span style={{ fontWeight: 700 }}>&nbsp;{item.duration}</span>}</span>
      </div>

      {/* Bullets + date shown when expanded */}
      {open && (
        <div style={{ marginTop: '.5rem' }}>
          {/* Date visible on mobile only when expanded */}
          <div className="role-date-expanded">
            {item.date}{item.duration && <span style={{ fontWeight: 700 }}>&nbsp;{item.duration}</span>}
          </div>
          {item.bullets?.length > 0 && (
            <ul className="exp-card-bullets" style={{ marginTop: '.4rem', paddingLeft: '1rem' }}>
              {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
        </div>
      )}

      {/* Stacks — always visible */}
      {item.stacks?.length > 0 && (
        <div className="exp-card-stacks" style={{ marginTop: '.5rem' }}>
          {item.stacks.map((s, i) => {
            const icon = stackIcon(s);
            return (
              <span key={i} className="exp-stack-badge">
                {icon && <img src={icon} alt={s} width="13" height="13" />}
                <span className="stack-label">{s}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function About() {
  const ref = useReveal();
  const { data } = useGistContent();
  const { certificates, education, achievements, experiences } = data;

  return (
    <>
      <Helmet>
        <title>About - Harsh Raj</title>
        <meta name="description" content="A full-stack developer and aspiring AI/ML engineer. Discover who I am, what I build, and what drives me." />
      </Helmet>

      <div style={{ paddingTop: '4.5rem' }} ref={ref}>

        {/* Header */}
        <div className="projects-page-header">
          <div className="projects-header-row">
            <h1 className="section-title">About</h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginTop: '.5rem' }}>
            A full-stack developer and aspiring AI/ML engineer - here's who I am
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
              passionate about building real, useful technology - spanning web apps,
              intelligent systems, and everything in between.
            </p>
            <p className="about-bio-para">
              Right now I'm deep into{' '}
              <strong className="about-highlight">Generative AI</strong>,
              deep learning architectures, and scalable full-stack systems - shipping
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
          <div className="projects-page-header" style={{ marginTop: '1rem' }}>
            <h2 className="section-title">Education</h2>
          </div>
          <div className="about-edu-list">
            {education.map((e, i) => <EduCard key={i} e={e} />)}
          </div>
        </div>

        {/* ── Experience ── */}
        <div className="about-certs-section">
          <div className="projects-page-header" style={{ marginTop: '1rem' }}>
            <h2 className="section-title">Experience</h2>
          </div>
          <div className="exp-cards-list">
            {(experiences ?? []).map((item, i) => (
              <ExpCard key={i} item={item} />
            ))}
          </div>
        </div>

        {/* ── Certifications ── */}
        <div className="about-certs-section">
          <div className="projects-page-header" style={{ marginTop: '1rem' }}>
            <h2 className="section-title">Certifications</h2>
          </div>
          <div className="acert-list">
            {certificates.map((c, i) => <AboutCertCard key={i} c={c} />)}
          </div>
        </div>

        {/* ── Achievements ── */}
        <div className="about-certs-section">
          <div className="projects-page-header" style={{ marginTop: '1rem' }}>
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
