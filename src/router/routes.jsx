import { lazy } from 'react';
import Home from '../pages/Home.jsx';

// Home stays in the entry chunk so the landing page renders without a fallback.
// Every other page is split into its own chunk. Guestbook is the only page that
// imports Firebase, so the Firebase SDK is downloaded only when it is visited.
const loaders = {
  Projects: () => import('../pages/Projects.jsx'),
  ProjectDetail: () => import('../pages/ProjectDetail.jsx'),
  Contact: () => import('../pages/Contact.jsx'),
  About: () => import('../pages/About.jsx'),
  PrivacyPolicy: () => import('../pages/PrivacyPolicy.jsx'),
  TermsOfService: () => import('../pages/TermsOfService.jsx'),
  NotFound: () => import('../pages/NotFound.jsx'),
};
const loadGuestbook = () => import('../pages/Guestbook.jsx');

const Projects = lazy(loaders.Projects);
const ProjectDetail = lazy(loaders.ProjectDetail);
const Contact = lazy(loaders.Contact);
const About = lazy(loaders.About);
const Guestbook = lazy(loadGuestbook);
const PrivacyPolicy = lazy(loaders.PrivacyPolicy);
const TermsOfService = lazy(loaders.TermsOfService);
const NotFound = lazy(loaders.NotFound);

// Warm the light page chunks once the browser is idle. Guestbook is left out
// so Firebase is not fetched until the guestbook is actually opened.
export function prefetchRoutes() {
  const run = () => Object.values(loaders).forEach((load) => load().catch(() => {}));
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 3000 });
  else window.setTimeout(run, 2000);
}

export { Home, Projects, ProjectDetail, Contact, About, Guestbook, PrivacyPolicy, TermsOfService, NotFound };
