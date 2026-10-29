import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth, useClerk, useUser } from '@clerk/react';
import { supabase, supabaseReady } from '../services/supabase.js';
import Toast from '../components/ui/Toast.jsx';
import { useToast } from '../hooks/useToast.js';

const NOTES_CACHE_KEY = 'guestbook_notes_cache_v2';
const CLERK_SIGNIN_KEY = 'guestbook_clerk_signin_v1';
const NOTE_COLUMNS = 'id, user_id, display_name, photo_url, message, author_role, pinned, pinned_at, likes_count, liked_by_admin, created_at';
const NOTES_LIMIT = 100;

// Database rows are snake_case; the cards and the cache use these camelCase fields.
function toEntry(row) {
  return {
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name,
    photoURL: row.photo_url,
    message: row.message,
    authorRole: row.author_role,
    pinned: Boolean(row.pinned),
    pinnedAt: row.pinned_at,
    likes: row.likes_count || 0,
    likedByAdmin: Boolean(row.liked_by_admin),
    createdAt: row.created_at,
  };
}

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
    window.localStorage.setItem(NOTES_CACHE_KEY, JSON.stringify(entries));
  } catch {
  }
}

function formatDate(value) {
  if (!value) return 'Just now';
  const date = new Date(value);
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

function GuestbookCard({ entry, user, isAdmin, hasLiked, onLike, onRequireLogin, onPin, onDelete, showDelete = true }) {
  const initial = (entry.displayName || 'V').charAt(0).toUpperCase();
  const entryIsAdmin = entry.authorRole === 'Admin'
    || (entry.userId === user?.uid && isAdmin);

  async function handleLike() {
    if (!user) {
      onRequireLogin();
      return;
    }
    try {
      if (!hasLiked) await onLike(entry);
    } catch { /* The displayed count stays as the server last reported it. */ }
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
          {entry.likedByAdmin && <span className="gbn-liked-by" title="Liked by Harsh Raj"><svg aria-hidden="true" viewBox="0 0 24 24" width="9" height="9" fill="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>Liked by HR</span>}
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
// Placeholder note cards shown while notes load (varied heights for the masonry grid).
const NOTE_SKELETONS = [1, 3, 2, 2];

function NoteSkeleton({ lines }) {
  return (
    <div className="guestbook-card gbn-card gbn-card-skeleton" aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <span className={`gb-skel gbn-skel-line${index === lines - 1 ? ' is-last' : ''}`} key={index} />
      ))}
      <div className="gbn-footer">
        <div className="gbn-author">
          <span className="gb-skel gbn-skel-avatar" />
          <span className="gbn-who">
            <span className="gb-skel gbn-skel-name" />
            <span className="gb-skel gbn-skel-role" />
          </span>
        </div>
        <span className="gb-skel gbn-skel-meta" />
      </div>
    </div>
  );
}

export default function Guestbook() {
  const initialEntries = readCachedEntries();
  // Clerk handles sign-in; Supabase receives the Clerk session token on every
  // request (see services/supabase.js), and RLS checks it.
  const { isLoaded: clerkLoaded, isSignedIn, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const clerk = useClerk();
  // null until the is_admin() check finishes for the signed-in user.
  const [isAdmin, setIsAdmin] = useState(null);
  const [likedIds, setLikedIds] = useState(() => new Set());
  const user = isSignedIn && clerkUser ? {
    uid: clerkUser.id,
    displayName: clerkUser.fullName || clerkUser.username || 'Visitor',
    photoURL: clerkUser.imageUrl || '',
  } : null;
  // Only wait for Clerk itself; the admin check fills in afterwards without blocking the composer.
  const authLoading = supabaseReady && (!clerkLoaded || (isSignedIn && !clerkUser));
  const [entries, setEntries] = useState(initialEntries);
  const [synced, setSynced] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(initialEntries.length === 0);
  const [sending, setSending] = useState(false);
  const { toast, showToast, dismissToast } = useToast();
  const announceSignIn = useRef(false);

  function upsertEntry(entry) {
    setEntries(current => (current.some(item => item.id === entry.id)
      ? current.map(item => (item.id === entry.id ? entry : item))
      : [entry, ...current]));
  }

  function removeEntry(id) {
    setEntries(current => current.filter(item => item.id !== id));
  }

  async function refreshEntry(id) {
    const { data, error } = await supabase.from('guestbook_notes').select(NOTE_COLUMNS).eq('id', id).maybeSingle();
    if (error) return;
    if (data) upsertEntry(toEntry(data));
    else removeEntry(id);
  }

  // Keep the cache in step with what the server last returned.
  useEffect(() => {
    if (synced) cacheEntries(entries);
  }, [entries, synced]);

  // Load the newest notes, then apply inserts, updates and deletes live.
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    supabase
      .from('guestbook_notes')
      .select(NOTE_COLUMNS)
      .order('created_at', { ascending: false })
      .limit(NOTES_LIMIT)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          showToast('Something went wrong', 'Please try again in a moment.', 'error');
        } else {
          setEntries(data.map(toEntry));
          setSynced(true);
        }
        setLoading(false);
      });
    // A fresh topic per mount: channel() returns an existing channel with the same
    // topic, and a channel still being removed (StrictMode remount) rejects new listeners.
    const channel = supabase
      .channel(`guestbook_notes_changes_${Date.now()}_${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guestbook_notes' }, payload => {
        if (payload.eventType === 'DELETE') {
          if (payload.old?.id) removeEntry(payload.old.id);
        } else if (payload.new?.id) {
          upsertEntry(toEntry(payload.new));
        }
      })
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  // For the signed-in user: are they an admin, and which notes have they liked.
  useEffect(() => {
    if (!supabase || !clerkLoaded) return undefined;
    if (!isSignedIn || !userId) {
      setIsAdmin(null);
      setLikedIds(new Set());
      return undefined;
    }
    let cancelled = false;
    (async () => {
      const [adminResult, likesResult] = await Promise.all([
        supabase.rpc('is_admin'),
        supabase.from('guestbook_likes').select('note_id').eq('user_id', userId),
      ]);
      if (cancelled) return;
      const failed = adminResult.error || likesResult.error;
      if (failed) console.error('[guestbook] Could not load your guestbook session:', failed);
      setIsAdmin(adminResult.data === true);
      setLikedIds(new Set((likesResult.data || []).map(row => row.note_id)));
      const announce = announceSignIn.current || window.sessionStorage.getItem(CLERK_SIGNIN_KEY) === '1';
      if (failed) {
        showToast('Sign in incomplete', 'Signed in, but the guestbook database could not be connected.', 'error');
      } else if (announce) {
        showToast('Sign in successful', "You're signed in. Leave a note whenever you're ready. 😊", 'success');
      }
      announceSignIn.current = false;
      try { window.sessionStorage.removeItem(CLERK_SIGNIN_KEY); } catch { /* no-op */ }
    })();
    return () => { cancelled = true; };
  }, [clerkLoaded, isSignedIn, userId]);

  function handleSignIn() {
    announceSignIn.current = true;
    try { window.sessionStorage.setItem(CLERK_SIGNIN_KEY, '1'); } catch { /* no-op */ }
    clerk.openSignIn({ forceRedirectUrl: window.location.href, signUpForceRedirectUrl: window.location.href });
  }

  async function handleSignOut() {
    await clerk.signOut({ redirectUrl: window.location.pathname });
    showToast('Signed out', 'You have been disconnected.', 'success');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!user || !supabase || !trimmedMessage || wordCount(trimmedMessage) > 100 || trimmedMessage.length > 500) return;
    setSending(true);
    try {
      // user_id, author_role, likes, pin state and created_at are set by the database.
      const { data, error } = await supabase
        .from('guestbook_notes')
        .insert({
          display_name: user.displayName || 'Visitor',
          photo_url: user.photoURL || null,
          message: trimmedMessage,
        })
        .select(NOTE_COLUMNS)
        .single();
      if (error) throw error;
      upsertEntry(toEntry(data));
      setMessage('');
      showToast('Note posted', 'Thanks for leaving a note! 😊', 'success');
    } catch {
      showToast('Could not post note', 'Your note could not be posted. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  }

  async function handleLike(entry) {
    if (!user || !supabase) return;
    if (likedIds.has(entry.id)) return;
    // user_id defaults to the Clerk user ID; a trigger bumps the note's like count.
    const { error } = await supabase.from('guestbook_likes').insert({ note_id: entry.id });
    if (error && error.code !== '23505') {
      showToast('Something went wrong', 'Your like could not be saved. Please try again.', 'error');
      throw error;
    }
    // 23505 = unique violation: this user already liked the note.
    setLikedIds(current => new Set(current).add(entry.id));
    await refreshEntry(entry.id);
  }

  async function handlePin(entry) {
    if (!isAdmin || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('guestbook_notes')
        .update(entry.pinned ? { pinned: false, pinned_at: null } : { pinned: true, pinned_at: new Date().toISOString() })
        .eq('id', entry.id)
        .select(NOTE_COLUMNS)
        .single();
      if (error) throw error;
      upsertEntry(toEntry(data));
      showToast(entry.pinned ? 'Note unpinned' : 'Note pinned', 'The guestbook note was updated.', 'success');
    } catch {
      showToast('Something went wrong', 'That action could not be completed. Please try again.', 'error');
    }
  }

  async function handleDelete(entry) {
    if (!isAdmin || !supabase || !window.confirm('Delete this guestbook note?')) return;
    try {
      // count: 'exact' tells an RLS-blocked delete (0 rows) apart from a real one.
      const { error, count } = await supabase.from('guestbook_notes').delete({ count: 'exact' }).eq('id', entry.id);
      if (error || count === 0) throw error || new Error('Note was not deleted');
      removeEntry(entry.id);
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
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return Date.parse(value) || 0;
    return 0;
  };
  const pinTime = entry => toMillis(entry.pinnedAt) || toMillis(entry.createdAt);
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
          {!supabaseReady ? (
            <p className="guestbook-muted">This section is temporarily unavailable. Please try again later.</p>
          ) : authLoading ? (
            <div className="gb-signin gb-signin-loading" role="status" aria-live="polite" aria-label="Loading sign-in">
              <span className="gb-skel gb-skel-icon" aria-hidden="true" />
              <span className="gb-skel gb-skel-text" aria-hidden="true" />
              <span className="gb-skel gb-skel-btn" aria-hidden="true" />
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
                  <button type="button" className="gb-signout" onClick={handleSignOut}>Sign out</button>
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
              <p>Sign in to leave a note.</p>
              <button type="button" className="gb-signin-btn" onClick={handleSignIn}>Sign in</button>
            </div>
          )}
        </div>

        <div className="guestbook-notes">
          <div className="guestbook-notes-heading"><div><p className="section-label">// recent messages</p><h2>Voices From Visitors</h2></div></div>
          {loading ? <div className="guestbook-grid gbn-skeleton-grid" role="status" aria-live="polite" aria-label="Loading notes">{NOTE_SKELETONS.map((lines, index) => <NoteSkeleton lines={lines} key={index} />)}</div> : entries.length === 0 ? <div className="guestbook-empty-state"><p>No notes yet.</p><small>Be the first to say hello.</small></div> : <>
            <div className="guestbook-grid">{sortedEntries.map(entry => <GuestbookCard entry={entry} user={user} isAdmin={isAdmin} hasLiked={Boolean(user && likedIds.has(entry.id))} onLike={handleLike} onRequireLogin={handleRequireLogin} onPin={handlePin} onDelete={handleDelete} key={entry.id} />)}</div>
          </>}
        </div>
      </section>
    </>
  );
}
