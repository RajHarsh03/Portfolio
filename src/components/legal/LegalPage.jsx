import { Helmet } from 'react-helmet-async';
import { useReveal } from '../../hooks/useReveal.js';
import { useActiveSection } from '../../hooks/useActiveSection.js';

/**
 * LegalPage — shared shell for /privacy and /terms.
 *
 * It reuses the inner-page building blocks the rest of the site already uses:
 * `.projects-page-header` + `.section-label` + `.section-title` + the mono
 * `.projects-count-badge` for the header, and an About-style two-column grid
 * for the body. Only the table of contents and the prose styles are new.
 */
export default function LegalPage({
  seo,
  eyebrow,
  title,
  subtitle,
  updated,
  updatedIso,
  intro,
  sections,
  closing,
}) {
  const ref = useReveal();
  const activeId = useActiveSection(sections.map(section => section.id));

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.url} />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={seo.url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        {/* Helmet keeps <script> children verbatim — JSON-LD for rich results */}
        <script type="application/ld+json">{JSON.stringify(seo.structuredData)}</script>
      </Helmet>

      <div className="legal-page" ref={ref}>
        {/* Header — same anatomy as the Projects/About page headers */}
        <div className="projects-page-header">
          <div className="section-label">{eyebrow}</div>
          <div className="projects-header-row">
            <h1 className="section-title">{title}</h1>
            <span className="projects-count-badge">
              Last updated: <time dateTime={updatedIso}>{updated}</time>
            </span>
          </div>
          <p className="legal-lede reveal">{subtitle}</p>
        </div>

        <div className="legal-body">
          <aside className="legal-toc-col">
            {/* role="navigation" rather than <nav> — the global `nav { position: fixed }`
                navbar rule targets the bare element and would fling this rail to the top. */}
            <div className="legal-toc" role="navigation" aria-label="On this page">
              <p className="legal-toc-title">On this page</p>
              <LegalTocList sections={sections} activeId={activeId} />
            </div>
          </aside>

          <div className="legal-content">
            {intro && <div className="legal-summary reveal">{intro}</div>}

            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="legal-section"
                tabIndex={-1}
                aria-labelledby={`${section.id}-title`}
              >
                <h2 id={`${section.id}-title`} className="legal-section-title">
                  <span className="legal-section-num" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.heading}
                </h2>
                {section.body}
              </section>
            ))}

            {closing && <div className="legal-closing">{closing}</div>}
          </div>
        </div>
      </div>
    </>
  );
}

/** Numbered contents list for the desktop table of contents rail. */
function LegalTocList({ sections, activeId }) {
  return (
    <ol className="legal-toc-list">
      {sections.map((section, index) => {
        const isActive = activeId === section.id;
        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`legal-toc-link${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'location' : undefined}
            >
              <span className="legal-toc-num" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {section.toc}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
