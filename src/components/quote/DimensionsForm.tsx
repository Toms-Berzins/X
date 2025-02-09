import React from 'react';
import { QuoteDimensions } from '@/types/Quote';
import { motion } from 'framer-motion';

interface DimensionsFormProps {
  dimensions: QuoteDimensions;
  onDimensionsChange: (dimensions: QuoteDimensions) => void;
  errors: {
    dimensions?: string;
  };
}

export const DimensionsForm: React.FC<DimensionsFormProps> = ({
  dimensions,
  onDimensionsChange,
  errors
}) => {
  const handleChange = (field: keyof QuoteDimensions, value: string) => {
    const numValue = parseFloat(value) || 0;
    onDimensionsChange({
      ...dimensions,
      [field]: numValue
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Height (inches)
          </label>
          <input
            type="number"
            id="height"
            min="0"
            step="0.1"
            value={dimensions.height || ''}
            onChange={(e) => handleChange('height', e.target.value)}
            className={`
              block w-full rounded-lg border ${errors.dimensions
                ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/10'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              } px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm
            `}
          />
        </div>

        <div>
          <label htmlFor="width" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Width (inches)
          </label>
          <input
            type="number"
            id="width"
            min="0"
            step="0.1"
            value={dimensions.width || ''}
            onChange={(e) => handleChange('width', e.target.value)}
            className={`
              block w-full rounded-lg border ${errors.dimensions
                ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/10'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              } px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm
            `}
          />
        </div>

        <div>
          <label htmlFor="depth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Depth (inches)
          </label>
          <input
            type="number"
            id="depth"
            min="0"
            step="0.1"
            value={dimensions.depth || ''}
            onChange={(e) => handleChange('depth', e.target.value)}
            className={`
              block w-full rounded-lg border ${errors.dimensions
                ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/10'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              } px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm
            `}
          />
        </div>
      </div>

      {errors.dimensions && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 dark:text-red-400"
        >
          {errors.dimensions}
        </motion.p>
      )}

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          Please provide accurate dimensions to ensure proper coating coverage and pricing.
        </p>
      </div>
    </div>
  );
}; 