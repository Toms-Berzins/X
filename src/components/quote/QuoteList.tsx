import React from 'react';
import { QuoteCard } from './QuoteCard';
import type { QuoteData, QuoteStatus } from '../../types/Quote';
import { cn } from '../../lib/utils';

interface QuoteListProps {
  quotes: QuoteData[];
  variant?: 'default' | 'compact' | 'detailed';
  onStatusChange?: (quoteId: string, status: QuoteStatus) => void;
  emptyMessage?: string;
  className?: string;
}

export const QuoteList: React.FC<QuoteListProps> = ({
  quotes,
  variant = 'default',
  onStatusChange,
  emptyMessage = 'No quotes found',
  className,
}) => {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'space-y-4',
        className
      )}
      role="list"
      aria-label="Quotes list"
    >
      {quotes.map((quote) => (
        <QuoteCard
          key={quote.id}
          quote={quote}
          variant={variant}
          onStatusChange={
            onStatusChange ? (status) => onStatusChange(quote.id, status) : undefined
          }
          interactive={!!onStatusChange}
        />
      ))}
    </div>
  );
}; 