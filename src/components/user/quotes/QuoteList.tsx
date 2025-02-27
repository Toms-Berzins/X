import React from 'react';
import { OrderTracking } from '../../quote/OrderTracking';
import { formatCurrency, formatDimension } from '../../../pages/Quote';
import type { Quote } from '../../../types/User';

interface QuoteListProps {
  quotes: Quote[];
  selectedQuote: string | null;
  onSelectQuote: (quoteId: string | null) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'in_preparation':
      return 'bg-purple-100 text-purple-800';
    case 'coating':
      return 'bg-indigo-100 text-indigo-800';
    case 'curing':
      return 'bg-cyan-100 text-cyan-800';
    case 'quality_check':
      return 'bg-teal-100 text-teal-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

export const QuoteList = ({ quotes, selectedQuote, onSelectQuote }: QuoteListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quote Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Requested
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {quotes.map((quote) => (
            <React.Fragment key={quote.id}>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    Order #{quote.id.slice(-6)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {quote.items.length} item(s)
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(quote.total)}
                  </div>
                  {quote.discount > 0 && (
                    <div className="text-xs text-green-600">
                      {quote.discount}% discount applied
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onSelectQuote(selectedQuote === quote.id ? null : quote.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {selectedQuote === quote.id ? 'Hide Details' : 'View Details'}
                  </button>
                </td>
              </tr>
              {selectedQuote === quote.id && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 bg-gray-50">
                    <div className="space-y-8">
                      {/* Order Tracking Timeline */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Progress</h3>
                        <OrderTracking quote={quote} />
                      </div>

                      {/* Order Details */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Items</h4>
                            <div className="space-y-3">
                              {quote.items.map((item, index) => (
                                <div key={index} className="text-sm border-b border-gray-100 pb-2 last:border-0">
                                  <div className="flex justify-between">
                                    <span className="text-gray-800">{item.type} ({formatDimension(item.size)})</span>
                                    <span className="font-medium">{formatCurrency(item.basePrice * item.quantity)}</span>
                                  </div>
                                  <div className="text-gray-500 text-xs mt-1">Quantity: {item.quantity}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h4 className="text-sm font-medium text-gray-900 mb-3">Coating Details</h4>
                              <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Type:</span>
                                  <span className="text-gray-900">{quote.coating.type}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Color:</span>
                                  <span className="text-gray-900">{quote.coating.color}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Finish:</span>
                                  <span className="text-gray-900">{quote.coating.finish}</span>
                                </div>
                              </div>
                            </div>

                            {Object.entries(quote.additionalServices).some(([_, value]) => value) && (
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Services</h4>
                                <div className="text-sm space-y-1">
                                  {quote.additionalServices.sandblasting && (
                                    <div className="flex items-center text-gray-700">
                                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                      Sandblasting
                                    </div>
                                  )}
                                  {quote.additionalServices.priming && (
                                    <div className="flex items-center text-gray-700">
                                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                      Priming
                                    </div>
                                  )}
                                  {quote.additionalServices.rushOrder && (
                                    <div className="flex items-center text-gray-700">
                                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                      Rush Order
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="text-gray-900">{formatCurrency(quote.subtotal)}</span>
                            </div>
                            {quote.discount > 0 && (
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Discount:</span>
                                <span>-{quote.discount}%</span>
                              </div>
                            )}
                            <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-100">
                              <span className="text-gray-900">Total:</span>
                              <span className="text-gray-900">{formatCurrency(quote.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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