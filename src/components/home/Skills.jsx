import { useReveal } from '../../hooks/useReveal.js';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

const FRONTEND = [
  { icon: `${DEVICON}/javascript/javascript-original.svg`, label: 'JavaScript' },
  { icon: `${DEVICON}/html5/html5-original.svg`,           label: 'HTML5' },
  { icon: `${DEVICON}/css3/css3-original.svg`,             label: 'CSS3' },
  { icon: `${DEVICON}/react/react-original.svg`,           label: 'React.js' },
  { icon: `${DEVICON}/tailwindcss/tailwindcss-original.svg`, label: 'Tailwind' },
  { icon: `${DEVICON}/cplusplus/cplusplus-original.svg`,   label: 'C / C++' },
  { icon: `${DEVICON}/python/python-original.svg`,         label: 'Python' },
  { icon: `${DEVICON}/bootstrap/bootstrap-original.svg`,   label: 'Bootstrap' },
];

const TOOLS = [
  { icon: `${DEVICON}/git/git-original.svg`,               label: 'Git' },
  { icon: `${DEVICON}/github/github-original.svg`,         label: 'GitHub' },
  { icon: `${DEVICON}/mysql/mysql-original.svg`,           label: 'MySQL' },
  { icon: `${DEVICON}/mongodb/mongodb-original.svg`,       label: 'MongoDB' },
  { icon: `${DEVICON}/linux/linux-original.svg`,           label: 'Linux' },
  { icon: `${DEVICON}/vscode/vscode-original.svg`,         label: 'VS Code' },
  { icon: `${DEVICON}/jupyter/jupyter-original.svg`,       label: 'Jupyter' },
  { icon: `${DEVICON}/numpy/numpy-original.svg`,           label: 'NumPy' },
];

/** Renders one ticker row — items duplicated for seamless loop */
function TickerRow({ items, direction = 'rtl' }) {
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrap">
      <div className={`ticker-track ${direction}`}>
        {doubled.map((item, i) => (
          <div className="skill-box" key={i}>
            <img src={item.icon} alt={item.label} loading="lazy" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useReveal();

  return (
    <section id="skills" ref={ref}>
      <div className="section-label">// what i work with</div>
      <h2 className="section-title reveal">Tech Stack</h2>

      <div className="skills-ticker-section">
        <div>
          <div className="skill-group-label">Frontend &amp; Languages</div>
          <TickerRow items={FRONTEND} direction="rtl" />
        </div>
        <div>
          <div className="skill-group-label">Database &amp; Tools</div>
          <TickerRow items={TOOLS} direction="ltr" />
        </div>
      </div>
    </section>
  );
}
