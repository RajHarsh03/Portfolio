/**
 * Gist-based CMS for experiences, internships, and certificates.
 *
 * To add/edit cards: just edit the Gist on github.com — no code push needed.
 * If the Gist is unreachable, the app falls back to FALLBACK_DATA below.
 */

const GIST_RAW_URL =
  'https://gist.githubusercontent.com/RajHarsh03/c654e844cf7de53873dd45b3d9a00b05/raw/portfolio-content.json';

// ─── Fallback — shown if Gist fetch fails ─────────────────────────────────────
export const FALLBACK_DATA = {
  experiences: [
    {
      label: 'PREVIOUS ROLE',
      type: 'SIMULATION',
      typeColor: 'badge-blue',
      company: 'Deloitte AU',
      role: 'Cyber & Technology Simulation',
      date: '2025',
      bullets: [
        'Analyzed enterprise cyber threat scenarios and security workflows.',
        'Identified vulnerabilities and proposed mitigation strategies aligned with industry best practices.',
      ],
    },
  ],
  internships: [
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
    }
  ],
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let _cache = null;
let _cacheTime = 0;

/**
 * Fetches portfolio content from GitHub Gist.
 * Falls back to FALLBACK_DATA if the fetch fails for any reason.
 */
export async function fetchGistContent() {
  // Return cached result if still fresh
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return _cache;

  try {
    // Cache-busting param so browsers don't serve stale Gist raw files
    const res = await fetch(`${GIST_RAW_URL}?t=${Date.now()}`, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    _cache = {
      experiences:  data.experiences  ?? FALLBACK_DATA.experiences,
      internships:  data.internships  ?? FALLBACK_DATA.internships,
      certificates: data.certificates ?? FALLBACK_DATA.certificates,
    };
    _cacheTime = Date.now();
    console.log('[gistContent] Loaded from Gist.');
    return _cache;

  } catch (err) {
    console.warn('[gistContent] Fetch failed — using fallback data.', err.message);
    return FALLBACK_DATA;
  }
}
