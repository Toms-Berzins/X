import React, { useState } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'line' | 'pill' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  className,
  orientation = 'horizontal',
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const getTabStyles = (tab: Tab) => {
    const isActive = tab.id === value;
    const isHovered = tab.id === hoveredTab;

    const baseStyles = classNames(
      'relative flex items-center justify-center transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
      tab.disabled && 'cursor-not-allowed opacity-50',
      !tab.disabled && 'cursor-pointer',
      sizes[size]
    );

    if (variant === 'line') {
      return classNames(
        baseStyles,
        'px-4 py-2 font-medium',
        isActive
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
        tab.disabled && 'cursor-not-allowed opacity-50'
      );
    }

    if (variant === 'pill') {
      return classNames(
        baseStyles,
        'px-4 py-2 font-medium rounded-full',
        'relative z-10',
        isActive
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
      );
    }

    return classNames(
      baseStyles,
      'px-4 py-2 font-medium',
      isActive
        ? 'bg-white text-primary-600 border-t border-l border-r rounded-t-lg dark:bg-gray-800 dark:text-primary-400'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
      isHovered && !isActive && 'bg-gray-50 dark:bg-gray-700/50'
    );
  };

  const containerStyles = classNames(
    'relative',
    orientation === 'horizontal' ? 'flex' : 'flex flex-col',
    variant === 'line' && 'border-b border-gray-200 dark:border-gray-700',
    variant === 'pill' && 'p-1 bg-gray-100 rounded-full dark:bg-gray-800',
    variant === 'enclosed' && 'border-b border-gray-200 dark:border-gray-700',
    fullWidth && 'w-full',
    className
  );

  const indicatorStyles = classNames(
    'absolute transition-all duration-200',
    variant === 'line' && 'bottom-0 h-0.5 bg-primary-600 dark:bg-primary-400',
    variant === 'pill' && 'bg-white dark:bg-gray-700 rounded-full shadow-sm',
    variant === 'enclosed' && 'hidden'
  );

  return (
    <div className={containerStyles} role="tablist">
      {tabs.map((tab, index) => (
        <motion.button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          onMouseEnter={() => setHoveredTab(tab.id)}
          onMouseLeave={() => setHoveredTab(null)}
          className={getTabStyles(tab)}
          disabled={tab.disabled}
          role="tab"
          aria-selected={tab.id === value}
          aria-controls={`panel-${tab.id}`}
          tabIndex={tab.id === value ? 0 : -1}
          whileHover={!tab.disabled ? { scale: 1.02 } : undefined}
          whileTap={!tab.disabled ? { scale: 0.98 } : undefined}
        >
          {tab.icon && (
            <span className={classNames('mr-2', size === 'sm' ? 'text-lg' : 'text-xl')}>
              {tab.icon}
            </span>
          )}
          {tab.label}
          {variant === 'line' && tab.id === value && (
            <motion.div
              layoutId="activeTab"
              className={indicatorStyles}
              style={{
                width: '100%',
                left: 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
      {variant === 'pill' && (
        <motion.div
          layoutId="activeTab"
          className={indicatorStyles}
          style={{
            width: `${100 / tabs.length}%`,
            height: '100%',
            left: `${(tabs.findIndex((tab) => tab.id === value) * 100) / tabs.length}%`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  );
}; 
