import React, { useState } from 'react';
import { QuoteCard } from './QuoteCard';
import type { Quote } from '../../types/Quote';
import type { QuoteStatus } from '../../types/QuoteStatus';
import { cn, formatCurrency, formatDimension } from '../../lib/utils';
import { Button } from '../shared/Button';
import { useQuotes } from '../../hooks/useQuotes';
import { ChevronLeft, ChevronRight, Search, SortAsc, SortDesc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderTracking } from './OrderTracking';
import { QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS, isQuoteEditable, isCancellable } from '../../types/QuoteStatus';

interface QuoteListProps {
  variant?: 'default' | 'compact' | 'detailed' | 'admin' | 'user';
  onStatusChange?: (quoteId: string, status: QuoteStatus) => void;
  emptyMessage?: string;
  className?: string;
  itemsPerPage?: number;
  quotes?: Quote[];
  selectedQuote?: string | null;
  onSelectQuote?: (quoteId: string | null) => void;
  onEdit?: (quote: Quote) => void;
  onCancel?: (quote: Quote) => void;
}

// Add a helper function at the top of the file to safely get status colors
const getStatusColors = (status: string | undefined) => {
  if (!status || !(status in QUOTE_STATUS_COLORS)) {
    // Return default colors if status is invalid
    return { bg: 'bg-gray-100', text: 'text-gray-800' };
  }
  return QUOTE_STATUS_COLORS[status as QuoteStatus];
};

