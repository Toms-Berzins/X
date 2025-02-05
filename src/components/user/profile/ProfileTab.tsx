import { useForm } from 'react-hook-form';
import type { ProfileFormData, ProfileTabProps } from './types';
import type { User } from '../../../types/User';

export const ProfileTab = ({ onSubmit, isUpdating, currentUser, onClose }: ProfileTabProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      displayName: (currentUser as unknown as User)?.displayName || '',
      email: currentUser?.email || '',
      phone: (currentUser as unknown as User)?.phone || '',
      company: (currentUser as unknown as User)?.company || '',
      address: (currentUser as unknown as User)?.address || '',
      city: (currentUser as unknown as User)?.city || '',
      state: (currentUser as unknown as User)?.state || '',
      zipCode: (currentUser as unknown as User)?.zipCode || '',
      preferredContactMethod: (currentUser as unknown as User)?.preferredContactMethod || 'email',
      notifications: {
        orderUpdates: true,
        promotions: false,
      },
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
      <div className="divide-y divide-gray-200 px-4 sm:px-6">
        <div className="space-y-6 pb-5 pt-6">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Display Name
            </label>
            <input
              type="text"
              {...register('displayName', { required: 'Display name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Company (Optional)
            </label>
            <input
              type="text"
              {...register('company')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Street Address
              </label>
              <input
                type="text"
                {...register('address')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-900">
                  City
                </label>
                <input
                  type="text"
                  {...register('city')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900">
                  State
                </label>
                <input
                  type="text"
                  {...register('state')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Preferred Contact Method
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  {...register('preferredContactMethod')}
                  value="email"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Email
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  {...register('preferredContactMethod')}
                  value="phone"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Phone
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Notification Preferences
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('notifications.orderUpdates')}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Order status updates
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('notifications.promotions')}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Promotional emails
                </label>
              </div>
            </div>
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
          {isUpdating ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}; 