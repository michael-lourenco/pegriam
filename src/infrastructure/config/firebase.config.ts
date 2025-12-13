/**
 * Configuração do Firebase
 * 
 * Configuração para autenticação via Firebase Auth.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (app) {
    return app;
  }

  const apps = getApps();
  if (apps.length > 0) {
    app = apps[0];
    return app;
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Firebase configuration is missing. Check your .env file.');
  }

  app = initializeApp(firebaseConfig);
  return app;
}

export function getFirebaseAuth(): Auth {
  if (auth) {
    return auth;
  }

  const firebaseApp = getFirebaseApp();
  auth = getAuth(firebaseApp);
  return auth;
}


