/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv extends ImportMetaEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  // Add more env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 