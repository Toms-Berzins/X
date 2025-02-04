import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/User';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setRole(null);
      setLoading(false);
      return;
    }

    const userRef = ref(db, `users/${currentUser.uid}`);
    const unsubscribe = onValue(userRef, 
      (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setRole(userData.role as UserRole);
        } else {
          setRole('user'); // Default role for new users
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching user role:', err);
        setError('Failed to fetch user role. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const isAdmin = role === 'admin';
  const isUser = role === 'user';

  return { role, loading, error, isAdmin, isUser };
}; 