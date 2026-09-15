import { useEffect } from 'react';

// Module-level flag — survives StrictMode double-mount
let nekoStarted = false;

export default function useNeko() {
  useEffect(() => {
    if (nekoStarted) return;
    nekoStarted = true;

    const SCRIPT_ID = 'nekojs-script';

    const startNeko = () => {
      if (typeof window.createNeko === 'function') {
        window.createNeko({
          speed: 20,
          fps: 120,
          behaviorMode: 0,
          allowBehaviorChange: true,
        }).start();
      }
    };

    if (document.getElementById(SCRIPT_ID)) {
      startNeko();
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://louisabraham.github.io/nekojs/neko.js';
    script.async = true;
    script.onload = startNeko;
    document.body.appendChild(script);
  }, []);
}
