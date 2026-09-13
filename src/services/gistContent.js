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
      desc: 'Participated in 5+ hackathons, collaborating in teams to rapidly prototype and deliver full-stack and AI solutions under tight deadlines.',
    },
    {
      title: 'Core Tech Team Member',
      org: 'GeeksforGeeks Campus Body',
      year: '2024–Present',
      desc: 'Contributed to campus technical initiatives, organized developer learning sessions, and led engineering activities.',
    },
    {
      title: 'Member — Institute of Innovation Council (IIC)',
      org: 'Institute of Innovation Council',
      year: '2024–Present',
      desc: 'Drove innovation, entrepreneurship, and technology initiatives through idea validation programs and cross-functional collaboration.',
    },
    {
      title: 'Competitive Event Winner',
      org: 'College-Level Technical Events',
      year: '2024–Present',
      desc: 'Won various college-level coding events, hackathons, and quizzes, securing multiple prize money accolades.',
    },
  ],
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let _cache = null;
let _cacheTime = 0;

export async function fetchGistContent() {
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return _cache;

  try {
    const res = await fetch(`${GIST_RAW_URL}?t=${Date.now()}`, {
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
    console.log('[gistContent] Loaded from Gist.');
    return _cache;

  } catch (err) {
    console.warn('[gistContent] Fetch failed — using fallback data.', err.message);
    return FALLBACK_DATA;
  }
}
