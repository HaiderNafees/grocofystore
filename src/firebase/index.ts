'use client';
import { getAnalytics } from 'firebase/analytics';
import {
  initializeApp,
  getApp,
  getApps,
  type FirebaseApp,
} from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// Initialize Firebase
// This function is guarded to only run once, ensuring no duplicate instances.
function initializeFirebase() {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
    if (typeof window !== 'undefined') {
      // Enable analytics. https://firebase.google.com/docs/analytics/web/start
      if ('measurementId' in firebaseConfig) {
        getAnalytics(firebaseApp);
      }
    }
  } else {
    firebaseApp = getApp();
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }
  return { firebaseApp, auth, firestore };
}

// Export the initialized services
export const {
  firebaseApp: app,
  auth: firebaseAuth,
  firestore: db,
} = initializeFirebase();

export {
  FirebaseProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
  FirebaseClientProvider,
} from './provider';

export { useUser } from './auth/use-user';
