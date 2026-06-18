import { useEffect, useRef } from 'react';


export default function Footer() {
  const countRef = useRef(null);
  const wrapRef  = useRef(null);
  const fetched  = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    // In dev, /api/visits doesn't run — fall back to production URL to read live count
    const isProd = window.location.hostname !== 'localhost' && !window.location.hostname.startsWith('127.');
    const apiUrl = isProd ? '/api/visits' : 'https://harshx.in/api/visits';

    // POST on prod (counts the visit), GET on dev (just reads the count)
    fetch(apiUrl, { method: isProd ? 'POST' : 'GET' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.total != null && countRef.current && wrapRef.current) {
          countRef.current.textContent = Number(data.total).toLocaleString('en-IN');
          wrapRef.current.hidden = false;
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer>
      <div className="footer-new">
        <div className="footer-new-top">
          <div className="footer-new-brand">
            <span className="footer-logo">harshx<span>.</span>in</span>
            <p>Full Stack Engineer building things that matter.<br className="footer-br" />Deep-dive experimenter at heart.</p>
          </div>

          <div className="footer-new-socials">
            {/* GitHub */}
            <a href="https://github.com/RajHarsh03" target="_blank" rel="noopener noreferrer"
              className="footer-icon-btn" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/rajharsh03" target="_blank" rel="noopener noreferrer"
              className="footer-icon-btn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a href="https://x.com/RajHarsh03" target="_blank" rel="noopener noreferrer"
              className="footer-icon-btn" aria-label="X / Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Blog (Hashnode) */}
            <a href="https://blog.harshx.in/" target="_blank" rel="noopener noreferrer"
              className="footer-icon-btn" aria-label="Blog">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 00-7.962 0l-6.37 6.37a5.63 5.63 0 000 7.962l6.37 6.37a5.63 5.63 0 007.962 0l6.37-6.37a5.63 5.63 0 000-7.962zM12 15.953a3.953 3.953 0 110-7.906 3.953 3.953 0 010 7.906z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-new-bottom">
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} &middot; harshx.in &middot; All rights reserved.
          </span>
          <div className="footer-new-right">
            <span ref={wrapRef} className="footer-visits" id="footerVisits" hidden>
              <span className="visit-dot" aria-hidden="true" />
              <span ref={countRef} id="visitCount">—</span> Visits
            </span>
            <span className="footer-made-by">MADE BY: <a>HARSH</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
