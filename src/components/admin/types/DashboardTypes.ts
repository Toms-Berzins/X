import type { Quote } from '@/types/User';

export interface EditFormType {
  orderNumber: string;
  items: {
    type: string;
    size: string;
    quantity: number;
    basePrice: number;
  }[];
  coating: {
    type: string;
    color: string;
    finish: string;
    priceMultiplier?: number;
  };
  additionalServices: {
    sandblasting?: boolean;
    priming?: boolean;
    [key: string]: boolean | undefined;
  };
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  total: number;
  subtotal: number;
  discount: number;
}

export interface QuoteTableProps {
  quotes: Quote[];
  onEditClick: (quote: Quote) => void;
  onDeleteClick: (quote: Quote) => void;
  selectedQuote: string | null;
  setSelectedQuote: (id: string | null) => void;
  editingQuote: string | null;
  editForm: EditFormType | null;
  handleEditFormChange: (field: string, value: any) => void;
  handleEdit: (quoteId: string) => void;
  handleProgressUpdate: (quoteId: string, newStatus: Quote['status']) => void;
  handleStatusUpdate: (quoteId: string, newStatus: Quote['status']) => void;
  handleTrackingUpdate: (quoteId: string, trackingNumber: string) => void;
  trackingNumber: string;
  setTrackingNumber: (value: string) => void;
  operationLoading: boolean;
}

export type DeleteModalProps = {
  quote: Quote | null;
  onClose: () => void;
  onConfirm: () => void;
}; 