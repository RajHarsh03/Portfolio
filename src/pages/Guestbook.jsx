import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { addDoc, arrayUnion, collection, deleteDoc, doc, increment, limit, onSnapshot, orderBy, query, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db, firebaseReady, googleProvider } from '../services/firebase.js';

const NOTES_CACHE_KEY = 'guestbook_entries_cache_v1';
const AUTH_CACHE_KEY = 'guestbook_auth_user_v1';
const TOAST_AVATAR_URL = 'https://github.com/RajHarsh03.png?size=96';
const ADMIN_EMAIL = 'rajharsh.devx@gmail.com';
const ADMIN_DISPLAY_NAME = 'Harsh Raj';
const ADMIN_UID = 'VqE9wVvuIZXMoMjOlPtw8J3V6Go2';

function readCachedEntries() {
  try {
    const cached = JSON.parse(window.localStorage.getItem(NOTES_CACHE_KEY) || '[]');
    return Array.isArray(cached) ? cached : [];
  } catch {
    return [];
  }
}

function cacheEntries(entries) {
  try {
    window.localStorage.setItem(NOTES_CACHE_KEY, JSON.stringify(entries.map(entry => ({
      ...entry,
      createdAt: entry.createdAt?.toMillis ? entry.createdAt.toMillis() : entry.createdAt,
    }))));
  } catch {
  }
}

function readCachedUser() {
  try {
    return JSON.parse(window.localStorage.getItem(AUTH_CACHE_KEY) || 'null');
  } catch {
    return null;
  }
}

function cacheUser(user) {
  try {
    window.localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Visitor',
      photoURL: user.photoURL || '',
    }));
  } catch {
    // Best-effort session hint only.
  }
}

function clearCachedUser() {
  try { window.localStorage.removeItem(AUTH_CACHE_KEY); } catch { /* no-op */ }
}

