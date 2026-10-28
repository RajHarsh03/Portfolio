import { useEffect, useState } from 'react';

const ROLES = [
  { title: 'Full Stack Dev',  quote: 'React · Node.js · TypeScript' },
  { title: 'AI/ML Engineer', quote: 'building things that think'    },
  { title: 'Software Engg',  quote: 'clean code, real impact'       },
];
const TYPE_SPEED   = 80;
const DELETE_SPEED = 40;
const PAUSE_AFTER  = 1800;
const PAUSE_BEFORE = 400;

export default function TypingEffect() {
  // Reduced motion: show the first role statically, no typing loop.
  const [reduceMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const [displayed, setDisplayed] = useState(() => (reduceMotion ? ROLES[0].title : ''));
  const [roleIdx,   setRoleIdx]   = useState(0);
  const [phase,     setPhase]     = useState('typing');

  const current = ROLES[roleIdx];
  const isDone  = phase === 'deleting' ? false : displayed.length === current.title.length;

  useEffect(() => {
    if (reduceMotion) return;
    if (phase === 'typing') {
      if (displayed.length < current.title.length) {
        const t = setTimeout(() => setDisplayed(current.title.slice(0, displayed.length + 1)), TYPE_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('deleting'), PAUSE_AFTER);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(d => d.slice(0, -1)), DELETE_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setRoleIdx(i => (i + 1) % ROLES.length);
          setPhase('typing');
        }, PAUSE_BEFORE);
        return () => clearTimeout(t);
      }
    }
  }, [displayed, phase, current]);

  return (
    <div className="hero-role-wrap">
      <div className="hero-role">
        {displayed}
        <span className="typing-cursor" aria-hidden="true">|</span>
      </div>
      <span className={`hero-role-quote${isDone ? ' visible' : ''}`}>
        {current.quote}
      </span>
    </div>
  );
}
