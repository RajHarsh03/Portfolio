import { useState, useEffect } from 'react';
import { fetchGistContent, FALLBACK_DATA } from '../services/gistContent.js';

/**
 * Loads portfolio content from GitHub Gist.
 * Starts immediately with fallback data — no empty flash.
 * Swaps to live Gist data once the fetch completes.
 */
export function useGistContent() {
  const [data, setData]       = useState(FALLBACK_DATA); // instant render, no flash
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await fetchGistContent();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
