import React from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  PencilIcon, 
  TrashIcon
} from '@heroicons/react/24/outline';
import { QuoteTableProps } from '../types/DashboardTypes';
import { QuoteDetails } from './QuoteDetails';
import { EditQuoteForm } from './EditQuoteForm';

export const QuoteTable: React.FC<QuoteTableProps> = ({
  quotes,
  onEditClick,
  onDeleteClick,
  selectedQuote,
  setSelectedQuote,
  editingQuote,
  editForm,
  handleEditFormChange,
  handleEdit,
  handleProgressUpdate,
  handleStatusUpdate,
  handleTrackingUpdate,
  trackingNumber,
  setTrackingNumber,
  operationLoading,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-8"></th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order #
            </th>
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
              Tracking
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
            <React.Fragment key={quote.id}>
              <tr 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedQuote(selectedQuote === quote.id ? null : quote.id)}
              >
                <td className="px-4">
                  <div className="text-gray-400">
                    {selectedQuote === quote.id ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {quote.orderNumber || 'N/A'}
                  </div>
                </td>
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
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${quote.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      quote.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      quote.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                      quote.status === 'in_preparation' ? 'bg-yellow-100 text-yellow-800' :
                      quote.status === 'coating' ? 'bg-purple-100 text-purple-800' :
                      quote.status === 'curing' ? 'bg-indigo-100 text-indigo-800' :
                      quote.status === 'quality_check' ? 'bg-cyan-100 text-cyan-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {quote.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {quote.status === 'approved' && (
                    <div className="text-sm text-gray-900">
                      {quote.trackingNumber ? (
                        <span className="font-medium">{quote.trackingNumber}</span>
                      ) : (
                        <span className="text-gray-500 italic">Not set</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(quote);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(quote);
                      }}
                      disabled={operationLoading}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
              {selectedQuote === quote.id && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 bg-gray-50">
                    {editingQuote === quote.id ? (
                      <EditQuoteForm
                        quote={quote}
                        editForm={editForm}
                        handleEditFormChange={handleEditFormChange}
                        handleEdit={handleEdit}
                        handleProgressUpdate={handleProgressUpdate}
                        onCancel={() => {
                          setSelectedQuote(null);
                          setTrackingNumber('');
                        }}
                      />
                    ) : (
                      <QuoteDetails
                        quote={quote}
                        handleProgressUpdate={handleProgressUpdate}
                        handleStatusUpdate={handleStatusUpdate}
                        handleTrackingUpdate={handleTrackingUpdate}
                        trackingNumber={trackingNumber}
                        setTrackingNumber={setTrackingNumber}
                        operationLoading={operationLoading}
                      />
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 