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

export default function BottomNav() {
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef  = useRef(null);

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

  // Close dropdown on route change
  useEffect(() => { setMoreOpen(false); }, [pathname]);

  const moreActive = MORE_LINKS.some(l => pathname === l.to);

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
          className={`bnav-link bnav-more-btn${moreActive ? ' active' : ''}`}
          onClick={() => setMoreOpen(o => !o)}
          aria-haspopup="true"
          aria-expanded={moreOpen}
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
          <div className="bnav-dropdown" role="menu">
            {MORE_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `bnav-drop-item${isActive ? ' active' : ''}`}
                role="menuitem"
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
