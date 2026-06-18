import { useEffect, useRef } from 'react';

/**
 * Custom dual-ring cursor — mirrors the original script.js behaviour.
 * Hidden on touch devices via CSS (hover:none / pointer:coarse).
 */
export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    function onMove(e) {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
    }

    function tick() {
      const { mx, my } = pos.current;
      let { rx, ry } = pos.current;

      dot.style.transform  = `translate(${mx - 5}px, ${my - 5}px)`;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      pos.current.rx = rx;
      pos.current.ry = ry;
      ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
      rafId.current = requestAnimationFrame(tick);
    }

    function expand() { ring.style.width = '52px'; ring.style.height = '52px'; }
    function shrink()  { ring.style.width = '32px'; ring.style.height = '32px'; }

    const selector = 'a,button,.blog-card,.project-card,.stat-card,.skill-tag,.theme-btn,.form-btn,.btn-primary,.btn-outline,.btn-cv,.social-link,.nav-gh-btn';

    function attachHover() {
      document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('mouseenter', expand);
        el.addEventListener('mouseleave', shrink);
      });
    }

    document.addEventListener('mousemove', onMove);
    rafId.current = requestAnimationFrame(tick);
    attachHover();

    // Re-attach when DOM changes (e.g. after React re-renders)
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor"      ref={dotRef}  id="cursor" />
      <div className="cursor-ring" ref={ringRef} id="cursorRing" />
    </>
  );
}
