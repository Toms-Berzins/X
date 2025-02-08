import React from 'react';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import classNames from 'classnames';

interface CustomBadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

type BadgeProps = CustomBadgeProps & MotionProps & React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
  className?: string;
};

const MotionSpan = motion.span;
const MotionButton = motion.button;

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  icon,
  className,
  onClick,
  removable = false,
  onRemove,
  ...props
}) => {
  const baseStyles = classNames(
    'inline-flex items-center font-medium transition-all duration-200',
    onClick && 'cursor-pointer hover:opacity-80'
  );

  const variants = {
    primary: 'bg-primary-50 text-primary-700 ring-1 ring-primary-700/10 dark:bg-primary-400/10 dark:text-primary-400 dark:ring-primary-400/20',
    secondary: 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20',
    success: 'bg-green-50 text-green-700 ring-1 ring-green-600/10 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20',
    error: 'bg-red-50 text-red-700 ring-1 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20',
    warning: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/10 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/20',
    info: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const roundedStyles = rounded ? 'rounded-full' : 'rounded-md';

  return (
    <MotionSpan
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      className={classNames(
        baseStyles,
        variants[variant],
        sizes[size],
        roundedStyles,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      {...props}
    >
      {icon && (
        <MotionSpan
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={classNames(
            'mr-1.5 -ml-0.5',
            size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
          )}
        >
          {icon}
        </MotionSpan>
      )}
      {children}
      {removable && (
        <MotionButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className={classNames(
            'ml-1.5 -mr-0.5 rounded-full p-0.5',
            'hover:bg-black/5 dark:hover:bg-white/5',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            {
              'focus:ring-primary-500': variant === 'primary',
              'focus:ring-gray-500': variant === 'secondary',
              'focus:ring-green-500': variant === 'success',
              'focus:ring-red-500': variant === 'error',
              'focus:ring-yellow-500': variant === 'warning',
              'focus:ring-blue-500': variant === 'info',
            }
          )}
        >
          <svg
            className={classNames(
              'h-3 w-3',
              size === 'lg' && 'h-4 w-4'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </MotionButton>
      )}
    </MotionSpan>
  );
}; 