export const QuoteList: React.FC<QuoteListProps> = ({
  variant = 'default',
  onStatusChange,
  emptyMessage = 'No quotes found',
  className,
  itemsPerPage = 6,
  quotes: propQuotes,
  selectedQuote,
  onSelectQuote,
  onEdit,
  onCancel,
}) => {
  // State for search and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<'date' | 'total' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Use quotes from props or from hook
  const { quotes: hookQuotes, loading, error, isOffline } = useQuotes();
  const quotes = propQuotes || hookQuotes;

  // Filter and sort quotes
  const filteredQuotes = React.useMemo(() => {
    return quotes
      .filter((quote) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          quote.id.toLowerCase().includes(query) ||
          quote.status.toLowerCase().includes(query) ||
          quote.orderNumber.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const order = sortOrder === 'asc' ? 1 : -1;
        switch (sortField) {
          case 'date':
            return order * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          case 'total':
            return order * (b.total - a.total);
          case 'status':
            return order * a.status.localeCompare(b.status);
          default:
            return 0;
        }
      });
  }, [quotes, searchQuery, sortField, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotes = filteredQuotes.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="text-center py-4 text-gray-700 dark:text-gray-300">Loading quotes...</div>;
  if (error) return <div className="text-center text-red-600 dark:text-red-400 py-4">Error loading quotes: {error.message}</div>;
  if (isOffline) return <div className="text-center text-yellow-600 dark:text-yellow-400 py-4">You are offline. Some features may be limited.</div>;
  if (!quotes.length) return <div className="text-center py-4 text-gray-700 dark:text-gray-300">{emptyMessage}</div>;

  // Render different layouts based on variant
  if (variant === 'compact') {
    return (
      <div className={cn("space-y-4", className)}>
        {paginatedQuotes.map((quote) => (
          <QuoteCard 
            key={quote.id} 
            quote={quote} 
            variant="compact" 
            onStatusChange={status => onStatusChange?.(quote.id, status)} 
          />
        ))}
        {/* Pagination */}
      </div>
    );
  }

  if (variant === 'user' || variant === 'admin') {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quotes..."
                className="w-full sm:w-auto pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm 
                  focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                  placeholder-gray-500 dark:placeholder-gray-400
                  transition-colors duration-200"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as 'date' | 'total' | 'status')}
              className="flex-1 sm:flex-none border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm 
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                transition-colors duration-200"
            >
              <option value="date">Date</option>
              <option value="total">Total</option>
              <option value="status">Status</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                text-gray-700 dark:text-gray-300 
                transition-colors duration-200"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quote Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedQuotes.map((quote) => (
                <React.Fragment key={quote.id}>
                  <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        Order #{quote.orderNumber}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {quote.items.length} item(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{formatCurrency(quote.total)}</div>
                      {quote.discount > 0 && (
                        <div className="text-xs text-green-600 dark:text-green-400">{quote.discount}% discount</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColors(quote.status).bg} ${getStatusColors(quote.status).text}`}>
                        {QUOTE_STATUS_LABELS[quote.status as QuoteStatus] || 'Unknown Status'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onSelectQuote?.(selectedQuote === quote.id ? null : quote.id)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 
                            px-3 py-1 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 
                            transition-colors duration-200"
                        >
                          {selectedQuote === quote.id ? 'Hide Details' : 'View Details'}
                        </motion.button>
                        {variant === 'user' && (
                          <>
                            {isQuoteEditable(quote.status) && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onEdit?.(quote)}
                                className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 
                                  px-3 py-1 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 
                                  transition-colors duration-200"
                              >
                                Edit
                              </motion.button>
                            )}
                            {isCancellable(quote.status) && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onCancel?.(quote)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 
                                  px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 
                                  transition-colors duration-200"
                              >
                                Cancel
                              </motion.button>
                            )}
                          </>
                        )}
                        {variant === 'admin' && onStatusChange && (
                          <select
                            value={quote.status || 'pending'}
                            onChange={(e) => onStatusChange(quote.id, e.target.value as QuoteStatus)}
                            className="border border-gray-200 dark:border-gray-700 rounded-md text-sm 
                              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                              transition-colors duration-200"
                          >
                            {Object.entries(QUOTE_STATUS_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {selectedQuote === quote.id && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-8">
                              {/* Order Progress */}
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Order Progress</h3>
                                <OrderTracking quote={quote} />
                              </div>

                              {/* Quote Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Items */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Items</h4>
                                  <div className="space-y-3">
                                    {quote.items.map((item, index) => (
                                      <div key={index} className="text-sm border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                                        <div className="flex justify-between">
                                          <span className="text-gray-800 dark:text-gray-200">{item.name}</span>
                                          <span className="text-gray-900 dark:text-gray-100">{formatCurrency(item.price)}</span>
                                        </div>
                                        <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                          Size: {formatDimension(item.size)} | Quantity: {item.quantity}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Additional Info */}
                                <div className="space-y-4">
                                  {/* Coating Details */}
                                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Coating Details</h4>
                                    <div className="text-sm space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                                        <span className="text-gray-900 dark:text-gray-100">{quote.coating.type}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Color:</span>
                                        <span className="text-gray-900 dark:text-gray-100">{quote.coating.color}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Finish:</span>
                                        <span className="text-gray-900 dark:text-gray-100">{quote.coating.finish}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Additional Services */}
                                  {Object.values(quote.additionalServices).some(Boolean) && (
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Additional Services</h4>
                                      <div className="space-y-2">
                                        {Object.entries(quote.additionalServices).map(([service, isIncluded]) => (
                                          isIncluded && (
                                            <div key={service} className="flex items-center text-sm">
                                              <span className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-2" />
                                              <span className="text-gray-800 dark:text-gray-200 capitalize">{service.replace('_', ' ')}</span>
                                            </div>
                                          )
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Pricing Summary */}
                              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                    <span className="text-gray-900 dark:text-gray-100">{formatCurrency(quote.total / (1 - quote.discount / 100))}</span>
                                  </div>
                                  {quote.discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                      <span>Discount:</span>
                                      <span>-{quote.discount}%</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-gray-900 dark:text-gray-100">Total:</span>
                                    <span className="text-gray-900 dark:text-gray-100">{formatCurrency(quote.total)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4")}>
        {paginatedQuotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onStatusChange={status => onStatusChange?.(quote.id, status)}
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="col-span-full flex justify-center items-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}; 