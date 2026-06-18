/**
 * githubProjects.js
 * Fetches GitHub repos tagged "portfolio", normalises them, and caches in localStorage.
 */

export const GH_USER = 'RajHarsh03';
const GH_CACHE_KEY = 'gh_portfolio_cache_v2';
const GH_CACHE_TTL = 10 * 60 * 1000;
const RANK_DEFAULT = 9999;

export const TECH_ICON_MAP = {
  react: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  reactjs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  nodejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  node: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'node-js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  tensorflow: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
  mongodb: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  mysql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  html5: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  html: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  css3: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  css: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  tailwind: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  tailwindcss: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  nextjs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  next: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  express: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  expressjs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  git: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  fastapi: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  flask: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
  postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  postgres: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  aws: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
  firebase: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  redis: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
  graphql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
  vue: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  vuejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  angular: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
  vite: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg',
  keras: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg',
  numpy: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg',
  c: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  cplusplus: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'c-plus-plus': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  bootstrap: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
};

const LANG_ICON = {
  JavaScript: '⚡', TypeScript: '💙', Python: '🐍',
  HTML: '🌐', CSS: '🎨', Java: '☕', 'C++': '⚙️',
  C: '⚙️', Go: '🐹', Rust: '🦀', PHP: '🐘',
  Ruby: '💎', Swift: '🍎', Kotlin: '🎯', Shell: '🖥️',
};

const CATEGORY_MAP = {
  frontend: 'frontend', fullstack: 'fullstack',
  'full-stack': 'fullstack', ai: 'ai',
  'machine-learning': 'ai', ml: 'ai', 'deep-learning': 'ai',
};

export const TYPE_MAP = {
  client:           { label: 'Client Project',   cls: 'type-client'   },
  'client-project': { label: 'Client Project',   cls: 'type-client'   },
  personal:         { label: 'Personal Project',  cls: 'type-personal' },
  'personal-project':{ label: 'Personal Project', cls: 'type-personal' },
  freelance:        { label: 'Freelance',         cls: 'type-client'   },
  'open-source':    { label: 'Open Source',       cls: 'type-oss'      },
  hackathon:        { label: 'Hackathon',         cls: 'type-hack'     },
};

const META_TOPICS = new Set([
  'portfolio', 'completed', 'in-progress', 'live',
  ...Object.keys(CATEGORY_MAP),
  ...Object.keys(TYPE_MAP),
]);

function parseRank(topics) {
  for (const t of topics) {
    const m = String(t).match(/^rank-(\d+)$/i);
    if (m) return parseInt(m[1], 10);
  }
  return RANK_DEFAULT;
}

function mapRepos(repos) {
  return repos
    .filter(r => Array.isArray(r.topics) && r.topics.includes('portfolio'))
    .map(r => {
      const topics = r.topics || [];

      let category = 'fullstack';
      for (const t of topics) {
        if (CATEGORY_MAP[t]) { category = CATEGORY_MAP[t]; break; }
      }

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
        live: r.homepage?.trim() || null,
        category,
        completed: topics.includes('completed') || topics.includes('live'),
        icon: LANG_ICON[r.language] || '🚀',
        stack,
        rank: parseRank(topics),
        updatedAt: r.updated_at,
        repoName: r.name,
        rawTopics: topics,
        projectType,
      };
    })
    .sort((a, b) => a.rank - b.rank || new Date(b.updatedAt) - new Date(a.updatedAt));
}

export async function fetchPortfolioProjects() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`,
      { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' }
    );
    if (!res.ok) throw new Error('GitHub API ' + res.status);
    const repos = await res.json();
    const projects = mapRepos(repos);

    try {
      localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: projects }));
    } catch {}

    return projects;
  } catch (err) {
    try {
      const cached = JSON.parse(localStorage.getItem(GH_CACHE_KEY));
      if (cached?.data?.length && Date.now() - (cached.ts || 0) < GH_CACHE_TTL * 6) {
        console.warn('GitHub API failed — using cache:', err.message);
        return cached.data;
      }
    } catch {}
    throw err;
  }
}
