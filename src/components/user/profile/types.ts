import type { User } from '../../../types/User';

export interface ProfileFormData {
  displayName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  preferredContactMethod: 'email' | 'phone';
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
  };
}

export interface CredentialsFormData {
  currentPassword: string;
  newEmail?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface ProfileTabProps {
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isUpdating: boolean;
  currentUser: User | null;
  onClose: () => void;
}

export interface SecurityTabProps {
  onSubmit: (data: CredentialsFormData) => Promise<void>;
  isUpdating: boolean;
  onClose: () => void;
} 