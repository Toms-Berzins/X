import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  label?: string;
  fullWidth?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className,
  error,
  label,
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find(item => item.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: DropdownItem) => {
    if (!item.disabled) {
      onChange?.(item.value);
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={clsx('relative', fullWidth && 'w-full', className)}
    >
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={clsx(
          'flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-left text-gray-900 shadow-sm dark:bg-secondary-800 dark:text-white',
          disabled && 'cursor-not-allowed opacity-50',
          error
            ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
            : 'border-gray-300 hover:bg-gray-50 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-secondary-700 dark:hover:bg-secondary-700'
        )}
      >
        <span className="block truncate">
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <svg
          className={clsx(
            'h-5 w-5 text-gray-400 transition-transform dark:text-gray-500',
            isOpen && 'rotate-180'
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full rounded-lg bg-white py-1 shadow-lg dark:bg-secondary-800"
          >
            {items.map(item => (
              <button
                key={item.value}
                onClick={() => handleSelect(item)}
                className={clsx(
                  'flex w-full items-center px-4 py-2 text-left text-sm',
                  item.disabled
                    ? 'cursor-not-allowed text-gray-400 dark:text-gray-500'
                    : value === item.value
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-secondary-700'
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1.5 text-sm text-error-500">{error}</p>
      )}
    </div>
  );
}; 