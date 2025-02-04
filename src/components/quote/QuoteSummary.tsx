import type { QuoteData } from '../../pages/Quote';
import { formatCurrency, formatDimension } from '../../pages/Quote';

interface QuoteSummaryProps {
  quoteData: QuoteData;
}

export const QuoteSummary: React.FC<QuoteSummaryProps> = ({ quoteData }) => {
  const totalItems = quoteData.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quote Summary</h3>

      {/* Items Summary */}
      <div className="space-y-4">
        {quoteData.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.quantity}x {item.type} ({formatDimension(item.size)})
            </span>
            <span className="text-gray-900 font-medium">
              {formatCurrency(item.basePrice * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Coating Options */}
      {quoteData.coating.type && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Coating Type</span>
            <span className="text-gray-900">{quoteData.coating.type}</span>
          </div>
          {quoteData.coating.color && (
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Color</span>
              <span className="text-gray-900">{quoteData.coating.color}</span>
            </div>
          )}
          {quoteData.coating.finish && (
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Finish</span>
              <span className="text-gray-900">{quoteData.coating.finish}</span>
            </div>
          )}
        </div>
      )}

      {/* Additional Services */}
      {Object.entries(quoteData.additionalServices).some(([_, value]) => value) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Services</h4>
          {quoteData.additionalServices.sandblasting && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sandblasting</span>
              <span className="text-gray-900">+15%</span>
            </div>
          )}
          {quoteData.additionalServices.priming && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Priming</span>
              <span className="text-gray-900">+10%</span>
            </div>
          )}
          {quoteData.additionalServices.rushOrder && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rush Order</span>
              <span className="text-gray-900">+25%</span>
            </div>
          )}
        </div>
      )}

      {/* Bulk Discount */}
      {totalItems >= 10 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-green-600">
            <span>Bulk Discount</span>
            <span>
              {totalItems >= 50
                ? '-15%'
                : totalItems >= 25
                ? '-10%'
                : '-5%'}
            </span>
          </div>
        </div>
      )}

      {/* Promo Code */}
      {quoteData.promoCode === 'WELCOME10' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-green-600">
            <span>Promo Code (WELCOME10)</span>
            <span>-10%</span>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatCurrency(quoteData.subtotal)}</span>
        </div>
        {quoteData.discount > 0 && (
          <div className="flex justify-between text-sm mt-2 text-green-600">
            <span>Total Discount</span>
            <span>-{Math.round(quoteData.discount)}%</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-medium mt-4">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">{formatCurrency(quoteData.total)}</span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-gray-500">
        * All prices are estimates and subject to final review. Additional charges may apply based on
        item condition and complexity.
      </p>
    </div>
  );
}; 