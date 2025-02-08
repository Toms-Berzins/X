import type { QuoteData, QuoteItem } from '@/types/Quote';
import { formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Paintbrush, Wrench, Check, X, ChevronDown, Edit2 } from 'lucide-react';
import { useState } from 'react';

// Helper function for formatting dimensions
const formatDimension = (size: string): string => {
  return size.includes('x') ? size : `${size} inches`;
};

interface QuoteSummaryProps {
  quoteData: QuoteData;
  currentStep?: number;
  onUpdateItems?: (items: QuoteItem[]) => void;
  onEditItem?: (index: number) => void;
}

export const QuoteSummary: React.FC<QuoteSummaryProps> = ({ 
  quoteData, 
  currentStep = 4,
  onUpdateItems,
  onEditItem
}) => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const totalItems = quoteData.items.reduce((acc, item) => acc + item.quantity, 0);
  const hasItems = quoteData.items.length > 0;
  const hasCoating = quoteData.coating.type;
  const hasServices = quoteData.additionalServices.sandblasting || quoteData.additionalServices.priming;

  const handleRemoveItem = (indexToRemove: number) => {
    if (onUpdateItems) {
      const updatedItems = quoteData.items.filter((_, index) => index !== indexToRemove);
      onUpdateItems(updatedItems);
      setExpandedItem(null);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quote Summary</h3>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step === currentStep
                  ? 'bg-primary-500 dark:bg-primary-400'
                  : step < currentStep
                  ? 'bg-primary-200 dark:bg-primary-700'
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-2">
          <ShoppingCart className="w-4 h-4 mr-2" />
          <span>Items ({totalItems})</span>
          {hasItems && <Check className="w-4 h-4 text-green-500 ml-auto" />}
        </div>
        
        <AnimatePresence mode="sync">
          {quoteData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className={`
                group relative overflow-hidden rounded-lg transition-all duration-200
                ${expandedItem === index ? 'bg-gray-50 dark:bg-gray-700/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
              `}
            >
              {/* Main Item Row */}
              <div 
                className="flex justify-between items-center py-3 px-3 cursor-pointer"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex-1 pr-8">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 w-6 h-6 rounded font-semibold">
                      {item.quantity}
                    </span>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {item.type}
                    </p>
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-400 transition-transform ${expandedItem === index ? 'rotate-180' : ''}`}
                    />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    {formatDimension(item.size)}
                  </p>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>

              {/* Expanded Actions */}
              <AnimatePresence>
                {expandedItem === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-100 dark:border-gray-600"
                  >
                    <div className="p-3 flex justify-end gap-2">
                      {onEditItem && (
                        <button
                          onClick={() => onEditItem(index)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {!hasItems && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
            No items added yet
          </div>
        )}
      </div>

      {/* Coating Section */}
      <div className="mt-6">
        <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-2">
          <Paintbrush className="w-4 h-4 mr-2" />
          <span>Coating Options</span>
          {hasCoating && <Check className="w-4 h-4 text-green-500 ml-auto" />}
        </div>
        
        <AnimatePresence mode="sync">
          {hasCoating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Type</span>
                <span className="text-gray-900 dark:text-gray-100">{quoteData.coating.type}</span>
              </div>
              {quoteData.coating.color && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Color</span>
                  <span className="text-gray-900 dark:text-gray-100">{quoteData.coating.color}</span>
                </div>
              )}
              {quoteData.coating.finish && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Finish</span>
                  <span className="text-gray-900 dark:text-gray-100">{quoteData.coating.finish}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Services Section */}
      <div className="mt-6">
        <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-2">
          <Wrench className="w-4 h-4 mr-2" />
          <span>Additional Services</span>
          {hasServices && <Check className="w-4 h-4 text-green-500 ml-auto" />}
        </div>
        
        <AnimatePresence mode="sync">
          {hasServices && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {quoteData.additionalServices.sandblasting && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Sandblasting</span>
                  <span className="text-gray-900 dark:text-gray-100">+$50</span>
                </div>
              )}
              {quoteData.additionalServices.priming && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Priming</span>
                  <span className="text-gray-900 dark:text-gray-100">+$35</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-700 dark:text-gray-300">Services Subtotal</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    +${(quoteData.additionalServices.sandblasting ? 50 : 0) + 
                       (quoteData.additionalServices.priming ? 35 : 0)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Promo Code Section */}
      <AnimatePresence>
        {quoteData.promoCode === 'WELCOME10' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30"
          >
            <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400 font-medium">
              <span>Promo Code (WELCOME10)</span>
              <span>-10%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Discount Section */}
      <AnimatePresence>
        {totalItems >= 10 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30"
          >
            <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400 font-medium">
              <span>Bulk Discount</span>
              <span>
                {totalItems >= 50
                  ? '-15%'
                  : totalItems >= 25
                  ? '-10%'
                  : '-5%'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total Section */}
      <motion.div
        layout
        className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
          <motion.div
            key={quoteData.total}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
            }}
            className="flex items-baseline"
          >
            <motion.span
              className={`text-2xl font-bold ${
                quoteData.total > 0 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1
              }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.3
              }}
            >
              {formatCurrency(quoteData.total)}
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}; 