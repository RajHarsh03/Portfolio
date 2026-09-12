/**
 * api/spotify-auth.js
 * One-time OAuth helper to get your SPOTIFY_REFRESH_TOKEN.
 *
 * Step 1 — visit /api/spotify-auth          → redirects to Spotify login
 * Step 2 — Spotify redirects back with ?code → exchanges for refresh token
 *
 * Copy the printed refresh_token into your .env.local + Vercel env vars,
 * then you can delete or disable this file.
 */

const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
].join(' ');

export default async function handler(req, res) {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    return res.status(500).send('Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_REDIRECT_URI env vars.');
  }

  const { code } = req.query;

  // ── Step 2: exchange code for tokens ──────────────────────────────────────
  if (code) {
    const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type:   'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      }),
    });

    const data = await tokenRes.json();

    if (data.refresh_token) {
      return res.status(200).send(`
        <html><body style="font-family:monospace;padding:2rem;background:#0c0c0c;color:#e2e8f0">
          <h2 style="color:#3b82f6">✅ Got your refresh token!</h2>
          <p>Add this to your <strong>.env.local</strong> and Vercel environment variables:</p>
          <pre style="background:#131313;padding:1rem;border-radius:8px;color:#14b8a6;font-size:1rem">
SPOTIFY_REFRESH_TOKEN=${data.refresh_token}</pre>
          <p style="color:#64748b">Then delete or disable <code>api/spotify-auth.js</code>.</p>
        </body></html>
      `);
    }

    return res.status(400).send(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
  }

  // ── Step 1: redirect to Spotify login ─────────────────────────────────────
  const params = new URLSearchParams({
    response_type: 'code',
    client_id:     SPOTIFY_CLIENT_ID,
    scope:         SCOPES,
    redirect_uri:  SPOTIFY_REDIRECT_URI,
  });

  return res.redirect(`https://accounts.spotify.com/authorize?${params}`);
}
