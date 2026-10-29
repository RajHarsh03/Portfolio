import { Link } from 'react-router-dom';
import LegalPage from '../components/legal/LegalPage.jsx';

const UPDATED      = 'October 2026';
const UPDATED_ISO  = '2026-10-28';
const EMAIL        = 'rajharsh.devx@gmail.com';

const SEO = {
  title: 'Privacy Policy | harshx.in',
  description: 'Privacy Policy for harshx.in explaining how user information is collected, used, and protected.',
  url: 'https://harshx.in/privacy',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'PrivacyPolicy',
    name: 'Privacy Policy',
    headline: 'Privacy Policy for harshx.in',
    description: 'How harshx.in collects, uses, and protects information when you browse the site or sign in to the guestbook.',
    url: 'https://harshx.in/privacy',
    dateModified: UPDATED_ISO,
    inLanguage: 'en',
    publisher: {
      '@type': 'Person',
      name: 'Harsh Raj',
      url: 'https://harshx.in',
      email: EMAIL,
    },
  },
};

const SECTIONS = [
  {
    id: 'information-we-collect',
    toc: 'Information We Collect',
    heading: 'Information We Collect',
    body: (
      <>
        <p className="legal-para">
          harshx.in is my portfolio. Almost all of it works without an account, a form, or a
          single detail from you. I collect information only when you choose to do one of
          three things: sign in, post a note, or send me a message.
        </p>

        <h3 className="legal-subtitle">Sign-in account information</h3>
        <p className="legal-para">
          Guestbook sign-in is handled by Clerk. Sign in with Google and, once you approve it,
          Google passes your basic profile to Clerk: your name, email address, and profile
          picture. Clerk keeps these in an account record with a unique user ID. I{' '}
          <mark className="legal-mark">never see your Google password</mark>, and I have no way
          to ask for it.
        </p>

        <h3 className="legal-subtitle">Guestbook information</h3>
        <p className="legal-para">
          The note you write, plus the name and picture shown beside it, your Clerk user ID, the
          time it went up, and a record of who liked it so one person cannot like the same note
          twice. Your email address is not saved with your note.
        </p>

        <h3 className="legal-subtitle">Contact form information</h3>
        <p className="legal-para">
          Your name, your email, and your message. The site's own server function passes them
          to Resend, which delivers them to my inbox so I can answer them. Nothing else happens
          with them. To stop spam, the server also keeps a short hash of your IP address that
          limits how many messages one network can send, and it expires after about an hour.
        </p>

        <h3 className="legal-subtitle">Visitor counting</h3>
        <p className="legal-para">
          The strip above the footer shows a running total of visitors. To count each visitor
          roughly once a day, the server keeps a short hash made from your IP address, browser
          user-agent, and the date, plus a separate hash of your IP address that limits how
          many visitors one network can add in a day. Both hashes expire after about 48
          hours. <mark className="legal-mark">The raw IP address is not stored</mark> or linked
          to your account.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use-information',
    toc: 'How We Use Information',
    heading: 'How We Use Information',
    body: (
      <>
        <p className="legal-para">
          Every item above does one job: keeping the site working the way you expect it to.
        </p>
        <ul className="legal-list">
          <li>Recognise you when you sign in, and keep you signed in while you use the Guestbook.</li>
          <li>Show your note with the right name and picture.</li>
          <li>Let you like notes, and stop duplicate likes.</li>
          <li>Tell the site owner and visitors apart, so the wall stays moderated.</li>
          <li>Answer messages you send through the contact page.</li>
          <li>Keep the site secure, and debug whatever breaks.</li>
          <li>Decide what to build next, based on rough visitor numbers.</li>
        </ul>
        <p className="legal-para">
          I don't use your information for{' '}
          <mark className="legal-mark">advertising, profiling, or automated decisions</mark>.
        </p>
      </>
    ),
  },
  {
    id: 'guestbook-sign-in',
    toc: 'Guestbook Sign-In',
    heading: 'Guestbook Sign-In',
    body: (
      <>
        <p className="legal-para">
          The Guestbook uses Clerk so you can leave a note without making yet another password.
          Press sign in and a Clerk sign-in window opens, with Google as the way in. You decide
          whether to continue, and nothing happens if you don't. Only basic profile information
          is requested. While you sign in or sign up, Clerk may run a quick automated bot check
          through Cloudflare Turnstile.
        </p>
        <p className="legal-para">
          You can revoke this site whenever you like from the security settings in your Google
          Account. Google's own Privacy Policy covers your Google account and what Google shares
          during sign-in, and Clerk's Privacy Policy covers the account record Clerk keeps.
        </p>
      </>
    ),
  },
  {
    id: 'clerk-and-supabase',
    toc: 'Clerk & Supabase',
    heading: 'Clerk & Supabase',
    body: (
      <>
        <p className="legal-para">
          Clerk creates the account record that stands in for you here and manages your
          session, which is why this site never handles a password of its own. Your notes and
          likes live in a Supabase Postgres database. Each request your browser makes to it
          carries your Clerk session token, and the database checks that token before it lets
          you post or like anything. New notes, likes, and pins reach anyone with the
          Guestbook open straight away, through Supabase Realtime.
        </p>
      </>
    ),
  },
  {
    id: 'data-storage-services',
    toc: 'Storage & Services',
    heading: 'Data Storage & Third-Party Services',
    body: (
      <>
        <p className="legal-para">
          harshx.in runs on a handful of services. Each does one job:
        </p>
        <ul className="legal-list">
          <li><strong>Clerk</strong> - guestbook sign-in, account records, and sessions.</li>
          <li><strong>Google</strong> - the sign-in option offered in the Clerk window.</li>
          <li><strong>Supabase</strong> - the database that holds guestbook notes and likes.</li>
          <li><strong>Vercel</strong> - hosting for the site, plus the small server functions behind the visitor total, the music widget, and the contact form.</li>
          <li><strong>Upstash</strong> - stores the counter behind the visitor total and the contact form's hourly message limit.</li>
          <li><strong>Resend</strong> - delivers contact-form messages to my inbox. The site's own server sends them, so your browser doesn't contact it.</li>
          <li><strong>GitHub</strong> - public information such as my repositories and profile picture, and the Gists that hold some page content.</li>
          <li><strong>Spotify</strong> - the song I'm listening to. The site's own server asks Spotify, so your browser doesn't contact it.</li>
          <li><strong>Open-Meteo</strong> - the current temperature in Kolkata on the home page.</li>
        </ul>
        <p className="legal-para">
          Loading a page also pulls fonts from Google Fonts, icons from jsDelivr, project images from ImageKit, the cat animation script from GitHub
          Pages, and contribution data from a public GitHub contributions API. Each of them
          keeps its own technical logs under its own privacy policy. Outside these, your
          information doesn't go anywhere.
        </p>
      </>
    ),
  },
  {
    id: 'data-sharing',
    toc: 'Data Sharing',
    heading: 'Data Sharing',
    body: (
      <>
        <p className="legal-para">
          <strong>I don't <mark className="legal-mark">sell, rent, or trade</mark> personal
          information.</strong> It is processed
          only by the services above, so the site can function. There are no advertisers, data
          brokers, analytics vendors, or tracking scripts on harshx.in.
        </p>
        <p className="legal-para">Two things you should know:</p>
        <ul className="legal-list">
          <li>
            The guestbook wall is public. Anyone who visits it can read a note along with the
            name and picture attached to it.
          </li>
          <li>
            I'll disclose information if the law asks me to, or where it's needed to protect
            the site from abuse.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies-and-storage',
    toc: 'Cookies & Browser Storage',
    heading: 'Cookies & Browser Storage',
    body: (
      <>
        <p className="legal-para">
          harshx.in uses <mark className="legal-mark">no analytics or advertising cookies</mark>.
          The cookies it does use come from Clerk, which loads with every page so it knows
          whether you're signed in. Clerk sets the cookies it needs for authentication on
          harshx.in and its sign-in subdomain, mainly to keep your Guestbook session going
          after you sign in. Google may set its own cookies inside its sign-in window, and
          Cloudflare may do the same during the bot check.
        </p>
        <p className="legal-para">
          The site also keeps a few small things in your browser's storage:
        </p>
        <ul className="legal-list">
          <li>Your theme choice (<code>pf-theme</code>).</li>
          <li>
            Short-lived copies of content so pages load faster: GitHub projects, profile and
            favicon, Gist content, guestbook notes, and the last song shown in the music widget.
          </li>
          <li>
            For the current tab only: a flag so your visit is counted once per session
            (<code>pf_visit_counted</code>), the quote on display, and a short flag that shows a
            confirmation after you sign in.
          </li>
        </ul>
        <p className="legal-para">
          Clear them whenever you like in your browser settings. All that does is sign you out
          and reset these preferences.
        </p>
      </>
    ),
  },
  {
    id: 'data-security',
    toc: 'Data Security',
    heading: 'Data Security',
    body: (
      <>
        <p className="legal-para">
          Everything runs over HTTPS, and the database uses Row Level Security rules that check
          your Clerk session before deciding what you may write. Anyone can read the wall. A
          signed-in visitor can post a note and like each note once. Visitors cannot edit or
          remove posted notes, and only I can pin or delete them.{' '}
          <mark className="legal-mark">The site itself never handles or stores a
          password</mark>.
        </p>
        <p className="legal-note">
          No site can promise complete security, and guestbook notes are public by design.
          Please don't post phone numbers, addresses, or anything else you'd rather keep
          private. For that, use the contact page or email me.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    toc: 'Your Rights & Deletion',
    heading: 'Your Rights & Data Deletion',
    body: (
      <>
        <p className="legal-para">Email me and I'll:</p>
        <ul className="legal-list">
          <li>Confirm what personal information of yours is on the site.</li>
          <li>Correct it - usually by taking your note down so you can post a better one.</li>
          <li>
            Delete it. Tell me which notes and I'll remove them along with their like records,
            and on request I'll also delete your Clerk account record (your name, email, and
            picture), <mark className="legal-mark">within 30 days</mark>.
          </li>
          <li>
            Stop collecting anything further. Sign out, clear site data, or simply browse
            without signing in.
          </li>
        </ul>
        <p className="legal-para">
          What Google holds about you stays under Google's controls. There's no sale of
          personal data to opt out of, and no automated decision-making to appeal.
        </p>
      </>
    ),
  },
  {
    id: 'childrens-privacy',
    toc: "Children's Privacy",
    heading: "Children's Privacy",
    body: (
      <>
        <p className="legal-para">
          harshx.in is not directed at children, and I do not knowingly collect personal
          information from children under 16. If you believe a child has provided personal
          information through the site, please contact me so I can remove it.
        </p>
      </>
    ),
  },
  {
    id: 'policy-updates',
    toc: 'Changes to This Policy',
    heading: 'Changes to This Policy',
    body: (
      <>
        <p className="legal-para">
          The date at the top of the page is when this version was last revised. When
          something that touches your data changes, this page changes with it and the date
          moves. Keep using the site after that, and you're accepting the current version.
        </p>
        <p className="legal-para">
          The page stays published at <code>/privacy</code> so you can come back to it.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    toc: 'Contact',
    heading: 'Contact',
    body: (
      <>
        <p className="legal-para">
          Questions, requests, or complaints about privacy can be sent to:
        </p>
        <ul className="legal-list">
          <li>Email: <a href={`mailto:${EMAIL}`} className="legal-inline-link">{EMAIL}</a></li>
          <li>Contact form: <Link to="/contact" className="legal-inline-link">/contact</Link></li>
        </ul>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      seo={SEO}
      eyebrow="// legal"
      title="Privacy Policy"
      subtitle="What harshx.in knows about you, where it keeps it, and how to get it removed."
      updated={UPDATED}
      updatedIso={UPDATED_ISO}
      sections={SECTIONS}
      intro={
        <p className="legal-para">
          harshx.in is one developer's portfolio. It makes nothing from your data and mostly
          would rather not have it. The site reads fine without an account - sign-in only
          enters the picture if you choose to leave a note on the guestbook wall.
        </p>
      }
      closing={
        <p className="legal-para">
          The <Link to="/terms" className="legal-inline-link">Terms of Service</Link> sit
          alongside this policy and cover how the site may be used.
        </p>
      }
    />
  );
}
