import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { addDoc, arrayUnion, collection, deleteDoc, doc, increment, limit, onSnapshot, orderBy, query, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getRedirectResult, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth, authPersistenceReady, db, firebaseReady, googleProvider } from '../services/firebase.js';
import Toast from '../components/ui/Toast.jsx';
import { useToast } from '../hooks/useToast.js';

const NOTES_CACHE_KEY = 'guestbook_entries_cache_v1';
const AUTH_CACHE_KEY = 'guestbook_auth_user_v1';
const AUTH_REDIRECT_PENDING_KEY = 'guestbook_auth_redirect_pending_v1';
const ADMIN_EMAIL = 'rajharsh.devx@gmail.com';
const ADMIN_UID = 'VqE9wVvuIZXMoMjOlPtw8J3V6Go2';

const CANCELLED_CODES = new Set([
  'auth/user-cancelled',
  'auth/cancelled-popup-request',
  'auth/popup-closed-by-user',
  'auth/redirect-interrupted',
]);
const wasCancelled = (err) => CANCELLED_CODES.has(err?.code);

// On local hosts the auth domain is a different origin (firebaseapp.com), and
// browser storage partitioning breaks the redirect flow there, so use a popup.
const isLocalHost = typeof window !== 'undefined'
  && ['localhost', '127.0.0.1'].includes(window.location.hostname);

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
      pinnedAt: entry.pinnedAt?.toMillis ? entry.pinnedAt.toMillis() : entry.pinnedAt,
    }))));
  } catch {
  }
}

function readCachedUser() {
  try {
    return JSON.parse(window.sessionStorage.getItem(AUTH_CACHE_KEY) || 'null');
  } catch {
    return null;
  }
}

