import type { BaseQuote } from './Quote';

export type UserRole = 'admin' | 'user';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Quote extends BaseQuote {} 