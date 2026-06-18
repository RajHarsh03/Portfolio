import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useReveal } from '../hooks/useReveal.js';

const EMAILJS_SERVICE_ID  = 'service_gb3gqr6';
const EMAILJS_TEMPLATE_ID = 'template_ngboxe4';
const EMAILJS_PUBLIC_KEY  = 'f-P9D7rMpesYc3TAk';

function Toast({ message, type, onHide }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onHide, 3500);
    return () => clearTimeout(t);
  }, [message, onHide]);

  if (!message) return null;

  return (
    <div className={`form-toast ${type}`} style={{ display: 'flex' }}
      dangerouslySetInnerHTML={{ __html: message }} />
  );
}

export default function Contact() {
  const ref = useReveal();
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [toast, setToast]     = useState({ msg: '', type: '' });
  const ejsLoaded             = useRef(false);

  // Load EmailJS SDK once
  useEffect(() => {
    if (ejsLoaded.current || window.emailjs) { ejsLoaded.current = true; return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => {
      window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      ejsLoaded.current = true;
    };
    document.head.appendChild(s);
  }, []);

  // Ctrl+Enter to submit
  function handleKey(e) {
    if (e.key === 'Enter' && e.ctrlKey) submitForm();
  }

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function submitForm() {
    const { name, email, subject, message } = form;
    setToast({ msg: '', type: '' });

    if (!name || !email || !subject || !message) {
      setToast({ msg: '⚠ Please fill in all fields.', type: 'toast-err' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setToast({ msg: '⚠ Please enter a valid email address.', type: 'toast-err' });
      return;
    }

    setSending(true);
    try {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  name,
        from_email: email,
        reply_to:   email,
        subject,
        message,
        to_name:    'Harsh Raj',
      });
      setToast({ msg: "✓ Message sent! I'll get back to you within 24 hours.", type: 'toast-ok' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('EmailJS error:', err);
      setToast({
        msg: '✕ Failed to send. Please try emailing <a href="mailto:raj.harsh4618@gmail.com" style="color:inherit;text-decoration:underline">raj.harsh4618@gmail.com</a> directly.',
        type: 'toast-err',
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact</title>
        <meta name="description" content="Get in touch with Harsh Raj for collaborations, freelance work, or just a good tech chat." />
      </Helmet>

      <Toast message={toast.msg} type={toast.type} onHide={() => setToast({ msg: '', type: '' })} />

      <div style={{ paddingTop: '5rem' }} ref={ref}>
        <div className="contact-page-header">
          <h1>Let's collaborate!</h1>
          <p>I'm always open to new opportunities, collaborations, or just a good tech chat.</p>
        </div>

        <section id="contactSection">
          <div className="contact-grid">
            {/* Left — intro + socials */}
            <div>
              <div className="section-label reveal">// let's connect</div>
              <h2 className="section-title reveal">Got a project<br />in mind?</h2>
              <p className="contact-sub reveal">
                I'm always open to new opportunities, collaborations, or just a good tech chat.
                Drop me a message and I'll get back to you!
              </p>

              <div className="socials reveal">
                <a href="https://x.com/RajHarsh03" target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Twitter
                </a>
                <a href="https://www.linkedin.com/in/rajharsh03" target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
                <a href="https://github.com/RajHarsh03" target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  GitHub
                </a>
                <a href="mailto:raj.harsh4618@gmail.com" className="social-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
                  </svg>
                  Email
                </a>
              </div>
            </div>

            {/* Right — form */}
            <div className="reveal">
              <div className="contact-form">
                <div className="form-row">
                  <div className="fg">
                    <label>Your Name</label>
                    <input type="text" placeholder="Your Name" value={form.name} onChange={set('name')} onKeyDown={handleKey} />
                  </div>
                  <div className="fg">
                    <label>Email Address</label>
                    <input type="email" placeholder="username@mail.com" value={form.email} onChange={set('email')} onKeyDown={handleKey} />
                  </div>
                </div>
                <div className="fg">
                  <label>Subject</label>
                  <input type="text" placeholder="Project collaboration, freelance work..." value={form.subject} onChange={set('subject')} onKeyDown={handleKey} />
                </div>
                <div className="fg">
                  <label>Message</label>
                  <textarea
                    placeholder={"Tell me about your project or idea...\n\nTip: Press Ctrl+Enter to send!"}
                    value={form.message}
                    onChange={set('message')}
                    onKeyDown={handleKey}
                  />
                </div>
                <button className="form-btn" disabled={sending} onClick={submitForm}>
                  {sending ? 'Sending… ⏳' : (
                    <>
                      Send Message{' '}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
