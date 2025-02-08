import { useForm } from 'react-hook-form';
import type { CredentialsFormData, SecurityTabProps } from './types';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const SecurityTab = ({ onSubmit, isUpdating, onClose }: SecurityTabProps) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CredentialsFormData>({
    defaultValues: {
      currentPassword: '',
      newEmail: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const inputClasses = `mt-1 block w-full rounded-lg border-0 bg-white/50 dark:bg-gray-900/50 
    py-2 px-3 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 
    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 
    dark:focus:ring-primary-400 sm:text-sm sm:leading-6 transition-all duration-200`;

  const labelClasses = "block text-sm font-medium text-gray-900 dark:text-gray-100";
  const errorClasses = "mt-1 text-sm text-red-500 dark:text-red-400";

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6"
    >
      <div>
        <label className={labelClasses}>
          Current Password
        </label>
        <input
          type="password"
          {...register('currentPassword', { 
            required: 'Current password is required'
          })}
          className={inputClasses}
          placeholder="Enter your current password"
        />
        {errors.currentPassword && (
          <p className={errorClasses}>{errors.currentPassword.message}</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>
          New Email (Optional)
        </label>
        <input
          type="email"
          {...register('newEmail', {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          className={inputClasses}
          placeholder="Enter new email address"
        />
        {errors.newEmail && (
          <p className={errorClasses}>{errors.newEmail.message}</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>
          New Password (Optional)
        </label>
        <input
          type="password"
          {...register('newPassword', {
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
          className={inputClasses}
          placeholder="Enter new password"
        />
        {errors.newPassword && (
          <p className={errorClasses}>{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>
          Confirm New Password
        </label>
        <input
          type="password"
          {...register('confirmNewPassword', {
            validate: (value) =>
              !watch('newPassword') ||
              value === watch('newPassword') ||
              'Passwords do not match'
          })}
          className={inputClasses}
          placeholder="Confirm new password"
        />
        {errors.confirmNewPassword && (
          <p className={errorClasses}>{errors.confirmNewPassword.message}</p>
        )}
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
        <button
          type="submit"
          disabled={isUpdating}
          className="inline-flex items-center rounded-lg bg-primary-600 dark:bg-primary-500 
            px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-500 
            dark:hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 
            dark:focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed 
            transition-all duration-200"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </motion.form>
  );
}; 