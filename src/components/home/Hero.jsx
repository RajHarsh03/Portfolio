import React, { useEffect, useRef, useState } from 'react';
import TypingEffect from './TypingEffect.jsx';

const GH_USER = 'RajHarsh03';

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-profile-card">

        {/* ── Banner (hidden on mobile) ── */}
        <div className="hero-banner">
          <div className="hero-banner-placeholder" aria-hidden="true" />

          <aside className="hb-note hb-note-lt" aria-hidden="true">
            <span className="hb-note-rule" />
            <span>Somewhere<br />between<br />ideas and<br />reality</span>
          </aside>
          <aside className="hb-note hb-note-rt" aria-hidden="true">
            <span className="hb-note-rule" style={{marginLeft:'auto'}} />
            <span>GOOD IDEAS TAKE TIME</span>
          </aside>

          <div className="hero-banner-center-text">
            Open for full-time<br />&amp; freelance work
          </div>
          <div className="hero-banner-time" aria-label="Local time and temperature">
            <LiveClock />
            <span className="hero-banner-time-label">·</span>
            <LiveTemp />
          </div>
        </div>

        {/* ── Mobile top row: avatar + name (shown only ≤430px) ── */}
        <div className="hero-mobile-top">
          <div className="hero-avatar-ring hero-mobile-avatar">
            <img
              src={`https://github.com/${GH_USER}.png?size=400`}
              alt="Harsh Raj"
              className="hero-avatar-img"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="hero-mobile-identity">
            <h1 className="hero-name"><span className="gradient-text">Harsh Raj</span></h1>
            <TypingEffect />
          </div>
        </div>

        {/* ── Mobile location (shown only ≤430px) ── */}
        <div className="hero-mobile-location">
          <span className="hero-mobile-location-label">LOCATION</span>
          <div className="hero-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            Kolkata, India
          </div>
        </div>

        {/* ── Profile row: avatar + body (desktop) ── */}
        <div className="hero-profile-body">

          {/* Avatar */}
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
            <div className="hero-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Kolkata, India
            </div>
          </div>

          {/* Text content */}
          <div className="hero-profile-text">

            <h1 className="hero-name">
              <span className="gradient-text">Harsh Raj</span>
            </h1>

            <TypingEffect />

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
              <a href="mailto:rajharsh.devx@gmail.com" className="hero-cta-btn secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email me
              </a>
            </div>

            {/* Short desc */}
            <p className="hero-short-desc">
              Full-stack engineer who turns ideas into real products. I care about clean architecture,
              sharp UI, and shipping things that actually work - with <strong>React</strong>, <strong>Node.js</strong>, <strong>TypeScript</strong>, and <strong>Python</strong>.
            </p>

            {/* Minimal Spotify one-liner */}
            <MiniSpotify />

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

/* ── Minimal one-line Spotify: 🟢 Last played - Song · Artist ── */
function MiniSpotify() {
  const [track, setTrack] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sp_last_track') || 'null'); } catch { return null; }
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname.startsWith('127.');
        let json = await fetch('/api/now-playing').then(r => r.ok ? r.json() : null).catch(() => null);
        if (isLocal && !json?.track) {
          json = await fetch('https://harshx.in/api/now-playing').then(r => r.ok ? r.json() : null).catch(() => null);
        }
        if (!cancelled && json?.track) {
          setTrack(json.track);
          try { localStorage.setItem('sp_last_track', JSON.stringify(json.track)); } catch {}
        }
      } catch {}
    }
    load();
    const id = setInterval(load, 30000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  if (!track) return (
    <div className="hero-mini-spotify" style={{ pointerEvents: 'none' }}>
      <svg viewBox="0 0 24 24" fill="#1DB954" width="14" height="14" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
      <span className="hero-mini-label">Last played</span>
      <span className="hero-mini-sep"> - </span>
      <span className="hero-mini-track" style={{ opacity: .4 }}>—</span>
    </div>
  );

  return (
    <a
      href={track.url || 'https://open.spotify.com'}
      target="_blank"
      rel="noopener noreferrer"
      className="hero-mini-spotify"
      aria-label={`Last played: ${track.title} by ${track.artist}`}
    >
      <svg viewBox="0 0 24 24" fill="#1DB954" width="14" height="14" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
      <span className="hero-mini-label">Last played</span>
      <span className="hero-mini-sep"> - </span>
      <span className="hero-mini-track">{track.title} · {track.artist}</span>
    </a>
  );
}

function LiveClock() {
  const [time, setTime] = React.useState(getTime());
  React.useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

function getTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

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

