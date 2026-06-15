/**
 * theme-toggle.js
 * Smooth circular wipe theme transition.
 * Uses View Transition API where supported, with instant fallback.
 */
(function () {
    const html = document.documentElement;

    /* ── Apply theme ── */
    function applyTheme(t) {
        html.setAttribute('data-theme', t);
        try { localStorage.setItem('pf-theme', t); } catch (e) { }
    }

    /* ── Boot: restore saved theme instantly (no animation) ── */
    let saved = 'light';
    try { saved = localStorage.getItem('pf-theme') || 'light'; } catch (e) { }
    applyTheme(saved);

    /* ── Prevent double-clicks during animation ── */
    let transitioning = false;

    /* ── Switch with smooth circular wipe ── */
    function switchTheme(fromBtn) {
        if (transitioning) return;

        const current = html.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';

        /* Origin point: centre of the toggle button */
        const rect = fromBtn
            ? fromBtn.getBoundingClientRect()
            : { left: window.innerWidth - 60, top: 30, width: 38, height: 38 };
        const ox = rect.left + rect.width / 2;
        const oy = rect.top + rect.height / 2;

        /* Largest radius needed to cover full viewport */
        const maxR = Math.hypot(
            Math.max(ox, window.innerWidth - ox),
            Math.max(oy, window.innerHeight - oy)
        );

        /* ── View Transition API (Chrome 111+, Edge, etc.) ── */
        if (document.startViewTransition) {
            transitioning = true;

            const vt = document.startViewTransition(() => {
                applyTheme(next);
            });

            vt.ready.then(() => {
                // Animate the new view snapshot expanding from the button
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${ox}px ${oy}px)`,
                            `circle(${maxR}px at ${ox}px ${oy}px)`
                        ]
                    },
                    {
                        duration: 500,
                        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        pseudoElement: '::view-transition-new(root)'
                    }
                );
            });

            vt.finished.then(() => {
                transitioning = false;
            });

            return;
        }

        /* ── Fallback: no animation, just toggle instantly ── */
        applyTheme(next);
    }

    /* ── Wire up the button ── */
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.addEventListener('click', () => switchTheme(btn));
    }
})();


/* ── Magnetic cursor dot effect on .btn-primary and .btn-cv ── */
(function () {
    function initBtn(btn) {
        if (btn.querySelector('.btn-cursor-dot')) return;
        const dot  = document.createElement('span');
        const ring = document.createElement('span');
        dot.className  = 'btn-cursor-dot';
        ring.className = 'btn-cursor-ring';
        btn.appendChild(dot);
        btn.appendChild(ring);
        btn.addEventListener('mousemove', function (e) {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            dot.style.left  = x + 'px';
            dot.style.top   = y + 'px';
            ring.style.left = x + 'px';
            ring.style.top  = y + 'px';
        });
    }
    document.querySelectorAll('.btn-primary, .btn-cv').forEach(initBtn);
    new MutationObserver(function () {
        document.querySelectorAll('.btn-primary, .btn-cv').forEach(initBtn);
    }).observe(document.body, { childList: true, subtree: true });
})();
