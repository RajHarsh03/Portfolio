import { useEffect, useRef, useState } from 'react';

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SHOW_AFTER_PX = 200;

/**
 * Floating back-to-top button. Its ring fills as the page is scrolled.
 */
export default function ScrollToTopButton() {
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
      }
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  function scrollToTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  return (
    <button
      type="button"
      className={`scroll-top-btn${visible ? ' is-visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle className="ring-bg" cx="24" cy="24" r={RADIUS} />
        <circle
          ref={ringRef}
          className="ring-fill"
          cx="24"
          cy="24"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
