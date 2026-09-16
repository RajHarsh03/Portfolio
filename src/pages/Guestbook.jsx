import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db, firebaseReady, googleProvider } from '../services/firebase.js';

function formatDate(value) {
  if (!value) return 'Just now';
  const date = value.toDate ? value.toDate() : new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function wordCount(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function GuestbookCard({ entry }) {
  const initial = (entry.displayName || 'V').charAt(0).toUpperCase();
  return (
    <article className="guestbook-card">
      <div className="guestbook-card-author">
        {entry.photoURL ? <img src={entry.photoURL} alt="" /> : <span className="guestbook-avatar-fallback">{initial}</span>}
        <div>
          <strong>{entry.displayName || 'Visitor'}</strong>
          <small>Visitor</small>
        </div>
      </div>
      <p>{entry.message}</p>
      <div className="guestbook-card-footer">
        <span>{formatDate(entry.createdAt)}</span>
        <span>{entry.pinned ? 'Pri' : ''} <span className="guestbook-preview-heart" aria-hidden="true">♡</span> {entry.likes || 0}</span>
      </div>
    </article>
  );
}

export default function Guestbook() {
  const initialUser = auth?.currentUser || null;
  const [user, setUser] = useState(initialUser);
  const [authLoading, setAuthLoading] = useState(Boolean(auth && !initialUser));
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return undefined;
    }
    return onAuthStateChanged(auth, nextUser => {
      setUser(nextUser);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return undefined;
    }
    const entriesQuery = query(
      collection(db, 'guestbook_entries'),
      orderBy('createdAt', 'desc'),
      limit(30),
    );
    return onSnapshot(entriesQuery, snapshot => {
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, () => {
      setError('Guestbook entries could not be loaded yet. Check your Firestore rules.');
      setLoading(false);
    });
  }, []);

  async function handleSignIn() {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.code === 'auth/popup-closed-by-user' ? '' : 'Google sign-in could not be completed.');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!user || !trimmedMessage || wordCount(trimmedMessage) > 100 || trimmedMessage.length > 500) return;
    setSending(true);
    setError('');
    try {
      await addDoc(collection(db, 'guestbook_entries'), {
        userId: user.uid,
        displayName: user.displayName || 'Visitor',
        photoURL: user.photoURL || '',
        message: trimmedMessage,
        createdAt: serverTimestamp(),
        likes: 0,
        pinned: false,
      });
      setMessage('');
    } catch {
      setError('Your note could not be posted. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Guestbook - Harsh Raj</title>
        <meta name="description" content="Leave a note for Harsh Raj and browse messages from visitors." />
      </Helmet>
      <section className="guestbook-page">
        <div className="guestbook-page-header">
          <p className="section-label">// Leave a note </p>
          <h1 className="guestbook-page-title">Guestbook</h1>
          <p className="guestbook-page-subtitle">A small wall for visitors, developers, and friends to say hello.</p>
        </div>

        <div className="guestbook-compose">
          {!firebaseReady ? (
            <p className="guestbook-muted">Firebase configuration is missing. Add the Vite Firebase variables to continue.</p>
          ) : authLoading ? (
            <p className="guestbook-muted">Checking your sign-in...</p>
          ) : user ? (
            <form className="guestbook-composer-form" onSubmit={handleSubmit}>
              <div className="guestbook-compose-user">
                {user.photoURL ? <img src={user.photoURL} alt="" /> : <span>{(user.displayName || 'V').charAt(0)}</span>}
                <div><strong>{user.displayName}</strong><small>Logged in as: Visitor</small></div>
                <button type="button" className="guestbook-signout" onClick={() => signOut(auth)}>Disconnect</button>
              </div>
              <textarea value={message} onChange={event => {
                const nextValue = event.target.value;
                if (wordCount(nextValue) <= 100) setMessage(nextValue);
              }} maxLength={500} placeholder="Write a message, share your feedback, or just say hello..." rows="4" required />
              <div className="guestbook-compose-footer">
                <small>{wordCount(message)}/100 words</small>
                <button className="guestbook-submit" disabled={sending || !message.trim()}>{sending ? 'Posting...' : 'Post Note'}</button>
              </div>
            </form>
          ) : (
            <div className="guestbook-signin">
              <div><h2>Leave a note on the wall</h2><p>Sign in with Google to share your thoughts, feedback, or just say hello.</p></div>
              <button className="guestbook-google" onClick={handleSignIn}>
                <svg className="guestbook-google-mark" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z"/>
                  <path fill="#34A853" d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.55 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.7Z"/>
                  <path fill="#FBBC05" d="M6.53 13.78a5.86 5.86 0 0 1 0-3.56V7.69H3.28a9.74 9.74 0 0 0 0 8.62l3.25-2.53Z"/>
                  <path fill="#EA4335" d="M12 6.19c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.27 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.72 5.39l3.25 2.53C7.3 7.91 9.45 6.19 12 6.19Z"/>
                </svg>
                Sign in with Google
              </button>
              {error && <p className="guestbook-error guestbook-signin-error">{error}</p>}
            </div>
          )}
          {error && user && <p className="guestbook-error">{error}</p>}
        </div>

        <div className="guestbook-notes">
          <div className="guestbook-notes-heading"><div><p className="section-label">// recent notes</p><h2>Messages from visitors</h2></div><span>{entries.length} notes</span></div>
          {loading ? <div className="guestbook-empty-state"><p className="guestbook-muted">Loading notes...</p></div> : entries.length === 0 ? <div className="guestbook-empty-state"><p>No notes yet.</p><small>Be the first to say hello.</small></div> : <div className="guestbook-grid">{entries.map(entry => <GuestbookCard entry={entry} key={entry.id} />)}</div>}
        </div>
      </section>
    </>
  );
}
