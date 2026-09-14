/**
 * projectDetailsGist.js
 * Fetches additional project details (features, highlights, challenges) from GitHub Gist
 */

const PROJECT_DETAILS_GIST_URL =
  'https://gist.githubusercontent.com/RajHarsh03/d9dafa7d57b7af090604cc06f0e69c9f/raw/project-details.json';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
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

export async function fetchProjectDetails() {
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) {
    return _cache;
  }

  try {
    const res = await fetch(`${PROJECT_DETAILS_GIST_URL}?t=${Date.now()}`, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    _cache = data;
    _cacheTime = Date.now();
    console.log('[projectDetails] Loaded from Gist.');
    return _cache;

  } catch (err) {
    console.warn('[projectDetails] Fetch failed — using fallback data.', err.message);
    return FALLBACK_PROJECT_DETAILS;
  }
}
