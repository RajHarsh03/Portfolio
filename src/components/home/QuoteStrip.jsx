import { useEffect, useState } from 'react';

const SHORT_QUOTES = [
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger Dijkstra' },
  { text: 'Code is like humor. When you have to explain it, it\'s bad.', author: 'Cory House' },
  { text: 'Talk is cheap. Show me the code. Every line counts.', author: 'Linus Torvalds' },
  { text: 'Make it work, make it right, then make it fast enough.', author: 'Kent Beck' },
  { text: 'Stay hungry, stay foolish, and keep building every day.', author: 'Steve Jobs' },
  { text: 'Move fast, break things, learn faster, and ship again.', author: 'Mark Zuckerberg' },
  { text: 'Build something people want and the rest will follow.', author: 'Paul Graham' },
  { text: 'Done is better than perfect. Ship it and improve later.', author: 'Sheryl Sandberg' },
  { text: 'Simplicity is the soul of efficiency in every system.', author: 'Austin Freeman' },
  { text: 'It always seems impossible until someone actually does it.', author: 'Nelson Mandela' },
  { text: 'You miss every single shot you never even dare to take.', author: 'Wayne Gretzky' },
  { text: 'First, solve the problem clearly. Then, write the code.', author: 'John Johnson' },
  { text: 'Simplicity is the true prerequisite for reliability in code.', author: 'Edsger Dijkstra' },
  { text: 'Code is like humor - if you have to explain it, it\'s bad.', author: 'Cory House' },
];

const LONG_QUOTES = [
  { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { text: 'Walking on water and developing software from a specification are easy if both are frozen.', author: 'Edward V. Berard' },
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' },
  { text: 'Measuring programming progress by lines of code is like measuring aircraft building progress by weight.', author: 'Bill Gates' },
  { text: 'The function of good software is to make the complex appear simple and easy to understand.', author: 'Grady Booch' },
  { text: 'Most good programmers do programming not because they expect to get paid, but because it is fun to program.', author: 'Linus Torvalds' },
  { text: 'If debugging is the process of removing bugs, then programming must be the process of putting them in.', author: 'Edsger Dijkstra' },
  { text: 'Perfection is achieved not when there is nothing more to add, but when there is nothing more to take away.', author: 'Antoine de Saint-Exupery' },
  { text: 'Testing leads to failure, and failure leads to understanding. Embrace bugs as learning opportunities.', author: 'Burt Rutan' },
  { text: 'Software is a great combination between artistry and engineering that creates meaningful solutions.', author: 'Bill Gates' },
];

const VISIT_COUNTED_KEY = 'pf_visit_counted';
const VISITS_REFRESH_MS = 60000;
const ORDINAL_RULES = new Intl.PluralRules('en-US', { type: 'ordinal' });
const ORDINAL_SUFFIXES = { one: 'st', two: 'nd', few: 'rd', other: 'th' };

function ordinalSuffix(n) {
  return ORDINAL_SUFFIXES[ORDINAL_RULES.select(n)] ?? 'th';
}

function getInitialQuoteIndex(isMobile) {
  const quotes = isMobile ? SHORT_QUOTES : LONG_QUOTES;
  const previousIndex = Number(sessionStorage.getItem('quoteIndex'));
  let nextIndex = Math.floor(Math.random() * quotes.length);

  if (quotes.length > 1 && nextIndex === previousIndex) {
    nextIndex = (nextIndex + 1) % quotes.length;
  }

  sessionStorage.setItem('quoteIndex', String(nextIndex));
  return nextIndex;
}

export default function QuoteStrip() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [quoteIndex, setQuoteIndex] = useState(() => getInitialQuoteIndex(isMobile));
  const [visitors, setVisitors] = useState(null);

  const quotes = isMobile ? SHORT_QUOTES : LONG_QUOTES;
  const quote = quotes[quoteIndex];

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 640;
      if (mobile !== isMobile) {
        setIsMobile(mobile);
        setQuoteIndex(getInitialQuoteIndex(mobile));
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  useEffect(() => {
    const quoteTimer = window.setInterval(() => {
      setQuoteIndex(currentIndex => {
        const nextIndex = (currentIndex + 1) % quotes.length;
        sessionStorage.setItem('quoteIndex', String(nextIndex));
        return nextIndex;
      });
    }, 15000);

    return () => window.clearInterval(quoteTimer);
  }, [quotes.length]);

  useEffect(() => {
    const isProd = window.location.hostname !== 'localhost'
      && !window.location.hostname.startsWith('127.');
    const apiUrl = isProd ? '/api/visits' : 'https://www.harshx.in/api/visits';
    let active = true;
    let visitorsTimer = null;
    let lastFetchAt = 0;

    const readFlag = () => { try { return sessionStorage.getItem(VISIT_COUNTED_KEY) === '1'; } catch { return false; } };
    const writeFlag = on => {
      try { on ? sessionStorage.setItem(VISIT_COUNTED_KEY, '1') : sessionStorage.removeItem(VISIT_COUNTED_KEY); } catch {}
    };

    const fetchVisitors = () => {
      lastFetchAt = Date.now();
      // Count the visit once per browser session (production only); otherwise just read the total.
      const shouldPost = isProd && !readFlag();
      // Set the flag before the request so a remount can't POST twice; cleared again if the POST fails.
      if (shouldPost) writeFlag(true);
      fetch(apiUrl, { method: shouldPost ? 'POST' : 'GET' })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (shouldPost && data?.total == null) writeFlag(false);
          if (active && data?.total != null) {
            setVisitors(Number(data.total));
          }
        })
        .catch(() => { if (shouldPost) writeFlag(false); });
    };

    const start = () => {
      if (visitorsTimer !== null) return;
      if (Date.now() - lastFetchAt >= VISITS_REFRESH_MS) fetchVisitors();
      visitorsTimer = window.setInterval(fetchVisitors, VISITS_REFRESH_MS);
    };
    const stop = () => {
      if (visitorsTimer !== null) { window.clearInterval(visitorsTimer); visitorsTimer = null; }
    };
    const handleVisibilityChange = () => { if (document.hidden) stop(); else start(); };

    if (document.hidden) {
      // Still record the visit / show the total for tabs opened in the background.
      fetchVisitors();
    } else {
      start();
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      active = false;
      stop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="quote-strip">
      <div className="quote-strip-inner">
        <div className="quote-strip-left">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"
            className="quote-strip-icon" aria-hidden="true">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <div className="quote-strip-body">
            <p className="quote-strip-text">{quote.text}</p>
            <span className="quote-strip-author">— {quote.author}</span>
          </div>
        </div>

        {visitors != null && (
          <>
            <div className="quote-strip-divider" aria-hidden="true" />
            <div className="quote-strip-visitors">
              You are the <strong>{visitors.toLocaleString('en-IN')}</strong><sup>{ordinalSuffix(visitors)}</sup> visitor
            </div>
          </>
        )}
      </div>
    </div>
  );
}
