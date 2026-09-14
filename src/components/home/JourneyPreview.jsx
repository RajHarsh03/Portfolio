import { useGistContent } from '../../hooks/useGistContent.js';
import { useReveal } from '../../hooks/useReveal.js';

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
          {items.map((item, i) => (
            <div key={i} className="exp-card reveal">
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
              <div className="exp-card-role">
                {item.role}
                <span className="role-date-meta"> &bull; {item.date}{item.duration && <span style={{ fontWeight: 700 }}>&nbsp;{item.duration}</span>}</span>
              </div>
              {item.stacks?.length > 0 && (
                <div className="exp-card-stacks" style={{ marginTop: '.5rem' }}>
                  {item.stacks.map((s, j) => {
                    const icon = stackIcon(s);
                    return (
                      <span key={j} className="exp-stack-badge">
                        {icon && <img src={icon} alt={s} width="13" height="13" />}
                        <span className="stack-label">{s}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
