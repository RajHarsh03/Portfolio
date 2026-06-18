import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Not Found</title>
      </Helmet>
      <section style={{ paddingTop: '8rem', minHeight: '70vh', textAlign: 'center' }}>
        <div className="container">
          <p className="section-label">// error</p>
          <h1 style={{ fontSize: 'clamp(4rem, 12vw, 8rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-.04em', color: 'var(--border)' }}>
            404
          </h1>
          <h2 className="section-title" style={{ marginTop: '1rem' }}>Page not found</h2>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '.88rem', color: 'var(--muted)', marginBottom: '2rem' }}>
            Looks like this route doesn't exist yet.
          </p>
          <Link to="/" className="btn-primary">← Back home</Link>
        </div>
      </section>
    </>
  );
}
