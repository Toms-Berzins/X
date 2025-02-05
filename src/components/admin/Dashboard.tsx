import { useQuotes } from '@/hooks/useQuotes';
import { useUserRole } from '@/hooks/useUserRole';
import { useQuoteOperations } from '../../hooks/useQuoteOperations';
import { useState } from 'react';
import { QuoteGrid } from '../quote/QuoteGrid';
import { DeleteModal } from './components/DeleteModal';
import type { Quote } from '../../types/User';
import type { QuoteData } from '../../types/Quote';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { quotes, loading, error, fetchQuotes } = useQuotes();
  const { loading: roleLoading, isAdmin } = useUserRole();
  const { deleteQuote } = useQuoteOperations();
  const [deleteModalQuote, setDeleteModalQuote] = useState<Quote | null>(null);
  const [statusFilter, setStatusFilter] = useState<Quote['status'] | 'all'>('all');
  const navigate = useNavigate();

  const handleDeleteConfirm = async () => {
    if (!deleteModalQuote) return;
    
    try {
      await deleteQuote(deleteModalQuote.id);
      setDeleteModalQuote(null);
      toast.success('Quote deleted successfully');
      fetchQuotes(); // Refresh quotes after deletion
    } catch (error) {
      console.error('Failed to delete quote:', error);
      toast.error('Failed to delete quote');
    }
  };

  const handleEditQuote = (quoteData: QuoteData) => {
    // Find the full quote with orderNumber from the quotes array
    const fullQuote = quotes.find(q => q.id === quoteData.id);
    if (fullQuote) {
      navigate(`/admin/quotes/${fullQuote.id}/edit`);
    } else {
      toast.error('Quote not found');
    }
  };

  // Stats calculations
  const pendingQuotes = quotes.filter(q => q.status === 'pending');
  const approvedQuotes = quotes.filter(q => q.status === 'approved');
  const completedQuotes = quotes.filter(q => q.status === 'completed');

  // Filter quotes based on selected status
  const filteredQuotes = statusFilter === 'all' 
    ? quotes 
    : quotes.filter(q => q.status === statusFilter);

  if (roleLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg inline-block">
          <p>Failed to load quotes. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {statusFilter === 'all' ? 'All Quotes' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Quotes`}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => fetchQuotes()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Quotes',
            value: quotes.length,
            color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
            status: 'all' as const,
          },
          {
            label: 'Pending',
            value: pendingQuotes.length,
            color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
            status: 'pending' as const,
          },
          {
            label: 'Approved',
            value: approvedQuotes.length,
            color: 'bg-green-50 text-green-700 hover:bg-green-100',
            status: 'approved' as const,
          },
          {
            label: 'Completed',
            value: completedQuotes.length,
            color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
            status: 'completed' as const,
          },
        ].map(({ label, value, color, status }) => (
          <button
            key={label}
            onClick={() => setStatusFilter(status)}
            className={`${color} p-4 rounded-lg shadow-sm transition-colors duration-200 ${statusFilter === status ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
          >
            <h3 className="text-sm font-medium">{label}</h3>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </button>
        ))}
      </div>

      {/* Quotes Grid */}
      <QuoteGrid
        quotes={filteredQuotes}
        onEdit={handleEditQuote}
        onQuoteUpdated={fetchQuotes}
        className="mt-6"
      />

      <DeleteModal
        quote={deleteModalQuote}
        onClose={() => setDeleteModalQuote(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}; 