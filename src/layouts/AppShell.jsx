import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import ScrollProgress from '../components/layout/ScrollProgress.jsx';
import QuoteStrip from '../components/home/QuoteStrip.jsx';
import BottomNav from '../components/home/BottomNav.jsx';

/**
 * AppShell — mounts exactly once.
 * Wraps every page with Nav, Footer, cursor, and scroll-progress bar.
 * None of these components remount on route change.
 */
export default function AppShell({ children }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [atBottom,    setAtBottom]    = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 10;
      // Consider "at bottom" when within 80px of the page end
      const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 80;
      setScrolled(scrolled);
      setAtBottom(nearBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Persistent layout elements */}
      <ScrollProgress />

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

      {/* Bottom nav pill — visible on mobile, handles page navigation */}
      <BottomNav />

      {/* Bottom scroll-fade overlay — hidden at bottom so footer is never covered */}
      <div className={`scroll-bottom-fade${scrolled && !atBottom ? ' visible' : ''}`} aria-hidden="true" />
    </>
  );
}
