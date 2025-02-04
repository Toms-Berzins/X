import { useEffect, useState } from 'react';
import { ref, query, orderByChild, equalTo, onValue, DatabaseReference, Query } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Quote } from '../types/User';

export const useQuotes = (userOnly: boolean = false) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setQuotes([]);
      setLoading(false);
      return;
    }

    const quotesRef = ref(db, 'quotes');
    let queryRef: DatabaseReference | Query = quotesRef;

    if (userOnly) {
      queryRef = query(quotesRef, orderByChild('userId'), equalTo(currentUser.uid));
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
  }, [currentUser, userOnly]);

  return { quotes, loading, error };
}; 