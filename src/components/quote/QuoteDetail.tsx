import React from 'react';
import { Link } from 'react-router-dom';
import { useQuote } from '../../hooks/useQuote';
import { OrderProgress } from './OrderProgress';
import { QuoteSummary } from './QuoteSummary';
import { Button } from '../shared/Button';
import { useUserRole } from '../../hooks/useUserRole';
import type { QuoteStatus } from '../../types/Quote';

interface QuoteDetailProps {
  id: string;
}

export const QuoteDetail: React.FC<QuoteDetailProps> = ({ id }) => {
  const { quote, loading, error, updateStatus } = useQuote(id);
  const { isAdmin } = useUserRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error loading quote details. Please try again later.</p>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: QuoteStatus) => {
    try {
      await updateStatus(newStatus);
    } catch (error) {
      console.error('Failed to update quote status:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Quote #{quote.orderNumber}
        </h2>
        {isAdmin && (
          <Link to={`/quotes/${id}/edit`}>
            <Button variant="secondary">Edit Quote</Button>
          </Link>
        )}
      </div>

      <OrderProgress 
        currentStatus={quote.status}
        onStatusChange={isAdmin ? handleStatusChange : undefined}
        interactive={isAdmin}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Items Section */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
              <div className="space-y-4">
                {quote.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Size: {item.size} | Quantity: {item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Coating Section */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Coating Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p>{quote.coating.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p>{quote.coating.color}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Finish</p>
                  <p>{quote.coating.finish}</p>
                </div>
              </div>
            </section>

            {/* Additional Services */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Services</h3>
              <div className="space-y-2">
                <p>
                  Sandblasting: {quote.additionalServices.sandblasting ? 'Yes' : 'No'}
                </p>
                <p>
                  Priming: {quote.additionalServices.priming ? 'Yes' : 'No'}
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-2">
                <p>Name: {quote.contactInfo.name}</p>
                <p>Email: {quote.contactInfo.email}</p>
                <p>Phone: {quote.contactInfo.phone}</p>
                {quote.contactInfo.notes && (
                  <div>
                    <p className="text-sm text-gray-500 mt-2">Notes:</p>
                    <p className="whitespace-pre-wrap">{quote.contactInfo.notes}</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="lg:col-span-1">
          <QuoteSummary quoteData={quote} />
        </div>
      </div>
    </div>
  );
}; 