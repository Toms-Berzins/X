import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../../hooks/useQuote';
import { QuoteForm } from './QuoteForm';
import { Button } from '../shared/Button';

interface QuoteEditProps {
  id: string;
}

export const QuoteEdit: React.FC<QuoteEditProps> = ({ id }) => {
  const navigate = useNavigate();
  const { quote, loading, error, updateQuote } = useQuote(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error loading quote. Please try again later.</p>
      </div>
    );
  }

  const handleCancel = () => {
    navigate(`/quotes/${id}`);
  };

  const handleSave = async (updatedQuote: typeof quote) => {
    try {
      await updateQuote(updatedQuote);
      navigate(`/quotes/${id}`);
    } catch (error) {
      console.error('Failed to update quote:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Edit Quote #{quote.orderNumber}
        </h2>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      <QuoteForm
        initialData={quote}
        onSubmit={handleSave}
        submitLabel="Save Changes"
      />
    </div>
  );
}; 