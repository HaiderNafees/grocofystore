'use client';
import type { ReactNode } from 'react';
import { app, firebaseAuth, db } from './index';
import { FirebaseProvider } from './provider';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * A client-side component that initializes Firebase and provides it to the component tree.
 * This ensures that Firebase is only initialized once on the client.
 */
export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const firebaseContextValue = {
    firebaseApp: app,
    auth: firebaseAuth,
    firestore: db,
  };

  return (
    <FirebaseProvider value={firebaseContextValue}>{children}</FirebaseProvider>
  );
}
