import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import ScrollProgress from '../components/layout/ScrollProgress.jsx';
import QuoteStrip from '../components/home/QuoteStrip.jsx';

/**
 * AppShell — mounts exactly once.
 * Wraps every page with Nav, Footer, cursor, and scroll-progress bar.
 * None of these components remount on route change.
 */
export default function AppShell({ children }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Persistent layout elements */}
      <ScrollProgress />

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

      <QuoteStrip />
      <Footer />

      {/* Bottom scroll-fade overlay */}
      <div className={`scroll-bottom-fade${scrolled ? ' visible' : ''}`} aria-hidden="true" />
    </>
  );
}
