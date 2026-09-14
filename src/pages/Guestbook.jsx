import { Helmet } from 'react-helmet-async';

export default function Guestbook() {
  return (
    <>
      <Helmet>
        <title>Guestbook - Harsh Raj</title>
      </Helmet>
      <section style={{ paddingTop: '8rem', minHeight: '70vh', textAlign: 'center' }}>
        <div className="container">
          <p className="section-label">// guestbook</p>

          <h1 style={{
            fontSize: 'clamp(2.8rem, 9vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-.04em',
            color: 'var(--text)',
            marginBottom: '1.25rem',
          }}>
            Something's<br />brewing.
          </h1>

          <p style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '.82rem',
            color: 'var(--muted)',
            lineHeight: 1.8,
            maxWidth: '360px',
            margin: '0 auto',
          }}>
            The guestbook is on its way - a place where you can leave a word, a thought, or just say hi.
          </p>
        </div>
      </section>
    </>
  );
}
