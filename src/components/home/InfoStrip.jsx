import { useEffect, useState } from 'react';

export default function InfoStrip() {
  return (
    <section id="about">
      <div className="info-strip-row">
        <div className="info-strip-bio-card">
          <p className="info-strip-bio">
            I'm a Full Stack Engineer focused on React, Node.js, and TypeScript.
            I love building intelligent, user-centric products and learning through
            real-world projects. I'm also an anime enthusiast, music lover,
            and occasional Minecraft player.
          </p>
        </div>

        <SpotifyNowPlaying />
      </div>
    </section>
  );
}

function SpotifyNowPlaying() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const isLocal = window.location.hostname === 'localhost'
          || window.location.hostname.startsWith('127.');

        let json = await fetch('/api/now-playing').then((r) => (r.ok ? r.json() : null)).catch(() => null);
        if (isLocal && !json?.track) {
          const prod = await fetch('https://harshx.in/api/now-playing')
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null);
          if (prod?.track) json = prod;
        }
        if (!cancelled) setData(json || { configured: false });
      } catch {
        if (!cancelled) setData({ configured: false });
      }
    }

    load();
    const id = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const track = data?.track;
  const isPlaying = Boolean(data?.isPlaying);
  const href = track?.url || 'https://open.spotify.com';

  return (
    <a
      className="info-strip-player"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={track ? `${isPlaying ? 'Now playing' : 'Last played'}: ${track.title} by ${track.artist}` : 'Spotify'}
    >
      {/* Album art — full width top */}
      <div className="np-art">
        {track?.artwork ? (
          <img src={track.artwork} alt={track.title} />
        ) : (
          <div className="np-art-placeholder">
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info below */}
      <div className="np-meta">
        <div className="np-label">
          {isPlaying ? (
            <>
              <span className="np-bars" aria-hidden="true">
                <span /><span /><span />
              </span>
              Now playing
            </>
          ) : (
            'Last played'
          )}
          <span className="np-source"> · Spotify</span>
        </div>
        <div className="np-title">{track?.title || '—'}</div>
        <div className="np-artist">{track?.artist || 'Open Spotify'}</div>
      </div>
    </a>
  );
}
