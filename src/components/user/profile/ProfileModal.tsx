import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { ProfileTab } from './ProfileTab';
import { SecurityTab } from './SecurityTab';
import type { ProfileFormData, CredentialsFormData } from './types';
import type { User } from '../../../types/User';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'profile' | 'security';
  setActiveTab: (tab: 'profile' | 'security') => void;
  onProfileSubmit: (data: ProfileFormData) => Promise<void>;
  onCredentialsSubmit: (data: CredentialsFormData) => Promise<void>;
  isUpdating: boolean;
  currentUser: User | null;
}

export const ProfileModal = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onProfileSubmit,
  onCredentialsSubmit,
  isUpdating,
  currentUser,
}: ProfileModalProps) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            {activeTab === 'profile' ? 'Profile Settings' : 'Security Settings'}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              activeTab === 'profile'
                                ? 'bg-white text-indigo-700'
                                : 'text-white hover:bg-indigo-600'
                            }`}
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => setActiveTab('security')}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              activeTab === 'security'
                                ? 'bg-white text-indigo-700'
                                : 'text-white hover:bg-indigo-600'
                            }`}
                          >
                            Security
                          </button>
                        </div>
                      </div>

                      {activeTab === 'profile' ? (
                        <ProfileTab
                          onSubmit={onProfileSubmit}
                          isUpdating={isUpdating}
                          currentUser={currentUser}
                          onClose={onClose}
                        />
                      ) : (
                        <SecurityTab
                          onSubmit={onCredentialsSubmit}
                          isUpdating={isUpdating}
                          onClose={onClose}
                        />
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}; 