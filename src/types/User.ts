export type UserRole = 'admin' | 'user';

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  preferredContactMethod?: 'email' | 'phone';
  notifications?: {
    orderUpdates: boolean;
    promotions: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: string;
  userId: string;
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
  promoCode: string;
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'approved' | 'in_preparation' | 'coating' | 'curing' | 'quality_check' | 'completed' | 'rejected';
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
} 