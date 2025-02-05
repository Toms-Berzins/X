import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import type { QuoteData, QuoteStatus } from '../types/Quote';
import { useAuth } from '../contexts/AuthContext';

interface UseQuotesReturn {
  quotes: QuoteData[];
  loading: boolean;
  error: Error | null;
  fetchQuotes: (userId?: string) => Promise<void>;
  updateQuoteStatus: (quoteId: string, status: QuoteStatus) => Promise<void>;
}

export const useQuotes = (): UseQuotesReturn => {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useAuth();

  const fetchQuotes = useCallback(async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const quotesRef = collection(firestore, 'quotes');
      let quotesQuery = query(quotesRef, orderBy('createdAt', 'desc'));

      if (userId) {
        quotesQuery = query(quotesRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
      }

      const querySnapshot = await getDocs(quotesQuery);
      const fetchedQuotes: QuoteData[] = [];

      querySnapshot.forEach((doc) => {
        fetchedQuotes.push({
          id: doc.id,
          ...doc.data(),
        } as QuoteData);
      });

      setQuotes(fetchedQuotes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch quotes'));
      console.error('Error fetching quotes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuoteStatus = useCallback(async (quoteId: string, status: QuoteStatus) => {
    setError(null);
    try {
      const quoteRef = doc(firestore, 'quotes', quoteId);
      await updateDoc(quoteRef, {
        status,
        updatedAt: new Date().toISOString(),
      });

      setQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote.id === quoteId
            ? { ...quote, status, updatedAt: new Date().toISOString() }
            : quote
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update quote status'));
      console.error('Error updating quote status:', err);
      throw err;
    }
  }, []);

  return {
    quotes,
    loading,
    error,
    fetchQuotes,
    updateQuoteStatus,
  };
}; 