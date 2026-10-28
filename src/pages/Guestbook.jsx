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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function wordCount(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function remainingChars(value) {
  return 500 - value.length;
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
          {showDelete && <button type="button" onClick={() => onDelete(entry)} className="is-danger" aria-label="Delete note" title="Delete note">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16" /><path d="M10 11v6m4-6v6" /><path d="m6 7 1 13h10l1-13M9 7V4h6v3" /></svg>
          </button>}
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
  const initialUser = auth?.currentUser || readCachedUser();
  const initialEntries = readCachedEntries();
  const [user, setUser] = useState(initialUser);
  const [authLoading, setAuthLoading] = useState(() => Boolean(auth && hasPendingAuthRedirect()));
  const [entries, setEntries] = useState(initialEntries);
  const [visibleCount, setVisibleCount] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches ? 2 : 3
  ));
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

  const pinnedEntries = entries.filter(entry => entry.pinned).slice(0, 5);
  const marqueePinnedEntries = pinnedEntries.length > 1
    ? [...pinnedEntries, ...pinnedEntries]
    : pinnedEntries;

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
          <p className="guestbook-page-subtitle">A small wall for visitors, developers, and friends to say hello.</p>
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
            <form className="guestbook-composer-form" onSubmit={handleSubmit}>
              <div className="guestbook-composer-user">
                <div className="guestbook-compose-user">
                  <div className="guestbook-compose-avatar">
                    {user.photoURL ? <img src={user.photoURL} alt="" /> : <span>{(user.displayName || 'V').charAt(0)}</span>}
                    <i className="guestbook-presence" aria-hidden="true" />
                  </div>
                  <div>
                    <strong>{user.displayName}</strong>
                    <small className={isAdmin ? 'guestbook-role role-admin' : 'guestbook-role role-visitor'}>Signed in as {isAdmin ? 'Admin' : 'Visitor'}</small>
                  </div>
                </div>
                <button type="button" className="guestbook-signout" onClick={() => { signOut(auth); showToast('Signed out', 'You have been disconnected.', 'success'); }}>Disconnect</button>
              </div>
              <div className="guestbook-composer-editor">
                <div className="guestbook-composer-heading">
                  <div>
                    <span className="guestbook-composer-kicker">Guestbook note</span>
                    <span className="guestbook-composer-hint">Say hello, share feedback, or leave a thought.</span>
                  </div>
                  <span className={`guestbook-composer-count${wordCount(message) >= 90 ? ' is-close' : ''}`}>{wordCount(message)}/100 words</span>
                </div>
                <textarea value={message} onChange={event => {
                  const nextValue = event.target.value;
                  if (wordCount(nextValue) <= 100) setMessage(nextValue);
                }} maxLength={500} placeholder="Write something worth remembering..." aria-label="Guestbook note" rows="4" required />
                <div className="guestbook-compose-footer">
                  <small>Your note will be visible to everyone · {remainingChars(message)} chars left</small>
                  <button className="guestbook-submit" disabled={sending || !message.trim()}>{sending ? 'Posting...' : 'Post Note'}</button>
                </div>
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
            {marqueePinnedEntries.map((entry, index) => <GuestbookCard entry={entry} user={user} isAdmin={isAdmin} showDelete={false} onLike={handleLike} onRequireLogin={handleRequireLogin} onPin={handlePin} onDelete={handleDelete} key={`pinned-${entry.id}-${index}`} />)}
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