function cacheUser(user) {
  try {
    window.sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({
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
  try { window.sessionStorage.removeItem(AUTH_CACHE_KEY); } catch { /* no-op */ }
}

function hasPendingAuthRedirect() {
  try {
    return window.sessionStorage.getItem(AUTH_REDIRECT_PENDING_KEY) === '1';
  } catch {
    return false;
  }
}

function clearPendingAuthRedirect() {
  try { window.sessionStorage.removeItem(AUTH_REDIRECT_PENDING_KEY); } catch { /* no-op */ }
}

function formatDate(value) {
  if (!value) return 'Just now';
  const date = value.toDate ? value.toDate() : new Date(value);
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString('en-US', sameYear ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' });
}

function wordCount(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function remainingChars(value) {
  return 500 - value.length;
}

const QUOTE_COLORS = ['#f5c26b', '#f472b6', '#4ade80', '#a78bfa', '#60a5fa', '#fb923c'];

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

function GuestbookCard({ entry, user, isAdmin, onLike, onRequireLogin, onPin, onDelete, showDelete = true }) {
  const initial = (entry.displayName || 'V').charAt(0).toUpperCase();
  const entryIsAdmin = entry.authorRole === 'Admin'
    || entry.authorEmail?.toLowerCase() === ADMIN_EMAIL
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

  const quoteColor = QUOTE_COLORS[hashString(entry.id || entry.message || '') % QUOTE_COLORS.length];

  return (
    <article className={`guestbook-card guestbook-compact-card gbn-card ${entryIsAdmin ? 'role-admin' : 'role-visitor'}`}>
      {isAdmin && <span className="gbn-admin-actions">
        <button type="button" onClick={() => onPin(entry)} aria-label={entry.pinned ? 'Unpin note' : 'Pin note'} title={entry.pinned ? 'Unpin note' : 'Pin note'} className={entry.pinned ? 'is-active' : ''}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><g transform="rotate(35 12 12)"><path d="M7 2h10v3l-2 2v4l3 3v2h-5v6h-2v-6H6v-2l3-3V7L7 5V2Z" /></g></svg>
        </button>
        {showDelete && <button type="button" onClick={() => onDelete(entry)} className="is-danger" aria-label="Delete note" title="Delete note">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16" /><path d="M10 11v6m4-6v6" /><path d="m6 7 1 13h10l1-13M9 7V4h6v3" /></svg>
        </button>}
      </span>}
      {!isAdmin && entry.pinned && <span className="gbn-admin-actions">
        <span className="gbn-pin-static" role="img" aria-label="Pinned note" title="Pinned note">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><g transform="rotate(35 12 12)"><path d="M7 2h10v3l-2 2v4l3 3v2h-5v6h-2v-6H6v-2l3-3V7L7 5V2Z" /></g></svg>
        </span>
      </span>}
      <p className="gbn-message">
        <span className="gbn-quote" style={{ color: quoteColor }} aria-hidden="true">&ldquo;</span>
        {entry.message}
      </p>
      <div className="gbn-footer">
        <div className="gbn-author">
          {entry.photoURL ? <img src={entry.photoURL} alt="" loading="lazy" decoding="async" /> : <span className="gbn-avatar-fallback" aria-hidden="true">{initial}</span>}
          <span className="gbn-who">
            <span className="gbn-name">{entry.displayName || 'Visitor'}</span>
            <small className={`gbn-role`+(entryIsAdmin ? ' is-admin' : '')}>{entryIsAdmin ? 'Admin' : 'Visitor'}</small>
          </span>
          {entry.likedBy?.includes('HR') && <span className="gbn-liked-by" title="Liked by Harsh Raj"><svg aria-hidden="true" viewBox="0 0 24 24" width="9" height="9" fill="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>Liked by HR</span>}
        </div>
        <div className="gbn-meta">
          <button type="button" className={`gbn-like${hasLiked ? ' is-liked' : ''}`} onClick={handleLike} disabled={hasLiked} aria-label={!user ? 'Sign in to like this note' : hasLiked ? 'You already liked this note' : 'Like this note'} title={!user ? 'Sign in to like this note' : hasLiked ? 'You already liked this note' : 'Like this note'}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {entry.likes > 0 && <span>{entry.likes}</span>}
          </button>
          <time className="gbn-date">{formatDate(entry.createdAt)}</time>
        </div>
      </div>
    </article>
  );
}
export default function Guestbook() {
  const initialUser = auth?.currentUser || readCachedUser();
  const initialEntries = readCachedEntries();
  const [user, setUser] = useState(initialUser);
  const [authLoading, setAuthLoading] = useState(() => Boolean(auth && hasPendingAuthRedirect()));
  const [entries, setEntries] = useState(initialEntries);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(initialEntries.length === 0);
  const [sending, setSending] = useState(false);
  const { toast, showToast, dismissToast } = useToast();
  const redirectResultRead = useRef(false);
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin || !db || !user?.uid || !entries.length) return;
    entries
      .filter(entry => (entry.userId === user.uid || entry.userId === ADMIN_UID) && !entry.authorRole)
      .forEach(entry => {
        setEntries(current => current.map(item => item.id === entry.id
          ? { ...item, authorRole: 'Admin' }
          : item));
        updateDoc(doc(db, 'guestbook_entries', entry.id), {
          authorRole: 'Admin',
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
    // StrictMode runs this effect twice in dev and getRedirectResult consumes the
    // stored result, so guard it or the success toast can fire twice.
    if (!auth || redirectResultRead.current) {
      return undefined;
    }
    redirectResultRead.current = true;
    const redirectWasPending = hasPendingAuthRedirect();
    // getRedirectResult already waits for Firebase's own initialization. Waiting
    // for authStateReady first made the redirect return do those two waits in
    // sequence, leaving the composer unavailable for much longer than needed.
    getRedirectResult(auth)
      .then(result => {
        const signedInUser = result?.user || auth.currentUser;
        if (signedInUser) completeSignIn(signedInUser, redirectWasPending);
        clearPendingAuthRedirect();
        setAuthLoading(false);
      })
      .catch(err => {
        if (wasCancelled(err)) {
          showToast('Sign in cancelled', 'Google sign-in was cancelled.', 'error');
        } else {
          showToast('Sign in failed', 'Google sign-in could not be completed.', 'error');
        }
        clearPendingAuthRedirect();
        setAuthLoading(false);
      });
    return undefined;
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

  function completeSignIn(signedInUser, announce) {
    setUser(signedInUser);
    cacheUser(signedInUser);
    if (announce) {
      showToast('Sign in successful', "You're signed in. Leave a note whenever you're ready. 😊", 'success');
    }
  }

  async function handleSignIn() {
    if (isLocalHost) {
      try {
        await authPersistenceReady;
        const result = await signInWithPopup(auth, googleProvider);
        completeSignIn(result.user, true);
      } catch (err) {
        if (err?.code === 'auth/popup-blocked') {
          showToast('Popup blocked', 'Allow popups for this site to sign in with Google.', 'error');
        } else if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
          showToast('Sign in failed', 'Google sign-in could not be completed.', 'error');
        }
      }
      return;
    }
    try {
      window.sessionStorage.setItem(AUTH_REDIRECT_PENDING_KEY, '1');
      // Navigates away to Google; this promise only settles if the redirect
      // itself is blocked, so a rejection here is a genuine failure.
      // Session persistence must be selected before redirecting, but waiting for
      // the complete auth-state restore here only adds latency to a new sign-in.
      await authPersistenceReady;
      await signInWithRedirect(auth, googleProvider);
    } catch {
      showToast('Sign in failed', 'Google sign-in could not be completed.', 'error');
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
      await updateDoc(doc(db, 'guestbook_entries', entry.id), entry.pinned ? { pinned: false, pinnedAt: null } : { pinned: true, pinnedAt: serverTimestamp() });
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

  // Pinned notes first (most recently pinned on top), then everything else newest first.
  const toMillis = value => {
    if (value?.toMillis) return value.toMillis();
    if (typeof value === 'number') return value;
    if (typeof value?.seconds === 'number') return value.seconds * 1000;
    return 0;
  };
  // A just-pinned note has pinnedAt === null until the server timestamp arrives: treat it as now.
  const pinTime = entry => (entry.pinnedAt === null ? Date.now() : toMillis(entry.pinnedAt) || toMillis(entry.createdAt));
  const sortedEntries = [...entries].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
    if (a.pinned) return pinTime(b) - pinTime(a);
    return toMillis(b.createdAt) - toMillis(a.createdAt);
  });

  return (
    <>
      <Helmet>
        <title>Guestbook | Harsh Raj | Full-Stack Developer</title>
        <meta name="description" content="Leave a note for Harsh Raj and browse messages from visitors." />
      </Helmet>
      <Toast toast={toast} onDismiss={dismissToast} />
      <section className="guestbook-page">
        <div className="guestbook-page-header">
          <p className="section-label">// Leave a note </p>
          <h1 className="guestbook-page-title">Guestbook</h1>
          <p className="guestbook-page-subtitle">Say hello, share some feedback, or leave a thought for the next visitor.</p>
        </div>

        <div className="guestbook-compose">
          {!firebaseReady ? (
            <p className="guestbook-muted">This section is temporarily unavailable. Please try again later.</p>
          ) : authLoading ? (
            <div className="guestbook-auth-loading" role="status" aria-live="polite" aria-label="Checking your session">
              <div className="guestbook-auth-skeleton">
                <span className="guestbook-skel-line is-avatar" aria-hidden="true" />
                <div className="guestbook-skel-stack">
                  <span className="guestbook-skel-line is-title" aria-hidden="true" />
                  <span className="guestbook-skel-line is-meta" aria-hidden="true" />
                </div>
                <span className="guestbook-skel-line is-button" aria-hidden="true" />
              </div>
              <span className="guestbook-skel-line is-block" aria-hidden="true" />
              <span className="guestbook-skel-line is-input" aria-hidden="true" />
              <div className="guestbook-auth-status">
                <span className="guestbook-auth-loader" aria-hidden="true"><span /></span>
                Checking your session…
              </div>
            </div>
          ) : user ? (
            <form className="gb-composer" onSubmit={handleSubmit}>
              <div className="gb-composer-input">
                <span className="gb-quote-mark" aria-hidden="true">&ldquo;</span>
                <textarea value={message} onChange={event => {
                  const nextValue = event.target.value;
                  if (wordCount(nextValue) <= 100) setMessage(nextValue);
                }} maxLength={500} placeholder="Say something nice, or don't." aria-label="Guestbook note" rows="3" required />
              </div>
              <div className="gb-composer-footer">
                <div className="gb-composer-user">
                  {user.photoURL ? <img src={user.photoURL} alt="" /> : <span className="gb-avatar-fallback" aria-hidden="true">{(user.displayName || 'V').charAt(0)}</span>}
                  <span className="gb-user-meta"><strong>{user.displayName || 'Visitor'}</strong><small className={`gb-role`+(isAdmin ? ' is-admin' : '')}>{isAdmin ? 'Admin' : 'Visitor'}</small></span>
                  <button type="button" className="gb-signout" onClick={() => { signOut(auth); showToast('Signed out', 'You have been disconnected.', 'success'); }}>Sign out</button>
                </div>
                <div className="gb-composer-actions">
                  <span className={`gb-count${remainingChars(message) <= 50 ? ' is-close' : ''}`} aria-label={`${remainingChars(message)} characters left`}>{remainingChars(message)}</span>
                  <button type="submit" className="gb-submit" disabled={sending || !message.trim()}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" />
                    </svg>
                    {sending ? 'Signing…' : 'Sign it'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="gb-signin">
              <svg className="gb-signin-icon" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              <p>Sign in with Google to leave a note.</p>
              <button type="button" className="gb-signin-btn" onClick={handleSignIn}>Sign in</button>
            </div>
          )}
        </div>

        <div className="guestbook-notes">
          <div className="guestbook-notes-heading"><div><p className="section-label">// recent messages</p><h2>Voices From Visitors</h2></div></div>
          {loading ? <div className="guestbook-empty-state"><p className="guestbook-muted">Loading notes...</p></div> : entries.length === 0 ? <div className="guestbook-empty-state"><p>No notes yet.</p><small>Be the first to say hello.</small></div> : <>
            <div className="guestbook-grid">{sortedEntries.map(entry => <GuestbookCard entry={entry} user={user} isAdmin={isAdmin} onLike={handleLike} onRequireLogin={handleRequireLogin} onPin={handlePin} onDelete={handleDelete} key={entry.id} />)}</div>
          </>}
        </div>
      </section>
    </>
  );
}
