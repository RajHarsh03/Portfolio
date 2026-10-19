import { useEffect, useState } from 'react';

export function useActiveSection(ids, offset = 110) {
  const key = ids.join('|');
  const [activeId, setActiveId] = useState(() => ids[0] || '');

  useEffect(() => {
    const targets = ids
      .map(id => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return undefined;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      // Band starts under the navbar and ends ~40% down the viewport.
      { rootMargin: `-${offset}px 0px -40% 0px`, threshold: 0 }
    );

    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
    // `key` is the stable signature of the ids array.
  }, [key, offset]);

  return activeId;
}
