import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, push, set } from 'firebase/database';
import { db } from '../config/firebase';
import { AuthContext } from '@/contexts/AuthContext';
import type { QuoteData, QuoteStatus } from '../types/Quote';
import { toast } from 'react-hot-toast';

const initialQuoteData: QuoteData = {
  id: '',
  userId: '',
  orderNumber: '',
  status: 'pending' as QuoteStatus,
  items: [],
  coating: {
    type: '',
    color: '',
    finish: '',
  },
  additionalServices: {
    sandblasting: false,
    priming: false,
  },
  contactInfo: {
    name: '',
    email: '',
    phone: '',
  },
  total: 0,
  discount: 0,
  createdAt: '',
  images: [],
};

export const useQuoteForm = (initialData?: Partial<QuoteData>) => {
  const [quoteData, setQuoteData] = useState<QuoteData>({
    ...initialQuoteData,
    ...initialData,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const updateQuoteData = (updates: Partial<QuoteData>) => {
    setQuoteData(prev => ({ ...prev, ...updates }));
  };

  const validateCurrentStep = (step: number, data: QuoteData): boolean => {
    switch (step) {
      case 1: // Items
        return data.items.length > 0;
      case 2: // Coating
        return Boolean(data.coating.type && data.coating.color && data.coating.finish);
      case 3: // Additional Services
        // Step 3 is optional, so always valid
        return true;
      case 4: // Contact Info
        return Boolean(
          data.contactInfo?.name &&
          data.contactInfo?.email &&
          data.contactInfo?.phone
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep(currentStep, quoteData)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      const errorMessages = {
        1: 'Please add at least one item to continue',
        2: 'Please select coating type, color, and finish to continue',
        4: 'Please fill in all required contact information'
      };
      toast.error(errorMessages[currentStep as keyof typeof errorMessages] || 'Please complete all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculateTotal = (data: QuoteData) => {
    let subtotal = data.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // Apply bulk discounts
    const totalItems = data.items.reduce((acc, item) => acc + item.quantity, 0);
    if (totalItems >= 50) {
      data.discount = 15;
    } else if (totalItems >= 25) {
      data.discount = 10;
    } else if (totalItems >= 10) {
      data.discount = 5;
    }

    // Apply discount
    if (data.discount > 0) {
      subtotal = subtotal * (1 - data.discount / 100);
    }

    return subtotal;
  };

  const submitQuote = async () => {
    if (!currentUser) {
      throw new Error('You must be logged in to submit a quote');
    }

    setLoading(true);
    setError(null);

    try {
      const newQuote = {
        ...quoteData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        total: calculateTotal(quoteData),
        orderNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
      };

      const quotesRef = ref(db, 'quotes');
      const newQuoteRef = push(quotesRef);
      newQuote.id = newQuoteRef.key!;

      await set(newQuoteRef, newQuote);
      navigate('/quotes/' + newQuote.id);
      toast.success('Quote created successfully');
      return newQuote;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to submit quote');
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async (quoteData: Omit<QuoteData, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) {
      throw new Error('You must be logged in to create a quote');
    }

    setLoading(true);
    setError(null);

    try {
      const quotesRef = ref(db, 'quotes');
      const newQuoteRef = push(quotesRef);
      const newQuote: QuoteData = {
        ...quoteData,
        id: newQuoteRef.key!,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      };

      await set(newQuoteRef, newQuote);
      toast.success('Quote created successfully');
      return newQuote;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create quote');
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    quoteData,
    currentStep,
    updateQuoteData,
    nextStep,
    prevStep,
    loading,
    error,
    submitQuote,
    createQuote,
    setCurrentStep
  };
}; 