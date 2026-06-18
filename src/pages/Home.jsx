import { Helmet } from 'react-helmet-async';
import Hero            from '../components/home/Hero.jsx';
import About           from '../components/home/About.jsx';
import JourneyPreview  from '../components/home/JourneyPreview.jsx';
import Skills          from '../components/home/Skills.jsx';
import FeaturedProjects from '../components/home/FeaturedProjects.jsx';
import GitHubHeatmap   from '../components/home/GitHubHeatmap.jsx';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Welcome Guzzzz!</title>
        <meta name="description" content="Full Stack Engineer crafting scalable web apps with React, Node.js & TypeScript." />
      </Helmet>

      <Hero />
      <About />
      <JourneyPreview />
      <Skills />
      <FeaturedProjects />
      <GitHubHeatmap />
    </>
  );
}
