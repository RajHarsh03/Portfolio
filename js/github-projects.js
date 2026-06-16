/**
 * github-projects.js
 * ──────────────────
 * Fetches public repos from GitHub tagged with topic "portfolio"
 * and renders them as project cards.
 *
 * HOW TO ADD A PROJECT:
 *   1. Go to your GitHub repo → ⚙ Settings → Topics
 *   2. Add:  portfolio
 *   3. Optionally add:  frontend | fullstack | ai   (category)
 *   4. Optionally add:  completed | live            (status)
 *   5. Optionally add:  rank-1 | rank-2 | rank-3   (display order — lower first)
 *   6. Add any tech tags: nodejs, firebase, react, etc.
 *      (they become stack pills — hyphen-separated → Title Cased)
 */

const GH_USER = 'RajHarsh03';

/* Map GitHub primary language → emoji icon */
const LANG_ICON = {
    JavaScript: '⚡', TypeScript: '💙', Python: '🐍',
    HTML: '🌐', CSS: '🎨', Java: '☕', 'C++': '⚙️',
    C: '⚙️', Go: '🐹', Rust: '🦀', PHP: '🐘',
    Ruby: '💎', Swift: '🍎', Kotlin: '🎯', Dart: '🎯',
    Shell: '🖥️', Jupyter: '📊',
};

/* Map topic slug → devicon CDN URL */
const TECH_ICON_MAP = {
    'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'reactjs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'nodejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    'node': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    'node-js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    'tensorflow': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
    'mongodb': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    'mysql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    'javascript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    'typescript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    'html5': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    'html': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    'css3': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    'css': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    'tailwind': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
    'tailwindcss': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
    'nextjs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    'next': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    'express': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
    'expressjs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
    'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    'docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    'fastapi': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
    'flask': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
    'postgresql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    'postgres': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    'java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    'aws': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
    'firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
    'redis': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
    'graphql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
    'vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
    'vuejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
    'angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    'vite': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg',
    'keras': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg',
    'numpy': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg',
    'c': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
    'cplusplus': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    'c-plus-plus': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    'bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
};

/* Map topic → display category */
const CATEGORY_MAP = {
    frontend: 'frontend', fullstack: 'fullstack',
    'full-stack': 'fullstack', ai: 'ai',
    'machine-learning': 'ai', ml: 'ai', 'deep-learning': 'ai',
};

/* Project type pills from GitHub topics */
const TYPE_MAP = {
    'client': { label: 'Client Project', cls: 'type-client' },
    'client-project': { label: 'Client Project', cls: 'type-client' },
    'personal': { label: 'Personal Project', cls: 'type-personal' },
    'personal-project': { label: 'Personal Project', cls: 'type-personal' },
    'freelance': { label: 'Freelance', cls: 'type-client' },
    'open-source': { label: 'Open Source', cls: 'type-oss' },
    'hackathon': { label: 'Hackathon', cls: 'type-hack' },
};

/* Topics to exclude from stack pills */
const META_TOPICS = new Set([
    'portfolio', 'completed', 'in-progress', 'live',
    ...Object.keys(CATEGORY_MAP),
    ...Object.keys(TYPE_MAP),
]);

const GH_CACHE_KEY = 'gh_portfolio_cache_v2';
const GH_CACHE_TTL = 10 * 60 * 1000; // 10 minutes — fallback only when API fails
const RANK_DEFAULT = 9999;

/** Parse rank from GitHub topic (rank-1, rank-2, …). */
function parseRankFromTopics(topics) {
    for (const t of topics) {
        const match = String(t).match(/^rank-(\d+)$/i);
        if (match) return parseInt(match[1], 10);
    }
    return RANK_DEFAULT;
}

function sortProjectsByRank(projects) {
    return projects.sort(
        (a, b) => a.rank - b.rank || new Date(b.updatedAt) - new Date(a.updatedAt)
    );
}

