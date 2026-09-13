const GH_USER = 'RajHarsh03';

export default function Footer() {
  return (
    <footer>
      <div className="footer-simple">
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span className="footer-copy">© {new Date().getFullYear()} &middot; <span className="footer-name-pixel">Harsh Raj</span></span>
          </div>

          <div className="footer-icons">
            <a href="https://www.linkedin.com/in/rajharsh03/" target="_blank" rel="noopener noreferrer"
              className="footer-icon-btn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://x.com/RajHarsh03" target="_blank" rel="noopener noreferrer"
              className="footer-icon-btn" aria-label="X / Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="mailto:rajharsh.devx@gmail.com" className="footer-icon-btn" aria-label="Email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="2,4 12,13 22,4" />
              </svg>
            </a>
            <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noopener noreferrer"
              className="footer-icon-btn" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <a href="https://blog.harshx.in/" target="_blank" rel="noopener noreferrer"
              className="footer-icon-btn" aria-label="Blog">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 00-7.962 0l-6.37 6.37a5.63 5.63 0 000 7.962l6.37 6.37a5.63 5.63 0 007.962 0l6.37-6.37a5.63 5.63 0 000-7.962zM12 15.953a3.953 3.953 0 110-7.906 3.953 3.953 0 010 7.906z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
