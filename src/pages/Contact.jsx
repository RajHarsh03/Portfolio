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
      setTimeout(() => setSent(false), 2000);
    } catch {
      // silent fail
    } finally { setSending(false); }
  }
  return (
    <>
      <Helmet>
        <title>Contact | Harsh Raj | Full-Stack Developer</title>
        <meta name="description" content="Get in touch with Harsh Raj for collaborations, freelance work, or just a good tech chat." />
      </Helmet>
      <section id="home-contact" ref={ref} style={{ paddingTop: '4.5rem' }}>
        <div className="container">
          <div className="section-label reveal">// let's connect</div>
          <h2 className="section-title reveal">Let's Work Together</h2>

          <div className="hc-grid">
            {/* Left — Get in touch (same style as hc-right) */}
            <div className="hc-left reveal">
              <div className="hc-right" style={{ height: '100%' }}>
                <h3 className="hc-form-title">Get in Touch</h3>
                <p className="hc-form-sub">Choose your preferred method to connect and let's discuss your project.</p>

                <div className="hc-links">
                  <a href="https://cal.com/rajharsh03/one-to-one" target="_blank" rel="noopener noreferrer" className="hc-link-row">
                    <span className="hc-link-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </span>
                    <div className="hc-link-text">
                      <div className="hc-link-title">Schedule a free call</div>
                      <div className="hc-link-desc">30-minute strategy session</div>
                    </div>
                    <span className="hc-link-arrow" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
                      </svg>
                    </span>
                  </a>
                  <a href="mailto:rajharsh.devx@gmail.com" className="hc-link-row">
                    <span className="hc-link-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <polyline points="2,4 12,13 22,4"/>
                      </svg>
                    </span>
                    <div className="hc-link-text">
                      <div className="hc-link-title">Write an email</div>
                      <div className="hc-link-desc">Quick inquiries &amp; questions</div>
                    </div>
                    <span className="hc-link-arrow" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
                      </svg>
                    </span>
                  </a>
                  <a href="https://x.com/RajHarsh03" target="_blank" rel="noopener noreferrer" className="hc-link-row">
                    <span className="hc-link-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </span>
                    <div className="hc-link-text">
                      <div className="hc-link-title">Connect on X</div>
                      <div className="hc-link-desc">Follow for updates &amp; insights</div>
                    </div>
                    <span className="hc-link-arrow" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
                      </svg>
                    </span>
                  </a>
                </div>

                <div className="hc-info-rows">
                  <div className="hc-info-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Replies within 24 hours
                  </div>
                  <div className="hc-info-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Open to remote, freelance &amp; full-time
                  </div>
                </div>
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
                          <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
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
