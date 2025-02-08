import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';
import { ProfileTab } from './ProfileTab';
import { SecurityTab } from './SecurityTab';
import type { ProfileFormData, CredentialsFormData } from './types';
import type { User } from '../../../types/User';
import { motion } from 'framer-motion';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'profile' | 'security';
  setActiveTab: (tab: 'profile' | 'security') => void;
  onProfileSubmit: (data: ProfileFormData) => Promise<any>;
  onCredentialsSubmit: (data: CredentialsFormData) => Promise<any>;
  isUpdating: boolean;
  currentUser: User | null;
}

const MotionDialogPanel = motion.create(Dialog.Panel);

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
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <MotionDialogPanel 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="pointer-events-auto w-screen max-w-md"
                >
                  <div className="flex h-full flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl">
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-primary-600/90 dark:bg-primary-500/90 backdrop-blur-lg px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-semibold leading-6 text-white">
                            {activeTab === 'profile' ? 'Profile Settings' : 'Security Settings'}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-lg p-1 text-primary-100 hover:text-white hover:bg-primary-500/50 
                                focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
                              onClick={onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              activeTab === 'profile'
                                ? 'bg-white text-primary-600 shadow-lg'
                                : 'text-white hover:bg-primary-500/50'
                            }`}
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => setActiveTab('security')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              activeTab === 'security'
                                ? 'bg-white text-primary-600 shadow-lg'
                                : 'text-white hover:bg-primary-500/50'
                            }`}
                          >
                            Security
                          </button>
                        </div>
                      </div>

                      <div className="p-6">
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
                  </div>
                </MotionDialogPanel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}; 