/**
 * api/now-playing.js
 * Returns the currently playing (or last played) Spotify track.
 * Env vars needed:
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_CLIENT_SECRET
 *   SPOTIFY_REFRESH_TOKEN
 */

const TOKEN_URL   = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENT      = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

const TOKEN_REFRESH_MARGIN_MS = 60 * 1000;
const PAYLOAD_TTL_MS = 10 * 1000;

// Module-scope caches: reused across requests on a warm serverless instance.
let cachedToken = null;   // { value, expiresAt, refreshToken }
let cachedPayload = null; // { value, expiresAt }
let inflightPayload = null;

async function fetchAccessToken(clientId, clientSecret, refreshToken) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error(`Token error ${res.status}`);
  const data = await res.json();
  const expiresInMs = (Number(data.expires_in) || 3600) * 1000;
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + expiresInMs - TOKEN_REFRESH_MARGIN_MS,
    refreshToken,
  };
  return cachedToken.value;
}

async function getAccessToken(clientId, clientSecret, refreshToken) {
  if (cachedToken && cachedToken.refreshToken === refreshToken && Date.now() < cachedToken.expiresAt) {
    return { token: cachedToken.value, fromCache: true };
  }
  return { token: await fetchAccessToken(clientId, clientSecret, refreshToken), fromCache: false };
}

// GET a Spotify API URL; if a cached token is rejected (401), drop it and retry once with a fresh one.
async function spotifyGet(url, creds) {
  const { token, fromCache } = await getAccessToken(...creds);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 401 && fromCache) {
    cachedToken = null;
    const fresh = await fetchAccessToken(...creds);
    return fetch(url, { headers: { Authorization: `Bearer ${fresh}` } });
  }
  return res;
}

export async function getNowPlayingPayload() {
  // Read env at call time so values loaded later (e.g. by vite.config.js in dev) apply.
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return { configured: false, track: null, isPlaying: false };
  }

  if (cachedPayload && Date.now() < cachedPayload.expiresAt) return cachedPayload.value;
  if (inflightPayload) return inflightPayload;

  inflightPayload = fetchNowPlayingPayload([SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN])
    .then(payload => {
      // Only cache successful lookups so errors are retried on the next request.
      if (payload.configured) cachedPayload = { value: payload, expiresAt: Date.now() + PAYLOAD_TTL_MS };
      return payload;
    })
    .finally(() => { inflightPayload = null; });
  return inflightPayload;
}

async function fetchNowPlayingPayload(creds) {
  try {
    // Try currently playing first
    const npRes = await spotifyGet(NOW_PLAYING, creds);

    if (npRes.status === 204) {
      // Nothing playing — fall back to recently played
      const recentRes = await spotifyGet(RECENT, creds);
      if (!recentRes.ok) return { configured: true, track: null, isPlaying: false };
      const recent = await recentRes.json();
      const item = recent.items?.[0]?.track;
      if (!item) return { configured: true, track: null, isPlaying: false };

      return {
        configured: true,
        isPlaying: false,
        track: {
          title:   item.name,
          artist:  item.artists.map(a => a.name).join(', '),
          artwork: item.album.images[1]?.url || item.album.images[0]?.url || null,
          url:     item.external_urls.spotify,
        },
      };
    }

    if (!npRes.ok) return { configured: true, track: null, isPlaying: false };

    const np = await npRes.json();
    if (!np?.item) return { configured: true, track: null, isPlaying: false };

    return {
      configured: true,
      isPlaying: np.is_playing,
      track: {
        title:   np.item.name,
        artist:  np.item.artists.map(a => a.name).join(', '),
        artwork: np.item.album.images[1]?.url || np.item.album.images[0]?.url || null,
        url:     np.item.external_urls.spotify,
      },
    };
  } catch (err) {
    console.error('Spotify error:', err);
    return { configured: false, track: null, isPlaying: false };
  }
}

export default async function handler(req, res) {
  // Let Vercel's edge CDN serve repeat requests briefly instead of invoking Spotify each time.
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=20');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const payload = await getNowPlayingPayload();
  return res.status(200).json(payload);
}
