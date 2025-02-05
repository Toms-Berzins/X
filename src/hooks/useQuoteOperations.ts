import { useState } from 'react';
import { ref, set, update, remove, push } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useUserRole } from './useUserRole';
import type { Quote } from '../types/User';
import type { QuoteStatus } from '../types/Quote';
import { toast } from 'react-hot-toast';

class QuoteOperationError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'QuoteOperationError';
    this.code = code;
  }
}

export const useQuoteOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { isAdmin } = useUserRole();

  const handleError = (err: any, customMessage: string) => {
    console.error(customMessage, err);
    const errorMessage = err.code === 'PERMISSION_DENIED' 
      ? 'You do not have permission to perform this action. Please ensure you are logged in as an admin.'
      : 'An error occurred. Please try again later.';
    setError(errorMessage);
    toast.error(errorMessage);
    throw err;
  };

  const checkAdminPermission = () => {
    if (!isAdmin) {
      throw new QuoteOperationError('Only administrators can perform this action', 'PERMISSION_DENIED');
    }
  };

  const createQuote = async (quoteData: Omit<Quote, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) {
      throw new QuoteOperationError('User must be authenticated to create a quote', 'UNAUTHENTICATED');
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
        updatedBy: currentUser.uid
      });

      toast.success('Quote created successfully');
      setLoading(false);
      return newQuoteRef.key;
    } catch (err) {
      handleError(err, 'Error creating quote:');
    }
  };

  const updateQuoteStatus = async (quoteId: string, status: QuoteStatus) => {
    if (!currentUser) {
      throw new QuoteOperationError('User must be authenticated to update a quote', 'UNAUTHENTICATED');
    }

    try {
      checkAdminPermission();

      setLoading(true);
      setError(null);

      const quoteRef = ref(db, `quotes/${quoteId}`);
      await update(quoteRef, {
        status,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.uid
      });
      
      setLoading(false);
    } catch (err) {
      handleError(err, 'Error updating quote status:');
    }
  };

  const deleteQuote = async (quoteId: string) => {
    if (!currentUser) {
      throw new QuoteOperationError('User must be authenticated to delete a quote', 'UNAUTHENTICATED');
    }

    try {
      checkAdminPermission();

      setLoading(true);
      setError(null);

      const quoteRef = ref(db, `quotes/${quoteId}`);
      await remove(quoteRef);
      
      setLoading(false);
    } catch (err) {
      handleError(err, 'Error deleting quote:');
    }
  };

  const updateQuote = async (quoteId: string, updates: Partial<Quote>) => {
    if (!currentUser) {
      throw new QuoteOperationError('User must be authenticated to update a quote', 'UNAUTHENTICATED');
    }

    try {
      checkAdminPermission();

      setLoading(true);
      setError(null);

      const quoteRef = ref(db, `quotes/${quoteId}`);
      await update(quoteRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.uid
      });
      
      setLoading(false);
    } catch (err) {
      handleError(err, 'Error updating quote:');
    }
  };

  return {
    createQuote,
    updateQuoteStatus,
    deleteQuote,
    updateQuote,
    loading,
    error,
  };
}; 