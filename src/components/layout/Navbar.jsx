import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';

const GH_USER = 'RajHarsh03';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const btnRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [repoCount, setRepoCount] = useState('');
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Scrolled class for nav shadow
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 10); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch GitHub public repo count
  useEffect(() => {
    fetch(`https://api.github.com/users/${GH_USER}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.public_repos) setRepoCount(String(d.public_repos)); })
      .catch(() => {});
  }, []);

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <Link to="/" className="nav-logo">
        harshx<span>.</span>in
      </Link>

      <div className="nav-right">
        {/* Mobile home icon — only on non-home pages */}
        {!isHome && (
          <Link to="/" className="nav-home-mobile" aria-label="Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
              <polyline points="9 21 9 12 15 12 15 21" />
            </svg>
          </Link>
        )}

        {/* Pill tabs — hidden on home page entirely */}
        {!isHome && (
          <div className="exp-tabs" id="expTabs">
            <NavLink to="/" end className={({ isActive }) => 'exp-tab' + (isActive ? ' expanded' : '')} aria-label="Home">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                <polyline points="9 21 9 12 15 12 15 21" />
              </svg>
              <span className="exp-tab-label">Home</span>
            </NavLink>

            <NavLink to="/projects" className={({ isActive }) => 'exp-tab' + (isActive ? ' expanded' : '')} aria-label="Projects">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span className="exp-tab-label">Projects</span>
            </NavLink>

            <NavLink to="/contact" className={({ isActive }) => 'exp-tab' + (isActive ? ' expanded' : '')} aria-label="Contact">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <span className="exp-tab-label">Contact</span>
            </NavLink>
          </div>
        )}

        {/* GitHub repo count */}
        <button
          type="button"
          className="nav-gh-btn"
          id="navGhBtn"
          aria-label="GitHub public repos"
          data-repos={repoCount ? `${repoCount} public repos` : ''}
          onClick={() => window.open(`https://github.com/${GH_USER}`, '_blank', 'noopener')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          {/* count lives in the ::after tooltip via data-repos — not shown inline */}
        </button>

        {/* Theme toggle */}
        <button
          ref={btnRef}
          className="theme-btn"
          id="themeToggle"
          aria-label="Toggle theme"
          onClick={() => toggleTheme(btnRef.current)}
        >
          <div className="theme-icon-wrap">
            {/* Moon — visible in light mode */}
            <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            {/* Sun — visible in dark mode */}
            <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </div>
        </button>
      </div>
    </nav>
  );
}
