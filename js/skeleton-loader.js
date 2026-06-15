/**
 * skeleton-loader.js
 * Full-screen name + progress bar preloader.
 * Replaces the old shimmer skeleton with a clean branded loader.
 */
(function () {
    const isDark = (function () {
        try { return localStorage.getItem('pf-theme') === 'dark'; } catch (e) { return false; }
    })();

    const bg   = isDark ? '#070b14' : '#f5f3ef';
    const fg   = isDark ? '#e2e8f0' : '#0f172a';
    const bar  = isDark ? '#3b82f6' : '#0f172a';
    const mute = isDark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.1)';

    const style = `
        #sk-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: ${bg};
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            transition: transform .7s cubic-bezier(0.76, 0, 0.24, 1);
        }
        #sk-overlay.sk-done {
            transform: translateY(-100%);
            pointer-events: none;
        }
        #sk-name {
            font-family: 'Syne', 'Arial Black', sans-serif;
            font-size: clamp(1.4rem, 3vw, 2.2rem);
            font-weight: 800;
            letter-spacing: -.03em;
            color: ${fg};
            line-height: 1;
            user-select: none;
        }
        #sk-bar-wrap {
            width: min(420px, 70vw);
            display: flex;
            flex-direction: column;
            gap: .55rem;
        }
        #sk-bar-track {
            width: 100%;
            height: 3px;
            background: ${mute};
            border-radius: 999px;
            overflow: hidden;
        }
        #sk-bar-fill {
            height: 100%;
            width: 0%;
            background: ${bar};
            border-radius: 999px;
            transition: width .12s linear;
        }
        #sk-pct {
            font-family: 'DM Mono', 'Courier New', monospace;
            font-size: .82rem;
            color: ${fg};
            opacity: .55;
            text-align: right;
            letter-spacing: .04em;
        }
    `;

    /* Inject styles */
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    document.head.appendChild(styleEl);

    /* Build overlay */
    const overlay = document.createElement('div');
    overlay.id = 'sk-overlay';
    overlay.innerHTML = `
        <div id="sk-name">harshx.in</div>
        <div id="sk-bar-wrap">
            <div id="sk-bar-track"><div id="sk-bar-fill"></div></div>
            <div id="sk-pct">0%</div>
        </div>
    `;
    document.documentElement.appendChild(overlay);

    const fill = overlay.querySelector('#sk-bar-fill');
    const pct  = overlay.querySelector('#sk-pct');

    let current = 0;
    let target  = 0;
    let done    = false;

    /* Animate progress bar smoothly toward target */
    function tick() {
        if (current < target) {
            current = Math.min(current + 1.2, target);
            fill.style.width = current + '%';
            pct.textContent  = Math.floor(current) + '%';
        }
        if (!done || current < 100) {
            requestAnimationFrame(tick);
        }
    }
    requestAnimationFrame(tick);

    /* Simulate progress in stages */
    const MIN_DISPLAY = 1200;
    const startTime   = Date.now();

    /* Quickly ramp to ~70% while loading */
    let sim = 0;
    const simInterval = setInterval(() => {
        if (sim < 70) {
            sim += Math.random() * 8 + 3;
            target = Math.min(sim, 70);
        } else {
            clearInterval(simInterval);
        }
    }, 120);

    window.addEventListener('load', () => {
        clearInterval(simInterval);
        target = 100;
        done   = true;

        const elapsed   = Date.now() - startTime;
        const remaining = Math.max(300, MIN_DISPLAY - elapsed);

        setTimeout(() => {
            /* Wait for bar to visually reach 100 */
            setTimeout(() => {
                overlay.classList.add('sk-done');
                setTimeout(() => overlay.remove(), 750);
            }, 250);
        }, remaining);
    });
})();
