import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastVariant } from '../components/shared/Toast';

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<ToastVariant>('info');

  const showToast = useCallback((newMessage: string, newVariant: ToastVariant = 'info') => {
    setMessage(newMessage);
    setVariant(newVariant);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={message}
        variant={variant}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </ToastContext.Provider>
  );
};