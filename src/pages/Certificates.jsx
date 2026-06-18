import { Helmet } from 'react-helmet-async';
import { useReveal } from '../hooks/useReveal.js';

const CERTS = [
  {
    icon: '🤖',
    title: 'Data Science and Machine Learning Intern',
    issuer: 'My Job Grow',
    date: 'Issued Oct 2025',
    skills: 'Machine Learning',
    link: 'https://drive.google.com/file/d/1jtflGRm11wVpS8HQh1MksdX7NLrVd0w2/view?usp=drive_link',
  },
  {
    icon: '💼',
    title: 'Deloitte Australia — Technology Job Simulation',
    issuer: 'Forage',
    date: 'Issued Jun 2025',
    skills: null,
    link: 'https://drive.google.com/file/d/1JKd1dBXABvNB0Lr6v8ILYqIsE9hQwkRY/view?usp=drive_link',
  },
  {
    icon: '🛡️',
    title: 'Deloitte Australia — Cyber Job Simulation',
    issuer: 'Forage',
    date: 'Issued Jun 2025',
    skills: 'Cybersecurity',
    link: 'https://drive.google.com/file/d/1m32-NzDPEgRp9GbxAc04d5K4uF-HPxuw/view?usp=drive_link',
  },
  {
    icon: '🚀',
    title: 'Bharatiya Antariksh Hackathon 2025',
    issuer: 'ISRO / H2S',
    date: '2025',
    skills: 'Full Stack Web Dev',
    link: 'https://drive.google.com/file/d/1sc-iWnc2tp9h3wmv6x4O_vBnQLVG9TcJ/view?usp=drive_link',
  },
  {
    icon: '🔐',
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    date: 'Issued Oct 2022',
    skills: 'Cybersecurity',
    link: 'https://drive.google.com/file/d/14swwNh_ID-CTKdSmiU3OdLIj6stnC-sH/view?usp=drive_link',
  },
];

export default function Certificates() {
  const ref = useReveal();

  return (
    <>
      <Helmet>
        <title>Certificates</title>
        <meta name="description" content="Credentials earned by Harsh Raj, Full Stack Engineer." />
      </Helmet>

      <div style={{ paddingTop: '5rem' }} ref={ref}>
        <div className="certs-page-header">
          <h1>Certificates &amp; Achievements</h1>
          <p>A curated list of professional certifications and achievements I've earned.</p>
        </div>

        <section id="allCerts">
          <div className="certs-grid">
            {CERTS.map((c, i) => (
              <div className="cert-card tilt-card reveal" key={i}>
                <div className="cert-icon">{c.icon}</div>
                <div className="cert-info">
                  <div className="cert-title">{c.title}</div>
                  <div className="cert-issuer">{c.issuer}</div>
                  <div className="cert-date">{c.date}</div>
                  {c.skills && <div className="cert-skills">Skills: {c.skills}</div>}
                  <a href={c.link} className="cert-link" target="_blank" rel="noopener noreferrer">
                    View credential ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
