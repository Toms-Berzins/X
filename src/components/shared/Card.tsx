import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import classNames from 'classnames';

interface CustomCardProps {
  variant?: 'elevated' | 'outlined' | 'filled' | 'glass';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

interface CardProps extends HTMLMotionProps<'div'>, CustomCardProps {
  children: React.ReactNode;
}

const MotionDiv = motion.create('div');

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => {
    const {
      children,
      className,
      variant = 'elevated',
      hover = false,
      padding = 'md',
      radius = 'lg',
      ...rest
    } = props;

    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const radiuses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    };

    const variants = {
      elevated: 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl dark:shadow-gray-900/50',
      outlined: 'border border-gray-200 dark:border-gray-700 bg-transparent',
      filled: 'bg-gray-50 dark:bg-gray-900',
      glass: 'backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 shadow-lg hover:shadow-xl',
    };

    const hoverStyles = hover
      ? 'transform transition-transform duration-200 hover:-translate-y-1'
      : '';

    const cardStyles = classNames(
      variants[variant],
      paddings[padding],
      radiuses[radius],
      hoverStyles,
      'transition-all duration-200',
      className
    );

    return (
      <MotionDiv
        ref={ref}
        className={cardStyles}
        {...rest}
      >
        {children}
      </MotionDiv>
    );
  }
); 
