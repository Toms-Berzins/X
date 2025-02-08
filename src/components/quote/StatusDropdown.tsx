import React from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import type { QuoteStatus } from '@/types/Quote';
import { cn } from '@/lib/utils';

interface StatusDropdownProps {
  status: QuoteStatus;
  onStatusChange: (status: QuoteStatus) => void;
  disabled?: boolean;
}

const statusOptions: QuoteStatus[] = ['pending', 'approved', 'rejected', 'completed'];

const getStatusColor = (status: QuoteStatus): string => {
  const colors = {
    pending: 'text-yellow-800 bg-yellow-100',
    approved: 'text-green-800 bg-green-100',
    rejected: 'text-red-800 bg-red-100',
    completed: 'text-blue-800 bg-blue-100',
  };
  return colors[status] || colors.pending;
};

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ 
  status, 
  onStatusChange,
  disabled = false,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
          getStatusColor(status),
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        disabled={disabled}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
        <ChevronDownIcon className="-mr-1 ml-2 h-4 w-4" aria-hidden="true" />
      </Menu.Button>

      {!disabled && (
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {statusOptions.map((option) => (
              <Menu.Item key={option}>
                {({ active }) => (
                  <button
                    onClick={() => onStatusChange(option)}
                    className={cn(
                      active ? 'bg-gray-100' : '',
                      'block w-full text-left px-4 py-2 text-sm',
                      getStatusColor(option)
                    )}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      )}
    </Menu>
  );
}; 