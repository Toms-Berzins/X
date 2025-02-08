export type QuoteStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface QuoteImage {
  url: string;
  caption?: string;
}

export interface QuoteItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  type: string;
  basePrice: number;
}

export interface QuoteCoating {
  type: string;
  color: string;
  finish: string;
}

export interface QuoteAdditionalServices {
  sandblasting: boolean;
  priming: boolean;
  rushOrder: boolean;
}

export interface QuoteContactInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
}

export interface Quote {
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
  createdAt: string;
  images: QuoteImage[];
  promoCode?: string;
  editingItemIndex?: number | null;
}

// Alias for Quote interface to maintain compatibility
export interface QuoteData {
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
  createdAt: string;
  images: QuoteImage[];
  promoCode?: string;
  editingItemIndex?: number | null;
  showNoItemsError?: boolean;
} 