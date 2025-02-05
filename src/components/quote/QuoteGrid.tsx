import React, { useState, useMemo } from 'react';
import { QuoteCard } from './QuoteCard';
import type { QuoteData, QuoteStatus } from '../../types/Quote';
import { cn } from '../../lib/utils';

interface QuoteGridProps {
  quotes: QuoteData[];
  onStatusChange?: (quoteId: string, status: QuoteStatus) => void;
  className?: string;
}

type SortField = 'createdAt' | 'total' | 'status';
type SortOrder = 'asc' | 'desc';

export const QuoteGrid: React.FC<QuoteGridProps> = ({
  quotes,
  onStatusChange,
  className,
}) => {
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredAndSortedQuotes = useMemo(() => {
    let result = [...quotes];

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((quote) => quote.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'createdAt') {
        return sortOrder === 'desc'
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortField === 'total') {
        return sortOrder === 'desc'
          ? b.total - a.total
          : a.total - b.total;
      }
      if (sortField === 'status') {
        return sortOrder === 'desc'
          ? b.status.localeCompare(a.status)
          : a.status.localeCompare(b.status);
      }
      return 0;
    });

    return result;
  }, [quotes, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No quotes found</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filters and Sort Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as QuoteStatus | 'all')}
            className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500">Sort by:</span>
          <div className="flex rounded-md shadow-sm">
            {[
              { field: 'createdAt', label: 'Date' },
              { field: 'total', label: 'Amount' },
              { field: 'status', label: 'Status' },
            ].map(({ field, label }) => (
              <button
                key={field}
                onClick={() => handleSort(field as SortField)}
                className={cn(
                  'px-4 py-2 text-sm font-medium border',
                  'first:rounded-l-md last:rounded-r-md',
                  sortField === field
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200 z-10'
                    : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50',
                  'focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:z-10'
                )}
              >
                {label}
                {sortField === field && (
                  <span className="ml-1">
                    {sortOrder === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        role="grid"
        aria-label="Quotes grid"
      >
        {filteredAndSortedQuotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            variant="compact"
            onStatusChange={onStatusChange}
            interactive={!!onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}; 