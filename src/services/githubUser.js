/**
 * githubUser.js
 * Shared GitHub user lookup for the Navbar (repo count), the favicon and the
 * Hero/About profile photo (avatar).
 * One request per page load at most, none while the localStorage copy is fresh.
 */
const GH_USER = 'RajHarsh03';
const CACHE_KEY = 'gh_user_cache_v1';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/* Direct avatar URL (no github.com/<user>.png redirect). It always serves the
   current GitHub picture. Keep `${DEFAULT_AVATAR_BASE}&s=400` identical to the
   <link rel="preload"> in index.html so the preload is reused. */
const DEFAULT_AVATAR_BASE = 'https://avatars.githubusercontent.com/u/217300092?v=4';
const AVATAR_ORIGIN = 'https://avatars.githubusercontent.com/';

let _promise = null;

function readCache() {
  try {
    const data = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (data && Date.now() - data.savedAt < CACHE_TTL) return data.user;
  } catch {
    /* corrupt entry / storage blocked */
  }
  return null;
}

function writeCache(user) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ user, savedAt: Date.now() }));
  } catch {
    /* quota / private mode */
  }
}

/**
 * Synchronous profile photo URL for the Hero and About avatars.
 * Uses the cached `avatar_url` (even when stale) and falls back to the known one.
 */
export function getAvatarUrl(size = 400) {
  let base = DEFAULT_AVATAR_BASE;
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')?.user?.avatar_url;
    if (typeof cached === 'string' && cached.startsWith(AVATAR_ORIGIN)) base = cached;
  } catch {
    /* corrupt entry / storage blocked */
  }
  return `${base}${base.includes('?') ? '&' : '?'}s=${size}`;
}

/** Resolves to { public_repos, avatar_url } or null when the request fails. */
export function getGitHubUser() {
  if (_promise) return _promise;
  const cached = readCache();
  if (cached) {
    _promise = Promise.resolve(cached);
    return _promise;
  }
  _promise = fetch(`https://api.github.com/users/${GH_USER}`)
    .then(r => (r.ok ? r.json() : null))
    .then(d => {
      if (!d) return null;
      const user = { public_repos: d.public_repos, avatar_url: d.avatar_url };
      writeCache(user);
      return user;
    })
    .catch(() => null);
  return _promise;
}
