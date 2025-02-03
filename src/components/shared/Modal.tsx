import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  className,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useKeyboardShortcut('Escape', onClose);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100vw-2rem)]',
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={classNames(
                  'relative w-full rounded-lg bg-white p-6 shadow-xl dark:bg-secondary-800',
                  sizes[size],
                  className
                )}
              >
                {title && (
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {title}
                    </h2>
                    {description && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {description}
                      </p>
                    )}
                  </div>
                )}
                {children}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}; 
