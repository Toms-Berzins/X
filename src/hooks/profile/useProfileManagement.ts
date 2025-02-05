import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import type { ProfileFormData, CredentialsFormData } from '../../components/user/profile/types';

export const useProfileManagement = () => {
  const { currentUser, updateUserProfile, updateUserEmail, updateUserPassword } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsUpdating(true);
      await updateUserProfile(data);
      toast.success('Profile updated successfully');
      setIsProfileOpen(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCredentialsSubmit = async (data: CredentialsFormData) => {
    try {
      setIsUpdating(true);

      if (data.newEmail && data.newEmail !== currentUser?.email) {
        await updateUserEmail(data.newEmail, data.currentPassword);
        toast.success('Email updated successfully');
      }

      if (data.newPassword) {
        if (data.newPassword !== data.confirmNewPassword) {
          toast.error('New passwords do not match');
          return;
        }
        await updateUserPassword(data.currentPassword, data.newPassword);
        toast.success('Password updated successfully');
      }

      setIsProfileOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update credentials');
      console.error('Credentials update error:', error);
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