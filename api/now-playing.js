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

async function getAccessToken(clientId, clientSecret, refreshToken) {
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
  return data.access_token;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return res.status(200).json({ configured: false, track: null, isPlaying: false });
  }

  try {
    const token = await getAccessToken(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN);

    // Try currently playing first
    const npRes = await fetch(NOW_PLAYING, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (npRes.status === 204) {
      // Nothing playing — fall back to recently played
      const recentRes = await fetch(RECENT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!recentRes.ok) return res.status(200).json({ configured: true, track: null, isPlaying: false });
      const recent = await recentRes.json();
      const item = recent.items?.[0]?.track;
      if (!item) return res.status(200).json({ configured: true, track: null, isPlaying: false });

      return res.status(200).json({
        configured: true,
        isPlaying: false,
        track: {
          title:   item.name,
          artist:  item.artists.map(a => a.name).join(', '),
          artwork: item.album.images[1]?.url || item.album.images[0]?.url || null,
          url:     item.external_urls.spotify,
        },
      });
    }

    if (!npRes.ok) return res.status(200).json({ configured: true, track: null, isPlaying: false });

    const np = await npRes.json();
    if (!np?.item) return res.status(200).json({ configured: true, track: null, isPlaying: false });

    return res.status(200).json({
      configured: true,
      isPlaying: np.is_playing,
      track: {
        title:   np.item.name,
        artist:  np.item.artists.map(a => a.name).join(', '),
        artwork: np.item.album.images[1]?.url || np.item.album.images[0]?.url || null,
        url:     np.item.external_urls.spotify,
      },
    });
  } catch (err) {
    console.error('Spotify error:', err);
    return res.status(200).json({ configured: false, track: null, isPlaying: false });
  }
}
