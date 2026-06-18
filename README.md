# harshx.in — Personal Portfolio

Personal portfolio of **Harsh Raj**, built as a React SPA using Vite, React Router, and the existing design system.

Live: [harshx.in](https://harshx.in)

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Build tool | Vite 6 |
| UI | React 19 |
| Routing | React Router v7 |
| Meta / SEO | react-helmet-async |
| Styling | Single global CSS (`src/index.css`) |
| Data | GitHub REST API + EmailJS |
| Visit counter | Upstash Redis via Vercel serverless |
| Deployment | Vercel |

---

## Features

- **SPA navigation** — zero full-page reloads between routes
- **Persistent layout** — Navbar, Footer, custom cursor, and scroll progress bar mount once and never remount
- **Theme toggle** — dark / light with View Transition API circular wipe, persisted in `localStorage`
- **GitHub projects** — fetched live from GitHub API, filtered by `portfolio` topic, sorted by `rank-N` topic
- **GitHub heatmap** — canvas-rendered contribution graph (last 12 months)
- **Contact form** — EmailJS integration with toast feedback and Ctrl+Enter shortcut
- **Visit counter** — Upstash Redis serverless function, counts unique daily visitors
- **Scroll reveal** — IntersectionObserver-based fade-up animations
- **Custom cursor** — dual-ring cursor with hover expand (hidden on touch devices)

---

## Routes

| URL | Page |
|-----|------|
| `/` | Home — hero, about, journey preview, skills ticker, featured projects, GitHub heatmap |
| `/projects` | All projects — search, filter (frontend / fullstack / AI), sort |
| `/contact` | Contact — EmailJS form + social links |
| `/journey` | Journey — experience & internship timeline |
| `/certificates` | Certificates & achievements |
| `*` | 404 Not Found |

---

## File Structure

```
Portfolio/
├── index.html                  # SPA shell — single HTML entry point
├── vite.config.js
├── vercel.json                 # SPA rewrites + /api route
├── package.json
├── Resume.pdf                  # served from /Resume.pdf
└── src/
    ├── main.jsx                # BrowserRouter + HelmetProvider + ThemeProvider
    ├── App.jsx                 # Route definitions + AppShell wrapper
    ├── index.css               # Full design system + all component styles
    │
    ├── layouts/
    │   └── AppShell.jsx        # Persistent shell — Nav, Footer, Cursor, Glows
    │
    ├── router/
    │   ├── routes.jsx          # Lazy imports for all pages
    │   └── ScrollToTop.jsx     # Scrolls to top on every route change
    │
    ├── context/
    │   └── ThemeContext.jsx    # Theme state + View Transition toggle
    │
    ├── hooks/
    │   ├── useProjects.js      # GitHub projects fetch + cache + auto-refresh
    │   ├── useReveal.js        # IntersectionObserver scroll reveal
    │   └── useTheme.js         # Re-export of useTheme from context
    │
    ├── services/
    │   ├── githubProjects.js   # Fetch + normalise portfolio repos from GitHub
    │   └── githubContributions.js  # Fetch contribution heatmap data
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx          # Pill nav — tabs, GitHub icon, theme toggle
    │   │   ├── Footer.jsx          # Footer + visit counter
    │   │   ├── CustomCursor.jsx    # Dual-ring cursor (desktop only)
    │   │   └── ScrollProgress.jsx  # Top gradient progress bar
    │   │
    │   └── home/
    │       ├── Hero.jsx            # Hero section
    │       ├── About.jsx           # About section
    │       ├── JourneyPreview.jsx  # Journey + Certificates card links
    │       ├── Skills.jsx          # Ticker marquee tech stack
    │       ├── FeaturedProjects.jsx # Top 2 projects from GitHub
    │       ├── GitHubHeatmap.jsx   # Canvas contribution heatmap
    │       └── BottomNav.jsx       # Floating pill nav (home page only)
    │
    └── pages/
        ├── Home.jsx
        ├── Projects.jsx        # Full grid — search, filter, sort, pagination
        ├── Contact.jsx         # EmailJS form + toast
        ├── Journey.jsx         # Static timeline
        ├── Certificates.jsx    # Certificate cards
        └── NotFound.jsx        # 404
```

---

## Installation

**Requirements:** Node.js 18+

```bash
# Clone
git clone https://github.com/RajHarsh03/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start dev server
npm run dev
```

Dev server runs at `http://localhost:5173`.

---

## Environment Variables

No `.env` file is needed to run or deploy this project.

- **EmailJS keys** are hardcoded in `src/pages/Contact.jsx` — this is intentional. They are public client-side keys (exposed in the browser bundle regardless). Security is handled via **domain whitelisting** in the EmailJS dashboard — make sure only `harshx.in` is listed under Account → Security.

- **Redis / Visit counter** — connect Upstash Redis via the Vercel dashboard (Storage tab). Vercel injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically. Nothing to add manually.

---

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. **Framework Preset:** Vite
4. **Root Directory:** `/` (root of repo)
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. Add environment variables in Vercel dashboard:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
8. Deploy

The `vercel.json` handles SPA routing — all URLs serve `index.html` and React Router takes over client-side.

---

## GitHub Projects Setup

To show a repo on the portfolio, add these **topics** to it on GitHub:

| Topic | Effect |
|-------|--------|
| `portfolio` | Required — makes it show up |
| `rank-1`, `rank-2`, … | Controls display order |
| `completed` | Shows green "Completed" badge |
| `frontend` / `fullstack` / `ai` | Sets the filter category |
| `personal` / `client` / `open-source` / `hackathon` | Sets the type pill |

Tech icon topics (auto-mapped to devicons): `react`, `nodejs`, `python`, `typescript`, `mongodb`, `tailwindcss`, etc.

---

## Visit Counter

Uses a Vercel serverless function at `/api/visits`:

- `POST /api/visits` — records a unique daily visit (hashed by IP + user-agent + date), returns total
- `GET /api/visits` — returns total without incrementing

Backed by Upstash Redis (Vercel KV). In local dev it reads from the live production endpoint so the counter is always visible.

---

## License

MIT — feel free to use as a reference or template. A credit link back to [harshx.in](https://harshx.in) is appreciated but not required.
