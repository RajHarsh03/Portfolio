import { getApp, getApps, initializeApp } from 'firebase/app';
import { browserSessionPersistence, getAuth, GoogleAuthProvider, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// The live site canonicalizes to www.harshx.in. Redirect Auth must use that
// exact origin, where Vercel proxies /__/auth/* to Firebase's helper pages.
const isProductionDomain = typeof window !== 'undefined' && window.location.hostname === 'www.harshx.in';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: isProductionDomain ? 'www.harshx.in' : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

const app = firebaseReady ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const googleProvider = new GoogleAuthProvider();

export const authPersistenceReady = auth
  ? setPersistence(auth, browserSessionPersistence)
  : Promise.resolve();
