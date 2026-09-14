import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layouts/AppShell.jsx';
import ScrollToTop from './router/ScrollToTop.jsx';
import {
  Home,
  Projects,
  ProjectDetail,
  Contact,
  About,
  Guestbook,
} from './router/routes.jsx';

/** Minimal loading fallback shown while a lazy page chunk loads */
function RouteLoader() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }} />
  );
}

export default function App() {
  return (
    <AppShell>
      <ScrollToTop />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/about"    element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/contact"   element={<Contact />} />
          <Route path="/guestbook" element={<Guestbook />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
