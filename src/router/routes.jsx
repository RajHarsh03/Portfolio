import { lazy } from 'react';
import Home from '../pages/Home.jsx'; // eager — it's the entry route, no lazy flash

export const Projects     = lazy(() => import('../pages/Projects.jsx'));
export const Contact      = lazy(() => import('../pages/Contact.jsx'));
export const Journey      = lazy(() => import('../pages/Journey.jsx'));
export const Certificates = lazy(() => import('../pages/Certificates.jsx'));
export const NotFound     = lazy(() => import('../pages/NotFound.jsx'));
export { Home };
