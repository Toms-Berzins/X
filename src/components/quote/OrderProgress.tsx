import React from 'react';
import { cn } from '@/lib/utils';
import type { QuoteStatus } from '@/types/Quote';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface OrderProgressProps {
  currentStatus: QuoteStatus;
  onStatusChange?: (status: QuoteStatus) => void;
  interactive?: boolean;
  disabled?: boolean;
}

const steps: { status: QuoteStatus; label: string }[] = [
  { status: 'pending', label: 'Pending Review' },
  { status: 'approved', label: 'Approved' },
  { status: 'completed', label: 'Completed' },
];

export const OrderProgress: React.FC<OrderProgressProps> = ({
  currentStatus,
  onStatusChange,
  interactive = false,
  disabled = false,
}) => {
  const currentStep = steps.findIndex(step => step.status === currentStatus);

  const handleClick = (status: QuoteStatus) => {
    if (interactive && onStatusChange && !disabled) {
      onStatusChange(status);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">Order Progress</h4>
      <nav aria-label="Progress">
        <ol className="overflow-hidden">
          {steps.map((step, stepIdx) => {
            const isActive = currentStatus === step.status;
            const isComplete = currentStep > stepIdx;

            return (
              <li
                key={step.status}
                className={cn(
                  stepIdx !== steps.length - 1 ? 'pb-8' : '',
                  'relative'
                )}
              >
                {stepIdx !== steps.length - 1 && (
                  <div
                    className={cn(
                      'absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5',
                      isComplete ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-200 dark:bg-gray-700'
                    )}
                    aria-hidden="true"
                  />
                )}
                <button
                  className={cn(
                    'group relative flex items-center',
                    interactive && !disabled ? 'cursor-pointer' : 'cursor-default',
                    disabled && 'opacity-50'
                  )}
                  onClick={() => handleClick(step.status)}
                  disabled={!interactive || disabled}
                >
                  <span className="flex h-9 items-center">
                    <span
                      className={cn(
                        'relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200',
                        isComplete ? 'bg-blue-600 dark:bg-blue-500' : 'bg-white dark:bg-gray-800 border-2',
                        isActive 
                          ? 'border-blue-600 dark:border-blue-400' 
                          : 'border-gray-300 dark:border-gray-600',
                        interactive && !disabled && !isComplete && 'group-hover:border-blue-400 dark:group-hover:border-blue-300'
                      )}
                    >
                      {isComplete ? (
                        <CheckCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : (
                        <span
                          className={cn(
                            'h-2.5 w-2.5 rounded-full transition-colors duration-200',
                            isActive 
                              ? 'bg-blue-600 dark:bg-blue-400' 
                              : 'bg-transparent'
                          )}
                        />
                      )}
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span
                      className={cn(
                        'text-sm font-medium transition-colors duration-200',
                        isComplete 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : isActive 
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-500 dark:text-gray-400'
                      )}
                    >
                      {step.label}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}; 