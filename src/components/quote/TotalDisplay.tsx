import { motion } from 'framer-motion';
import type { QuoteData } from '@/types/Quote';

interface TotalDisplayProps {
  total: number;
  className?: string;
  quoteData?: QuoteData;
  showBreakdown?: boolean;
}

export const TotalDisplay: React.FC<TotalDisplayProps> = ({ 
  total, 
  className = '',
  quoteData,
  showBreakdown = true
}) => {
  // Calculate subtotal from items
  const subtotal = quoteData?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  
  // Calculate additional services total
  const servicesTotal = quoteData?.additionalServices ? 
    (quoteData.additionalServices.sandblasting ? 50 : 0) + 
    (quoteData.additionalServices.priming ? 35 : 0) : 0;

  // Calculate bulk discount
  const totalItems = quoteData?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  let bulkDiscountPercent = 0;
  if (totalItems >= 50) bulkDiscountPercent = 15;
  else if (totalItems >= 25) bulkDiscountPercent = 10;
  else if (totalItems >= 10) bulkDiscountPercent = 5;

  // Calculate promo discount
  const hasPromoDiscount = quoteData?.promoCode === 'WELCOME10';
  const promoDiscountPercent = hasPromoDiscount ? 10 : 0;

  // Calculate total discounts
  const totalDiscountPercent = bulkDiscountPercent + promoDiscountPercent;
  const discountAmount = (subtotal * totalDiscountPercent) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm ${className}`}
    >
      {showBreakdown && quoteData && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Items Subtotal */}
          <div className="p-4 space-y-1">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Items Subtotal ({totalItems} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {/* Additional Services */}
            {servicesTotal > 0 && (
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Additional Services</span>
                <span>+${servicesTotal.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Discounts Section */}
          {(bulkDiscountPercent > 0 || hasPromoDiscount) && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20">
              {bulkDiscountPercent > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Bulk Discount ({bulkDiscountPercent}%)</span>
                  <span>-${((subtotal * bulkDiscountPercent) / 100).toFixed(2)}</span>
                </div>
              )}
              {hasPromoDiscount && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Promo Code (WELCOME10)</span>
                  <span>-${((subtotal * promoDiscountPercent) / 100).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Total */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/80">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
            Total
          </span>
          <motion.span
            key={total}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-lg font-bold text-gray-900 dark:text-gray-100"
          >
            ${total.toFixed(2)}
          </motion.span>
        </div>

        {/* Savings Callout */}
        {totalDiscountPercent > 0 && (
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">
            You save ${discountAmount.toFixed(2)} ({totalDiscountPercent}% off)
          </p>
        )}
      </div>
    </motion.div>
  );
}; 