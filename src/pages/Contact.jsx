import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useReveal } from '../hooks/useReveal.js';

const EMAILJS_SERVICE_ID  = 'service_gb3gqr6';
const EMAILJS_TEMPLATE_ID = 'template_ngboxe4';
const EMAILJS_PUBLIC_KEY  = 'f-P9D7rMpesYc3TAk';

export default function Contact() {
  const ref = useReveal();
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const ejsLoaded             = useRef(false);

  useEffect(() => {
    if (ejsLoaded.current || window.emailjs) { ejsLoaded.current = true; return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); ejsLoaded.current = true; };
    document.head.appendChild(s);
  }, []);

  function set(f) { return e => setForm(p => ({ ...p, [f]: e.target.value })); }

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: form.name, from_email: form.email,
        reply_to: form.email, subject: 'Message from portfolio',
        message: form.message, to_name: 'Harsh Raj',
      });
      setSent(true);
      setForm({ name: '', email: '', message: '' });
      // Auto-hide success message after 2 seconds
      setTimeout(() => setSent(false), 2000);
    } catch {
      // silent fail
    } finally { setSending(false); }
  }

  return (
    <>
      <Helmet>
        <title>Contact — Harsh Raj</title>
        <meta name="description" content="Get in touch with Harsh Raj for collaborations, freelance work, or just a good tech chat." />
      </Helmet>

      <section id="home-contact" ref={ref} style={{ paddingTop: '4.5rem' }}>
        <div className="container">
          <div className="section-label reveal">// let's connect</div>
          <h2 className="section-title reveal">Let's Work Together</h2>

          <div className="socials reveal" style={{ marginBottom: '1.5rem' }}>
            <a href="https://x.com/RajHarsh03" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span className="social-link-text">Twitter</span>
            </a>
            <a href="https://www.linkedin.com/in/rajharsh03" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              <span className="social-link-text">LinkedIn</span>
            </a>
            <a href="https://github.com/RajHarsh03" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              <span className="social-link-text">GitHub</span>
            </a>
            <a href="mailto:rajharsh.devx@gmail.com" className="social-link social-link--mobile-only">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
              <span className="social-link-text">Email</span>
            </a>

          </div>

          <div className="hc-grid">
            {/* Left — Get in touch */}
            <div className="hc-left reveal">
              <div className="hc-card">
                <div>
                  <h3 className="hc-card-title">Get in touch</h3>
                  <p className="hc-card-sub">Choose your preferred method to connect and let's discuss your project.</p>

                  <div className="hc-links">
                    <a href="https://cal.com/rajharsh03/one-to-one" target="_blank" rel="noopener noreferrer" className="hc-link-row">
                      <span className="hc-link-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <rect x="3" y="4" width="18" height="18" rx="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </span>
                      <div className="hc-link-text">
                        <div className="hc-link-title">Book a quick chat</div>
                        <div className="hc-link-desc">Discuss code, projects, or just say hello</div>
                      </div>
                      <span className="hc-link-arrow">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17L17 7"/>
                          <path d="M7 7h10v10"/>
                        </svg>
                      </span>
                    </a>

                    <a href="mailto:rajharsh.devx@gmail.com" className="hc-link-row">
                      <span className="hc-link-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <rect x="2" y="4" width="20" height="16" rx="2"/>
                          <polyline points="2,4 12,13 22,4"/>
                        </svg>
                      </span>
                      <div className="hc-link-text">
                        <div className="hc-link-title">Write an email</div>
                        <div className="hc-link-desc">For collaborations or quick questions</div>
                      </div>
                      <span className="hc-link-arrow">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17L17 7"/>
                          <path d="M7 7h10v10"/>
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>

                <div className="hc-stats">
                  <div className="hc-stat-item">
                    <div className="hc-stat-icon">⚡</div>
                    <div className="hc-stat-text">
                      <div className="hc-stat-value">24h</div>
                      <div className="hc-stat-label">Response time</div>
                    </div>
                  </div>
                  <div className="hc-stat-item">
                    <div className="hc-stat-icon">✓</div>
                    <div className="hc-stat-text">
                      <div className="hc-stat-value">Open</div>
                      <div className="hc-stat-label">For opportunities</div>
                    </div>
                  </div>
                </div>

                <div className="hc-card-footer">Let's build something amazing together 🚀</div>
              </div>
            </div>

            {/* Right — Send a message */}
            <div className="hc-right reveal">
              <h3 className="hc-form-title">Send a message</h3>
              <p className="hc-form-sub">Prefer to write? Fill out the form and I'll get back to you within 24 hours.</p>

              {sent ? (
                <div className="hc-sent">✓ Message sent! I'll get back to you soon.</div>
              ) : (
                <form className="hc-form" onSubmit={submit}>
                  <div className="hc-fg">
                    <input type="text" placeholder="Name" value={form.name} onChange={set('name')} required />
                  </div>
                  <div className="hc-fg">
                    <input type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
                  </div>
                  <div className="hc-fg">
                    <textarea placeholder="Message" rows="4" value={form.message} onChange={set('message')} required />
                  </div>
                  <button type="submit" className="hc-submit" disabled={sending}>
                    {sending ? 'Sending…' : (
                      <>
                        Send Message
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17L17 7"/>
                          <path d="M7 7h10v10"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
