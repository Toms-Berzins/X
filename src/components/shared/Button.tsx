import React, { Fragment } from 'react';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import classNames from 'classnames';

interface ButtonProps extends Omit<MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children?: React.ReactNode;
}

const MotionButton = motion.create('button');

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', loading = false, className, disabled, ...props }, ref) => {
    const baseStyles = classNames(
      'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
      {
        // Variants
        'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500': variant === 'primary',
        'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500': variant === 'secondary',
        'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500': variant === 'outline',
        'text-gray-700 hover:bg-gray-50 focus:ring-primary-500': variant === 'ghost',
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
        // Sizes
        'text-xs px-2.5 py-1.5 rounded': size === 'xs',
        'text-sm px-3 py-2 rounded-md': size === 'sm',
        'text-sm px-4 py-2 rounded-md': size === 'md',
        'text-base px-4 py-2 rounded-md': size === 'lg',
        'text-base px-6 py-3 rounded-md': size === 'xl',
      },
      className
    );

    return (
      <MotionButton
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={baseStyles}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Fragment>
            <svg
              className="w-4 h-4 mr-2 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </Fragment>
        ) : (
          children
        )}
      </MotionButton>
    );
  }
); 
