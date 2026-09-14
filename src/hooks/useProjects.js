import { useState, useEffect, useRef } from 'react';
import { fetchPortfolioProjects, getCachedProjects } from '../services/githubProjects.js';

/**
 * Shared hook for fetching GitHub portfolio projects.
 * - Instantly shows cached data (no loading flash if cache exists)
 * - Fetches fresh data in background and updates silently
 * - Auto-refreshes on tab focus with a 5-min cooldown
 */
export function useProjects({ limit = 0 } = {}) {
  const cached = getCachedProjects();

  const [projects, setProjects] = useState(
    cached ? (limit > 0 ? cached.slice(0, limit) : cached) : []
  );
  const [loading, setLoading] = useState(!cached); // no spinner if cache hit
  const [error, setError]     = useState(null);
  const lastFetch = useRef(0);
  const cooldown  = useRef(false);

  function applyProjects(all) {
    setProjects(limit > 0 ? all.slice(0, limit) : all);
    lastFetch.current = Date.now();
  }

  async function load(showLoading = false) {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const all = await fetchPortfolioProjects();
      applyProjects(all);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  // On mount: if cache exists, fetch fresh silently; otherwise show loader
  useEffect(() => {
    if (cached) {
      // Already showing cached data — refresh silently in background
      load(false);
    } else {
      load(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
