import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useReveal } from '../hooks/useReveal.js';

export default function NotFound() {
  const ref = useReveal();
  const { pathname, search } = useLocation();

  return (
    <div className="notfound-page" ref={ref}>
      <Helmet>
        <title>Lost | harshx.in</title>
        <meta name="description" content="That page doesn't exist on harshx.in." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="notfound-inner">
        <p className="section-label">// lost</p>

        {/* Decorative - the <h1> below is the real page name */}
        <p className="notfound-code" aria-hidden="true">404</p>

        <h1 className="section-title">Page not found</h1>

        <p className="notfound-lede reveal">
          Nothing lives at this address on harshx.in. It may have moved, been renamed, or
          never existed at all.
        </p>

        {/* The URL that missed, as a compact line - a broken link found elsewhere
            should be easy to read back to me. Navigation out of here is the navbar
            and footer's job. */}
        <p className="notfound-row reveal">
          <span className="notfound-row-label">Requested</span>
          <code className="notfound-path">{pathname}{search}</code>
        </p>

        <p className="notfound-hint">
          Followed a broken link from somewhere?{' '}
          <Link to="/contact" className="notfound-report-link">
            Tell me where
            <svg aria-hidden="true" viewBox="0 0 24 24" width="12" height="12" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </Link>{' '}
          and I'll fix it.
        </p>
      </div>
    </div>
  );
}
