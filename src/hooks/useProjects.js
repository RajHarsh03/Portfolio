import { useState, useEffect, useRef } from 'react';
import { fetchPortfolioProjects } from '../services/githubProjects.js';

/**
 * Shared hook for fetching GitHub portfolio projects.
 * Re-use across Home (top 2) and Projects page (all).
 * Auto-refreshes on tab focus with a 5-min cooldown.
 */
export function useProjects({ limit = 0 } = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const cooldown = useRef(false);
  const lastFetch = useRef(0);

  async function load(showLoading = false) {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const all = await fetchPortfolioProjects();
      setProjects(limit > 0 ? all.slice(0, limit) : all);
      lastFetch.current = Date.now();
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  // Initial fetch
  useEffect(() => { load(true); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh on tab return (5-min cooldown)
  useEffect(() => {
    function onVisible() {
      if (document.hidden) return;
      if (cooldown.current) return;
      if (Date.now() - lastFetch.current < 5 * 60 * 1000) return;
      cooldown.current = true;
      setTimeout(() => {
        load(false).finally(() => { cooldown.current = false; });
      }, 1500);
    }
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { projects, loading, error, reload: () => load(false) };
}
