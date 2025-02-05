import { Quote } from '../../../types/User';

export type EditFormType = {
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
    priceMultiplier: number;
  };
  additionalServices: {
    sandblasting: boolean;
    priming: boolean;
    rushOrder: boolean;
  };
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  subtotal: number;
  discount: number;
  total: number;
};

export type QuoteTableProps = {
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
  handleStatusUpdate: (quoteId: string, newStatus: 'approved' | 'rejected' | 'completed') => void;
  handleTrackingUpdate: (quoteId: string, trackingNumber: string) => void;
  trackingNumber: string;
  setTrackingNumber: (value: string) => void;
  operationLoading: boolean;
};

export type DeleteModalProps = {
  quote: Quote | null;
  onClose: () => void;
  onConfirm: () => void;
}; 