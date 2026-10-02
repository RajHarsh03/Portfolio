import { useEffect, useState } from 'react';

const QUOTES = [
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'Code is like humor. When you have to explain it, it\'s bad.', author: 'Cory House' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger Dijkstra' },
  { text: 'Programs must be written for people to read.', author: 'Harold Abelson' },
  { text: 'The best error message is the one that never shows up.', author: 'Thomas Fuchs' },
  { text: 'It always seems impossible until it\'s done.', author: 'Nelson Mandela' },
  { text: 'You miss 100% of the shots you don\'t take.', author: 'Wayne Gretzky' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: 'Move fast and break things.', author: 'Mark Zuckerberg' },
  { text: 'Build something people want.', author: 'Paul Graham' },
  { text: 'Done is better than perfect.', author: 'Sheryl Sandberg' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'The function of good software is to make the complex appear simple.', author: 'Grady Booch' },
  { text: 'Most good programmers do programming not because of pay but because it\'s fun.', author: 'Linus Torvalds' },
  { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
];

function getInitialQuoteIndex() {
  const previousIndex = Number(sessionStorage.getItem('quoteIndex'));
  let nextIndex = Math.floor(Math.random() * QUOTES.length);

  if (QUOTES.length > 1 && nextIndex === previousIndex) {
    nextIndex = (nextIndex + 1) % QUOTES.length;
  }

  sessionStorage.setItem('quoteIndex', String(nextIndex));
  return nextIndex;
}

export default function QuoteStrip() {
  const [quoteIndex, setQuoteIndex] = useState(getInitialQuoteIndex);
  const [visitors, setVisitors] = useState(null);

  const quote = QUOTES[quoteIndex];

  useEffect(() => {
    const quoteTimer = window.setInterval(() => {
      setQuoteIndex(currentIndex => {
        const nextIndex = (currentIndex + 1) % QUOTES.length;
        sessionStorage.setItem('quoteIndex', String(nextIndex));
        return nextIndex;
      });
    }, 15000);

    return () => window.clearInterval(quoteTimer);
  }, []);

  useEffect(() => {
    const isProd = window.location.hostname !== 'localhost'
      && !window.location.hostname.startsWith('127.');
    const apiUrl = isProd ? '/api/visits' : 'https://harshx.in/api/visits';
    let active = true;

    const fetchVisitors = () => {
      fetch(apiUrl, { method: isProd ? 'POST' : 'GET' })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (active && data?.total != null) {
            setVisitors(Number(data.total).toLocaleString('en-IN'));
          }
        })
        .catch(() => {});
    };

    fetchVisitors();
    const visitorsTimer = window.setInterval(fetchVisitors, 15000);

    return () => {
      active = false;
      window.clearInterval(visitorsTimer);
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

        {visitors && (
          <>
            <div className="quote-strip-divider" aria-hidden="true" />
            <div className="quote-strip-visitors">
              You are the <strong>{visitors}</strong><sup>th</sup> visitor
            </div>
          </>
        )}
      </div>
    </div>
  );
}
