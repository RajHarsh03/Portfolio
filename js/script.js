
/* GLOBAL GLOW ORBS — inject on pages that don't already have them in HTML */
(function () {
    if (!document.querySelector('.hero-glow')) {
        ['hero-glow', 'hero-glow2', 'hero-glow3'].forEach(cls => {
            const d = document.createElement('div');
            d.className = cls;
            document.body.prepend(d);
        });
    }
})();

/* CURSOR */
const cur = document.getElementById('cursor'), ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function tick() {
    cur.style.transform = `translate(${mx - 6}px,${my - 6}px)`;
    rx += (mx - rx) * .12; ry += (my - ry) * .12;
    ring.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
    requestAnimationFrame(tick);
})();
document.querySelectorAll('a,button,.blog-card,.project-card,.stat-card,.skill-tag,.theme-btn,.form-btn,.btn-primary,.btn-outline,.btn-cv,.social-link,.nav-gh-btn').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = '52px'; ring.style.height = '52px'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; });
});

/* DARK MODE — handled by theme-toggle.js */
window.__revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: .08 });

document.querySelectorAll('.reveal').forEach(el => window.__revealObserver.observe(el));



/* SCROLL PROGRESS BAR */
(function () {
    const bar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = (window.scrollY / h) * 100;
        bar.style.width = pct + '%';
    }, { passive: true });
})();

/* ANIMATED STAT COUNTERS */
(function () {
    const nums = document.querySelectorAll('.stat-num');
    const animated = new Set();
    function animateCount(el) {
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)/);
        if (!match) return;
        const target = parseInt(match[1]);
        const suffix = text.replace(/^\d+/, '');
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const interval = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(interval); }
            el.textContent = current + suffix;
        }, 30);
    }
    nums.forEach(el => {
        new IntersectionObserver((entries, obs) => {
            if (entries[0].isIntersecting && !animated.has(el)) {
                animated.add(el);
                animateCount(el);
                obs.unobserve(el);
            }
        }, { threshold: .5 }).observe(el);
    });
})();

/* CARD TILT EFFECT */
(function () {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -6;
            const rotateY = ((x - cx) / cx) * 6;
            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
        });
    });
})();

