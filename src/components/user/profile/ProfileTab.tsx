import { useForm } from 'react-hook-form';
import type { ProfileFormData, ProfileTabProps } from './types';
import { motion } from 'framer-motion';
import { Loader2, Mail, Phone, Bell, BellRing, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUserProfile } from '../../../hooks/useUserProfile';

export const ProfileTab = ({ onSubmit, isUpdating, currentUser, onClose }: ProfileTabProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const { userProfile, loading } = useUserProfile(currentUser?.uid);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues, reset } = useForm<ProfileFormData>({
    defaultValues: {
      displayName: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      preferredContactMethod: 'email',
      notifications: {
        orderUpdates: true,
        promotions: false,
      },
    },
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (userProfile) {
      reset({
        displayName: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        company: userProfile.company || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        zipCode: userProfile.zipCode || '',
        preferredContactMethod: userProfile.preferredContactMethod || 'email',
        notifications: {
          orderUpdates: userProfile.notifications?.orderUpdates ?? true,
          promotions: userProfile.notifications?.promotions ?? false,
        },
      });
    }
  }, [userProfile, reset]);

  // Watch for changes in notification preferences
  const orderUpdates = watch('notifications.orderUpdates');
  const promotions = watch('notifications.promotions');
  const preferredContactMethod = watch('preferredContactMethod');

  // Handle notification toggle
  const handleNotificationToggle = (key: 'orderUpdates' | 'promotions') => {
    const currentValue = getValues(`notifications.${key}`);
    setValue(`notifications.${key}`, !currentValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Handle contact method selection
  const handleContactMethodSelect = (method: 'email' | 'phone') => {
    setValue('preferredContactMethod', method, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Effect to validate contact method based on email/phone availability
  useEffect(() => {
    const values = getValues();
    if (preferredContactMethod === 'email' && !values.email) {
      setValue('preferredContactMethod', 'phone');
    } else if (preferredContactMethod === 'phone' && !values.phone) {
      setValue('preferredContactMethod', 'email');
    }
  }, [preferredContactMethod, setValue, getValues]);

  const inputClasses = `mt-1 block w-full rounded-lg border-0 bg-white/50 dark:bg-gray-900/50 
    py-2 px-3 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 
    dark:focus:ring-primary-400 sm:text-sm sm:leading-6 transition-all duration-200`;

  const labelClasses = "block text-sm font-medium text-gray-900 dark:text-gray-100";
  const errorClasses = "mt-1 text-sm text-red-500 dark:text-red-400";

  const handleFormSubmit = async (data: ProfileFormData) => {
    try {
      await onSubmit(data);
      setShowSuccess(true);
      toast.success('Profile updated successfully!');
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(handleFormSubmit)} 
      className="space-y-6"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500 dark:text-primary-400" />
        </div>
      ) : (
        <>
          <div>
            <label className={labelClasses}>
              Display Name
            </label>
            <input
              type="text"
              {...register('displayName', { required: 'Display name is required' })}
              className={inputClasses}
              placeholder="Enter your display name"
            />
            {errors.displayName && (
              <p className={errorClasses}>{errors.displayName.message}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>
              Email Address
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={inputClasses}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className={errorClasses}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone', {
                pattern: {
                  value: /^[\d\s-+()]*$/,
                  message: 'Invalid phone number'
                }
              })}
              className={inputClasses}
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && (
              <p className={errorClasses}>{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>
              Company (Optional)
            </label>
            <input
              type="text"
              {...register('company')}
              className={inputClasses}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClasses}>
                Street Address
              </label>
              <input
                type="text"
                {...register('address')}
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-3">
                <label className={labelClasses}>
                  City
                </label>
                <input
                  type="text"
                  {...register('city')}
                  className={inputClasses}
                />
              </div>

              <div className="col-span-2">
                <label className={labelClasses}>
                  State
                </label>
                <input
                  type="text"
                  {...register('state')}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  ZIP
                </label>
                <input
                  type="text"
                  {...register('zipCode', {
                    pattern: {
                      value: /^\d{5}(-\d{4})?$/,
                      message: 'Invalid ZIP code'
                    }
                  })}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClasses}>
                Preferred Contact Method
              </label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContactMethodSelect('email')}
                  className={`relative flex cursor-pointer rounded-lg px-4 py-3 shadow-sm focus:outline-none
                    ${preferredContactMethod === 'email' 
                      ? 'bg-primary-50 dark:bg-primary-900/50 border-2 border-primary-500 dark:border-primary-400' 
                      : 'bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600'}`}
                >
                  <input
                    type="radio"
                    {...register('preferredContactMethod')}
                    value="email"
                    className="sr-only"
                    disabled={!watch('email')}
                  />
                  <div className="flex w-full items-center justify-center">
                    <div className="flex items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full 
                        ${preferredContactMethod === 'email'
                          ? 'bg-primary-500 dark:bg-primary-400'
                          : 'bg-gray-200 dark:bg-gray-700'}`}
                      >
                        <Mail className={`h-4 w-4 ${preferredContactMethod === 'email' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${preferredContactMethod === 'email' 
                          ? 'text-primary-900 dark:text-primary-100' 
                          : 'text-gray-900 dark:text-gray-100'}`}>
                          Email
                        </p>
                        {!watch('email') && (
                          <p className="text-xs text-red-500 dark:text-red-400">
                            Add email first
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContactMethodSelect('phone')}
                  className={`relative flex cursor-pointer rounded-lg px-4 py-3 shadow-sm focus:outline-none
                    ${preferredContactMethod === 'phone' 
                      ? 'bg-primary-50 dark:bg-primary-900/50 border-2 border-primary-500 dark:border-primary-400' 
                      : 'bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600'}`}
                >
                  <input
                    type="radio"
                    {...register('preferredContactMethod')}
                    value="phone"
                    className="sr-only"
                    disabled={!watch('phone')}
                  />
                  <div className="flex w-full items-center justify-center">
                    <div className="flex items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full 
                        ${preferredContactMethod === 'phone'
                          ? 'bg-primary-500 dark:bg-primary-400'
                          : 'bg-gray-200 dark:bg-gray-700'}`}
                      >
                        <Phone className={`h-4 w-4 ${preferredContactMethod === 'phone' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${preferredContactMethod === 'phone' 
                          ? 'text-primary-900 dark:text-primary-100' 
                          : 'text-gray-900 dark:text-gray-100'}`}>
                          Phone
                        </p>
                        {!watch('phone') && (
                          <p className="text-xs text-red-500 dark:text-red-400">
                            Add phone first
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div>
              <label className={labelClasses}>
                Notification Preferences
              </label>
              <div className="mt-3 space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center justify-between p-3 rounded-lg
                    ${orderUpdates 
                      ? 'bg-primary-50 dark:bg-primary-900/50 border-2 border-primary-500 dark:border-primary-400' 
                      : 'bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600'}`}
                >
                  <div className="flex items-center flex-1">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full mr-3
                      ${orderUpdates ? 'bg-primary-500 dark:bg-primary-400' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      <BellRing className={`h-4 w-4 ${orderUpdates ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Order Status Updates
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications about your order status changes
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      ${orderUpdates ? 'bg-primary-500 dark:bg-primary-400' : 'bg-gray-200 dark:bg-gray-700'}`}
                    role="switch"
                    aria-checked={orderUpdates}
                    onClick={() => handleNotificationToggle('orderUpdates')}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                        transition duration-200 ease-in-out ${orderUpdates ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </motion.button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center justify-between p-3 rounded-lg
                    ${promotions 
                      ? 'bg-primary-50 dark:bg-primary-900/50 border-2 border-primary-500 dark:border-primary-400' 
                      : 'bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600'}`}
                >
                  <div className="flex items-center flex-1">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full mr-3
                      ${promotions ? 'bg-primary-500 dark:bg-primary-400' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      <Bell className={`h-4 w-4 ${promotions ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Promotional Emails
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get updates about special offers and new features
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      ${promotions ? 'bg-primary-500 dark:bg-primary-400' : 'bg-gray-200 dark:bg-gray-700'}`}
                    role="switch"
                    aria-checked={promotions}
                    onClick={() => handleNotificationToggle('promotions')}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                        transition duration-200 ease-in-out ${promotions ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 
                hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 
                focus:ring-primary-500 dark:focus:ring-primary-400 transition-all duration-200"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isUpdating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={showSuccess ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.2 }}
              className={`
                inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white 
                shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 
                dark:focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed 
                transition-all duration-200
                ${showSuccess 
                  ? 'bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600'
                  : 'bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600'
                }
              `}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Updated!</span>
                </motion.div>
              ) : (
                'Save Changes'
              )}
            </motion.button>
          </div>
        </>
      )}
    </motion.form>
  );
}; 