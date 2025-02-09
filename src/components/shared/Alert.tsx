import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Sparkles, X } from 'lucide-react';

type AlertVariant = 'error' | 'warning' | 'success' | 'info';

interface AlertProps {
  title: string;
  message: string;
  variant?: AlertVariant;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  show?: boolean;
  autoHideDuration?: number;
  children?: React.ReactNode;
}

const variantStyles = {
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    title: 'text-red-800 dark:text-red-300',
    text: 'text-red-700 dark:text-red-400',
    icon: 'text-red-500 dark:text-red-400'
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    title: 'text-amber-800 dark:text-amber-300',
    text: 'text-amber-700 dark:text-amber-400',
    icon: 'text-amber-500 dark:text-amber-400'
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    title: 'text-emerald-800 dark:text-emerald-300',
    text: 'text-emerald-700 dark:text-emerald-400',
    icon: 'text-emerald-500 dark:text-emerald-400'
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    title: 'text-blue-800 dark:text-blue-300',
    text: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-500 dark:text-blue-400'
  }
};

export const Alert: React.FC<AlertProps> = ({
  title,
  message,
  variant = 'info',
  icon,
  onDismiss,
  show = true,
  autoHideDuration,
  children
}) => {
  React.useEffect(() => {
    if (autoHideDuration && show && onDismiss) {
      const timer = setTimeout(onDismiss, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, show, onDismiss]);

  if (!show) return null;

  const styles = variantStyles[variant];
  const DefaultIcon = variant === 'success' ? Sparkles : AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${styles.bg} border ${styles.border} rounded-xl p-4`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {icon || <DefaultIcon className={`h-5 w-5 ${styles.icon}`} />}
        </div>
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${styles.title}`}>
            {title}
          </h3>
          <p className={`mt-1 text-sm ${styles.text}`}>
            {message}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 ${styles.icon} hover:opacity-75`}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}; 