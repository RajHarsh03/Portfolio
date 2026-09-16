import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, firebaseReady } from '../../services/firebase.js';

function formatDate(value) {
    if (!value) return 'Recently';
    const date = value.toDate ? value.toDate() : new Date(value);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function GuestbookPreview() {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        if (!firebaseReady || !db) return undefined;
        const entriesQuery = query(
            collection(db, 'guestbook_entries'),
            orderBy('createdAt', 'desc'),
            limit(1),
        );
        return onSnapshot(entriesQuery, snapshot => {
            setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, () => setEntries([]));
    }, []);

    return (
        <section className="guestbook-preview" aria-label="Guestbook preview">
            <div className="guestbook-preview-header">
                <div>
                    <div className="section-label">// visitor notes</div>
                    <h2 className="section-title">Guestbook</h2>
                </div>
                <a className="guestbook-preview-link" href="/guestbook">
                    <span>Open guestbook</span>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                    </svg>
                </a>
            </div>
            {entries.length > 0 ? (
                <div className="guestbook-preview-marquee">
                    <div className="guestbook-preview-track is-static">
                        {entries.map(entry => (
                            <article className="guestbook-preview-card" key={entry.id}>
                                <div className="guestbook-author">
                                    {entry.photoURL ? <img src={entry.photoURL} alt="" /> : <span>{(entry.displayName || 'V').charAt(0).toUpperCase()}</span>}
                                    <div>
                                        <strong>{entry.displayName || 'Visitor'}</strong>
                                        <small className={entry.authorRole === 'Admin' || entry.authorEmail?.toLowerCase() === 'rajharsh.devx@gmail.com' || entry.displayName?.trim().toLowerCase() === 'harsh raj' || entry.userId === 'VqE9wVvuIZXMoMjOlPtw8J3V6Go2' ? 'guestbook-role role-admin' : 'guestbook-role role-visitor'}>{entry.authorRole === 'Admin' || entry.authorEmail?.toLowerCase() === 'rajharsh.devx@gmail.com' || entry.displayName?.trim().toLowerCase() === 'harsh raj' || entry.userId === 'VqE9wVvuIZXMoMjOlPtw8J3V6Go2' ? 'Admin' : 'Visitor'}</small>
                                    </div>
                                </div>
                                <p>{entry.message}</p>
                                <div className="guestbook-preview-card-footer">
                                    <small>{formatDate(entry.createdAt)}</small>
                                    <span>{entry.pinned ? 'Pri' : ''} <span className="guestbook-preview-heart" aria-hidden="true">♡</span> {entry.likes || 0}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="guestbook-empty-state guestbook-preview-empty">
                    <p>Leave the first note on the wall.</p>
                </div>
            )}
        </section>
    );
}
