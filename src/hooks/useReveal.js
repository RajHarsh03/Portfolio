import { useEffect, useState } from 'react';

/**
 * useReveal — attaches an IntersectionObserver to a container element.
 * All children with className "reveal" inside that container get
 * the "visible" class added when they scroll into view.
 *
 * Returns a callback ref, so the observer is (re)attached whenever the
 * container element mounts — including when it renders after a loading view.
 *
 * Usage:
 *   const ref = useReveal();
 *   return <section ref={ref}><div className="reveal">…</div></section>
 */
export function useReveal(threshold = 0.08) {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    // Observe all .reveal children already in the container
    function observe() {
      container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
    observe();

    // Re-observe when children change (e.g. after async data loads)
    const mutation = new MutationObserver(observe);
    mutation.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [container, threshold]);

  return setContainer;
}
