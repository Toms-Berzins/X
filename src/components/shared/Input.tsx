import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'block w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-secondary-700 dark:bg-secondary-900 dark:text-white dark:placeholder:text-gray-400';

    const errorStyles = error
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';

    const widthStyles = fullWidth ? 'w-full' : 'w-auto';

    return (
      <div className={clsx('flex flex-col gap-1.5', widthStyles)}>
        {label && (
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              baseStyles,
              errorStyles,
              startIcon && 'pl-10',
              endIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {endIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={clsx(
              'text-sm',
              error ? 'text-error-500' : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {error || helperText}
          </p>
        )}
 