import { ref, set } from 'firebase/database';
import { db } from '../lib/firebase.js';

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

export const initializeServices = async () => {
  try {
    const servicesRef = ref(db, 'services');
    await set(servicesRef, initialServices);
    console.log('Services initialized successfully');
  } catch (error) {
    console.error('Error initializing services:', error);
  }
}; 