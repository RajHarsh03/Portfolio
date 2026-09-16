import { Helmet } from 'react-helmet-async';
import Hero            from '../components/home/Hero.jsx';
import InfoStrip       from '../components/home/InfoStrip.jsx';
import Skills          from '../components/home/Skills.jsx';
import FeaturedProjects from '../components/home/FeaturedProjects.jsx';
import GitHubHeatmap   from '../components/home/GitHubHeatmap.jsx';
import EducationCerts  from '../components/home/EducationCerts.jsx';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Welcome Guzzzz!</title>
        <meta name="description" content="Full Stack Engineer crafting scalable web apps with React, Node.js & TypeScript." />
      </Helmet>

      <Hero />
      <InfoStrip />
      <Skills />
      <EducationCerts />
      <FeaturedProjects />
      <GitHubHeatmap />
      <section className="guestbook-home-cta" aria-label="Guestbook invitation">
        <p>Have a thought to share? Leave a message and become part of this little corner of the internet.</p>
        <a href="/guestbook" className="guestbook-preview-link">
          <span>Open guestbook</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      </section>
    </>
  );
}
