import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from './firebase-admin.js';
import './loadEnv.js';

const createAdminUser = async () => {
  // Get environment variables
  const adminEmail = process.env.VITE_ADMIN_EMAIL;
  const adminPassword = process.env.VITE_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('Admin credentials not found in environment variables');
    process.exit(1);
  }

  try {
    console.log('Setting up admin user...');
    console.log('Email:', adminEmail);
    
    let userCredential;
    try {
      // Try to create new user
      userCredential = await createUserWithEmailAndPassword(
        auth,
        adminEmail,
        adminPassword
      );
      console.log('New admin user created in Firebase Auth');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        // If user exists, sign in instead
        console.log('Admin user already exists, signing in...');
        userCredential = await signInWithEmailAndPassword(
          auth,
          adminEmail,
          adminPassword
        );
      } else {
        throw error;
      }
    }
    
    // Add or update the user data in Realtime Database
    const userRef = ref(db, `users/${userCredential.user.uid}`);
    await set(userRef, {
      email: adminEmail,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('Admin user data saved to Realtime Database');
    console.log('Please change the password after first login');

    // Exit the process after completion
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin user:', error);
    process.exit(1);
  }
};

// Run the script
createAdminUser(); 