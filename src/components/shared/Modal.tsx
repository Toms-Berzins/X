import React, { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { modalVariants, overlayVariants } from '../../config/animations';
import { MotionDiv, useAnimationConfig } from '../providers/AnimationProvider';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showCloseButton?: boolean;
  closeOnClickOutside?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  className,
  showCloseButton = true,
  closeOnClickOutside = true,
}) => {
  const { isEnabled, defaultTransition } = useAnimationConfig();

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

  return isOpen ? (
    <Dialog
      as={MotionDiv}
      className="fixed inset-0 z-50 overflow-y-auto"
      onClose={closeOnClickOutside ? onClose : () => {}}
      static
    >
      <div className="min-h-screen px-4 text-center">
        <MotionDiv
          className="fixed inset-0 bg-black"
          variants={overlayVariants}
          initial={isEnabled ? "hidden" : false}
          animate={isEnabled ? "visible" : { opacity: 0.5 }}
          exit="exit"
          aria-hidden="true"
          transition={defaultTransition}
        />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <MotionDiv
          className={classNames(
            'inline-block w-full text-left align-middle transition-all',
            sizes[size],
            className
          )}
          variants={modalVariants}
          initial={isEnabled ? "hidden" : false}
          animate={isEnabled ? "visible" : { opacity: 1, scale: 1, y: 0 }}
          exit="exit"
          transition={defaultTransition}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-description" : undefined}
        >
          <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                {title && (
                  <Dialog.Title 
                    id="modal-title"
                    className="text-lg font-medium text-gray-900 dark:text-gray-100"
                  >
                    {title}
                  </Dialog.Title>
                )}
                {showCloseButton && (
                  <MotionDiv
                    whileHover={isEnabled ? { scale: 1.1 } : undefined}
                    whileTap={isEnabled ? { scale: 0.95 } : undefined}
                  >
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={onClose}
                      aria-label="Close modal"
                    >
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </MotionDiv>
                )}
              </div>
            )}
            <div className="p-4">
              {description && (
                <Dialog.Description 
                  id="modal-description"
                  className="text-sm text-gray-500 dark:text-gray-400 mb-4"
                >
                  {description}
                </Dialog.Description>
              )}
              {children}
            </div>
          </Dialog.Panel>
        </MotionDiv>
      </div>
    </Dialog>
  ) : null;
}; 
