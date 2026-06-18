import { Helmet } from 'react-helmet-async';
import { useReveal } from '../hooks/useReveal.js';

const CERTS = [
  {
    label: 'INTERNSHIP',
    type: 'CERTIFICATE',
    typeColor: 'badge-teal',
    title: 'Data Science and Machine Learning Intern',
    issuer: 'MY JOB GROW',
    date: 'OCT 2025',
    desc: 'Completed a 2-month internship focused on Data Science and Machine Learning concepts. Worked on data analysis, model building, and ML workflows.',
    link: 'https://drive.google.com/file/d/1jtflGRm11wVpS8HQh1MksdX7NLrVd0w2/view?usp=drive_link',
  },
  {
    label: 'SIMULATION',
    type: 'CERTIFICATE',
    typeColor: 'badge-blue',
    title: 'Deloitte Australia — Technology Job Simulation',
    issuer: 'FORAGE',
    date: 'JUN 2025',
    desc: 'Simulated real-world technology consulting tasks at Deloitte Australia, including data analysis and software engineering workflows.',
    link: 'https://drive.google.com/file/d/1JKd1dBXABvNB0Lr6v8ILYqIsE9hQwkRY/view?usp=drive_link',
  },
  {
    label: 'SIMULATION',
    type: 'CERTIFICATE',
    typeColor: 'badge-blue',
    title: 'Deloitte Australia — Cyber Job Simulation',
    issuer: 'FORAGE',
    date: 'JUN 2025',
    desc: 'Analyzed enterprise cyber threat scenarios and security workflows. Identified vulnerabilities and proposed mitigation strategies aligned with industry best practices.',
    link: 'https://drive.google.com/file/d/1m32-NzDPEgRp9GbxAc04d5K4uF-HPxuw/view?usp=drive_link',
  },
  {
    label: 'HACKATHON',
    type: 'CERTIFICATE',
    typeColor: 'badge-purple',
    title: 'Bharatiya Antariksh Hackathon 2025',
    issuer: 'ISRO / H2S',
    date: '2025',
    desc: 'Participated in the national-level space hackathon organized by ISRO. Built a full-stack web application addressing a space-tech challenge.',
    link: 'https://drive.google.com/file/d/1sc-iWnc2tp9h3wmv6x4O_vBnQLVG9TcJ/view?usp=drive_link',
  },
  {
    label: 'COURSE',
    type: 'CERTIFICATE',
    typeColor: 'badge-teal',
    title: 'Introduction to Cybersecurity',
    issuer: 'CISCO NETWORKING ACADEMY',
    date: 'OCT 2022',
    desc: 'Completed a foundational course in cybersecurity covering threat landscapes, network security, and best practices for securing systems and data.',
    link: 'https://drive.google.com/file/d/14swwNh_ID-CTKdSmiU3OdLIj6stnC-sH/view?usp=drive_link',
  },
];

function CertCard({ c }) {
  return (
    <div className="exp-card cert-card-item reveal">
      {/* Top row */}
      <div className="exp-card-top">
        <span className="exp-card-label">{c.label}</span>
        <span className={`exp-card-badge ${c.typeColor}`}>{c.type}</span>
      </div>

      {/* Icon + Title */}
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

      {/* Issuer + date */}
      <div className="exp-card-role">{c.issuer} &bull; {c.date}</div>

      {/* Description */}
      <p className="exp-card-desc-text">{c.desc}</p>

      {/* External link */}
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
            {CERTS.map((c, i) => <CertCard key={i} c={c} />)}
          </div>
        </section>
      </div>
    </>
  );
}
