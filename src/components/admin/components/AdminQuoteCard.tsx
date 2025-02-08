import React, { useState } from 'react';
import { QuoteCard, QuoteCardProps } from '@/components/quote/QuoteCard';
import { useQuote } from '@/hooks/useQuote';
import type { QuoteStatus } from '@/types/Quote';
import { toast } from 'react-hot-toast';

interface AdminQuoteCardProps extends Omit<QuoteCardProps, 'onStatusChange' | 'interactive'> {
  onStatusUpdated?: () => void;
  onDelete?: () => void;
}

export const AdminQuoteCard: React.FC<AdminQuoteCardProps> = ({
  quote,
  onStatusUpdated,
  onDelete,
  ...props
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateStatus } = useQuote(quote.id);

  const handleStatusChange = async (newStatus: QuoteStatus) => {
    try {
      setIsUpdating(true);
      await updateStatus(newStatus);
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
    <QuoteCard
      {...props}
      quote={quote}
      interactive
      onStatusChange={handleStatusChange}
      onDelete={onDelete}
      disabled={isUpdating}
    />
  );
}; 