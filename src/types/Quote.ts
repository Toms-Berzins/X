export type QuoteStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'in_preparation'
  | 'coating'
  | 'curing'
  | 'quality_check';

export interface QuoteImage {
  url: string;
  caption?: string;
}

export interface QuoteItem {
  type: string;
  size: string;
  quantity: number;
  basePrice: number;
}

export interface QuoteCoating {
  type: string;
  color: string;
  finish: string;
}

export interface QuoteAdditionalServices {
  sandblasting?: boolean;
  priming?: boolean;
  [key: string]: boolean | undefined;
}

export interface QuoteContactInfo {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface BaseQuote {
  id: string;
  userId: string;
  orderNumber: string;
  status: QuoteStatus;
  items: QuoteItem[];
  coating: QuoteCoating;
  additionalServices: QuoteAdditionalServices;
  contactInfo: QuoteContactInfo;
  total: number;
  discount: number;
  trackingNumber?: string;
  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface QuoteData extends BaseQuote {
  images?: QuoteImage[];
} 