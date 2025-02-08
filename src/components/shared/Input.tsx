import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { MotionDiv, useAnimationConfig } from '../providers/AnimationProvider';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  animate?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      size = 'md',
      className,
      leftIcon,
      rightIcon,
      containerClassName,
      animate = true,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const { isEnabled } = useAnimationConfig();

    const sizes = {
      sm: 'h-8 text-sm',
      md: 'h-10 text-base',
      lg: 'h-12 text-lg',
    } as const;

    const inputClassName = classNames(
      'block w-full rounded-md border-gray-300 shadow-sm',
      'focus:border-primary-500 focus:ring-primary-500',
      'disabled:bg-gray-100 disabled:cursor-not-allowed',
      'dark:bg-gray-800 dark:border-gray-700 dark:text-white',
      'dark:focus:border-primary-400 dark:focus:ring-primary-400',
      'dark:disabled:bg-gray-900',
      sizes[size],
      leftIcon ? 'pl-10' : null,
      rightIcon ? 'pr-10' : null,
      error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : null,
      className
    );

    const containerClasses = classNames(
      'relative',
      containerClassName
    );

    const iconClasses = classNames(
      'absolute inset-y-0 flex items-center pointer-events-none text-gray-400',
      {
        'w-4 h-4': size === 'sm',
        'w-5 h-5': size === 'md',
        'w-6 h-6': size === 'lg'
      }
    );

    const inputContent = (
      <>
        {label && (
          <label
            className={classNames(
              'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
              { 'opacity-60': disabled }
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className={containerClasses}>
          {leftIcon && (
            <div className={classNames(iconClasses, 'left-3')}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClassName}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : undefined}
            disabled={disabled}
            required={required}
            {...props}
          />
          {rightIcon && (
            <div className={classNames(iconClasses, 'right-3')}>
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            id={`${props.id}-error`}
          >
            {error}
          </p>
        )}
      </>
    );

    if (animate && isEnabled) {
      return (
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {inputContent}
        </MotionDiv>
      );
    }

    return inputContent;
  }
);

Input.displayName = 'Input';

export default Input; 