/** Normalise repo list → project objects. */
function mapReposToProjects(repos) {
    return repos
        .filter(r => Array.isArray(r.topics) && r.topics.includes('portfolio'))
        .map(r => {
            const topics = r.topics || [];

            let category = 'fullstack';
            for (const t of topics) {
                if (CATEGORY_MAP[t]) { category = CATEGORY_MAP[t]; break; }
            }

            const completed = topics.includes('completed') || topics.includes('live');
            const rank = parseRankFromTopics(topics);

            /* Detect project type from topics */
            let projectType = null;
            for (const t of topics) {
                if (TYPE_MAP[t]) { projectType = TYPE_MAP[t]; break; }
            }

            const stack = topics
                .filter(t => !META_TOPICS.has(t) && !/^rank-\d+$/i.test(t))
                .map(t => t.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '))
                .slice(0, 4);
            if (!stack.length && r.language) stack.push(r.language);

            const name = r.name
                .replace(/-/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase());

            return {
                name,
                description: r.description || 'No description provided.',
                github: r.html_url,
                live: r.homepage && r.homepage.trim() ? r.homepage.trim() : null,
                category,
                completed,
                icon: LANG_ICON[r.language] || '🚀',
                stack,
                rank,
                updatedAt: r.updated_at,
                repoName: r.name,
                rawTopics: topics,
                projectType,
            };
        });
}

async function fetchReposFromGitHub() {
    const res = await fetch(
        `https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`,
        { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' }
    );
    if (!res.ok) throw new Error('GitHub API ' + res.status);
    const repos = await res.json();
    return mapReposToProjects(repos);
}

/**
 * Fetch all repos tagged "portfolio" and return normalised project objects.
 * Falls back to localStorage cache on API failure (e.g. rate limit 403).
 * @returns {Promise<Array>}
 */
async function fetchPortfolioProjects() {
    try {
        const projects = await fetchReposFromGitHub();

        try {
            localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: projects }));
        } catch {}

        return projects;
    } catch (err) {
        try {
            const cached = JSON.parse(localStorage.getItem(GH_CACHE_KEY));
            if (cached?.data?.length) {
                const age = Date.now() - (cached.ts || 0);
                if (age < GH_CACHE_TTL * 6) {
                    console.warn('GitHub API failed, using cached projects:', err.message);
                    return cached.data;
                }
            }
        } catch {}
        throw err;
    }
}

/**
 * Build a project card HTML string.
 * @param {Object} p  - project object from fetchPortfolioProjects()
 * @returns {string}
 */
function buildProjectCard(p) {
    const ghImgUrl     = `https://raw.githubusercontent.com/${GH_USER}/${p.repoName}/HEAD/preview.png`;
    const ghImgFallback = `https://opengraph.githubassets.com/1/${GH_USER}/${p.repoName}`;

    // Build tech icons from raw stack topics
    const techIconsHtml = p.rawTopics
        ? p.rawTopics
            .filter(t => TECH_ICON_MAP[t])
            .slice(0, 6)
            .map(t => `<img class="proj-tech-icon" src="${TECH_ICON_MAP[t]}" alt="${t}" title="${t}" loading="lazy">`)
            .join('')
        : '';

    const liveLink = p.live
        ? `<a class="proj-btn proj-btn-live" href="${p.live}" target="_blank" rel="noopener">Live ↗</a>`
        : `<span></span>`;

    const statusClass = p.completed ? 'project-status completed' : 'project-status';
    const statusText  = p.completed ? 'Completed' : 'In Progress';

    const typePill = p.projectType
        ? `<span class="project-type-pill ${p.projectType.cls}">${p.projectType.label}</span>`
        : '';

    const detailUrl = `/projects/${p.repoName}`;

    return `
    <div class="project-card reveal"
         data-category="${p.category}"
         data-updated="${p.updatedAt}"
         data-name="${p.name}"
         data-rank="${p.rank}">
      <div class="project-card-glow"></div>
      <div class="${statusClass}">${statusText}</div>
      <div class="project-img-wrap">
        <img src="${ghImgUrl}" alt="${p.name} preview" loading="lazy"
             onerror="if(this.src!=='${ghImgFallback}'){this.src='${ghImgFallback}';}else{this.closest('.project-img-wrap').style.display='none';}">
        <div class="project-img-overlay">
          <a class="project-img-arrow" href="${detailUrl}" aria-label="View project details">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
        </div>
      </div>
      <div class="project-body">
        <div class="project-title-row">
          <div class="project-title">${p.name}</div>
          ${typePill}
        </div>
        <div class="project-desc">${p.description}</div>
        ${techIconsHtml ? `<div class="project-tech-row">${techIconsHtml}</div>` : ''}
      </div>
      <div class="project-footer">
        <a class="proj-btn proj-btn-gh" href="${p.github}" target="_blank" rel="noopener" aria-label="GitHub">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </a>
        ${liveLink}
      </div>
    </div>`;
}

/**
 * Skeleton loader HTML for while projects are loading.
 * @param {number} count
 * @returns {string}
 */
