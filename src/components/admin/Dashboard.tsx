import { useQuotes } from '@/hooks/useQuotes';
import { useQuote } from '@/hooks/useQuote';
import { useState } from 'react';
import { QuoteGrid } from '../quote/QuoteGrid';
import { DeleteModal } from './components/DeleteModal';
import type { Quote, QuoteStatus } from '@/types/Quote';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUsageTracker, UsageEvent } from '@/hooks/useUsageTracker';

// Create reusable motion components
const MotionDiv = motion.create('div');

export const AdminDashboard: React.FC = () => {
  const { quotes, loading, error, fetchQuotes } = useQuotes();
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const { deleteQuote, updateStatus } = useQuote(selectedQuoteId || 'placeholder');
  const [deleteModalQuote, setDeleteModalQuote] = useState<Quote | null>(null);
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const { events, trackEvent } = useUsageTracker();
  const [showUsageReport, setShowUsageReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showIncompleteAnalysis, setShowIncompleteAnalysis] = useState(false);
  const [incompleteAnalysis, setIncompleteAnalysis] = useState<{quoteId: string; missingFields: string[]}[]>([]);

  const handleDeleteConfirm = async () => {
    if (!deleteModalQuote || !deleteQuote) return;
    
    try {
      await deleteQuote();
      trackEvent('delete_confirmed', { quoteId: deleteModalQuote.id });
      setDeleteModalQuote(null);
      setSelectedQuoteId(null);
      toast.success('Quote deleted successfully');
      fetchQuotes();
    } catch (error) {
      console.error('Failed to delete quote:', error);
      toast.error('Failed to delete quote');
    }
  };

  const handleEditQuote = (quote: Quote) => {
    trackEvent('edit_quote', { quoteId: quote.id });
    navigate(`/admin/quotes/${quote.id}/edit`);
  };

  const handleStatusChange = async (quoteId: string, status: QuoteStatus) => {
    setSelectedQuoteId(quoteId);
    trackEvent('status_change', { quoteId, newStatus: status });
    if (updateStatus) {
      try {
        await updateStatus(status);
        toast.success('Quote status updated successfully');
        fetchQuotes();
      } catch (error) {
        toast.error('Failed to update quote status');
      }
    }
  };

  const handleDeleteClick = (quote: Quote) => {
    setSelectedQuoteId(quote.id);
    setDeleteModalQuote(quote);
    trackEvent('delete_click', { quoteId: quote.id });
  };

  // Stats calculations
  const pendingQuotes = quotes.filter(q => q.status === 'pending');
  const approvedQuotes = quotes.filter(q => q.status === 'approved');
  const completedQuotes = quotes.filter(q => q.status === 'completed');
  // Add computed metrics
  const totalQuotes = quotes.length;
  const approvalRate = totalQuotes > 0 ? Math.round((approvedQuotes.length / totalQuotes) * 100) : 0;
  const pendingRate = totalQuotes > 0 ? Math.round((pendingQuotes.length / totalQuotes) * 100) : 0;
  const completionRate = totalQuotes > 0 ? Math.round((completedQuotes.length / totalQuotes) * 100) : 0;

  // Filter quotes based on selected status and search term
  const filteredQuotes = quotes.filter(q => {
    const matchesStatus = statusFilter === 'all' ? true : q.status === statusFilter;
    const matchesSearch = searchTerm.trim() === '' ? true : JSON.stringify(q).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuotes = filteredQuotes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    trackEvent('page_change', { page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // First, add a helper function at the top of the component to format the details
  const formatEventDetails = (details: Record<string, any>) => {
    if (!details) return '-';
    return Object.entries(details)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  const analyzeIncompleteQuotes = () => {
    const analysis = quotes
      .filter(q => q.status !== 'completed')
      .map(q => {
        const missing: string[] = [];
        const text = (q as any)?.text?.trim();
        const author = (q as any)?.author?.trim();
        if (!text) missing.push('Text');
        if (!author) missing.push('Author');
        return { quoteId: q.id, missingFields: missing };
      })
      .filter(result => result.missingFields.length > 0);
    // Sort analysis descending by number of missing fields
    analysis.sort((a, b) => b.missingFields.length - a.missingFields.length);
    setIncompleteAnalysis(analysis);
    trackEvent('incomplete_quote_analysis', { incompleteCount: analysis.length });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
        <p className="text-gray-600 text-center mb-4">{error.message}</p>
        <p className="text-gray-500 text-sm">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 transition-all duration-300 hover:scale-[1.01] border border-gray-100 dark:border-gray-700"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 dark:bg-gray-700/95 rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 dark:border-gray-600 transition-all duration-300 hover:scale-105"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Quotes</h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{quotes.length}</p>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 dark:bg-gray-700/95 rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 dark:border-gray-600 transition-all duration-300 hover:scale-105"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingQuotes.length}</p>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/95 dark:bg-gray-700/95 rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 dark:border-gray-600 transition-all duration-300 hover:scale-105"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Approved</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{approvedQuotes.length}</p>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/95 dark:bg-gray-700/95 rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 dark:border-gray-600 transition-all duration-300 hover:scale-105"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{completedQuotes.length}</p>
          </MotionDiv>
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/95 dark:bg-gray-700/95 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-600 mt-8 transition-all duration-300 hover:shadow-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Metrics</h3>
          <div className="flex flex-col md:flex-row justify-between mt-4">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{approvalRate}%</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Approval Rate</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingRate}%</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Pending Rate</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completionRate}%</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</span>
            </div>
          </div>
        </MotionDiv>

        <div className="mt-8">
          <input
            type="text"
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-2xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={() => { setStatusFilter('all'); trackEvent('filter_change', { status: 'all' }); }}
            className={`px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg ${
              statusFilter === 'all' 
                ? 'bg-primary-600 text-white shadow-lg' 
                : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => { setStatusFilter('pending'); trackEvent('filter_change', { status: 'pending' }); }}
            className={`px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg ${
              statusFilter === 'pending'
                ? 'bg-yellow-600 text-white shadow-lg'
                : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => { setStatusFilter('approved'); trackEvent('filter_change', { status: 'approved' }); }}
            className={`px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg ${
              statusFilter === 'approved'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => { setStatusFilter('completed'); trackEvent('filter_change', { status: 'completed' }); }}
            className={`px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg ${
              statusFilter === 'completed'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80'
            }`}
          >
            Completed
          </button>
        </div>

        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <QuoteGrid
            quotes={currentQuotes}
            onEdit={handleEditQuote}
            onDelete={handleDeleteClick}
            onStatusChange={handleStatusChange}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                        : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          <button
            onClick={() => { setShowUsageReport(!showUsageReport); trackEvent('toggle_usage_report', { show: !showUsageReport }); }}
            className="mt-8 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full transition-all duration-300 hover:shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {showUsageReport ? 'Hide Usage Report' : 'Show Usage Report'}
          </button>
          
          {/* New Button for Incomplete Quotes Analysis */}
          <button
            onClick={() => {
              if (!showIncompleteAnalysis) {
                analyzeIncompleteQuotes();
              }
              setShowIncompleteAnalysis(!showIncompleteAnalysis);
            }}
            className="mt-4 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full transition-all duration-300 hover:shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {showIncompleteAnalysis ? 'Hide Incomplete Analysis' : 'Show Incomplete Analysis'}
          </button>
          {showIncompleteAnalysis && (
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 p-8 bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm transition-all duration-300 overflow-hidden"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Incomplete Quotes Analysis</h3>
              {incompleteAnalysis.length > 0 && (
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                  Total Incomplete: {incompleteAnalysis.length} | Missing Text: {incompleteAnalysis.reduce((acc, item) => acc + (item.missingFields.includes('Text') ? 1 : 0), 0)} | Missing Author: {incompleteAnalysis.reduce((acc, item) => acc + (item.missingFields.includes('Author') ? 1 : 0), 0)}
                </div>
              )}
              {incompleteAnalysis.length > 0 ? (
                <div className="overflow-x-auto rounded-xl">
                  <table className="min-w-full">
                    <thead className="bg-gray-100/90 dark:bg-gray-700/90 sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Quote ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Missing Fields</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incompleteAnalysis.map(item => (
                        <tr
                          key={item.quoteId}
                          className={`odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800/50 dark:even:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors duration-200 ${item.missingFields.length >= 2 ? 'border-l-4 border-red-500' : ''}`}
                        >
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                            {item.quoteId}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {item.missingFields.map(field => (
                              <span
                                key={field}
                                className={`px-2 py-1 text-sm rounded-full mr-2 ${
                                  field === 'Text'
                                    ? 'bg-red-200 text-red-600'
                                    : field === 'Author'
                                    ? 'bg-yellow-200 text-yellow-600'
                                    : 'bg-gray-200 text-gray-600'
                                }`}
                              >
                                {field}
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No incomplete quotes found.</p>
              )}
            </MotionDiv>
          )}
          {showUsageReport && (
            <div className="mt-6 p-8 bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm transition-all duration-300 overflow-hidden">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Usage Report</h3>
              <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full">
                  <thead className="bg-gray-100/90 dark:bg-gray-700/90 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 first:rounded-l-xl">Time</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Event</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 last:rounded-r-xl">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event: UsageEvent, index: number) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800/50 dark:even:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          {new Date(event.timestamp).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                          {event.event.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {formatEventDetails(event.details)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </MotionDiv>
      </MotionDiv>

      <DeleteModal
        isOpen={!!deleteModalQuote}
        onClose={() => setDeleteModalQuote(null)}
        onConfirm={handleDeleteConfirm}
        quote={deleteModalQuote}
      />
    </div>
  );
}; 