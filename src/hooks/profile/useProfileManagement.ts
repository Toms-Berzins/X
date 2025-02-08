import { useState, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import type { ProfileFormData, CredentialsFormData } from '../../components/user/profile/types';

export const useProfileManagement = () => {
  const { currentUser, updateUserProfile, updateUserEmail, updateUserPassword } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const handleProfileSubmit = async (data: ProfileFormData) => {
    if (!currentUser) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    try {
      setIsUpdating(true);

      // Validate required fields
      if (!data.displayName?.trim()) {
        throw new Error('Display name is required');
      }

      if (!data.email?.trim()) {
        throw new Error('Email is required');
      }

      // Validate email format
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
      }

      // Validate phone format if provided
      if (data.phone) {
        const phoneRegex = /^[\d\s-+()]*$/;
        if (!phoneRegex.test(data.phone)) {
          throw new Error('Invalid phone number format');
        }
      }

      // Validate ZIP code format if provided
      if (data.zipCode) {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(data.zipCode)) {
          throw new Error('Invalid ZIP code format');
        }
      }

      // If email has changed, we need to update it through Firebase Auth
      if (data.email !== currentUser?.email) {
        throw new Error('Email changes must be done through the Security tab');
      }

      await updateUserProfile(data);
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCredentialsSubmit = async (data: CredentialsFormData) => {
    if (!currentUser) {
      toast.error('You must be logged in to update your credentials');
      return;
    }

    try {
      setIsUpdating(true);

      if (!data.currentPassword) {
        throw new Error('Current password is required');
      }

      if (data.newEmail && data.newEmail !== currentUser?.email) {
        await updateUserEmail(data.newEmail, data.currentPassword);
      }

      if (data.newPassword) {
        if (data.newPassword.length < 8) {
          throw new Error('New password must be at least 8 characters');
        }

        if (data.newPassword !== data.confirmNewPassword) {
          throw new Error('New passwords do not match');
        }

        await updateUserPassword(data.currentPassword, data.newPassword);
      }
    } catch (error: any) {
      console.error('Credentials update error:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    currentUser,
    isProfileOpen,
    setIsProfileOpen,
    isUpdating,
    activeTab,
    setActiveTab,
    handleProfileSubmit,
    handleCredentialsSubmit,
  };
}; 