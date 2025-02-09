import React from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { QuoteItem } from '@/types/Quote';

interface ItemFormErrors {
  name?: string;
  size?: string;
  quantity?: string;
  dimensions?: string;
}

interface ItemFormTouched {
  name: boolean;
  size: boolean;
  quantity: boolean;
  dimensions: boolean;
}

interface ItemFormProps {
  currentItem: Partial<QuoteItem>;
  onItemChange: (item: Partial<QuoteItem>) => void;
  onSubmit: () => void;
  isEditing: boolean;
  onCancel?: () => void;
  errors: ItemFormErrors;
  touched: ItemFormTouched;
  onBlur: (field: keyof ItemFormTouched) => void;
  availableItemTypes: { id: string; name: string; basePrice: number }[];
}

const sizes = [
  'Up to 6"',
  '6" - 12"',
  '12" - 24"',
  '24" - 36"',
  '36"+'
];

export const ItemForm: React.FC<ItemFormProps> = ({
  currentItem,
  onItemChange,
  onSubmit,
  isEditing,
  onCancel,
  errors,
  touched,
  onBlur,
  availableItemTypes
}) => {
  const handleFieldChange = (field: keyof typeof errors, value: any) => {
    onItemChange({ ...currentItem, [field]: value });
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="itemType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Item Type *
          </label>
          <select
            id="itemType"
            value={currentItem.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            onBlur={() => onBlur('name')}
            className={`
              block w-full rounded-lg border ${touched.name && errors.name 
                ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/10' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              } px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm
            `}
          >
            <option value="" className="dark:bg-gray-800 dark:text-gray-200">Select an item type</option>
            {availableItemTypes.map((type) => (
              <option key={type.id} value={type.id} className="dark:bg-gray-800 dark:text-gray-200">
                {type.name}
              </option>
            ))}
          </select>
          {touched.name && errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 dark:text-red-400"
            >
              {errors.name}
            </motion.p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Size *
          </label>
          <select
            id="size"
            value={currentItem.size || ''}
            onChange={(e) => handleFieldChange('size', e.target.value)}
            onBlur={() => onBlur('size')}
            className={`
              block w-full rounded-lg border ${touched.size && errors.size 
                ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/10' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              } px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm
            `}
            disabled={!currentItem.name}
          >
            <option value="" className="dark:bg-gray-800 dark:text-gray-200">Select a size</option>
            {sizes.map((size) => (
              <option key={size} value={size} className="dark:bg-gray-800 dark:text-gray-200">
                {size}
              </option>
            ))}
          </select>
          {touched.size && errors.size && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 dark:text-red-400"
            >
              {errors.size}
            </motion.p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantity *
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleFieldChange('quantity', Math.max(1, (currentItem.quantity || 1) - 1))}
              className="inline-flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={!currentItem.name || !currentItem.size}
            >
              <MinusCircle className="h-4 w-4" />
            </button>
            <input
              type="number"
              id="quantity"
              value={currentItem.quantity || ''}
              onChange={(e) => handleFieldChange('quantity', parseInt(e.target.value) || '')}
              onBlur={() => onBlur('quantity')}
              className={`
                block w-20 text-center rounded-lg border ${touched.quantity && errors.quantity 
                  ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/10' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                } px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm
              `}
              min="1"
              max="1000"
              disabled={!currentItem.name || !currentItem.size}
            />
            <button
              type="button"
              onClick={() => handleFieldChange('quantity', Math.min(1000, (currentItem.quantity || 1) + 1))}
              className="inline-flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={!currentItem.name || !currentItem.size}
            >
              <PlusCircle className="h-4 w-4" />
            </button>
          </div>
          {touched.quantity && errors.quantity && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 dark:text-red-400"
            >
              {errors.quantity}
            </motion.p>
          )}
        </div>

        {(currentItem.price || 0) > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-800 dark:text-green-300">
                Estimated Price: ${((currentItem.price || 0) * (currentItem.quantity || 1)).toFixed(2)}
              </span>
            </div>
          </motion.div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          {isEditing && onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onSubmit}
            disabled={!currentItem.name || !currentItem.size || !currentItem.quantity}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 border border-transparent rounded-lg shadow-sm hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}; 