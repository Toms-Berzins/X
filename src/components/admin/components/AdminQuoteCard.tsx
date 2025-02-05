import React, { useState } from 'react';
import { QuoteCard, QuoteCardProps } from '@/components/quote/QuoteCard';
import { useQuoteOperations } from '@/hooks/useQuoteOperations';
import type { QuoteStatus } from '@/types/Quote';
import { toast } from 'react-hot-toast';

interface AdminQuoteCardProps extends Omit<QuoteCardProps, 'onStatusChange' | 'interactive'> {
  onStatusUpdated?: () => void;
}

export const AdminQuoteCard: React.FC<AdminQuoteCardProps> = ({
  quote,
  onStatusUpdated,
  ...props
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateQuoteStatus } = useQuoteOperations();

  const handleStatusChange = async (newStatus: QuoteStatus) => {
    try {
      setIsUpdating(true);
      await updateQuoteStatus(quote.id, newStatus);
      toast.success(`Quote #${quote.id} status updated to ${newStatus}`);
      onStatusUpdated?.();
    } catch (error) {
      toast.error('Failed to update quote status');
      console.error('Error updating quote status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      )}
      <QuoteCard
        {...props}
        quote={quote}
        interactive={true}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}; 