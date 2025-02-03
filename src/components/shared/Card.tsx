import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'elevated' | 'outlined' | 'filled';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'elevated',
  hover = false,
  onClick,
}) => {
  const baseStyles = 'rounded-lg p-6';

  const variants = {
    elevated: 'bg-white shadow-lg dark:bg-secondary-800',
    outlined: 'border border-secondary-200 dark:border-secondary-700',
    filled: 'bg-secondary-50 dark:bg-secondary-900',
  };

  const hoverStyles = hover
    ? 'transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={classNames(baseStyles, variants[variant], hoverStyles, className)}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}; 