function formatDate(value) {
  if (!value) return 'Just now';
  const date = value.toDate ? value.toDate() : new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function wordCount(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function GuestbookCard({ entry, user, isAdmin, onLike, onRequireLogin, onPin, onDelete }) {
  const initial = (entry.displayName || 'V').charAt(0).toUpperCase();
  const entryIsAdmin = entry.authorRole === 'Admin'
    || entry.authorEmail?.toLowerCase() === ADMIN_EMAIL
    || entry.displayName?.trim().toLowerCase() === ADMIN_DISPLAY_NAME.toLowerCase()
    || entry.userId === ADMIN_UID
    || (entry.userId === user?.uid && isAdmin);
  const hasLiked = Boolean(user?.uid && entry.likedUserIds?.includes(user.uid));

  async function handleLike() {
    if (!user) {
      onRequireLogin();
      return;
    }
    try {
      if (!hasLiked) await onLike(entry);
    } catch { /* The live listener will keep the displayed count unchanged. */ }
  }

  return (
    <article className={`guestbook-card guestbook-compact-card ${entryIsAdmin ? 'role-admin' : 'role-visitor'}`}>
      <div className="guestbook-card-top">
        <div className="guestbook-card-author">
          {entry.photoURL ? <img src={entry.photoURL} alt="" /> : <span className="guestbook-avatar-fallback">{initial}</span>}
          <div>
            <strong>{entry.displayName || 'Visitor'}</strong>
            <small className={entryIsAdmin ? 'guestbook-role role-admin' : 'guestbook-role role-visitor'}>{entryIsAdmin ? 'Admin' : 'Visitor'}</small>
          </div>
        </div>
        {isAdmin && <div className="guestbook-admin-actions">
          <button type="button" onClick={() => onPin(entry)} aria-label={entry.pinned ? 'Unpin note' : 'Pin note'} title={entry.pinned ? 'Unpin note' : 'Pin note'}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><g transform="rotate(35 12 12)"><path d="M7 2h10v3l-2 2v4l3 3v2h-5v6h-2v-6H6v-2l3-3V7L7 5V2Z" /></g></svg>
          </button>
          <button type="button" onClick={() => onDelete(entry)} className="is-danger" aria-label="Delete note" title="Delete note">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16" /><path d="M10 11v6m4-6v6" /><path d="m6 7 1 13h10l1-13M9 7V4h6v3" /></svg>
          </button>
        </div>}
      </div>
      <p>{entry.message}</p>
      <div className="guestbook-card-footer">
            <span>{formatDate(entry.createdAt)}</span>
            <span className="guestbook-like-wrap">
          {entry.likedBy?.includes('HR') && <small className="guestbook-liked-by">Liked by HR</small>}
          <button type="button" className={`guestbook-like-button${hasLiked ? ' is-liked' : ''}`} onClick={handleLike} disabled={hasLiked} aria-label={!user ? 'Sign in to like this note' : hasLiked ? 'You already liked this note' : 'Like this note'} title={!user ? 'Sign in to like this note' : hasLiked ? 'You already liked this note' : 'Like this note'}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 10v10H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3Z" />
              <path d="M7 20h9.4a2 2 0 0 0 1.9-1.4l2-6A2 2 0 0 0 18.4 10H14l.7-3.4A2.2 2.2 0 0 0 12.6 4L7 10v10Z" />
            </svg>
            {entry.likes || 0}
          </button>
        </span>
      </div>
    </article>
  );
}

export default function Guestbook() {
  const initialUser = auth?.currentUser || null;
  const initialEntries = readCachedEntries();
  const [user, setUser] = useState(initialUser);
  const [entries, setEntries] = useState(initialEntries);
  const [visibleCount, setVisibleCount] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches ? 2 : 3
  ));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(initialEntries.length === 0);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    const avatar = new Image();
    avatar.src = TOAST_AVATAR_URL;
  }, []);

  // Backfill the role on older notes created by the admin before authorRole
  // was stored. The realtime listener then shares that role with every viewer.
  useEffect(() => {
    if (!isAdmin || !db || !user?.uid || !entries.length) return;
    entries
      .filter(entry => (entry.userId === user.uid || entry.userId === ADMIN_UID || entry.displayName?.trim().toLowerCase() === ADMIN_DISPLAY_NAME.toLowerCase()) && !entry.authorRole)
      .forEach(entry => {
        setEntries(current => current.map(item => item.id === entry.id
          ? { ...item, authorRole: 'Admin', authorEmail: user.email || ADMIN_EMAIL }
          : item));
        updateDoc(doc(db, 'guestbook_entries', entry.id), {
          authorRole: 'Admin',
          authorEmail: user.email || ADMIN_EMAIL,
        }).catch(() => {});
      });
  }, [entries, isAdmin, user]);

  useEffect(() => {
    if (!auth) {
      return undefined;
    }
    return onAuthStateChanged(auth, nextUser => {
      setUser(nextUser);
      if (nextUser) cacheUser(nextUser);
      else clearCachedUser();
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
      const nextEntries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(nextEntries);
      cacheEntries(nextEntries);
      setLoading(false);
    }, () => {
      showToast('Something went wrong', 'Please try again in a moment.', 'error');
      setLoading(false);
    });
  }, []);

  async function handleSignIn() {
    try {
      await signInWithPopup(auth, googleProvider);
      if (auth.currentUser) cacheUser(auth.currentUser);
      showToast('Sign in successful', "You're signed in. Leave a note whenever you're ready. 😊", 'success');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        showToast('Sign in failed', 'Google sign-in could not be completed.', 'error');
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!user || !trimmedMessage || wordCount(trimmedMessage) > 100 || trimmedMessage.length > 500) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'guestbook_entries'), {
        userId: user.uid,
        authorEmail: user.email || '',
        authorRole: isAdmin ? 'Admin' : 'Visitor',
        displayName: user.displayName || 'Visitor',
        photoURL: user.photoURL || '',
        message: trimmedMessage,
        createdAt: serverTimestamp(),
        likes: 0,
        likedUserIds: [],
        pinned: false,
      });
      setMessage('');
      showToast('Note posted', 'Thanks for leaving a note! 😊', 'success');
    } catch {
      showToast('Could not post note', 'Your note could not be posted. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  }

  async function handleLike(entry) {
    if (!user || !db) return;
    if (entry.likedUserIds?.includes(user.uid)) return;
    try {
      await runTransaction(db, async transaction => {
        const ref = doc(db, 'guestbook_entries', entry.id);
        const snapshot = await transaction.get(ref);
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        const likedUserIds = Array.isArray(data.likedUserIds) ? data.likedUserIds : [];
        if (likedUserIds.includes(user.uid)) return;
        transaction.update(ref, {
          likes: increment(1),
          likedUserIds: arrayUnion(user.uid),
          ...(isAdmin ? { likedBy: arrayUnion('HR') } : {}),
        });
      });
    } catch (error) {
      showToast('Something went wrong', 'Your like could not be saved. Please try again.', 'error');
      throw error;
    }
  }

  async function handlePin(entry) {
    if (!isAdmin || !db) return;
    try {
      await updateDoc(doc(db, 'guestbook_entries', entry.id), { pinned: !entry.pinned });
      showToast(entry.pinned ? 'Note unpinned' : 'Note pinned', 'The guestbook note was updated.', 'success');
    } catch {
      showToast('Something went wrong', 'That action could not be completed. Please try again.', 'error');
    }
  }

  async function handleDelete(entry) {
    if (!isAdmin || !db || !window.confirm('Delete this guestbook note?')) return;
    try {
      await deleteDoc(doc(db, 'guestbook_entries', entry.id));
      showToast('Note deleted', 'The guestbook note was removed.', 'success');
    } catch {
      showToast('Something went wrong', 'That action could not be completed. Please try again.', 'error');
    }
  }

  function handleRequireLogin() {
    showToast('Sign in to like notes', 'Connect with Google to support visitor notes.', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showToast(title, message, tone = 'info') {
    setToast({ title, message, tone });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4500);
  }

  const pinnedEntries = entries.filter(entry => entry.pinned).slice(0, 5);
  const marqueePinnedEntries = pinnedEntries.length > 1
    ? [...pinnedEntries, ...pinnedEntries]
    : pinnedEntries;

  return (
    <>
      <Helmet>
        <title>Guestbook - Harsh Raj</title>
        <meta name="description" content="Leave a note for Harsh Raj and browse messages from visitors." />
      </Helmet>
      {toast && <div className={`guestbook-toast is-${toast.tone}`} role="status" aria-live="polite">
        <img src={TOAST_AVATAR_URL} alt="Harsh Raj" loading="eager" fetchPriority="high" decoding="async" />
        <strong>{toast.title}</strong>
        <span>{toast.message}</span>
        <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification">×</button>
      </div>}
      <section className="guestbook-page">
        <div className="guestbook-page-header">
          <p className="section-label">// Leave a note </p>
          <h1 className="guestbook-page-title">Guestbook</h1>
          <p className="guestbook-page-subtitle">A small wall for visitors, developers, and friends to say hello.</p>
        </div>

        <div className="guestbook-compose">
          {!firebaseReady ? (
            <p className="guestbook-muted">This section is temporarily unavailable. Please try again later.</p>
          ) : user ? (
            <form className="guestbook-composer-form" onSubmit={handleSubmit}>
              <div className="guestbook-compose-user">
                {user.photoURL ? <img src={user.photoURL} alt="" /> : <span>{(user.displayName || 'V').charAt(0)}</span>}
                <div><strong>{user.displayName}</strong><small className={isAdmin ? 'guestbook-role role-admin' : 'guestbook-role role-visitor'}>Logged in as: {isAdmin ? 'Admin' : 'Visitor'}</small></div>
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
            </div>
          )}
        </div>

        {entries.some(entry => entry.pinned) && <section className="guestbook-pinned" aria-label="Pinned notes">
          <div className="guestbook-notes-heading"><div><p className="section-label">// highlights</p><h2>Pinned Notes</h2></div></div>
          <div className="guestbook-pinned-marquee"><div className={`guestbook-pinned-track${pinnedEntries.length < 2 ? ' is-static' : ''}`}>
            {marqueePinnedEntries.map((entry, index) => <GuestbookCard entry={entry} user={user} isAdmin={isAdmin} onLike={handleLike} onRequireLogin={handleRequireLogin} onPin={handlePin} onDelete={handleDelete} key={`pinned-${entry.id}-${index}`} />)}
          </div></div>
        </section>}

        <div className="guestbook-notes">
          <div className="guestbook-notes-heading"><div><p className="section-label">// recent messages</p><h2>Voices From Visitors</h2></div></div>
          {loading ? <div className="guestbook-empty-state"><p className="guestbook-muted">Loading notes...</p></div> : entries.length === 0 ? <div className="guestbook-empty-state"><p>No notes yet.</p><small>Be the first to say hello.</small></div> : <>
            <div className="guestbook-grid">{entries.slice(0, visibleCount).map(entry => <GuestbookCard entry={entry} user={user} isAdmin={isAdmin} onLike={handleLike} onRequireLogin={handleRequireLogin} onPin={handlePin} onDelete={handleDelete} key={entry.id} />)}</div>
            {visibleCount < entries.length && <button type="button" className="guestbook-load-more" onClick={() => setVisibleCount(count => count + (window.matchMedia('(max-width: 640px)').matches ? 2 : 3))}>View more</button>}
          </>}
        </div>
      </section>
    </>
  );
}
