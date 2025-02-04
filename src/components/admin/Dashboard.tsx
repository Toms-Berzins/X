import { useAuth } from '../../contexts/AuthContext';
import { useQuotes } from '../../hooks/useQuotes';
import { useUserRole } from '../../hooks/useUserRole';
import { useQuoteOperations } from '../../hooks/useQuoteOperations';
import { useState } from 'react';

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const { quotes, loading: quotesLoading, error: quotesError } = useQuotes(false);
  const { role, loading: roleLoading, error: roleError, isAdmin } = useUserRole();
  const { updateQuote, deleteQuote, loading: operationLoading, error: operationError } = useQuoteOperations();
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);

  const handleStatusUpdate = async (quoteId: string, newStatus: 'approved' | 'rejected' | 'completed') => {
    try {
      await updateQuote(quoteId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update quote status:', error);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        await deleteQuote(quoteId);
      } catch (error) {
        console.error('Failed to delete quote:', error);
      }
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {quotesError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {quotesError}
            </div>
          )}
          
          {operationError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {operationError}
            </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Quote Management</h2>
              
              {quotesLoading ? (
                <div className="text-center py-4">Loading quotes...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {quotes.map((quote) => (
                        <tr key={quote.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {quote.contactInfo.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {quote.contactInfo.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              ${quote.total.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${quote.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                quote.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                quote.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                                'bg-yellow-100 text-yellow-800'}`}>
                              {quote.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(quote.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(quote.id, 'approved')}
                                disabled={operationLoading || quote.status === 'approved'}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(quote.id, 'rejected')}
                                disabled={operationLoading || quote.status === 'rejected'}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(quote.id, 'completed')}
                                disabled={operationLoading || quote.status === 'completed'}
                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => handleDeleteQuote(quote.id)}
                                disabled={operationLoading}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 