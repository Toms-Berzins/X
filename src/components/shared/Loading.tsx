import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
  label?: string;
  fullScreen?: boolean;
}

const MotionDiv = motion.div;

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  label,
  fullScreen = false,
}) => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const variants = {
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    white: 'text-white',
  };

  const labelSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const Spinner = () => (
    <div className="relative">
      <MotionDiv
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity,
          type: "tween"
        }}
        className={classNames(
          'rounded-full border-2 border-current border-r-transparent',
          sizes[size],
          variants[variant],
          className
        )}
      />
      {label && (
        <span
          className={classNames(
            'mt-2 block text-center font-medium',
            variants[variant],
            labelSizes[size]
          )}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Spinner />
        </MotionDiv>
      </div>
    );
  }

  return <Spinner />;
}; 