function buildSkeletons(count = 3) {
    return Array.from({ length: count }, () => `
    <div class="project-card gh-skeleton">
      <div class="project-card-glow"></div>
      <div class="skel-block" style="position:absolute;top:0;left:0;width:88px;height:26px;border-radius:0 0 10px 0;"></div>
      <div class="project-body">
        <div class="skel-block" style="width:60%;height:22px;border-radius:6px;margin-bottom:1rem;"></div>
        <div class="skel-block" style="width:100%;height:12px;border-radius:4px;margin-bottom:.5rem;"></div>
        <div class="skel-block" style="width:88%;height:12px;border-radius:4px;margin-bottom:.5rem;"></div>
        <div class="skel-block" style="width:72%;height:12px;border-radius:4px;margin-bottom:1.2rem;"></div>
        <div style="display:flex;gap:.5rem;">
          <div class="skel-block" style="width:64px;height:24px;border-radius:999px;"></div>
          <div class="skel-block" style="width:72px;height:24px;border-radius:999px;"></div>
          <div class="skel-block" style="width:56px;height:24px;border-radius:999px;"></div>
        </div>
      </div>
      <div class="project-footer" style="border-top:1px solid var(--border);padding:1rem 1.5rem;justify-content:flex-end;">
        <div style="display:flex;gap:.5rem;">
          <div class="skel-block" style="width:78px;height:28px;border-radius:8px;"></div>
          <div class="skel-block" style="width:60px;height:28px;border-radius:8px;"></div>
        </div>
      </div>
    </div>`).join('');
}

/**
 * Build a hash fingerprint from projects for change detection.
 */
function projectsFingerprint(projects) {
    return projects.map(p => `${p.name}|${p.rank}|${p.category}|${p.completed}|${p.stack.join(',')}`).join(';;');
}

/**
 * Init: render projects into a given container element.
 * @param {HTMLElement} grid     - target container
 * @param {number}      maxCards - max cards to show (0 = all)
 * @param {boolean}     showSkeletons - whether to show skeleton loaders
 * @returns {Promise<string>} hash of rendered projects
 */
async function initProjectGrid(grid, maxCards = 0, showSkeletons = true) {
    if (!grid) return '';

    if (showSkeletons) {
        grid.innerHTML = buildSkeletons(maxCards || 3);
    }

    try {
        let projects = await fetchPortfolioProjects();

        /* Sort: rank-1 first, then rank-2, then unranked by date */
        sortProjectsByRank(projects);

        /* Limit if needed */
        if (maxCards > 0) projects = projects.slice(0, maxCards);

        const hash = projectsFingerprint(projects);

        if (!projects.length) {
            grid.innerHTML = `<p style="color:var(--muted);font-family:'DM Mono',monospace;font-size:.85rem;grid-column:1/-1;text-align:center;padding:2rem 0;">No projects tagged "portfolio" yet.</p>`;
            return hash;
        }

        grid.innerHTML = projects.map(buildProjectCard).join('');

        /* Re-trigger reveal animations for newly added cards */
        grid.querySelectorAll('.reveal').forEach(el => {
            if (window.__revealObserver) {
                window.__revealObserver.observe(el);
            } else {
                el.classList.add('visible');
            }
        });

        return hash;
    } catch (err) {
        console.warn('GitHub projects fetch failed:', err);
        if (showSkeletons) {
            grid.innerHTML = `<p style="color:var(--muted);font-family:'DM Mono',monospace;font-size:.85rem;grid-column:1/-1;text-align:center;padding:2rem 0;">Could not load projects. <a href="https://github.com/${GH_USER}" style="color:var(--accent)">View on GitHub ↗</a></p>`;
        }
        return '';
    }
}

/* ── Auto-init with auto-refresh ──
   Scripts are loaded at end of <body> so DOM is already ready. */
(function () {
    /* Home page: show latest 3 projects */
    const homeGrid = document.getElementById('homeProjectsGrid');
    if (homeGrid) {
        let lastHash = '';

        async function loadHome(showSkeletons) {
            const hash = await initProjectGrid(homeGrid, 2, showSkeletons);
            if (hash && hash !== lastHash) lastHash = hash;
        }

        /* Initial load */
        loadHome(true);

        /* Auto-refresh on tab return (5-min cooldown to conserve API quota) */
        let cooldown = false;
        function autoRefresh() {
            if (cooldown) return;
            cooldown = true;
            setTimeout(() => {
                console.log('[Home] Auto-refreshing projects...');
                loadHome(false).then(() => {
                    setTimeout(() => { cooldown = false; }, 5 * 60 * 1000);
                });
            }, 1500);
        }

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) autoRefresh();
        });
        window.addEventListener('focus', autoRefresh);
        setInterval(() => loadHome(false), 10 * 60 * 1000);
    }

    /* Projects page: grid has its own inline init — skip to avoid conflict */
})();
