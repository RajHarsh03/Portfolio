import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import CustomCursor from '../components/layout/CustomCursor.jsx';
import ScrollProgress from '../components/layout/ScrollProgress.jsx';

/**
 * AppShell — mounts exactly once.
 * Wraps every page with Nav, Footer, cursor, and scroll-progress bar.
 * None of these components remount on route change.
 */
export default function AppShell({ children }) {
  return (
    <>
      {/* Persistent layout elements */}
      <ScrollProgress />
      <CustomCursor />

      {/* Skip to content accessibility link */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Background glow orbs — fixed, always behind page */}
      <div className="hero-glow"  aria-hidden="true" />
      <div className="hero-glow2" aria-hidden="true" />
      <div className="hero-glow3" aria-hidden="true" />

      <Navbar />

      <main id="main-content">
        {children}
      </main>

      <Footer />
    </>
  );
}
