export type QuoteStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'inPreparation'
  | 'inCoating'
  | 'inCuring'
  | 'inQualityCheck'
  | 'readyForDelivery'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'Draft',
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  inPreparation: 'In Preparation',
  inCoating: 'Coating in Progress',
  inCuring: 'Curing',
  inQualityCheck: 'Quality Check',
  readyForDelivery: 'Ready for Delivery',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

export const QUOTE_STATUS_COLORS: Record<QuoteStatus, { bg: string; text: string }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-800' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  approved: { bg: 'bg-green-100', text: 'text-green-800' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800' },
  inPreparation: { bg: 'bg-purple-100', text: 'text-purple-800' },
  inCoating: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  inCuring: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
  inQualityCheck: { bg: 'bg-teal-100', text: 'text-teal-800' },
  readyForDelivery: { bg: 'bg-blue-100', text: 'text-blue-800' },
  delivered: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  completed: { bg: 'bg-green-100', text: 'text-green-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' }
};

export const QUOTE_STATUS_ORDER: QuoteStatus[] = [
  'draft',
  'pending',
  'approved',
  'inPreparation',
  'inCoating',
  'inCuring',
  'inQualityCheck',
  'readyForDelivery',
  'delivered',
  'completed'
];

export const isQuoteEditable = (status: QuoteStatus): boolean => {
  const editableStatuses: QuoteStatus[] = ['draft', 'pending'];
  return editableStatuses.includes(status);
};

export const isCancellable = (status: QuoteStatus): boolean => {
  const cancellableStatuses: QuoteStatus[] = ['draft', 'pending', 'approved', 'inPreparation'];
  return cancellableStatuses.includes(status);
};

export const getNextStatus = (currentStatus: QuoteStatus): QuoteStatus | null => {
  const currentIndex = QUOTE_STATUS_ORDER.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === QUOTE_STATUS_ORDER.length - 1) return null;
  return QUOTE_STATUS_ORDER[currentIndex + 1];
};

export const getPreviousStatus = (currentStatus: QuoteStatus): QuoteStatus | null => {
  const currentIndex = QUOTE_STATUS_ORDER.indexOf(currentStatus);
  if (currentIndex <= 0) return null;
  return QUOTE_STATUS_ORDER[currentIndex - 1];
}; 