'use client';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

// Define the shape of the context value
interface FirebaseContextValue {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

// Create the context with an undefined initial value
const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

// Define the props for the provider component
interface FirebaseProviderProps {
  children: ReactNode;
  value: FirebaseContextValue;
}

/**
 * Provides Firebase services (app, auth, firestore) to its children components.
 */
export function FirebaseProvider({ children, value }: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

/**
 * Custom hook to access the entire Firebase context value.
 * Throws an error if used outside of a FirebaseProvider.
 */
export const useFirebase = (): FirebaseContextValue => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

/**
 * Custom hook to access the FirebaseApp instance.
 */
export const useFirebaseApp = (): FirebaseApp => {
  return useFirebase().firebaseApp;
};

/**
 * Custom hook to access the FirebaseAuth instance.
 */
export const useAuth = (): Auth => {
  return useFirebase().auth;
};

/**
 * Custom hook to access the FirebaseFirestore instance.
 */
export const useFirestore = (): Firestore => {
  return useFirebase().firestore;
};

export { FirebaseClientProvider } from './client-provider';
