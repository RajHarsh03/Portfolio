<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=3b82f6&height=200&section=header&text=harshx.in&fontSize=70&fontColor=ffffff&fontAlignY=35&desc=Personal%20Portfolio%20%E2%80%93%20%20React%20%2B%20Vite&descAlignY=55&descSize=20&animation=fadeIn" width="100%" />

<br/>

[![Live](https://img.shields.io/badge/Live%20Demo-harshx.in-3b82f6?style=for-the-badge&logo=vercel&logoColor=white)](https://harshx.in)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

<br/>

> **Personal portfolio of Harsh Raj** - a fast, fully-featured React SPA with dark/light theme, live GitHub data, DOM-based contribution heatmap, live Spotify now-playing widget, oneko.js cat companion, circular GitHub favicon, a Clerk + Supabase guestbook, and a Gist-powered CMS for experiences, internships, and certificates.

</div>

---

## Features

<table>
<tr>
<td width="50%">

**SPA Navigation** - zero full-page reloads\
**Dark / Light Theme** - circular wipe via View Transition API\
**Live GitHub Projects** - fetched, filtered & sorted by topics\
**Project Detail Pages** - route-based with Gist-powered content\
**GitHub Heatmap** - DOM-rendered contribution graph, monochrome style, contribution count + less/more legend\
**Contact Form** - Resend via Vercel serverless, honeypot + rate limit, toast feedback\
**Spotify Widget** - live now-playing / last-played mini player in the hero, polls every 30 seconds\
**Guestbook** - Clerk sign-in (Google), notes and likes in Supabase with realtime updates, pinned-first grid, loading skeletons, admin pin/delete\
**Back-to-Top Button** - floating button with a ring that fills as you scroll

</td>
<td width="50%">

**Scroll Reveal** - IntersectionObserver fade-up animations\
**Oneko Cat** - nekojs cat companion that follows your cursor\
**Circular Favicon** - live GitHub avatar rendered as circular favicon\
**Visit Counter** - Upstash Redis via Vercel serverless, shown in the quote strip above the footer\
**Persistent Layout** - Nav, quote strip, Footer mount once\
**Fully Responsive** - mobile-first, incremental load on mobile\
**Experience Cards** - collapsible cards with tech stack icons\
**Gist CMS** - manage content without redeployment\
**Quote Strip** - rotating developer quotes above the footer\
**Typing Effect** - animated typing in hero section\
**Animated Theme Icon** - moon/sun icon rotates and the sun rays stagger in on toggle\
**Thin Scrollbar** - slim page scrollbar on desktop, hidden on mobile

</td>
</tr>
</table>

---

## Tech Stack

<div align="center">

| Layer | Choice |
|:------|:-------|
| Build Tool | **Vite 6** |
| UI Framework | **React 19** |
| Routing | **React Router v7** |
| Meta / SEO | **react-helmet-async** |
| Styling | Single global CSS (`src/index.css`) |
| Data | **GitHub REST API** |
| Contact email | **Resend** via **`/api/contact`** serverless endpoint |
| Spotify | **Custom `/api/now-playing`** serverless endpoint |
| Visit Counter | **Upstash Redis** via Vercel serverless |
| Guestbook auth | **Clerk** (`@clerk/react`, Google sign-in) |
| Guestbook data | **Supabase** Postgres + Row Level Security + Realtime (`@supabase/supabase-js`) |
| Deployment | **Vercel** |

</div>

---

## Routes

<div align="center">

| URL | Page |
|:----|:-----|
| `/` | Home - hero with Spotify mini player, skills ticker, education + certificates, featured projects, heatmap, guestbook invitation |
| `/projects` | All Projects - category filter pills (Web Apps / AI & ML / Data Science), incremental mobile load |
| `/projects/:id` | Project Detail - full overview, tech stack, features, highlights, challenges (Gist-powered) |
| `/contact` | Contact - Resend-backed form with toast feedback + social links |
| `/about` | About - bio, education, collapsible experience cards with tech stack icons, certificates |
| `/guestbook` | Guestbook - Clerk sign-in, live visitor notes and likes, pinned notes first |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `*` | 404 - Page not found |

</div>

---

## File Structure

```
Portfolio/
|-- index.html                  # SPA shell - single HTML entry point
|-- vite.config.js
|-- vercel.json                 # SPA rewrites + /api route + security headers (CSP)
|-- package.json
|
|-- public/
|   |-- favicon.png             # Default favicon
|   |-- apple-touch-icon.png    # iOS home-screen icon
|   |-- og-image.jpg            # Open Graph / Twitter card image
|   +-- Resume.pdf              # Served from /Resume.pdf
|
|-- api/                        # Vercel serverless functions
|   |-- contact.js              # Contact form -> Resend email (validation, honeypot, rate limit)
|   |-- now-playing.js          # Spotify currently playing / last played
|   +-- visits.js               # Upstash Redis visit counter
|
+-- src/
    |-- main.jsx                # BrowserRouter + HelmetProvider + ThemeProvider + ClerkThemeProvider
    |-- App.jsx                 # Route definitions + AppShell wrapper
    |-- index.css               # Full design system + all component styles
    |
    |-- layouts/
    |   +-- AppShell.jsx        # Persistent shell - Nav, quote strip, Footer, bottom nav, glows
    |
    |-- router/
    |   |-- routes.jsx          # Home eager; other pages lazy-loaded and prefetched when idle
    |   +-- ScrollToTop.jsx     # Scrolls to top on every route change
    |
    |-- context/
    |   +-- ThemeContext.jsx    # Theme state + View Transition toggle
    |
    |-- hooks/
    |   |-- useProjects.js           # GitHub projects fetch + cache + auto-refresh
    |   |-- useProjectDetails.js     # Gist project details fetch + 5min cache
    |   |-- useGistContent.js        # Gist CMS hook - experiences, internships, certs
    |   |-- useReveal.js             # IntersectionObserver scroll reveal
    |   |-- useActiveSection.js      # Tracks the visible section for the legal TOC
    |   |-- useToast.js              # Toast state for contact form + guestbook
    |   +-- useNeko.js               # Oneko cat companion cursor follower
    |
    |-- lib/
    |   +-- circularFavicon.js       # Fetches GitHub avatar, renders as circular favicon
    |
    |-- services/
    |   |-- supabase.js                  # Supabase client, sends the Clerk session token
    |   |-- githubUser.js                # Shared GitHub user lookup (repo count, avatar) + cache
    |   |-- githubProjects.js            # Fetch + normalise portfolio repos
    |   |-- projectDetailsGist.js        # Fetch project details from Gist
    |   |-- githubContributions.js       # Fetch contribution heatmap data
    |   +-- gistContent.js               # Gist CMS - fetch + fallback
    |
    |-- components/
    |   |-- ClerkThemeProvider.jsx  # ClerkProvider styled to follow the site's dark/light theme
    |   |
    |   |-- layout/
    |   |   |-- Navbar.jsx          # Pill nav - tabs, GitHub icon, animated theme toggle
    |   |   |-- Footer.jsx          # Footer + legal links
    |   |   |-- ScrollProgress.jsx  # Top gradient progress bar
    |   |   +-- ScrollToTopButton.jsx # Back-to-top button with a scroll-progress ring
    |   |
    |   |-- home/
    |   |   |-- Hero.jsx            # Hero section - avatar, name, CTA, socials, Spotify mini player
    |   |   |-- TypingEffect.jsx    # Animated typing text in hero
    |   |   |-- EducationCerts.jsx  # Education timeline + certificates section
    |   |   |-- Skills.jsx          # Ticker marquee tech stack
    |   |   |-- FeaturedProjects.jsx # Top 2 projects from GitHub
    |   |   |-- GitHubHeatmap.jsx   # DOM-based contribution heatmap
    |   |   |-- QuoteStrip.jsx      # Rotating developer quotes + visit counter (above the footer)
    |   |   +-- BottomNav.jsx       # Floating pill nav (mobile)
    |   |
    |   |-- projects/
    |   |   +-- CompactProjectCard.jsx     # Compact project card with arrow navigation
    |   |
    |   |-- ui/
    |   |   +-- Toast.jsx                  # Toast notification (contact form + guestbook)
    |   |
    |   +-- legal/
    |       +-- LegalPage.jsx              # Shared shell for the privacy and terms pages
    |
    +-- pages/
        |-- Home.jsx
        |-- About.jsx              # Education + collapsible ExpCard with stacks
        |-- Projects.jsx           # Full grid - category filter pills, incremental mobile load
        |-- ProjectDetail.jsx      # Individual project page with Gist-powered details
        |-- Contact.jsx            # Contact form (POST /api/contact) + toast
        |-- Guestbook.jsx          # Clerk sign-in + Supabase notes, likes, realtime
        |-- PrivacyPolicy.jsx      # /privacy
        |-- TermsOfService.jsx     # /terms
        +-- NotFound.jsx           # 404
```

---

## Quick Start

**Requirements:** Node.js 18+

```bash
# Clone the repository
git clone https://github.com/RajHarsh03/Portfolio
cd Portfolio

# Install dependencies
npm install

# Create .env.local (see Environment Variables below)

# Start dev server
npm run dev
```

---

## Environment Variables

Create a `.env.local` in the project root:

```env
# Spotify (serverless API)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token

# Visit counter (serverless API) - Upstash Redis REST credentials
# The Vercel KV / Upstash integration sets KV_REST_API_*; UPSTASH_REDIS_REST_* also works
KV_REST_API_URL=https://your-db.upstash.io
KV_REST_API_TOKEN=your_upstash_token

# Contact form (serverless API) - Resend
RESEND_API_KEY=re_your_resend_api_key
# Optional, these are the defaults
CONTACT_TO_EMAIL=rajharsh.devx@gmail.com
CONTACT_FROM_EMAIL="Portfolio <contact@harshx.in>"

# Clerk (client-side, VITE_ prefix required)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_or_pk_live_key

# Supabase (client-side, VITE_ prefix required)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_key
# Legacy fallback, used only when VITE_SUPABASE_PUBLISHABLE_KEY is not set
# VITE_SUPABASE_ANON_KEY=your_legacy_anon_key
```

- `VITE_*` values are bundled into the browser code, so only use public keys there. The Supabase publishable key is safe in the browser because Row Level Security decides what each request may do.
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` have no `VITE_` prefix, so they stay on the server. Without `RESEND_API_KEY` the contact form shows an error toast.
- `CLERK_SECRET_KEY` is not needed. The site only uses Clerk in the browser and has no server code that calls Clerk.
- Without the Supabase values the guestbook shows "temporarily unavailable"; the rest of the site still works.

---

## Deployment

1. **Push** to GitHub
2. **Connect** the repo in [Vercel](https://vercel.com)
3. **Set** all environment variables in Vercel Project Settings Environment Variables
4. **Build command:** `npm run build`
5. **Output directory:** `dist`
6. **Deploy**

> The `vercel.json` handles SPA routing - all URLs serve `index.html` and React Router takes over client-side.

### Content Security Policy

`vercel.json` sends a full CSP as `Content-Security-Policy-Report-Only` on every path, alongside the other security headers (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`). Report-only means the browser blocks nothing. It only logs what it would block. There is no reporting endpoint, so violations appear in the DevTools Console as messages starting with `[Report Only] Refused to ...`. The separate enforced `Content-Security-Policy: frame-ancestors 'self'` header stays in place.

- **Checking:** open each page (including Contact send and Guestbook sign-in, post, like) with DevTools Console open and look for `[Report Only]` messages. A new third-party origin (script, image, API) must be added to the matching directive.
- **Guestbook origins:** Clerk loads from its Frontend API (`https://clerk.harshx.in` in production, `https://*.clerk.accounts.dev` in development) and uses `https://img.clerk.com` (avatars), `https://*.protect.clerk.com` and `https://challenges.cloudflare.com` (bot protection / Cloudflare Turnstile), and `https://clerk-telemetry.com`. Google profile images come from `https://lh3.googleusercontent.com`. Supabase needs `https://*.supabase.co` for the REST API and `wss://*.supabase.co` for Realtime in `connect-src`.
- **Inline theme script:** `index.html` has one inline script, allowed by its `sha256-...` hash in `script-src`. Any edit to that script, even whitespace, changes the hash. Recompute it after `npm run build` with:
  ```bash
  node -e "const h=require('fs').readFileSync('dist/index.html','utf8');const s=h.match(/<script>([\s\S]*?)<\/script>/)[1];console.log('sha256-'+require('crypto').createHash('sha256').update(s).digest('base64'))"
  ```
  Two hashes are listed because the hash depends on line endings: one for LF (Git/Vercel builds) and one for CRLF (a Windows checkout deployed with the Vercel CLI).
- **Switching to enforcing:** after about a week with no violations, rename the key to `Content-Security-Policy` and delete the old `frame-ancestors 'self'` CSP entry in the same block (the full policy already contains `frame-ancestors 'self'`). Keep `X-Frame-Options`. Also append `; upgrade-insecure-requests` to the policy, since browsers ignore it in report-only mode.
- `style-src` includes `'unsafe-inline'` because React `style={{...}}` props render as inline style attributes. This is the usual trade-off for React apps; scripts stay hash-restricted.

---

## Guestbook setup (Clerk + Supabase)

**Clerk** handles sign-in (Google) and sessions. **Supabase** stores notes and likes in Postgres. The browser Supabase client (`src/services/supabase.js`) sends the current Clerk session token with every request through Supabase **Third-Party Auth**, and **Row Level Security** checks it. Signed-out visitors use the publishable key and can only read. New, updated and deleted notes arrive live through **Supabase Realtime**.

### 1. Clerk

1. Create an application in the [Clerk Dashboard](https://dashboard.clerk.com) and enable **Google** under **SSO connections**.
2. Copy the publishable key into `VITE_CLERK_PUBLISHABLE_KEY`.
3. Activate the **Supabase integration** in Clerk (Integrations > Supabase). It adds the `role: "authenticated"` claim to session tokens and shows your **Clerk domain**.

### 2. Supabase

1. Create a Supabase project. Copy the Project URL into `VITE_SUPABASE_URL` and the publishable key into `VITE_SUPABASE_PUBLISHABLE_KEY` (the legacy anon key also works through `VITE_SUPABASE_ANON_KEY`).
2. In **Authentication > Sign In / Providers > Third-Party Auth**, add **Clerk** with the Clerk domain. Development and production Clerk instances have different domains (`*.clerk.accounts.dev` and `clerk.harshx.in`), so add both.
3. Create the tables, policies and functions below in the SQL Editor (the SQL was run once there and is not kept in this repo), and enable Realtime for `guestbook_notes`.

**Schema summary**

| Table / function | Contents |
|:-----------------|:---------|
| `guestbook_notes` | `id`, `user_id` (Clerk user ID), `display_name`, `photo_url`, `message` (max 500 characters / 100 words), `author_role` (`Admin` or `Visitor`), `pinned`, `pinned_at`, `likes_count`, `liked_by_admin`, `created_at`, `legacy_id` (notes migrated from Firestore) |
| `guestbook_likes` | `note_id`, `user_id` - one like per user per note (unique), no unlike |
| `guestbook_admins` | Clerk user IDs of admins |
| `is_admin()` | Returns `true` when the caller's Clerk user ID is in `guestbook_admins`; the page calls it as an RPC |

**RLS summary**

- Anyone can read notes.
- A signed-in user can insert a note. The database sets `user_id` from the Clerk token, plus `author_role`, likes, pin state and `created_at`. The client only sends `display_name`, `photo_url` and `message`; email addresses are not stored.
- A signed-in user can like a note once. A database trigger updates the note's `likes_count`.
- Only admins can pin, unpin and delete notes.

### 3. Admin access

Add your Clerk user ID (`user_...`, from **Clerk Dashboard > Users**) to `guestbook_admins`. Development and production Clerk instances give the same person different user IDs, so add the ID from each instance you use.

### 4. Production

- Create a **production instance** in Clerk for `harshx.in`, add the DNS records it lists, and set the production publishable key (`pk_live_...`) as `VITE_CLERK_PUBLISHABLE_KEY` in Vercel. Development keys (`pk_test_...`) show Clerk's **Development mode** banner in the sign-in modal; production keys remove it.
- Production Google sign-in needs your own OAuth credentials. In Google Cloud Console, create an OAuth client ID (Web application), add the **Authorized redirect URI** shown in Clerk under **SSO connections > Google** with **Use custom credentials** on, then paste the client ID and secret back into Clerk. Publish the OAuth consent screen so any Google account can sign in.
- Add the production Clerk domain to Supabase Third-Party Auth and the production admin user ID to `guestbook_admins` (steps 2 and 3).

The Home page links to the guestbook. The `/guestbook` page shows pinned notes first (newest pin first), then the newest notes, and provides Clerk sign-in, note submission, likes, admin pin/delete, loading skeletons and toast feedback.

---

## GitHub Projects Setup

To show a repo on the portfolio, add these **topics** to it on GitHub:

<div align="center">

| Topic | Effect |
|:------|:-------|
| `portfolio` | **Required** - makes it appear on the portfolio |
| `rank-1`, `rank-2`, etc. | Controls display order (lower = higher priority) |
| `completed` | Shows "Live" status on project detail page |
| `frontend` / `fullstack` / `ai` | Sets the filter category |
| `personal` / `client` / `open-source` / `hackathon` | These are filtered out - not shown on cards |

</div>

Tech icon topics (auto-mapped to devicons): `react`, `nodejs`, `python`, `typescript`, `mongodb`, `tailwindcss`, and more.

### Project Card Images

Each project card and detail page displays a preview image fetched from **ImageKit**. If the ImageKit image is not found, it falls back to GitHub's auto-generated OpenGraph image.

```
1. ImageKit image  (custom screenshot you upload)
   https://ik.imagekit.io/username/foldername/{repoName}.png

2. GitHub OpenGraph image  (auto-generated fallback)
   https://opengraph.githubassets.com/1/username/{repo}
```

**To add a project preview image:**

1. Take a screenshot of your project
2. Name the file exactly as the **GitHub repo name** (e.g. `Library-Management-System.png`)
3. Upload to ImageKit under your folder
4. The card will automatically display the image - no code push needed

---

## Gist CMS - Experiences and Certificates

Content for the **About** page (experience cards, education, certificates) is managed via a **GitHub Gist** - no code push needed to add or edit cards.

### How it works

The app fetches a single JSON file from a private Gist at runtime. If the Gist is unreachable, it automatically falls back to hardcoded data so the site never breaks.

```
Gist URL > fetched on every page visit (cached 5 min)
         > fails?
Fallback data in gistContent.js (always shown instantly)
```

### Adding or editing a card

1. Go to your Gist: [https://gist.github.com/](https://gist.github.com/)
2. Open and **edit the existing gist** (do NOT create a new one)
3. Update the JSON for `experiences`, `certificates`, or `education`
4. Save - changes are live within **5 minutes**, no deploy needed
5. To update the offline fallback, also edit `FALLBACK_DATA` in `src/services/gistContent.js` and push

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
> - `duration` - short label shown next to date (e.g. `"2m"`, `"6m"`)
> - `stacks` - array of tech names; icons auto-resolved via Devicons CDN v2.16
> - `bullets` - shown only when the card is expanded (chevron toggle)

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

## Project Details - Gist CMS

Each project can have additional details (features, highlights, challenges) managed through a **separate Gist** without redeployment.

### How it works

```
/projects/:repoName  >  fetches project-details.json from Gist
                     >  displays Overview, Tech, Features, Highlights, Challenges
                     >  cached 5 minutes
```

**Gist URL:** `https://gist.githubusercontent.com/RajHarsh03/d9dafa7d57b7af090604cc06f0e69c9f/raw/project-details.json`

### Project Details JSON Structure

```json
{
  "CropGaurd": {
    "features": [
      "AI-powered crop disease detection using MobileNetV2",
      "Upload leaf images to identify 18 different plant diseases",
      "Treatment recommendations for identified diseases",
      "Built with React, FastAPI and TensorFlow"
    ],
    "highlights": [
      "Achieved 95% accuracy in disease classification",
      "Processes images in under 2 seconds",
      "Supports multiple crop types"
    ],
    "challenges": [
      "Optimizing model size for faster inference",
      "Handling various image qualities and lighting conditions"
    ]
  },
  "Library-Management-System": {
    "features": ["..."],
    "highlights": ["..."],
    "challenges": ["..."]
  }
}
```

**Key:** Use the exact `repoName` from GitHub (matches the URL slug)\
**Fields:** All three arrays (`features`, `highlights`, `challenges`) are optional

### Route-Based Detail Pages

- Project cards show an **arrow button** that navigates to `/projects/:repoName`
- Detail page displays: large preview image, live/code buttons, tech tags, overview, features, highlights, challenges
- **Mobile optimizations:**
  - Buttons shown as small icons on mobile (358px, 324px)
  - Images use `object-fit: cover` with proper positioning
  - Incremental loading: 3 projects initially, load 3 more at a time
  - "Show Less" appears only when all projects loaded

---

## Spotify Now Playing Widget

The mini player in the **Hero** section on the home page shows the currently playing song (or last-played if nothing is active).

### How it works

```
GET /api/now-playing  >  { track: { title, artist, artwork, url }, isPlaying }
```

- Polls every **30 seconds** while the tab is visible
- **Last played persisted in `localStorage`** - no blank flash on page reload
- Falls back to production endpoint (`harshx.in/api/now-playing`) in local dev
- Clicking opens the track on Spotify

### Spotify setup

1. In the Spotify developer dashboard, register the redirect URI `http://127.0.0.1:5173/callback`.
2. Add `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` to `.env.local`.
3. Run `npm run dev` and open `http://127.0.0.1:5173/spotify-connect`. After you log in, the dev server writes `SPOTIFY_REFRESH_TOKEN` to `.env.local`.
4. Add `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN` to the Vercel environment variables.

---

## Visit Counter

Uses a Vercel serverless function at `/api/visits`:

```
POST /api/visits  >  Records unique daily visit (hashed IP + UA + date), returns total
GET  /api/visits  >  Returns total count without incrementing
```

Backed by **Upstash Redis** (Vercel KV). In local dev it reads from the live production endpoint so the counter is always visible.

- The browser POSTs once per session (`pf_visit_counted` in `sessionStorage`), and only POSTs from the site's own origins are accepted.
- Each visitor key is a SHA-256 hash of IP + user-agent + date (IST); a separate hash of the IP caps new visitors at 3 per IP per day. Both keys expire after 48 hours, and raw IPs are never stored.

---

## Contact Form (Resend)

The form on `/contact` POSTs JSON to a Vercel serverless function, which sends the email through the [Resend](https://resend.com) REST API:

```
POST /api/contact  { name, email, message, website }  >  { ok: true }
```

- Only POSTs from the site's own origins are accepted (localhost too, outside production). Other origins get `403`.
- Validation: name 1-100 characters, a valid email up to 254 characters, message 1-2000 characters. Invalid input gets `400`.
- `website` is a hidden honeypot field. If a bot fills it, the API answers `200` without sending anything.
- Rate limit: 3 messages per IP per hour, keyed by a SHA-256 hash of the IP in Upstash Redis (`contact_rl:*`, expires after 1 hour). Over the limit gets `429`. Without Redis credentials the limit is skipped.
- The email goes to `CONTACT_TO_EMAIL` from `CONTACT_FROM_EMAIL`, with `reply_to` set to the visitor, so replying in Gmail answers them directly. All user input is HTML-escaped.
- In local dev, `vite.config.js` serves the same `/api/contact` route from `.env.local`.

### Resend setup

1. In the [Resend dashboard](https://resend.com/domains), add and verify the sending domain (`harshx.in`) by adding the DNS records it lists.
2. Create an API key with **Sending access** (optionally limited to that domain).
3. Add `RESEND_API_KEY` (plus `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` if you want to override the defaults) to `.env.local` and to the Vercel environment variables. `CONTACT_FROM_EMAIL` must use the verified domain.
4. Restart `npm run dev`, send a test message from `/contact`, and check the inbox (and spam folder).

---

## Oneko Cat Companion

A playful cat sprite that follows your cursor around the page, powered by [nekojs](https://louisabraham.github.io/nekojs/). Loads lazily from CDN and automatically resumes after tab visibility changes or device sleep.

---

## Circular Favicon

The favicon is dynamically generated from your GitHub avatar - fetched, drawn as a circle on a canvas, and applied as the page favicon. Cached in `localStorage` to avoid re-fetching on every page load.

---

## License

```
MIT License - feel free to use as a reference or template.
A credit link back to harshx.in is appreciated but not required.
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=3b82f6&height=120&section=footer&animation=fadeIn" width="100%" />

Made by **[Harsh Raj](https://harshx.in)**

</div>
