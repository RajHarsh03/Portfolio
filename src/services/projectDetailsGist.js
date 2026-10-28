/**
 * projectDetailsGist.js
 * Fetches additional project details (features, highlights, challenges) from GitHub Gist
 */

const PROJECT_DETAILS_GIST_URL =
  'https://gist.githubusercontent.com/RajHarsh03/d9dafa7d57b7af090604cc06f0e69c9f/raw/project-details.json';

// Stale-while-revalidate: the last good copy lives in localStorage and renders
// immediately; it is refetched in the background once older than CACHE_TTL.
const CACHE_KEY = 'gist_project_details_cache_v1';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
let _cache = null;
let _cacheTime = 0;

export const FALLBACK_PROJECT_DETAILS = {
  // Example data structure
  'CropGaurd': {
    features: [
      'AI-powered crop disease detection using MobileNetV2 transfer learning',
      'Upload leaf images to identify 18 different plant diseases classes',
      'Treatment recommendations for identified diseases',
      'Built with React, FastAPI & TensorFlow'
    ],
    highlights: [
      'Achieved 95% accuracy in disease classification',
      'Processes images in under 2 seconds',
      'Supports multiple crop types'
    ],
    challenges: [
      'Optimizing model size for faster inference',
      'Handling various image qualities and lighting conditions'
    ]
  }
};

function readStored() {
  try {
    const stored = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (stored?.data && typeof stored.savedAt === 'number') return stored;
  } catch {
    /* corrupt entry / storage blocked */
  }
  return null;
}

/** Last cached project details (any age), or null. Synchronous, for first render. */
export function getCachedProjectDetails() {
  if (_cache) return _cache;
  return readStored()?.data ?? null;
}

export async function fetchProjectDetails() {
  if (!_cache) {
    const stored = readStored();
    if (stored) { _cache = stored.data; _cacheTime = stored.savedAt; }
  }

  if (_cache && Date.now() - _cacheTime < CACHE_TTL) {
    return _cache;
  }

  try {
    const res = await fetch(PROJECT_DETAILS_GIST_URL, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    _cache = data;
    _cacheTime = Date.now();
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: _cache, savedAt: _cacheTime }));
    } catch {
      /* quota / private mode */
    }
    console.log('[projectDetails] Loaded from Gist.');
    return _cache;

  } catch (err) {
    if (_cache) return _cache; // keep showing the stale copy
    console.warn('[projectDetails] Fetch failed — using fallback data.', err.message);
    return FALLBACK_PROJECT_DETAILS;
  }
}
