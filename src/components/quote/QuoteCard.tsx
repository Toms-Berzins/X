import React from 'react';
import { cn } from '../../lib/utils';
import type { QuoteData, QuoteStatus } from '../../types/Quote';
import { formatCurrency } from '../../pages/Quote';
import { StatusDropdown } from './StatusDropdown';

export interface QuoteCardProps {
  quote: QuoteData;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
  onStatusChange?: (quoteId: string, status: QuoteStatus) => void;
  interactive?: boolean;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  variant = 'default',
  className,
  onStatusChange,
  interactive = false,
}) => {
  const totalItems = quote.items.reduce((acc, item) => acc + item.quantity, 0);
  
  const baseClasses = 'rounded-lg shadow-sm transition-all duration-200';
  const variantClasses = {
    default: 'bg-white p-6 hover:shadow-md',
    compact: 'bg-gray-50 p-4',
    detailed: 'bg-white p-6 border border-gray-200 hover:border-indigo-200',
  };

  return (
    <article 
      className={cn(baseClasses, variantClasses[variant], className)}
      role="article"
      aria-label="Quote details"
      tabIndex={interactive ? 0 : undefined}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Quote #{quote.id}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(quote.createdAt).toLocaleDateString()}
          </p>
        </div>
        {interactive && onStatusChange ? (
          <StatusDropdown
            status={quote.status}
            onStatusChange={(status) => onStatusChange(quote.id, status)}
          />
        ) : (
          <span 
            className={cn(
              'px-2.5 py-0.5 rounded-full text-xs font-medium',
              {
                'bg-yellow-100 text-yellow-800': quote.status === 'pending',
                'bg-green-100 text-green-800': quote.status === 'approved',
                'bg-red-100 text-red-800': quote.status === 'rejected',
                'bg-blue-100 text-blue-800': quote.status === 'completed',
              }
            )}
          >
            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </span>
        )}
      </div>

      {/* Items Summary */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Items ({totalItems})</h4>
        <ul className="space-y-1">
          {quote.items.map((item, index) => (
            <li 
              key={index}
              className="text-sm text-gray-600 flex justify-between"
            >
              <span>{item.quantity}x {item.type}</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(item.basePrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Coating Details - Only show in detailed variant */}
      {variant === 'detailed' && quote.coating.type && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Coating Details</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Type</span>
              <p className="font-medium text-gray-900">{quote.coating.type}</p>
            </div>
            {quote.coating.color && (
              <div>
                <span className="text-gray-500">Color</span>
                <p className="font-medium text-gray-900">{quote.coating.color}</p>
              </div>
            )}
            {quote.coating.finish && (
              <div>
                <span className="text-gray-500">Finish</span>
                <p className="font-medium text-gray-900">{quote.coating.finish}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer with Total */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm">
          <span className="text-gray-500">Total</span>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(quote.total)}
          </p>
        </div>
      </div>
    </article>
  );
}; 