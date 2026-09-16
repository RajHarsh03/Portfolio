import { useEffect } from 'react';

// Module-level flag — survives StrictMode double-mount
let nekoStarted = false;
let nekoInstance = null;

export default function useNeko() {
  useEffect(() => {
    if (nekoStarted) return;
    nekoStarted = true;

    const SCRIPT_ID = 'nekojs-script';

    const startNeko = () => {
      if (typeof window.createNeko === 'function') {
        nekoInstance = window.createNeko({
          speed: 16,
          fps: 120,
          behaviorMode: 0,
          allowBehaviorChange: true,
        });
        nekoInstance.start();
      }
    };

  
    const resumeNeko = () => {
      if (document.visibilityState === 'hidden') return;
      if (nekoInstance && typeof nekoInstance.start === 'function') {
        nekoInstance.start();
      } else {
        startNeko();
      }
    };

    document.addEventListener('visibilitychange', resumeNeko);
    window.addEventListener('focus', resumeNeko);

    if (document.getElementById(SCRIPT_ID)) {
      startNeko();
      return undefined;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://louisabraham.github.io/nekojs/neko.js';
    script.async = true;
    script.onload = startNeko;
    document.body.appendChild(script);
  }, []);
}
