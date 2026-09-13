import { Helmet } from 'react-helmet-async';
import Hero            from '../components/home/Hero.jsx';
import InfoStrip       from '../components/home/InfoStrip.jsx';
import JourneyPreview  from '../components/home/JourneyPreview.jsx';
import Skills          from '../components/home/Skills.jsx';
import FeaturedProjects from '../components/home/FeaturedProjects.jsx';
import GitHubHeatmap   from '../components/home/GitHubHeatmap.jsx';
import EducationCerts  from '../components/home/EducationCerts.jsx';
import HomeContact     from '../components/home/HomeContact.jsx';
import QuoteStrip      from '../components/home/QuoteStrip.jsx';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Welcome Guzzzz!</title>
        <meta name="description" content="Full Stack Engineer crafting scalable web apps with React, Node.js & TypeScript." />
      </Helmet>

      <Hero />
      <InfoStrip />
      <JourneyPreview />
      <Skills />
      <FeaturedProjects />
      <GitHubHeatmap />
      <EducationCerts />
      <HomeContact />
      <QuoteStrip />
    </>
  );
}
