import { useEffect } from 'react';

export default function CertModal({ cert, onClose }) {
  // Close on Escape or scroll
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose(); }
    function handleScroll() { onClose(); }
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onClose]);

  return (
    <div className="cert-modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="cert-modal" onClick={e => e.stopPropagation()}>

        {/* Accent top bar */}
        <div className="cert-modal-top-bar" />

        {/* Close */}
        <button className="cert-modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Icon */}
        <div className="cert-modal-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="cert-modal-title">{cert.title}</h2>
        <div className="cert-modal-issuer">{cert.issuer?.toUpperCase()}</div>

        {/* Meta row */}
        <div className="cert-modal-meta">
          {cert.date && (
            <div className="cert-modal-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="14" height="14"
                style={{ color: '#f59e0b', flexShrink: 0 }}>
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <div>
                <div className="cert-modal-meta-label">ISSUED</div>
                <div className="cert-modal-meta-value">{cert.date}</div>
              </div>
            </div>
          )}
          {cert.label && (
            <div className="cert-modal-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="14" height="14"
                style={{ color: '#f59e0b', flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <div className="cert-modal-meta-label">TYPE</div>
                <div className="cert-modal-meta-value">{cert.label}</div>
              </div>
            </div>
          )}
        </div>

        {/* Description + desc */}
        {cert.desc && (
          <div className="cert-modal-desc-wrap">
            <div className="cert-modal-desc-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="12" height="12"
                style={{ color: '#f59e0b' }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              SKILLS &amp; CORE LEARNING
            </div>
            <p className="cert-modal-desc">{cert.desc}</p>
          </div>
        )}

        {/* Verify button */}
        {cert.link && (
          <a href={cert.link} target="_blank" rel="noopener noreferrer"
            className="cert-modal-verify">
            Verify with Credentials ↗
          </a>
        )}
      </div>
    </div>
  );
}
