import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

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
  variant?: 'line' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  className,
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const sizes = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg',
  };

  const getTabStyles = (tab: Tab) => {
    const isSelected = tab.id === value;
    const isHovered = tab.id === hoveredTab;

    if (variant === 'line') {
      return clsx(
        'relative px-4 flex items-center justify-center transition-colors duration-200',
        tab.disabled
          ? 'cursor-not-allowed text-gray-400 dark:text-gray-500'
          : isSelected
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
        sizes[size],
        fullWidth && 'flex-1'
      );
    }

    return clsx(
      'relative px-4 flex items-center justify-center transition-colors duration-200 rounded-full',
      tab.disabled
        ? 'cursor-not-allowed text-gray-400 dark:text-gray-500'
        : isSelected
        ? 'text-white'
        : isHovered
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-gray-600 dark:text-gray-400',
      sizes[size],
      fullWidth && 'flex-1'
    );
  };

  return (
    <div
      className={clsx(
        'relative flex',
        variant === 'line' && 'border-b border-gray-200 dark:border-secondary-700',
        variant === 'pill' && 'p-1 bg-gray-100 rounded-full dark:bg-secondary-800',
        fullWidth && 'w-full',
        className
      )}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          onMouseEnter={() => setHoveredTab(tab.id)}
          onMouseLeave={() => setHoveredTab(null)}
          className={getTabStyles(tab)}
          disabled={tab.disabled}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
          {variant === 'line' && tab.id === value && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
            />
          )}
        </button>
      ))}
      {variant === 'pill' && (
        <motion.div
          layoutId="activeTab"
          className="absolute top-1 bottom-1 bg-white dark:bg-secondary-700 rounded-full shadow-sm"
          style={{
            width: `${100 / tabs.length}%`,
            left: `${(tabs.findIndex(tab => tab.id === value) * 100) / tabs.length}%`,
          }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </div>
  );
}; 