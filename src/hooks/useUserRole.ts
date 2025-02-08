import { useState, useEffect, useContext } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../config/firebase';
import { AuthContext } from '@/contexts/AuthContext';

export const useUserRole = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const userRoleRef = ref(db, `users/${currentUser.uid}/role`);
        const snapshot = await get(userRoleRef);
        
        if (snapshot.exists()) {
          setIsAdmin(snapshot.val() === 'admin');
        } else {
          // If no role is set, default to regular user
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setError(error instanceof Error ? error : new Error('Failed to check user role'));
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [currentUser]);

  return { isAdmin, loading, error };
}; 