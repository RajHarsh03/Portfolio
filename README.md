<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=3b82f6&height=200&section=header&text=harshx.in&fontSize=70&fontColor=ffffff&fontAlignY=35&desc=Personal%20Portfolio%20%E2%80%93%20%20React%20%2B%20Vite&descAlignY=55&descSize=20&animation=fadeIn" width="100%" />

<br/>

[![Live](https://img.shields.io/badge/Live%20Demo-harshx.in-3b82f6?style=for-the-badge&logo=vercel&logoColor=white)](https://harshx.in)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-14b8a6?style=for-the-badge)](./LICENSE)

<br/>

> **Personal portfolio of Harsh Raj** - a fast, fully-featured React SPA with dark/light theme, live GitHub data, animated custom cursor, canvas contribution heatmap, live Spotify now-playing widget, and a Gist-powered CMS for experiences, internships, and certificates.

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

🚀 **SPA Navigation** - zero full-page reloads\
🎨 **Dark / Light Theme** - circular wipe via View Transition API\
📡 **Live GitHub Projects** - fetched, filtered & sorted by topics\
🔥 **GitHub Heatmap** - canvas-rendered contribution graph\
📬 **Contact Form** - EmailJS + toast feedback + `Ctrl+Enter`\
🎵 **Spotify Widget** - live now-playing / last-played with artwork

</td>
<td width="50%">

👁️ **Scroll Reveal** - IntersectionObserver fade-up animations\
🖱️ **Custom Cursor** - dual-ring, hover-expand (desktop only)\
📊 **Visit Counter** - Upstash Redis via Vercel serverless\
🧭 **Persistent Layout** - Nav, Footer, Cursor mount once\
📱 **Fully Responsive** - mobile-first, all breakpoints covered\
💼 **Experience Cards** - collapsible cards with tech stack icons

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Choice |
|:------|:-------|
| ⚡ Build Tool | **Vite 6** |
| ⚛️ UI Framework | **React 19** |
| 🔀 Routing | **React Router v7** |
| 🪖 Meta / SEO | **react-helmet-async** |
| 🎨 Styling | Single global CSS (`src/index.css`) |
| 📡 Data | **GitHub REST API** + **EmailJS** |
| 🎵 Spotify | **Custom `/api/now-playing`** serverless endpoint |
| 📊 Visit Counter | **Upstash Redis** via Vercel serverless |
| 🚀 Deployment | **Vercel** |

</div>

---

## 📄 Routes

<div align="center">

| URL | Page |
|:----|:-----|
| `/` | 🏠 Home - hero, bio + Spotify strip, experience preview, skills ticker, featured projects, heatmap |
| `/projects` | 🗂️ All Projects - search, filter (frontend / fullstack / AI), sort |
| `/contact` | 📬 Contact - EmailJS form + social links |
| `/about` | 👤 About - bio, education, collapsible experience cards with tech stack icons |
| `*` | 🔍 404 Not Found |

</div>

---

## 📁 File Structure

```
Portfolio/
├── 📄 index.html                  # SPA shell - single HTML entry point
├── ⚙️  vite.config.js
├── 🚀 vercel.json                 # SPA rewrites + /api route
├── 📦 package.json
├── 📋 Resume.pdf                  # Served from /Resume.pdf
│
└── src/
    ├── 🚀 main.jsx                # BrowserRouter + HelmetProvider + ThemeProvider
    ├── 🗺️  App.jsx                # Route definitions + AppShell wrapper
    ├── 🎨 index.css               # Full design system + all component styles
    │
    ├── layouts/
    │   └── 🏗️  AppShell.jsx       # Persistent shell - Nav, Footer, Cursor, Glows
    │
    ├── router/
    │   ├── 🔀 routes.jsx          # Lazy imports for all pages
    │   └── ⬆️  ScrollToTop.jsx    # Scrolls to top on every route change
    │
    ├── context/
    │   └── 🌗 ThemeContext.jsx    # Theme state + View Transition toggle
    │
    ├── hooks/
    │   ├── 📡 useProjects.js      # GitHub projects fetch + cache + auto-refresh
    │   ├── 🗂️  useGistContent.js  # Gist CMS hook - experiences, internships, certs
    │   ├── 👁️  useReveal.js       # IntersectionObserver scroll reveal
    │   └── 🌗 useTheme.js         # Re-export of useTheme from context
    │
    ├── services/
    │   ├── 🐙 githubProjects.js        # Fetch + normalise portfolio repos
    │   ├── 🔥 githubContributions.js   # Fetch contribution heatmap data
    │   └── 📝 gistContent.js           # Gist CMS - fetch + fallback + spotify field
    │
    ├── components/
    │   ├── layout/
    │   │   ├── 🧭 Navbar.jsx          # Pill nav - tabs, GitHub icon, theme toggle
    │   │   ├── 🦶 Footer.jsx          # Footer + visit counter
    │   │   ├── 🖱️  CustomCursor.jsx   # Dual-ring cursor (desktop only)
    │   │   └── 📊 ScrollProgress.jsx  # Top gradient progress bar
    │   │
    │   └── home/
    │       ├── 🦸 Hero.jsx            # Hero section - avatar, name, CTA, socials
    │       ├── ℹ️  InfoStrip.jsx       # Bio card + live Spotify now-playing widget
    │       ├── 💼 JourneyPreview.jsx  # Experience card preview (static, home only)
    │       ├── 🛠️  Skills.jsx         # Ticker marquee tech stack
    │       ├── 🗂️  FeaturedProjects.jsx # Top 2 projects from GitHub
    │       ├── 🔥 GitHubHeatmap.jsx   # Canvas contribution heatmap
    │       └── 📱 BottomNav.jsx       # Floating pill nav (home page only)
    │
    └── pages/
        ├── 🏠 Home.jsx
        ├── 👤 About.jsx           # Education + collapsible ExpCard with stacks
        ├── 🗂️  Projects.jsx        # Full grid - search, filter, sort, pagination
        ├── 📬 Contact.jsx         # EmailJS form + toast
        └── 🔍 NotFound.jsx        # 404
```

---

## ⚡ Quick Start

**Requirements:** Node.js 18+

```bash
# Clone the repository
git clone https://github.com/RajHarsh03/Portfolio
cd Portfolio

# Install dependencies
npm install

# Start dev server
npm run dev
```

> Dev server runs at **`http://localhost:5173`**

---

## 🔐 Environment Variables

> **No `.env` file is needed** to run or deploy this project.

<table>
<tr>
<th>Variable</th>
<th>Where</th>
<th>Notes</th>
</tr>
<tr>
<td><code>KV_REST_API_URL</code></td>
<td>Vercel Dashboard → Storage</td>
<td>Auto-injected by Vercel when Upstash Redis is connected</td>
</tr>
<tr>
<td><code>KV_REST_API_TOKEN</code></td>
<td>Vercel Dashboard → Storage</td>
<td>Auto-injected by Vercel when Upstash Redis is connected</td>
</tr>
</table>

> 📌 **EmailJS keys** are public client-side keys (hardcoded intentionally). Security is handled via **domain whitelisting** in the EmailJS dashboard. Ensure only `harshx.in` is listed under **Account → Security**.

---

## 📦 Build & Preview

```bash
npm run build      # → outputs production bundle to dist/
npm run preview    # → preview the production build locally
```

---

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Set the following options:

| Setting | Value |
|:--------|:------|
| Framework Preset | **Vite** |
| Root Directory | `/` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. Connect **Upstash Redis** from Vercel Dashboard → Storage (auto-injects env vars)
5. **Deploy** 🎉

> The `vercel.json` handles SPA routing - all URLs serve `index.html` and React Router takes over client-side.

---

## 🐙 GitHub Projects Setup

To show a repo on the portfolio, add these **topics** to it on GitHub:

<div align="center">

| Topic | Effect |
|:------|:-------|
| `portfolio` | ✅ **Required** - makes it appear on the portfolio |
| `rank-1`, `rank-2`, … | 📊 Controls display order (lower = higher priority) |
| `completed` | 🟢 Shows green "Completed" badge |
| `frontend` / `fullstack` / `ai` | 🔍 Sets the filter category |
| `personal` / `client` / `open-source` / `hackathon` | 🏷️ Sets the type pill label |

</div>

Tech icon topics (auto-mapped to devicons): `react`, `nodejs`, `python`, `typescript`, `mongodb`, `tailwindcss`, and more.

---

## 🗂️ Gist CMS — Experiences & Certificates

Content for the **About** page (experience cards) and education is managed via a **GitHub Gist** — no code push needed to add or edit cards.

### How it works

The app fetches a single JSON file from a private Gist at runtime. If the Gist is unreachable, it automatically falls back to hardcoded data so the site never breaks.

```
Gist URL → fetched on every page visit (cached 5 min)
         ↓ fails?
Fallback data in gistContent.js (always shown instantly)
```

### Adding or editing a card

1. Go to your Gist: [https://gist.github.com/](https://gist.github.com/)
2. Open and **edit the existing gist** (do NOT create a new one)
3. Update the JSON for `experiences`, `certificates`, or `education`
4. Save — changes are live within **5 minutes**, no deploy needed
5. To update the offline fallback, also edit `FALLBACK_DATA` in [`src/services/gistContent.js`](./src/services/gistContent.js) and push

### JSON structure

**Experience card:**
```json
{
  "label": "INTERNSHIP",
  "type": "INTERNSHIP",
  "typeColor": "badge-purple",
  "company": "Company Name",
  "role": "Your Role Title",
  "date": "JAN 2025 - AUG 2025",
  "duration": "2m",
  "stacks": ["Python", "Pandas", "NumPy", "ScikitLearn"],
  "bullets": [
    "First bullet point about what you did.",
    "Second bullet point with an achievement."
  ]
}
```

> **Fields:**
> - `duration` — short label shown next to date (e.g. `"2m"`, `"6m"`)
> - `stacks` — array of tech names; icons auto-resolved via Devicons CDN v2.16
> - `bullets` — shown only when the card is expanded (chevron toggle)

**Certificate card:**
```json
{
  "label": "COURSE",
  "type": "CERTIFICATE",
  "typeColor": "badge-teal",
  "title": "Certificate Title",
  "issuer": "ISSUING BODY",
  "date": "JAN 2025",
  "desc": "Short description of what this certificate covers.",
  "link": "https://drive.google.com/..."
}
```

**`typeColor` options:** `badge-blue` | `badge-purple` | `badge-teal`

**Supported stack names (auto-icon via Devicons):**

`html`, `css`, `javascript`, `typescript`, `react`, `nextjs`, `python`, `figma`, `tailwindcss`, `nodejs`, `git`, `mongodb`, `mysql`, `firebase`, `pandas`, `numpy`, `scikitlearn`, `matplotlib`, `jupyter`, `flask`, `fastapi`, `docker`, `postgresql`, `redux`

---

## 🎵 Spotify Now Playing Widget

The **InfoStrip** section on the home page displays a live Spotify widget showing the currently playing song (or last-played if nothing is active).

### How it works

```
GET /api/now-playing  →  { track: { title, artist, artwork, url }, isPlaying }
```

- Polls every **5 seconds** for near-real-time updates
- **Last played persisted in `localStorage`** — no blank flash on page reload
- Falls back to production endpoint (`harshx.in/api/now-playing`) in local dev
- Glows green on hover; clicking opens the track on Spotify

### Widget layout

```
┌──────────────────────────────────────────┐
│ 🎵 Last Played          [Album Artwork]  │
│ Song Title (bold)                        │
│ Artist Name (muted)                      │
└──────────────────────────────────────────┘
```

---

## 📊 Visit Counter

Uses a Vercel serverless function at `/api/visits`:

```
POST /api/visits  →  Records unique daily visit (hashed IP + UA + date), returns total
GET  /api/visits  →  Returns total count without incrementing
```

Backed by **Upstash Redis** (Vercel KV). In local dev it reads from the live production endpoint so the counter is always visible.

---

## 📜 License

```
MIT License - feel free to use as a reference or template.
A credit link back to harshx.in is appreciated but not required.
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=3b82f6&height=120&section=footer&animation=fadeIn" width="100%" />

Made by **[Harsh Raj](https://harshx.in)**

</div>
