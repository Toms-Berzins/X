import { useState, useEffect, useCallback, useContext } from 'react';
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from '../config/firebase';
import { AuthContext } from '@/contexts/AuthContext';
import { useUserRole } from './useUserRole';
import type { Quote, QuoteStatus } from '../types/Quote';
import { toast } from 'react-hot-toast';

class QuoteOperationError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'QuoteOperationError';
    this.code = code;
  }
}

interface UseQuoteReturn {
  quote: Quote | null;
  loading: boolean;
  error: Error | null;
  updateQuote: (updates: Partial<Quote>) => Promise<void>;
  deleteQuote: () => Promise<void>;
  updateStatus: (status: QuoteStatus) => Promise<void>;
  isStatusMenuOpen: boolean;
  selectedStatus: QuoteStatus | null;
  openStatusMenu: (currentStatus: QuoteStatus) => void;
  closeStatusMenu: () => void;
  getStatusColor: (status: QuoteStatus) => string;
  statusOptions: QuoteStatus[];
}

export const useQuote = (id: string): UseQuoteReturn => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<QuoteStatus | null>(null);
  const { currentUser } = useContext(AuthContext);
  const { isAdmin } = useUserRole();

  // Status menu functions
  const openStatusMenu = useCallback((currentStatus: QuoteStatus) => {
    setSelectedStatus(currentStatus);
    setIsStatusMenuOpen(true);
  }, []);

  const closeStatusMenu = useCallback(() => {
    setIsStatusMenuOpen(false);
    setSelectedStatus(null);
  }, []);

  const getStatusColor = useCallback((status: QuoteStatus): string => {
    const colors = {
      pending: 'text-yellow-800 bg-yellow-100',
      approved: 'text-green-800 bg-green-100',
      rejected: 'text-red-800 bg-red-100',
      completed: 'text-blue-800 bg-blue-100',
    };
    return colors[status] || colors.pending;
  }, []);

  const statusOptions: QuoteStatus[] = ['pending', 'approved', 'rejected', 'completed'];

  // Error handling
  const handleError = (err: any, customMessage: string) => {
    console.error(customMessage, err);
    const errorMessage = err.code === 'PERMISSION_DENIED' 
      ? 'You do not have permission to perform this action'
      : 'An error occurred. Please try again later.';
    setError(new Error(errorMessage));
    toast.error(errorMessage);
    throw err;
  };

  // Permission check
  const checkPermission = () => {
    if (!currentUser) {
      throw new QuoteOperationError('You must be logged in', 'UNAUTHENTICATED');
    }
    if (!isAdmin && quote?.userId !== currentUser.uid) {
      throw new QuoteOperationError('You do not have permission to modify this quote', 'PERMISSION_DENIED');
    }
  };

  // Quote operations
  const updateQuote = async (updates: Partial<Quote>) => {
    try {
      checkPermission();
      const quoteRef = ref(db, `quotes/${id}`);
      await update(quoteRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleError(err, 'Error updating quote:');
    }
  };

  const deleteQuote = async () => {
    try {
      checkPermission();
      const quoteRef = ref(db, `quotes/${id}`);
      await remove(quoteRef);
    } catch (err) {
      handleError(err, 'Error deleting quote:');
    }
  };

  const updateStatus = async (status: QuoteStatus) => {
    try {
      if (!isAdmin) {
        throw new QuoteOperationError('Only administrators can update quote status', 'PERMISSION_DENIED');
      }
      await updateQuote({ status });
      closeStatusMenu();
    } catch (err) {
      handleError(err, 'Error updating quote status:');
    }
  };

  // Fetch quote data
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setError(new Error('No authenticated user'));
      return;
    }

    const quoteRef = ref(db, `quotes/${id}`);
    const unsubscribe = onValue(quoteRef, (snapshot) => {
      if (snapshot.exists()) {
        const quoteData = snapshot.val() as Quote;
        // Only allow access if user is admin or quote owner
        if (isAdmin || quoteData.userId === currentUser.uid) {
          setQuote(quoteData);
          setError(null);
        } else {
          setError(new Error('You do not have permission to view this quote'));
        }
      } else {
        setError(new Error('Quote not found'));
      }
      setLoading(false);
    }, (error) => {
      setError(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, currentUser, isAdmin]);

  return {
    quote,
    loading,
    error,
    updateQuote,
    deleteQuote,
    updateStatus,
    isStatusMenuOpen,
    selectedStatus,
    openStatusMenu,
    closeStatusMenu,
    getStatusColor,
    statusOptions,
  };
}; 