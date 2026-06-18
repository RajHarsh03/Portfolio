import { Helmet } from 'react-helmet-async';
import { useReveal } from '../hooks/useReveal.js';

export default function Journey() {
  const ref = useReveal();

  return (
    <>
      <Helmet>
        <title>Journey</title>
        <meta name="description" content="A timeline of my career — experiences, roles, and the internships that shaped me." />
      </Helmet>

      <div style={{ paddingTop: '5rem' }} ref={ref}>
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
            <div className="timeline">
              <div className="timeline-item reveal">
                <div className="timeline-dot" />
                <div className="timeline-date">2025</div>
                <div className="timeline-role">Cyber &amp; Technology Simulation</div>
                <div className="timeline-company">@ Deloitte AU</div>
                <div className="timeline-tags">
                  <span className="tl-tag">Cybersecurity</span>
                  <span className="tl-tag">Risk Assessment</span>
                </div>
                <div className="timeline-desc">
                  Analyzed enterprise cyber threat scenarios and security workflows. Identified vulnerabilities
                  and proposed mitigation strategies aligned with industry best practices.
                </div>
              </div>
            </div>
          </div>

          {/* INTERNSHIPS */}
          <div className="journey-block">
            <div className="journey-section-label reveal">// where it started</div>
            <div className="journey-section-title reveal">Internships</div>
            <div className="timeline">
              <div className="timeline-item reveal">
                <div className="timeline-dot" />
                <div className="timeline-date">Jun 2025 — Aug 2025</div>
                <div className="timeline-role">Data Science &amp; Machine Learning Intern</div>
                <div className="timeline-company">@ MyJobGrow</div>
                <div className="timeline-tags">
                  <span className="tl-tag">Data Science</span>
                  <span className="tl-tag">Machine Learning</span>
                </div>
                <div className="timeline-desc">
                  Completed a 2-month internship focused on Data Science and Machine Learning concepts.
                  Worked on data analysis, model building, and machine learning workflows.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
