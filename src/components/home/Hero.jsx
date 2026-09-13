import React from 'react';
import { useGistContent } from '../../hooks/useGistContent.js';
import TypingEffect from './TypingEffect.jsx';

const GH_USER = 'RajHarsh03';

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-profile-card">

        {/* ── Banner ── */}
        <div className="hero-banner">
          {/* Replace src with your banner image later */}
          <div className="hero-banner-placeholder" aria-hidden="true" />
          {/* Centered availability text */}
          <div className="hero-banner-center-text">
            Open for full-time<br />&amp; freelance work
          </div>
          <div className="hero-banner-time" aria-label="Local time and temperature">
            <LiveClock />
            <span className="hero-banner-time-label">·</span>
            <LiveTemp />
          </div>
        </div>

        {/* ── Profile row: avatar + body ── */}
        <div className="hero-profile-body">

          {/* Avatar overlapping banner */}
          <div className="hero-avatar-wrap">
            <div className="hero-avatar-ring">
              <img
                src={`https://github.com/${GH_USER}.png?size=400`}
                alt="Harsh Raj"
                className="hero-avatar-img"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>

          {/* Text content */}
          <div className="hero-profile-text">

            {/* Name */}
            <h1 className="hero-name">
              <span className="gradient-text">Harsh Raj</span>
            </h1>

            <TypingEffect />

            <div className="hero-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Kolkata, India
            </div>


            {/* CTA buttons */}
            <div className="hero-cta-row">
              <a href="https://cal.com/rajharsh03/one-to-one" target="_blank" rel="noopener noreferrer" className="hero-cta-btn primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book a call
              </a>
              <a href="mailto:rajharsh2404@gmail.com" className="hero-cta-btn secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email me
              </a>
            </div>

            {/* Social icon buttons */}
            <div className="hero-actions">
              <a href="https://x.com/RajHarsh03" target="_blank" rel="noopener noreferrer"
                className="hero-action-btn" aria-label="X / Twitter" data-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/rajharsh03" target="_blank" rel="noopener noreferrer"
                className="hero-action-btn" aria-label="LinkedIn" data-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <rect x="2" y="2" width="20" height="20" rx="4" />
                  <path d="M7 10v7" />
                  <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
                  <path d="M11 10v7m0-4c0-2 1.5-3 3-3s3 1 3 3v4" />
                </svg>
              </a>
              <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noopener noreferrer"
                className="hero-action-btn" aria-label="GitHub" data-label="GitHub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
              <a href="/Resume.pdf" download
                className="hero-action-btn" aria-label="Resume" data-label="Resume">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" y1="13" x2="16" y2="13" />
                  <line x1="8" y1="17" x2="13" y2="17" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll" aria-hidden="true">
        <div className="scroll-line" />
        Scroll
      </div>
    </section>
  );
}

/* Live clock — updates every second */
function LiveClock() {
  const [time, setTime] = React.useState(getTime());

  React.useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{time}</span>;
}

function getTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/* Live temperature — Kolkata, fixed coords, no permission needed */
function LiveTemp() {
  const [temp, setTemp] = React.useState(null);

  React.useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=22.5726&longitude=88.3639&current_weather=true')
      .then(r => r.json())
      .then(d => setTemp(Math.round(d.current_weather.temperature)))
      .catch(() => {});
  }, []);

  if (temp === null) return null;
  return <span>{temp}°C</span>;
}
