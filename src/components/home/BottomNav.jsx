import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const HOME_ITEMS = [
  { id: 'hero',     label: 'Home',     icon: 'hgi-home-01' },
  { id: 'about',    label: 'About',    icon: 'hgi-user-circle' },
  { id: 'skills',   label: 'Skills',   icon: 'hgi-code' },
  { id: 'projects', label: 'Projects', icon: 'hgi-layout-grid' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [active, setActive] = useState('hero');

  useEffect(() => {
    if (!isHome) return;

    function onScroll() {
      let current = HOME_ITEMS[0].id;
      for (const item of HOME_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          current = item.id;
        }
      }
      setActive(current);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  if (!isHome) return null;

  function handleClick(e, id) {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
  }

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Page sections">
      {HOME_ITEMS.map(item => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`bnav-link${active === item.id ? ' active' : ''}`}
          onClick={e => handleClick(e, item.id)}
          aria-label={item.label}
        >
          <i className={`hgi-stroke ${item.icon}`} aria-hidden="true" />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
