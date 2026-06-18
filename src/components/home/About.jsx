import { useReveal } from '../../hooks/useReveal.js';

export default function About() {
  const ref = useReveal();

  return (
    <section id="about" ref={ref}>
      <div className="about-grid">
        <div className="about-text reveal">
          <div className="section-label">// about me</div>
          <h2 className="section-title">Building things for the web</h2>
          <p>
            I'm an aspiring <em>Full Stack Developer</em> with a passion for building products
            that are both functional and delightful.
          </p>
          <p>
            Currently focused on <em>React</em>, <em>Node.js</em>, and Machine Learning.
            I love working on challenging problems that push the boundaries of what's possible.
          </p>
        </div>
      </div>
    </section>
  );
}
