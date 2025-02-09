import { useState } from 'react';
import type { QuoteData } from '../types/Quote';
import type { QuoteStatus } from '../types/QuoteStatus';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const useQuoteOperations = () => {
  const [loading, setLoading] = useState(false);

  const updateQuoteStatus = async (quoteId: string, newStatus: QuoteStatus) => {
    setLoading(true);
    try {
      const quoteRef = doc(db, 'quotes', quoteId);
      await updateDoc(quoteRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Error updating quote status:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteTrackingNumber = async (quoteId: string, trackingNumber: string) => {
    setLoading(true);
    try {
      const quoteRef = doc(db, 'quotes', quoteId);
      await updateDoc(quoteRef, {
        trackingNumber,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Error updating tracking number:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuote = async (quoteId: string, quoteData: Partial<QuoteData>) => {
    setLoading(true);
    try {
      const quoteRef = doc(db, 'quotes', quoteId);
      await updateDoc(quoteRef, {
        ...quoteData,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Error updating quote:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateQuoteStatus,
    updateQuoteTrackingNumber,
    updateQuote,
  };
}; 