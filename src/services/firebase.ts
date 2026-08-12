import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  // Dynamically attempt loading firebase config
  const configModules = (import.meta as any).glob('/firebase-applet-config.json', { eager: true });
  const configKeys = Object.keys(configModules);

  if (configKeys.length > 0) {
    const firebaseConfig = (configModules[configKeys[0]] as any).default || configModules[configKeys[0]];
    if (firebaseConfig && firebaseConfig.apiKey) {
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      auth = getAuth(app);
      db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
      console.log('Firebase initialized successfully.');
    }
  }
} catch (e) {
  console.warn('Firebase config not detected or failed to load. Operating with offline/localStorage persistence mode.');
}

export { app, auth, db };
