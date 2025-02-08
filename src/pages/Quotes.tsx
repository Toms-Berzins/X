import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QuoteList } from '../components/quote/QuoteList';
import { QuoteGrid } from '../components/quote/QuoteGrid';
import { QuoteCarousel } from '../components/quote/QuoteCarousel';
import { Button } from '../components/shared/Button';
import { useUserRole } from '../hooks/useUserRole';
import { useQuotes } from '../hooks/useQuotes';
import type { QuoteStatus } from '../types/Quote';

type ViewMode = 'list' | 'grid' | 'carousel';

export const Quotes = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');
  const { isAdmin } = useUserRole();
  const { quotes, loading, error, isOffline, updateQuoteStatus } = useQuotes();

  const handleStatusChange = async (quoteId: string, status: QuoteStatus) => {
    try {
      await updateQuoteStatus(quoteId, status);
    } catch (error) {
      console.error('Failed to update quote status:', error);
    }
  };

  const filteredQuotes = statusFilter === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.status === statusFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">Error loading quotes: {error.message}</p>
        <Link to="/quote">
          <Button variant="primary">Create New Quote</Button>
        </Link>
      </div>
    );
  }

  if (isOffline) {
    return (
      <div className="text-center py-12 bg-yellow-50 rounded-lg">
        <p className="text-yellow-600 mb-4">You are currently offline. Please check your connection.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
          {isAdmin ? 'All Quotes' : 'My Quotes'}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="list">List View</option>
              <option value="grid">Grid View</option>
              <option value="carousel">Carousel View</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as QuoteStatus | 'all')}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <Link to="/quote">
            <Button variant="primary">
              New Quote
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section (Admin Only) */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Quotes', value: quotes.length },
            { label: 'Pending', value: quotes.filter(q => q.status === 'pending').length },
            { label: 'Approved', value: quotes.filter(q => q.status === 'approved').length },
            { label: 'Completed', value: quotes.filter(q => q.status === 'completed').length },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quotes Display */}
      <div className="bg-white shadow rounded-lg p-6">
        {viewMode === 'list' && (
          <QuoteList
            variant={isAdmin ? 'detailed' : 'default'}
            onStatusChange={isAdmin ? handleStatusChange : undefined}
            emptyMessage={`No quotes found. ${!isAdmin ? 'Create your first quote to get started!' : ''}`}
            className="mt-6"
          />
        )}

        {viewMode === 'grid' && (
          <QuoteGrid
            quotes={filteredQuotes}
            onStatusChange={isAdmin ? handleStatusChange : undefined}
            className="mt-6"
          />
        )}

        {viewMode === 'carousel' && filteredQuotes.length > 0 && (
          <QuoteCarousel
            quotes={filteredQuotes}
            onStatusChange={isAdmin ? handleStatusChange : undefined}
            className="mt-6"
          />
        )}
      </div>
    </div>
  );
}; 