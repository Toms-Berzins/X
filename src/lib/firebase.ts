import { initializeApp } from 'firebase/app';
import { getAuth, browserPopupRedirectResolver, browserLocalPersistence, initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: 'https://powder-af9c6-default-rtdb.europe-west1.firebasedatabase.app'
};

// Check if any required environment variables are missing
const missingVars = Object.entries(firebaseConfig).filter(([_, value]) => !value);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.map(([key]) => key).join(', ')}\n` +
    'Please check your .env file and ensure all required variables are set.'
  );
}

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Auth with custom settings
export const auth: Auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});

export const db: Database = getDatabase(app);
export default app; 