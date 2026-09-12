import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const REDIRECT_URI = 'http://127.0.0.1:5173/callback';
const SCOPES = 'user-read-currently-playing user-read-recently-played';

function upsertEnvLocal(key, value) {
  const file = path.resolve('.env.local');
  let text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const line = `${key}=${value}`;
  if (new RegExp(`^${key}=`, 'm').test(text)) {
    text = text.replace(new RegExp(`^${key}=.*$`, 'm'), line);
  } else {
    text = `${text.trimEnd()}\n${line}\n`;
  }
  fs.writeFileSync(file, text);
}

function sendHtml(res, html) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}

function nowPlayingDevPlugin() {
  return {
    name: 'now-playing-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', 'http://127.0.0.1:5173');

        if (url.pathname === '/spotify-connect') {
          const clientId = process.env.SPOTIFY_CLIENT_ID;
          if (!clientId) {
            sendHtml(res, '<p>Missing SPOTIFY_CLIENT_ID in .env.local. Restart the dev server after adding it.</p>');
            return;
          }
          const authorize = new URL('https://accounts.spotify.com/authorize');
          authorize.searchParams.set('client_id', clientId);
          authorize.searchParams.set('response_type', 'code');
          authorize.searchParams.set('redirect_uri', REDIRECT_URI);
          authorize.searchParams.set('scope', SCOPES);
          res.statusCode = 302;
          res.setHeader('Location', authorize.toString());
          res.end();
          return;
        }

        if (url.pathname === '/callback') {
          const code = url.searchParams.get('code');
          const error = url.searchParams.get('error');
          if (error || !code) {
            sendHtml(res, `<p>Spotify login failed: ${error || 'no code'}. Close this tab and try <a href="/spotify-connect">/spotify-connect</a> again.</p>`);
            return;
          }

          try {
            const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
              method: 'POST',
              headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
              }),
            });
            const data = await tokenRes.json();
            if (!data.refresh_token) {
              sendHtml(res, `<p>No refresh token returned. ${data.error_description || JSON.stringify(data)}</p>`);
              return;
            }

            upsertEnvLocal('SPOTIFY_REFRESH_TOKEN', data.refresh_token);
            process.env.SPOTIFY_REFRESH_TOKEN = data.refresh_token;
            sendHtml(res, '<p>Connected. You can close this tab and refresh the portfolio.</p>');
          } catch (err) {
            sendHtml(res, `<p>Token exchange failed: ${String(err)}</p>`);
          }
          return;
        }

        if (url.pathname === '/api/now-playing') {
          try {
            const { getNowPlayingPayload } = await import('./api/now-playing.js');
            const payload = await getNowPlayingPayload();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
          } catch (error) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ configured: false, error: String(error.message || error) }));
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
    plugins: [react(), nowPlayingDevPlugin()],
    server: {
      host: '127.0.0.1',
      port: 5173,
    },
  };
});
