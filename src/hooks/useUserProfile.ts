import { useState, useEffect } from 'react';
import { ref, onValue, off, get } from 'firebase/database';
import { db } from '../config/firebase';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  preferredContactMethod?: 'email' | 'phone';
  notifications?: {
    orderUpdates: boolean;
    promotions: boolean;
  };
  createdAt: string;
  updatedAt?: string;
}

export const useUserProfile = (userId: string | undefined) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setUserProfile(null);
      return;
    }

    const userRef = ref(db, `users/${userId}/profile`);
    setLoading(true);
    
    // First, get the initial data
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUserProfile(snapshot.val());
      } else {
        setUserProfile(null);
      }
      setLoading(false);
      setError(null);
    }).catch((error) => {
      setError(error);
      setLoading(false);
    });

    // Then, listen for changes
    const unsubscribe = onValue(userRef, 
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserProfile(data);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
        setError(null);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      off(userRef);
    };
  }, [userId]);

  const refreshProfile = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const snapshot = await get(ref(db, `users/${userId}/profile`));
      if (snapshot.exists()) {
        setUserProfile(snapshot.val());
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return { userProfile, loading, error, refreshProfile };
}; 