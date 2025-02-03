import React from 'react';
import clsx from 'clsx';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  icon,
  className,
  onClick,
}) => {
  const baseStyles = 'inline-flex items-center font-medium';

  const variants = {
    primary: 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
    secondary: 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400',
    success: 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400',
    error: 'bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const roundedStyles = rounded ? 'rounded-full' : 'rounded-md';
  const cursorStyles = onClick ? 'cursor-pointer hover:opacity-80' : '';

  return (
    <span
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        roundedStyles,
        cursorStyles,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {icon && <span className="mr-1.5 -ml-0.5">{icon}</span>}
      {children}
    </span>
  );
}; 