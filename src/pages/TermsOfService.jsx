import { Link } from 'react-router-dom';
import LegalPage from '../components/legal/LegalPage.jsx';

const UPDATED      = 'October 2026';
const UPDATED_ISO  = '2026-10-28';
const EMAIL        = 'rajharsh.devx@gmail.com';

const SEO = {
  title: 'Terms of Service | harshx.in',
  description: 'Terms of Service governing the use of harshx.in.',
  url: 'https://harshx.in/terms',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Terms of Service',
    headline: 'Terms of Service for harshx.in',
    description: 'The terms that apply when you browse harshx.in, sign in to the guestbook, or post a note on it.',
    url: 'https://harshx.in/terms',
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
    id: 'acceptance-of-terms',
    toc: 'Acceptance of Terms',
    heading: 'Acceptance of Terms',
    body: (
      <>
        <p className="legal-para">
          Use harshx.in and these Terms apply. They're light while you're reading, and a
          little more specific once you sign in and post. If you don't agree with them, please
          don't use the site.
        </p>
        <p className="legal-para">
          This is a personal project rather than a company, so the aim here is a working wall
          and a readable portfolio, not a contract that traps you.
        </p>
      </>
    ),
  },
  {
    id: 'about-harshx-in',
    toc: 'About harshx.in',
    heading: 'About harshx.in',
    body: (
      <>
        <p className="legal-para">
          harshx.in is my portfolio: projects, an about page, a public guestbook, and a way to
          contact me. Some of the numbers and pictures on it come live from other services, so
          they belong to whoever runs those.
        </p>
      </>
    ),
  },
  {
    id: 'accounts-and-sign-in',
    toc: 'Accounts & Sign-In',
    heading: 'User Accounts & Sign-In',
    body: (
      <>
        <p className="legal-para">
          There's no password to make here. Sign in with Google through Clerk, the sign-in
          service the guestbook uses, and you have a guestbook identity. I{' '}
          <mark className="legal-mark">never receive your Google password</mark>. Google only
          shares the basic profile information you authorize during sign-in.
        </p>
        <p className="legal-para">
          You're responsible for anything posted from your account. Signing in is optional -
          the whole site reads fine without it - and signing out is one press away. Your Google
          account itself stays under Google's terms, and your sign-in account under Clerk's.
        </p>
      </>
    ),
  },
  {
    id: 'guestbook-rules',
    toc: 'Guestbook Rules',
    heading: 'Guestbook Rules & Acceptable Use',
    body: (
      <>
        <p className="legal-para">Please don't post:</p>
        <ul className="legal-list">
          <li>anything unlawful, harmful, threatening, abusive, harassing, defamatory, hateful, sexually explicit, or encouraging illegal activity;</li>
          <li>material aimed at another person, or revealing their personal details;</li>
          <li>impersonations of any person or organisation, or content you have no right to share;</li>
          <li>spam, promotional links, scams, or notes posted in bulk.</li>
        </ul>
        <p className="legal-para">
          Don't try to get into the site, its services, or its hosting without permission, and
          don't flood it with automated requests or repeated sign-ins. Don't copy, reproduce,
          sell, or present the site's design or content as your own without permission.
        </p>
        <p className="legal-para">
          The site is here to be read, and the wall is here for a decent note. Anything beyond
          that counts as <mark className="legal-mark">misuse</mark>.
        </p>
      </>
    ),
  },
  {
    id: 'user-responsibilities',
    toc: 'User Responsibilities',
    heading: 'User Responsibilities',
    body: (
      <>
        <ul className="legal-list">
          <li><strong>Notes are <mark className="legal-mark">public</mark>.</strong> Every visitor can read the wall, and search engines may index it.</li>
          <li>
            <strong>What you write stays yours.</strong> Posting a note just gives me
            permission to display it here while it remains up.
          </li>
          <li>
            <strong>Moderation is mine.</strong> I can pin or remove any note as I see fit,
            with or without notice, and I don't promise a note stays online.
          </li>
          <li>
            <strong>You are responsible for the content you post</strong> and for any claims or
            disputes arising from it.
          </li>
          <li>
            <strong>The wall isn't a private channel.</strong> Use the{' '}
            <Link to="/contact" className="legal-inline-link">contact page</Link> for anything
            you'd rather send to me directly.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    toc: 'Intellectual Property',
    heading: 'Intellectual Property',
    body: (
      <>
        <p className="legal-para">
          The design, code, writing, and layout here are mine unless a third party is credited.
          Individual projects may carry their own open-source licence, which the linked
          repository explains better than I can.
        </p>
        <p className="legal-para">
          You may view the site, link to it, and quote reasonable portions with appropriate
          attribution. You may{' '}
          <mark className="legal-mark">not reproduce, republish, sell, or present the site's
          design or content as your own</mark> without permission.
        </p>
        <p className="legal-para">
          Names and logos belonging to others appear only to describe work honestly, and they
          stay their owners' property. If something here infringes your rights, email me and
          I'll look into it.
        </p>
      </>
    ),
  },
  {
    id: 'third-party-services',
    toc: 'Third-Party Services',
    heading: 'Third-Party Services',
    body: (
      <>
        <p className="legal-para">
          The site leans on services I don't control: Clerk (sign-in), Google (as a sign-in
          option), Supabase (the guestbook database), EmailJS, GitHub, Spotify, Upstash, and
          Vercel. Each comes with its own terms and privacy policy.
        </p>
        <p className="legal-para">
          Links take you away from harshx.in, and once you're there the destination sets the
          rules.
        </p>
      </>
    ),
  },
  {
    id: 'website-availability',
    toc: 'Availability',
    heading: 'Website Availability',
    body: (
      <>
        <p className="legal-para">
          I keep this site up on a best-effort basis. It can go down for maintenance, a bad
          deployment, or an outage at one of my providers, and features may appear, change, or
          disappear without notice. Because parts of it depend on outside services, something
          may occasionally look outdated or simply stop working.
        </p>
      </>
    ),
  },
  {
    id: 'disclaimer',
    toc: 'Disclaimer',
    heading: 'Disclaimer',
    body: (
      <>
        <p className="legal-para">
          As far as the law allows, this site comes as it is, with{' '}
          <mark className="legal-mark">no warranties of any kind</mark>, express or implied,
          including accuracy, completeness, and fitness for a particular purpose. I don't
          promise it will run without interruption or errors, and I don't
          vouch for figures pulled in from third parties.
        </p>
      </>
    ),
  },
  {
    id: 'limitation-of-liability',
    toc: 'Limitation of Liability',
    heading: 'Limitation of Liability',
    body: (
      <>
        <p className="legal-para">
          As far as the law allows, I'm not liable for indirect or consequential loss,
          including lost data or lost profits, from your use of the site, from something
          another visitor posted, or from the services the site depends on.
        </p>
        <p className="legal-para">
          Nothing here excludes liability that can't lawfully be excluded, or{' '}
          <mark className="legal-mark">your statutory rights as a consumer</mark>.
        </p>
      </>
    ),
  },
  {
    id: 'access-termination',
    toc: 'Termination',
    heading: 'Account & Access Termination',
    body: (
      <>
        <p className="legal-para">
          You can walk away at any time, and signing out ends your session. Email me if you
          want your notes or your sign-in account removed as well. If these terms are
          broken, access to the guestbook features can be withdrawn and notes can be removed.
          If you've already asked me to delete your information, I'll still honour that, however
          your access ended.
        </p>
        <p className="legal-para">
          The parts that should outlast your visit - intellectual property, disclaimers, and
          liability limits - keep applying.
        </p>
      </>
    ),
  },
  {
    id: 'changes-to-terms',
    toc: 'Changes to Terms',
    heading: 'Changes to These Terms',
    body: (
      <>
        <p className="legal-para">
          I may update these Terms as the site grows. The date at the top marks the current
          version, and using the site after an update means you accept it. This page stays
          published at <code>/terms</code> so you can come back to it.
        </p>
      </>
    ),
  },
  {
    id: 'governing-law',
    toc: 'Governing Law',
    heading: 'Governing Law & Jurisdiction',
    body: (
      <>
        <p className="legal-para">
          These Terms are governed by{' '}
          <mark className="legal-mark">the laws of the Republic of India</mark>. Subject to
          applicable law, disputes relating to these Terms or your use of the site will be
          subject to the jurisdiction of the courts of Kolkata, West Bengal, India.
        </p>
        <p className="legal-para">
          If one part of these Terms turns out to be unenforceable, the rest still stands.
        </p>
      </>
    ),
  },
  {
    id: 'contact-information',
    toc: 'Contact Information',
    heading: 'Contact Information',
    body: (
      <>
        <p className="legal-para">
          Questions about these Terms or the use of harshx.in can be sent to:
        </p>
        <ul className="legal-list">
          <li>Email: <a href={`mailto:${EMAIL}`} className="legal-inline-link">{EMAIL}</a></li>
          <li>Contact form: <Link to="/contact" className="legal-inline-link">/contact</Link></li>
        </ul>
      </>
    ),
  },
];

export default function TermsOfService() {
  return (
    <LegalPage
      seo={SEO}
      eyebrow="// legal"
      title="Terms of Service"
      subtitle="Ground rules for the portfolio, and for the guestbook wall if you decide to post."
      updated={UPDATED}
      updatedIso={UPDATED_ISO}
      sections={SECTIONS}
      intro={
        <p className="legal-para">
          Nothing here is written to catch you out. Read the site freely. Sign in only if you
          want to put something on the wall, and remember that the wall is public and that I
          keep it tidy.
        </p>
      }
      closing={
        <p className="legal-para">
          For how information is handled here, read the{' '}
          <Link to="/privacy" className="legal-inline-link">Privacy Policy</Link>.
        </p>
      }
    />
  );
}
