import { useState, useCallback, useEffect } from 'react';
import { 
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  update,
  onValue,
  off,
  Query,
  DatabaseReference
} from 'firebase/database';
import { db } from '../lib/firebase';
import type { QuoteData } from '../types/Quote';
import type { Quote } from '../types/User';
import { useAuth } from '../contexts/AuthContext';
import { useUserRole } from './useUserRole';

interface UseQuotesReturn {
  quotes: QuoteData[];
  loading: boolean;
  error: Error | null;
  isOffline: boolean;
  fetchQuotes: () => Promise<void>;
  updateQuoteStatus: (quoteId: string, status: Quote['status']) => Promise<void>;
  retryConnection: () => Promise<void>;
}

export const useQuotes = (): UseQuotesReturn => {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const { currentUser } = useAuth();
  const { isAdmin } = useUserRole();

  // Setup real-time listener
  useEffect(() => {
    if (!currentUser) {
      setQuotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Create appropriate query based on user role
    const quotesRef = ref(db, 'quotes');
    let quotesQuery: Query | DatabaseReference = quotesRef;

    if (!isAdmin) {
      // Regular users only see their own quotes
      quotesQuery = query(quotesRef, orderByChild('userId'), equalTo(currentUser.uid));
    }

    // Set up real-time listener
    const unsubscribe = onValue(quotesQuery, 
      (snapshot) => {
        const quotesData: QuoteData[] = [];
        snapshot.forEach((childSnapshot) => {
          quotesData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        
        // Sort by createdAt in descending order
        quotesData.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setQuotes(quotesData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching quotes:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch quotes'));
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, [currentUser, isAdmin]);

  // Set up connection state listener
  useEffect(() => {
    const connectedRef = ref(db, '.info/connected');
    const handleConnection = (snap: any) => {
      setIsOffline(!snap.val());
    };

    onValue(connectedRef, handleConnection);

    return () => {
      off(connectedRef, 'value', handleConnection);
    };
  }, []);

  const fetchQuotes = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const quotesRef = ref(db, 'quotes');
      let quotesQuery: Query | DatabaseReference = quotesRef;

      if (!isAdmin) {
        quotesQuery = query(quotesRef, orderByChild('userId'), equalTo(currentUser.uid));
      }

      const snapshot = await get(quotesQuery);
      const quotesData: QuoteData[] = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          quotesData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
      }

      // Sort by createdAt in descending order
      quotesData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setQuotes(quotesData);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch quotes'));
    } finally {
      setLoading(false);
    }
  }, [currentUser, isAdmin]);

  const updateQuoteStatus = async (quoteId: string, status: Quote['status']) => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const quoteRef = ref(db, `quotes/${quoteId}`);
      await update(quoteRef, {
        status,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.uid
      });

      // No need to manually fetch quotes as the real-time listener will update the state
    } catch (err) {
      console.error('Error updating quote status:', err);
      setError(err instanceof Error ? err : new Error('Failed to update quote status'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const retryConnection = async () => {
    setError(null);
    await fetchQuotes();
  };

  return {
    quotes,
    loading,
    error,
    isOffline,
    fetchQuotes,
    updateQuoteStatus,
    retryConnection
  };
}; 