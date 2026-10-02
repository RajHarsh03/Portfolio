import { useState, useEffect, useRef } from 'react';
import { useReveal } from '../../hooks/useReveal.js';

const EMAILJS_SERVICE_ID  = 'service_gb3gqr6';
const EMAILJS_TEMPLATE_ID = 'template_ngboxe4';
const EMAILJS_PUBLIC_KEY  = 'f-P9D7rMpesYc3TAk';

export default function HomeContact() {
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
    } catch {
      // silent fail
    } finally { setSending(false); }
  }

  return (
    <section id="home-contact" ref={ref}>
      <div className="container">
        <div className="section-label reveal">// let's connect</div>
        <h2 className="section-title reveal">Let's Work Together</h2>

        <div className="hc-grid">
          {/* Left — Get in touch */}
          <div className="hc-left reveal">
            <div className="hc-card">
              <h3 className="hc-card-title">Get in touch</h3>
              <p className="hc-card-sub">Choose your preferred method to connect and let's discuss your project.</p>

              {/* Stats box */}
              <div className="hc-stats">
                <div className="hc-stat-item">
                  <div className="hc-stat-text">
                    <span className="hc-stat-value">24h</span>
                    <span className="hc-stat-label">Response time</span>
                  </div>
                </div>
                <div className="hc-stat-divider" />
                <div className="hc-stat-item">
                  <div className="hc-stat-text">
                    <span className="hc-stat-value">Open</span>
                    <span className="hc-stat-label">For opportunities</span>
                  </div>
                </div>
              </div>

              {/* Simple info rows */}
              <div className="hc-info-rows">
                <div className="hc-info-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Replies within 24 hours
                </div>
                <div className="hc-info-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
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
                  {sending ? 'Sending…' : 'Send Message ↗'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
