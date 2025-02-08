import { useState, useCallback, useEffect, useContext } from 'react';
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
import { db } from '../config/firebase';
import type { QuoteData, QuoteStatus } from '../types/Quote';
import { AuthContext } from '@/contexts/AuthContext';
import { useUserRole } from './useUserRole';

interface UseQuotesReturn {
  quotes: QuoteData[];
  loading: boolean;
  error: Error | null;
  isOffline: boolean;
  fetchQuotes: () => Promise<void>;
  updateQuoteStatus: (quoteId: string, status: QuoteStatus) => Promise<void>;
  retryConnection: () => Promise<void>;
}

export const useQuotes = (): UseQuotesReturn => {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const { currentUser } = useContext(AuthContext);
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

    let quotesQuery: Query | DatabaseReference;
    
    // Create appropriate query based on user role
    if (isAdmin) {
      // Admins can see all quotes
      quotesQuery = ref(db, 'quotes');
    } else {
      // Regular users can only see their own quotes
      quotesQuery = query(
        ref(db, 'quotes'),
        orderByChild('userId'),
        equalTo(currentUser.uid)
      );
    }
    
    // Set up real-time listener
    const unsubscribe = onValue(quotesQuery, 
      (snapshot) => {
        console.log('Got quotes snapshot, exists:', snapshot.exists());
        const quotesData: QuoteData[] = [];
        
        snapshot.forEach((childSnapshot) => {
          const quoteData = {
            id: childSnapshot.key,
            ...childSnapshot.val()
          } as QuoteData;
          quotesData.push(quoteData);
        });
        
        // Sort by createdAt in descending order
        quotesData.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        console.log('Total quotes found:', quotesData.length);
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
      console.log('Cleaning up quotes listener');
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
    if (!currentUser) {
      setQuotes([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let quotesQuery: Query | DatabaseReference;
      
      if (isAdmin) {
        quotesQuery = ref(db, 'quotes');
      } else {
        quotesQuery = query(
          ref(db, 'quotes'),
          orderByChild('userId'),
          equalTo(currentUser.uid)
        );
      }

      const snapshot = await get(quotesQuery);
      const quotesData: QuoteData[] = [];

      snapshot.forEach((childSnapshot) => {
        quotesData.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        } as QuoteData);
      });

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

  const updateQuoteStatus = useCallback(async (quoteId: string, status: QuoteStatus) => {
    if (!currentUser || !quoteId) return;

    try {
      const updates = {
        [`quotes/${quoteId}/status`]: status,
        [`quotes/${quoteId}/updatedAt`]: new Date().toISOString(),
        [`quotes/${quoteId}/updatedBy`]: currentUser.uid
      };

      await update(ref(db), updates);
      await fetchQuotes();
    } catch (err) {
      console.error('Error updating quote status:', err);
      throw err;
    }
  }, [currentUser, fetchQuotes]);

  const retryConnection = useCallback(async () => {
    await fetchQuotes();
  }, [fetchQuotes]);

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