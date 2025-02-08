import React, { createContext, useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateEmail,
  updatePassword,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { ref, update, get, child } from 'firebase/database';
import type { ProfileFormData } from '../components/user/profile/types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  updateUserProfile: (data: ProfileFormData) => Promise<void>;
  updateUserEmail: (newEmail: string, currentPassword: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (result.user) {
      await sendEmailVerification(result.user);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const verifyEmail = async () => {
    if (currentUser) {
      await sendEmailVerification(currentUser);
    }
  };

  const updateUserProfile = async (data: ProfileFormData) => {
    if (!currentUser) throw new Error('No user logged in');
    
    try {
      console.log('Updating profile with data:', data);

      // Update Firebase Auth profile (only supports displayName and photoURL)
      await firebaseUpdateProfile(currentUser, {
        displayName: data.displayName,
      });

      // Create a reference to the user's profile
      const userRef = ref(db, `users/${currentUser.uid}`);
      
      // Clean and prepare profile data - remove undefined/empty string values
      const profileData: Record<string, any> = {
        name: data.displayName || null,
        email: data.email || null,
        phone: data.phone || null,
        company: data.company || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,
        preferredContactMethod: data.preferredContactMethod || 'email',
        notifications: {
          orderUpdates: data.notifications?.orderUpdates ?? true,
          promotions: data.notifications?.promotions ?? false
        },
        updatedAt: new Date().toISOString()
      };

      // Remove null values to prevent overwriting existing data with nulls
      Object.keys(profileData).forEach(key => {
        if (profileData[key] === null || profileData[key] === '') {
          delete profileData[key];
        }
      });

      // Update user data - only include non-null values
      const updates = {
        profile: profileData,
        displayName: data.displayName || null,
        updatedAt: new Date().toISOString()
      };

      console.log('Writing updates to path:', userRef.toString());
      console.log('Update data:', updates);

      // Update database
      await update(userRef, updates);

      // Verify the update
      const snapshot = await get(child(userRef, 'profile'));
      if (!snapshot.exists()) {
        throw new Error('Profile data not saved');
      }
      
      console.log('Saved profile data:', snapshot.val());

      // Force a refresh of the user object to get updated profile
      await currentUser.reload();
      
      console.log('Profile updated successfully');
      return snapshot.val();
    } catch (error) {
      console.error('Error updating profile:', error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      throw new Error('Failed to update profile');
    }
  };

  const updateUserEmail = async (newEmail: string, currentPassword: string) => {
    if (!currentUser) throw new Error('No user logged in');
    
    // Re-authenticate user before updating email (required by Firebase)
    const credential = signInWithEmailAndPassword(auth, currentUser.email!, currentPassword);
    await credential;
    
    await updateEmail(currentUser, newEmail);
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!currentUser) throw new Error('No user logged in');
    
    // Re-authenticate user before updating password (required by Firebase)
    const credential = signInWithEmailAndPassword(auth, currentUser.email!, currentPassword);
    await credential;
    
    await updatePassword(currentUser, newPassword);
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
    verifyEmail,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 