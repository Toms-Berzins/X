import { useState } from 'react';
import { ref, set, update, remove, push } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Quote } from '../types/User';

export const useQuoteOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const createQuote = async (quoteData: Omit<Quote, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to create a quote');
    }

    setLoading(true);
    setError(null);

    try {
      const quotesRef = ref(db, 'quotes');
      const newQuoteRef = push(quotesRef);
      
      await set(newQuoteRef, {
        ...quoteData,
        userId: currentUser.uid,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setLoading(false);
      return newQuoteRef.key;
    } catch (err) {
      console.error('Error creating quote:', err);
      setError('Failed to create quote. Please try again later.');
      setLoading(false);
      throw err;
    }
  };

  const updateQuote = async (quoteId: string, updates: Partial<Quote>) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to update a quote');
    }

    setLoading(true);
    setError(null);

    try {
      const quoteRef = ref(db, `quotes/${quoteId}`);
      await update(quoteRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      setLoading(false);
    } catch (err) {
      console.error('Error updating quote:', err);
      setError('Failed to update quote. Please try again later.');
      setLoading(false);
      throw err;
    }
  };

  const deleteQuote = async (quoteId: string) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to delete a quote');
    }

    setLoading(true);
    setError(null);

    try {
      const quoteRef = ref(db, `quotes/${quoteId}`);
      await remove(quoteRef);
      setLoading(false);
    } catch (err) {
      console.error('Error deleting quote:', err);
      setError('Failed to delete quote. Please try again later.');
      setLoading(false);
      throw err;
    }
  };

  return {
    createQuote,
    updateQuote,
    deleteQuote,
    loading,
    error,
  };
}; 