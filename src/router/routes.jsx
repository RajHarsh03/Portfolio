import { lazy } from 'react';
import Home from '../pages/Home.jsx'; // eager — it's the entry route, no lazy flash

export const Projects = lazy(() => import('../pages/Projects.jsx'));
export const Contact  = lazy(() => import('../pages/Contact.jsx'));
export const About    = lazy(() => import('../pages/About.jsx'));
export { Home };
