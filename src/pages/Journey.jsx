import { Helmet } from 'react-helmet-async';
import { useReveal } from '../hooks/useReveal.js';

const experiences = [
  {
    label: 'CURRENT ROLE',
    type: 'SIMULATION',
    typeColor: 'badge-blue',
    company: 'Deloitte AU',
    role: 'Cyber & Technology Simulation',
    date: '2025',
    bullets: [
      'Analyzed enterprise cyber threat scenarios and security workflows.',
      'Identified vulnerabilities and proposed mitigation strategies aligned with industry best practices.',
    ],
  },
];

const internships = [
  {
    label: 'INTERNSHIP',
    type: 'INTERNSHIP',
    typeColor: 'badge-purple',
    company: 'MyJobGrow',
    role: 'Data Science & Machine Learning Intern',
    date: 'JUN 2025 – AUG 2025',
    bullets: [
      'Completed a focused internship on Data Science and Machine Learning concepts.',
      'Worked on data analysis, model building, and machine learning workflows.',
    ],
  },
];

function ExperienceCard({ item }) {
  return (
    <div className="exp-card reveal">
      {/* Top row */}
      <div className="exp-card-top">
        <span className="exp-card-label">{item.label}</span>
        <span className={`exp-card-badge ${item.typeColor}`}>{item.type}</span>
      </div>

      {/* Company */}
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

      {/* Role + date */}
      <div className="exp-card-role">{item.role} &bull; {item.date}</div>

      {/* Bullets */}
      <ul className="exp-card-bullets">
        {item.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Journey() {
  const ref = useReveal();

  return (
    <>
      <Helmet>
        <title>Journey</title>
        <meta name="description" content="A timeline of my career — experiences, roles, and the internships that shaped me." />
      </Helmet>

      <div className="page-wrap" ref={ref}>
        {/* Page header */}
        <div className="journey-page-header">
          <h1>My Journey</h1>
          <p>A timeline of my career — experiences, roles, and the internships that shaped me.</p>
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
