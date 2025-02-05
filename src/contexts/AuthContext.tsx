import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { ref, update } from 'firebase/database';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isEmailVerified: boolean;
  updateUserProfile: (data: any) => Promise<void>;
  updateUserEmail: (newEmail: string, currentPassword: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  reauthenticate: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  isEmailVerified: false,
  updateUserProfile: async () => {},
  updateUserEmail: async () => {},
  updateUserPassword: async () => {},
  reauthenticate: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        // Reload user to get latest verification status
        await user.reload();
        setIsEmailVerified(user.emailVerified);
      } else {
        setIsEmailVerified(false);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateUserProfile = async (data: any) => {
    if (!currentUser) throw new Error('No user logged in');
    
    const userRef = ref(db, `users/${currentUser.uid}/profile`);
    await update(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  };

  const reauthenticate = async (password: string) => {
    if (!currentUser || !currentUser.email) throw new Error('No user logged in');
    
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
  };

  const updateUserEmail = async (newEmail: string, currentPassword: string) => {
    if (!currentUser) throw new Error('No user logged in');

    try {
      // First reauthenticate
      await reauthenticate(currentPassword);
      
      // Then update email
      await updateEmail(currentUser, newEmail);
      
      // Update in Realtime Database
      const userRef = ref(db, `users/${currentUser.uid}`);
      await update(userRef, {
        email: newEmail,
        updatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please log in again to change your email');
      }
      throw error;
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!currentUser) throw new Error('No user logged in');

    try {
      // First reauthenticate
      await reauthenticate(currentPassword);
      
      // Then update password
      await updatePassword(currentUser, newPassword);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please log in again to change your password');
      }
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    isEmailVerified,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    reauthenticate,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 