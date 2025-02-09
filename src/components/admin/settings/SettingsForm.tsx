import React from 'react';
import { Settings, PriceValidation } from '@/hooks/useSettings';
import { motion } from 'framer-motion';

interface SettingsFormProps {
  settings: Settings;
  validation: Record<string, PriceValidation>;
  localChanges: Partial<Settings>;
  hasUnsavedChanges: boolean;
  onUpdate: (updates: Partial<Settings>) => void;
  onReset: () => void;
  error: Error | null;
}

const MotionInput = motion.input;

type NumericSettingKey = keyof Pick<Settings, 'basePrice' | 'rushOrderFee' | 'taxRate' | 'minimumOrderAmount'>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
  settings,
  validation,
  localChanges,
  hasUnsavedChanges,
  onUpdate,
  onReset,
  error
}) => {
  const getValue = (key: NumericSettingKey): number => {
    return (key in localChanges ? localChanges[key] : settings[key]) as number;
  };

  const handleInputChange = (key: NumericSettingKey, value: number) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.entries(validation) as [NumericSettingKey, PriceValidation][]).map(([key, val]) => (
          <div key={key} className="relative">
            <label htmlFor={key} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            <MotionInput
              type="number"
              id={key}
              value={getValue(key)}
              onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
              min={val.min}
              max={val.max}
              step={val.step}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              animate={hasUnsavedChanges ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.2 }}
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Range: {val.min} - {val.max} (Step: {val.step})
            </div>
          </div>
        ))}
      </div>

      {hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
            <span className="animate-pulse mr-2">●</span>
            Unsaved changes
          </div>
        </motion.div>
      )}

      {/* Preview Section */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preview Calculations</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Base Price:</span>
            <span className="font-medium">${getValue('basePrice').toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">With Rush Order:</span>
            <span className="font-medium">
              ${(getValue('basePrice') + getValue('rushOrderFee')).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tax Amount:</span>
            <span className="font-medium">
              ${((getValue('basePrice') * getValue('taxRate')) / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-900 dark:text-white">Total with Tax:</span>
            <span className="text-primary-600 dark:text-primary-400">
              ${(getValue('basePrice') * (1 + getValue('taxRate') / 100)).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 