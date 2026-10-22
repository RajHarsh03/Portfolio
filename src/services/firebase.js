import { getApp, getApps, initializeApp } from 'firebase/app';
import { browserPopupRedirectResolver, browserSessionPersistence, getAuth, GoogleAuthProvider, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Redirect authentication must use the same origin as the production app.
// Vercel transparently proxies /__/auth/* to Firebase (see vercel.json), so
// Firebase's helper iframe can use first-party storage instead of being
// blocked as a third-party firebaseapp.com frame.
const isProductionDomain = typeof window !== 'undefined' && window.location.hostname === 'harshx.in';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: isProductionDomain ? 'harshx.in' : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

const app = firebaseReady ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;

let configuredAuth = null;
if (app) {
  try {
    configuredAuth = initializeAuth(app, {
      persistence: browserSessionPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    configuredAuth = getAuth(app);
  }
}

export const auth = configuredAuth;
export const db = app ? getFirestore(app) : null;
export const googleProvider = new GoogleAuthProvider();

export const authPersistenceReady = Promise.resolve();

export const authReady = auth
  ? authPersistenceReady.then(() => auth.authStateReady())
  : Promise.resolve();
