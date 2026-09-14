import { useEffect, useState, useMemo } from 'react';

const QUOTES = [
  { text: 'To understand recursion, you must first understand recursion.', author: 'Anonymous' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'The function of good software is to make the complex appear simple.', author: 'Grady Booch' },
  { text: 'Code is like humor. When you have to explain it, it\'s bad.', author: 'Cory House' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
];

export default function QuoteStrip() {
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);
  const [visitors, setVisitors] = useState(null);

  useEffect(() => {
    const isProd = window.location.hostname !== 'localhost'
      && !window.location.hostname.startsWith('127.');
    const apiUrl = isProd ? '/api/visits' : 'https://harshx.in/api/visits';

    fetch(apiUrl, { method: isProd ? 'POST' : 'GET' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.total != null) {
          setVisitors(Number(data.total).toLocaleString('en-IN'));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="quote-strip">
      <div className="quote-strip-inner">
        <div className="quote-strip-left">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"
            className="quote-strip-icon" aria-hidden="true">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <div>
            <p className="quote-strip-text">{quote.text}</p>
            <span className="quote-strip-author">— {quote.author.toUpperCase()}</span>
          </div>
        </div>

        {visitors && (
          <div className="quote-strip-visitors">
            You are the <strong>{visitors}</strong><sup>th</sup> visitor
          </div>
        )}
      </div>
    </div>
  );
}
