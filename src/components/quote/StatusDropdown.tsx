import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';
import type { QuoteStatus } from '../../types/Quote';
import { useQuoteStatusChange } from '../../hooks/useQuoteStatusChange';
import { cn } from '../../lib/utils';

interface StatusDropdownProps {
  status: QuoteStatus;
  onStatusChange: (status: QuoteStatus) => void;
  className?: string;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  status,
  onStatusChange,
  className,
}) => {
  const {
    isOpen,
    selectedStatus,
    openMenu,
    closeMenu,
    handleStatusSelect,
    getStatusColor,
    statusOptions,
  } = useQuoteStatusChange(onStatusChange);

  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      <div>
        <Menu.Button
          className={cn(
            'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium',
            getStatusColor(status),
            'hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          )}
          onClick={() => openMenu(status)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
          <ChevronDownIcon className="ml-1 h-4 w-4" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        show={isOpen}
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          static
          className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
        >
          <div className="py-1">
            {statusOptions.map((option) => (
              <Menu.Item key={option}>
                {({ active }) => (
                  <button
                    className={cn(
                      active ? 'bg-gray-100' : '',
                      'block w-full text-left px-4 py-2 text-sm',
                      option === selectedStatus ? 'font-medium' : ''
                    )}
                    onClick={() => handleStatusSelect(option)}
                  >
                    <span className={cn('inline-block w-3 h-3 rounded-full mr-2', getStatusColor(option))} />
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}; 