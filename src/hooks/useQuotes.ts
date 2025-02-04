import { useEffect, useState } from 'react';
import { ref, query, orderByChild, equalTo, onValue, DatabaseReference, Query, limitToLast } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useUserRole } from './useUserRole';
import type { Quote } from '../types/User';

export const useQuotes = (userOnly: boolean = false, limit: number = 100) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!currentUser || roleLoading) {
      setQuotes([]);
      setLoading(false);
      return;
    }

    const quotesRef = ref(db, 'quotes');
    let queryRef: DatabaseReference | Query;

    // If not admin or userOnly is true, only fetch user's quotes
    if (!isAdmin || userOnly) {
      queryRef = query(
        quotesRef,
        orderByChild('userId'),
        equalTo(currentUser.uid),
        limitToLast(limit)
      );
    } else {
      // For admin, order by createdAt to use the index
      queryRef = query(
        quotesRef,
        orderByChild('createdAt'),
        limitToLast(limit)
      );
    }

    const unsubscribe = onValue(
      queryRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const quotesData: Quote[] = [];
          snapshot.forEach((childSnapshot) => {
            quotesData.push({
              id: childSnapshot.key as string,
              ...childSnapshot.val()
            });
          });
          // Sort by createdAt in descending order
          quotesData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setQuotes(quotesData);
        } else {
          setQuotes([]);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching quotes:', err);
        setError('Failed to fetch quotes. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, userOnly, isAdmin, roleLoading, limit]);

  return { quotes, loading: loading || roleLoading, error };
}; 