const GIST_RAW_URL =
  'https://gist.githubusercontent.com/RajHarsh03/c654e844cf7de53873dd45b3d9a00b05/raw/portfolio-content.json';

export const FALLBACK_DATA = {
  experiences: [
    {
      label: 'INTERNSHIP',
      type: 'INTERNSHIP',
      typeColor: 'badge-purple',
      company: 'MyJobGrow',
      role: 'Data Science & Machine Learning Intern',
      date: 'JUN 2025 - AUG 2025',
      bullets: [
        'Completed a focused internship on Data Science and Machine Learning concepts.',
        'Worked on data analysis, model building, and machine learning workflows.',
      ],
    },
  ],
  certificates: [
    {
      label: 'INTERNSHIP',
      type: 'CERTIFICATE',
      typeColor: 'badge-teal',
      title: 'Data Science and Machine Learning Intern',
      issuer: 'MY JOB GROW',
      date: 'OCT 2025',
      desc: 'Completed a 2-month internship focused on Data Science and Machine Learning concepts. Worked on data analysis, model building, and ML workflows.',
      link: 'https://drive.google.com/file/d/1jtflGRm11wVpS8HQh1MksdX7NLrVd0w2/view?usp=drive_link',
    },
    {
      label: 'HACKATHON',
      type: 'CERTIFICATE',
      typeColor: 'badge-purple',
      title: 'Bharatiya Antariksh Hackathon 2025',
      issuer: 'ISRO / H2S',
      date: '2025',
      desc: 'Participated in the national-level space hackathon organized by ISRO. Built a full-stack web application addressing a space-tech challenge.',
      link: 'https://drive.google.com/file/d/1sc-iWnc2tp9h3wmv6x4O_vBnQLVG9TcJ/view?usp=drive_link',
    },
  ],
  education: [
    {
      school: 'Heritage Institute of Technology, Kolkata',
      degree: 'B.Tech in Computer Science & Business Systems',
      year: '2023 – 2027',
      desc: 'Pursuing a four-year undergraduate program with a focus on software engineering, data structures, algorithms, and AI/ML fundamentals.',
    },
  ],
  achievements: [
    {
      title: 'Hackathon Participant',
      org: '',
      year: '2024–2025',
      desc: 'Participated in 6+ hackathons, collaborating in teams to rapidly prototype and deliver full-stack and AI solutions under tight deadlines.',
    },
  ],
};

// Stale-while-revalidate: the last good copy lives in localStorage and renders
// immediately; it is refetched in the background once older than CACHE_TTL.
const CACHE_KEY = 'gist_content_cache_v1';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
let _cache = null;
let _cacheTime = 0;

function readStored() {
  try {
    const stored = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (stored?.data && typeof stored.savedAt === 'number') return stored;
  } catch {
    /* corrupt entry / storage blocked */
  }
  return null;
}

/** Last cached Gist content (any age), or null. Synchronous, for first render. */
export function getCachedGistContent() {
  if (_cache) return _cache;
  return readStored()?.data ?? null;
}

export async function fetchGistContent() {
  if (!_cache) {
    const stored = readStored();
    if (stored) { _cache = stored.data; _cacheTime = stored.savedAt; }
  }

  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return _cache;

  try {
    const res = await fetch(GIST_RAW_URL, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    _cache = {
      experiences:  data.experiences  ?? FALLBACK_DATA.experiences,
      certificates: data.certificates ?? FALLBACK_DATA.certificates,
      education:    data.education    ?? FALLBACK_DATA.education,
      achievements: data.achievements ?? FALLBACK_DATA.achievements,
    };
    _cacheTime = Date.now();
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: _cache, savedAt: _cacheTime }));
    } catch {
      /* quota / private mode */
    }
    console.log('[gistContent] Loaded from Gist.');
    return _cache;

  } catch (err) {
    if (_cache) return _cache; // keep showing the stale copy
    console.warn('[gistContent] Fetch failed — using fallback data.', err.message);
    return FALLBACK_DATA;
  }
}
