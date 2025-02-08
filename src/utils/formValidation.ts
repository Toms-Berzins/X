import type { QuoteContactInfo, QuoteCoating, QuoteItem } from '../types/Quote';

export interface ValidationError {
  [key: string]: string;
}

export interface TouchedFields {
  [key: string]: boolean;
}

export const validateQuoteItem = (field: keyof QuoteItem, value: any): string => {
  switch (field) {
    case 'name':
      return !value ? 'Please select an item type' : '';
    case 'size':
      return !value ? 'Please select a size' : '';
    case 'quantity':
      if (!value) return 'Quantity is required';
      if (value < 1) return 'Quantity must be at least 1';
      if (value > 1000) return 'Quantity cannot exceed 1000';
      return '';
    default:
      return '';
  }
};

export const validateCoating = (field: keyof QuoteCoating, value: string): string => {
  switch (field) {
    case 'type':
      return !value ? 'Please select a coating type' : '';
    case 'color':
      return !value ? 'Please select a color' : '';
    case 'finish':
      return !value ? 'Please select a finish type' : '';
    default:
      return '';
  }
};

export const validateContactInfo = (field: keyof QuoteContactInfo, value: string): string => {
  switch (field) {
    case 'name':
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      if (value.trim().length > 50) return 'Name must be less than 50 characters';
      return '';
    case 'email':
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
      return '';
    case 'phone':
      if (!value.trim()) return 'Phone number is required';
      const phoneRegex = /^\+?[\d\s-()]{10,}$/;
      if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
      return '';
    case 'notes':
      if (value.length > 500) return 'Notes must be less than 500 characters';
      return '';
    case 'company':
      if (value.length > 50) return 'Company name must be less than 50 characters';
      return '';
    default:
      return '';
  }
};

export const validatePromoCode = (code: string): string => {
  if (!code) return '';
  if (code === 'WELCOME10') return '';
  return 'Invalid promo code';
};

export const getInputClasses = (hasError: boolean, isTouched: boolean, darkMode: boolean = false) => `
  mt-1 block w-full rounded-md shadow-sm transition-colors
  focus:ring-primary-500 focus:border-primary-500 sm:text-sm
  ${hasError && isTouched
    ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/10 text-gray-900 dark:text-gray-100 placeholder-red-300 dark:placeholder-red-400'
    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
  }
  ${darkMode ? 'dark:text-gray-100' : ''}
`;

export const getSelectClasses = (hasError: boolean, isTouched: boolean) => `
  ${getInputClasses(hasError, isTouched, true)}
  [&>option]:dark:bg-gray-800 
  [&>option]:dark:text-gray-200
`;

export const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

export const errorMessageClasses = "mt-2 flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/20 px-2 py-1 rounded-md";

export const inputGroupClasses = "space-y-1";

export const optionClasses = "dark:bg-gray-800 dark:text-gray-200";

// Helper function for quantity input styling
export const getQuantityInputClasses = (hasError: boolean, isTouched: boolean) => `
  block w-20 text-center transition-colors
  focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-none
  ${hasError && isTouched
    ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/10'
    : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
  }
`;

export const quantityButtonClasses = `
  inline-flex items-center justify-center p-2 border
  border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 
  text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 
  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 
  dark:focus:ring-primary-400 transition-colors hover:text-primary-600 
  dark:hover:text-primary-400
`; 