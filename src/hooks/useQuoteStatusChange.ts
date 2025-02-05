import { useState, useCallback } from 'react';
import type { QuoteStatus } from '../types/Quote';

interface UseQuoteStatusChangeReturn {
  isOpen: boolean;
  selectedStatus: QuoteStatus | null;
  openMenu: (currentStatus: QuoteStatus) => void;
  closeMenu: () => void;
  handleStatusSelect: (status: QuoteStatus) => void;
  getStatusColor: (status: QuoteStatus) => string;
  statusOptions: QuoteStatus[];
}

export const useQuoteStatusChange = (
  onStatusChange?: (status: QuoteStatus) => void
): UseQuoteStatusChangeReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<QuoteStatus | null>(null);

  const openMenu = useCallback((currentStatus: QuoteStatus) => {
    setSelectedStatus(currentStatus);
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setSelectedStatus(null);
  }, []);

  const handleStatusSelect = useCallback((status: QuoteStatus) => {
    if (onStatusChange) {
      onStatusChange(status);
    }
    closeMenu();
  }, [onStatusChange, closeMenu]);

  const getStatusColor = useCallback((status: QuoteStatus): string => {
    const colors = {
      pending: 'text-yellow-800 bg-yellow-100',
      approved: 'text-green-800 bg-green-100',
      rejected: 'text-red-800 bg-red-100',
      completed: 'text-blue-800 bg-blue-100',
    };
    return colors[status] || colors.pending;
  }, []);

  const statusOptions: QuoteStatus[] = [
    'pending',
    'approved',
    'rejected',
    'completed',
  ];

  return {
    isOpen,
    selectedStatus,
    openMenu,
    closeMenu,
    handleStatusSelect,
    getStatusColor,
    statusOptions,
  };
}; 