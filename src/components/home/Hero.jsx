import { Link } from 'react-router-dom';

const GH_USER = 'RajHarsh03';

export default function Hero() {
  return (
    <section id="hero">
      {/* hero-grid-bg removed — global dot grid from body::before shows through */}

      <div className="hero-inner">
        <div className="hero-content">
          {/* Available badge */}
          <div className="hero-tag">
            <span className="tag-desktop">Available for Freelance &amp; Full-time Roles</span>
            <span className="tag-mobile">Open to Work</span>
          </div>

          <p className="hero-greeting">Hello! I'm</p>
          <h1 className="hero-name">
            <span className="gradient-text">Harsh Raj</span>
          </h1>
          <div className="hero-role">Full Stack Engineer</div>

          <div className="hero-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            Kolkata, India
          </div>

          <p className="hero-desc">
            Full Stack Engineer crafting scalable web apps with React, Node.js &amp; TypeScript.
          </p>

          <div className="hero-cta">
            <a href="/Resume.pdf" download className="btn-cv">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Resume / CV
            </a>
            <Link to="/contact" className="btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
              Get in touch
            </Link>
          </div>

          <div className="hero-socials">
            <a href="https://x.com/RajHarsh03" target="_blank" rel="noopener noreferrer"
              className="hero-social" aria-label="X / Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/rajharsh03" target="_blank" rel="noopener noreferrer"
              className="hero-social" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noopener noreferrer"
              className="hero-social" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>

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
