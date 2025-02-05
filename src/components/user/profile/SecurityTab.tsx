import { useForm } from 'react-hook-form';
import type { CredentialsFormData, SecurityTabProps } from './types';

export const SecurityTab = ({ onSubmit, isUpdating, onClose }: SecurityTabProps) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CredentialsFormData>({
    defaultValues: {
      currentPassword: '',
      newEmail: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
      <div className="divide-y divide-gray-200 px-4 sm:px-6">
        <div className="space-y-6 pb-5 pt-6">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Current Password
            </label>
            <input
              type="password"
              {...register('currentPassword', { 
                required: 'Current password is required'
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.newEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.newEmail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.confirmNewPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword.message}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-shrink-0 justify-end px-4 py-4">
        <button
          type="button"
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUpdating}
          className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}; 