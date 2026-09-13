const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

const ROW1 = [
  { icon: `${DEVICON}/python/python-original.svg`,           label: 'Python' },
  { icon: `${DEVICON}/cplusplus/cplusplus-original.svg`,     label: 'C++' },
  { icon: `${DEVICON}/javascript/javascript-original.svg`,   label: 'JavaScript' },
  { icon: `${DEVICON}/typescript/typescript-original.svg`,   label: 'TypeScript' },
  { icon: `${DEVICON}/react/react-original.svg`,             label: 'React' },
  { icon: `${DEVICON}/nodejs/nodejs-original.svg`,           label: 'Node.js' },
  { icon: `${DEVICON}/tailwindcss/tailwindcss-original.svg`, label: 'Tailwind' },
  { icon: `${DEVICON}/html5/html5-original.svg`,             label: 'HTML5' },
  { icon: `${DEVICON}/css3/css3-original.svg`,               label: 'CSS3' },
  { icon: `${DEVICON}/tensorflow/tensorflow-original.svg`,   label: 'TensorFlow' },
  { icon: `${DEVICON}/pytorch/pytorch-original.svg`,         label: 'PyTorch' },
  { icon: `${DEVICON}/scikitlearn/scikitlearn-original.svg`, label: 'Scikit-learn' },
];

const ROW2 = [
  { icon: `${DEVICON}/git/git-original.svg`,                 label: 'Git' },
  { icon: `${DEVICON}/github/github-original.svg`,           label: 'GitHub' },
  { icon: `${DEVICON}/mysql/mysql-original.svg`,             label: 'MySQL' },
  { icon: `${DEVICON}/mongodb/mongodb-original.svg`,         label: 'MongoDB' },
  { icon: `${DEVICON}/docker/docker-original.svg`,           label: 'Docker' },
  { icon: `${DEVICON}/linux/linux-original.svg`,             label: 'Linux' },
  { icon: `${DEVICON}/jupyter/jupyter-original.svg`,         label: 'Jupyter' },
  { icon: `${DEVICON}/numpy/numpy-original.svg`,             label: 'NumPy' },
  { icon: `${DEVICON}/pandas/pandas-original.svg`,           label: 'Pandas' },
  { icon: `${DEVICON}/fastapi/fastapi-original.svg`,         label: 'FastAPI' },
  { icon: `${DEVICON}/express/express-original.svg`,         label: 'Express' },
  { icon: `${DEVICON}/vscode/vscode-original.svg`,           label: 'VS Code' },
];

function TickerRow({ items, direction = 'rtl' }) {
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrap">
      <div className={`ticker-track ${direction}`}>
        {doubled.map((item, i) => (
          <div className="skill-box icon-only" key={i}>
            <img src={item.icon} alt={item.label} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" aria-label="Tech stack">
      <div className="skills-ticker-section icon-strip">
        <TickerRow items={ROW1} direction="rtl" />
        <TickerRow items={ROW2} direction="ltr" />
      </div>
    </section>
  );
}
