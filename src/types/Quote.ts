import { QuoteData as BaseQuoteData } from '../pages/Quote';

export type QuoteStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface QuoteData extends BaseQuoteData {
  id: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt?: string;
  userId?: string;
  contactInfo?: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
  };
} 