import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',        label: 'Home'     },
  { to: '/about',   label: 'About'    },
  { to: '/projects',label: 'Projects' },
];

const MORE_LINKS = [
  { to: '/contact',   label: 'Contact'   },
  { to: '/guestbook', label: 'Guestbook' },
];

// Matches the desktop navbar: the footer-only legal pages still count as "More",
// and so does any URL that falls through to the 404 page.
const MORE_PATHS = [...MORE_LINKS.map(l => l.to), '/privacy', '/terms'];
const KNOWN_PATHS = [...NAV_LINKS.map(l => l.to), ...MORE_PATHS];

const isMoreActive = (path) =>
  MORE_PATHS.includes(path) ||
  (!KNOWN_PATHS.includes(path) && !path.startsWith('/projects/'));

export default function BottomNav() {
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef  = useRef(null);
  const moreBtnRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onPointerDown(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // Close on Escape and return focus to the trigger
  useEffect(() => {
    if (!moreOpen) return;
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setMoreOpen(false);
        moreBtnRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [moreOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setMoreOpen(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [pathname]);

  const moreActive = isMoreActive(pathname);

  return (
    <div className="bottom-nav-portal">
      <div className="bottom-nav" role="navigation" aria-label="Main navigation">
      {NAV_LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `bnav-link${isActive ? ' active' : ''}`}
        >
          {label}
        </NavLink>
      ))}

      {/* More dropdown */}
      <div className="bnav-more-wrap" ref={moreRef}>
        <button
          ref={moreBtnRef}
          className={`bnav-link bnav-more-btn${moreActive ? ' active' : ''}`}
          onClick={() => setMoreOpen(o => !o)}
          aria-expanded={moreOpen}
          aria-controls="bnav-more-dropdown"
        >
          More
          <svg
            className={`bnav-chevron${moreOpen ? ' open' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            width="12" height="12" aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {moreOpen && (
          <div className="bnav-dropdown" id="bnav-more-dropdown">
            {MORE_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `bnav-drop-item${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
