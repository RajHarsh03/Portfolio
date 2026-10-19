import { Link } from 'react-router-dom';

const GH_USER = 'RajHarsh03';

export default function Footer() {
  return (
    <footer>
      <div className="footer-simple">
        <div className="footer-bottom">
          {/* Mobile-only brand mark. The name is already spelled out in the
              copyright line below, so this stays to two lines. */}
          <div className="footer-brand">
            <p className="footer-brand-name">harshx.in</p>
            <p className="footer-brand-tagline">"Ship daily. Learn in public."</p>
          </div>

          <div className="footer-bottom-left">
            <span className="footer-copy">© {new Date().getFullYear()} &middot; <span className="footer-name-pixel">Harsh Raj</span></span>
            <span className="footer-loc">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="12" height="12"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Kolkata, IN
            </span>
          </div>

          {/* role="navigation" instead of <nav>: the global `nav { position: fixed }`
              navbar rule in index.css targets the bare element selector.
              Group titles, link icons and text labels are desktop-hidden and only
              appear once the footer stacks vertically below 768px. */}
          <div className="footer-legal" role="navigation" aria-label="Legal">
            <p className="footer-group-title">Legal</p>

            <Link to="/privacy" className="footer-legal-link">
              <svg className="footer-legal-icon" aria-hidden="true" viewBox="0 0 24 24" width="15" height="15"
                fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.6 4.8 5.4v5.3c0 4.5 3 8.6 7.2 10 4.2-1.4 7.2-5.5 7.2-10V5.4L12 2.6Z" />
              </svg>
              <span className="footer-legal-label">
                <span className="footer-legal-short">Privacy</span>
                <span className="footer-legal-full">Privacy Policy</span>
              </span>
            </Link>

            <Link to="/terms" className="footer-legal-link">
              <svg className="footer-legal-icon" aria-hidden="true" viewBox="0 0 24 24" width="15" height="15"
                fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V7l-4-4Z" />
                <path d="M13.8 3.1V7.2H18" />
                <path d="M9 12.5h6M9 16.5h6" />
              </svg>
              <span className="footer-legal-label">
                <span className="footer-legal-short">Terms</span>
                <span className="footer-legal-full">Terms of Service</span>
              </span>
            </Link>
          </div>

          <div className="footer-icons">
            <p className="footer-group-title">Network</p>

            <a href="https://www.linkedin.com/in/rajharsh03/" target="_blank" rel="noopener noreferrer"
              className="footer-icon-btn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="footer-icon-label">LinkedIn</span>
            </a>
            <a href="https://x.com/RajHarsh03" target="_blank" rel="noopener noreferrer"
              className="footer-icon-btn" aria-label="X / Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="footer-icon-label">X / Twitter</span>
            </a>
            <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noopener noreferrer"
              className="footer-icon-btn" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span className="footer-icon-label">GitHub</span>
            </a>
            <a href="https://blog.harshx.in/" target="_blank" rel="noopener noreferrer"
              className="footer-icon-btn" aria-label="Blog">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 00-7.962 0l-6.37 6.37a5.63 5.63 0 000 7.962l6.37 6.37a5.63 5.63 0 007.962 0l6.37-6.37a5.63 5.63 0 000-7.962zM12 15.953a3.953 3.953 0 110-7.906 3.953 3.953 0 010 7.906z" />
              </svg>
              <span className="footer-icon-label">Blog</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
