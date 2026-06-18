import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppShell from './layouts/AppShell.jsx';
import ScrollToTop from './router/ScrollToTop.jsx';
import {
  Home,
  Projects,
  Contact,
  Journey,
  Certificates,
  NotFound,
} from './router/routes.jsx';

/** Minimal loading fallback shown while a lazy page chunk loads */
function RouteLoader() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Mono, monospace',
      fontSize: '.85rem',
      color: 'var(--muted)',
    }}>
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <AppShell>
      <ScrollToTop />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/projects"     element={<Projects />} />
          <Route path="/contact"      element={<Contact />} />
          <Route path="/journey"      element={<Journey />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="*"             element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
