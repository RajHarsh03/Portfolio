import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('pf-theme') || 'light'; } catch { return 'light'; }
  });

  // Keep document attribute in sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('pf-theme', theme); } catch {}
  }, [theme]);

  function toggleTheme(fromEl) {
    const next = theme === 'dark' ? 'light' : 'dark';

    if (document.startViewTransition && fromEl) {
      const rect = fromEl.getBoundingClientRect();
      const ox = rect.left + rect.width / 2;
      const oy = rect.top + rect.height / 2;
      const maxR = Math.hypot(
        Math.max(ox, window.innerWidth - ox),
        Math.max(oy, window.innerHeight - oy)
      );
      
      // Slower and smoother animation
      const isMobile = window.innerWidth <= 768;
      const duration = isMobile ? 600 : 800;
      
      const vt = document.startViewTransition(() => setTheme(next));
      vt.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${ox}px ${oy}px)`,
              `circle(${maxR}px at ${ox}px ${oy}px)`,
            ],
          },
          {
            duration: duration,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    } else {
      setTheme(next);
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
