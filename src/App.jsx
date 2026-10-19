import { Routes, Route } from 'react-router-dom';
import AppShell from './layouts/AppShell.jsx';
import ScrollToTop from './router/ScrollToTop.jsx';
import useNeko from './hooks/useNeko.js';
import {
  Home,
  Projects,
  ProjectDetail,
  Contact,
  About,
  Guestbook,
  PrivacyPolicy,
  TermsOfService,
  NotFound,
} from './router/routes.jsx';

export default function App() {
  useNeko();

  return (
    <AppShell>
      <ScrollToTop />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/about"       element={<About />} />
        <Route path="/projects"    element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/contact"     element={<Contact />} />
        <Route path="/guestbook"   element={<Guestbook />} />
        <Route path="/privacy"     element={<PrivacyPolicy />} />
        <Route path="/terms"       element={<TermsOfService />} />
        <Route path="*"            element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}
