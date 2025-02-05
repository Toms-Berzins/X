import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import type { ServiceAccount } from 'firebase-admin/app';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin with service account
const serviceAccount: ServiceAccount = {
  projectId: "powder-af9c6",
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: "firebase-adminsdk-aqxvw@powder-af9c6.iam.gserviceaccount.com"
};

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://powder-af9c6-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = getDatabase(app);

const initialServices = {
  service1: {
    title: 'Powder Coating',
    description: 'Professional powder coating services for all types of metal surfaces.',
    icon: '🎨',
    order: 1
  },
  service2: {
    title: 'Sandblasting',
    description: 'Surface preparation and cleaning using advanced sandblasting techniques.',
    icon: '🌪️',
    order: 2
  },
  service3: {
    title: 'Custom Finishes',
    description: 'Specialized coating solutions for unique requirements and designs.',
    icon: '✨',
    order: 3
  }
};

const init = async () => {
  try {
    const servicesRef = db.ref('services');
    await servicesRef.set(initialServices);
    console.log('Services initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing services:', error);
    process.exit(1);
  }
};

init(); 