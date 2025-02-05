import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircleIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/outline';
import type { QuoteStatus } from '@/types/Quote';

const PROGRESS_STEPS: { status: QuoteStatus; label: string }[] = [
  { status: 'pending', label: 'Pending Review' },
  { status: 'approved', label: 'Approved' },
  { status: 'in_preparation', label: 'In Preparation' },
  { status: 'coating', label: 'Coating' },
  { status: 'curing', label: 'Curing' },
  { status: 'quality_check', label: 'Quality Check' },
  { status: 'completed', label: 'Completed' },
];

interface OrderProgressProps {
  currentStatus: QuoteStatus;
  onStatusChange?: (newStatus: QuoteStatus) => void;
  className?: string;
  interactive?: boolean;
}

export const OrderProgress: React.FC<OrderProgressProps> = ({
  currentStatus,
  onStatusChange,
  className,
  interactive = false,
}) => {
  const currentStepIndex = PROGRESS_STEPS.findIndex(step => step.status === currentStatus);

  const handleProgressChange = (direction: 'forward' | 'backward') => {
    if (!onStatusChange || currentStepIndex === -1) return;

    const newIndex = direction === 'forward' 
      ? Math.min(currentStepIndex + 1, PROGRESS_STEPS.length - 1)
      : Math.max(currentStepIndex - 1, 0);

    if (newIndex !== currentStepIndex) {
      onStatusChange(PROGRESS_STEPS[newIndex].status);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900">Order Progress</h4>
        {interactive && onStatusChange && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleProgressChange('backward')}
              disabled={currentStepIndex <= 0}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Move to previous step"
            >
              <MinusCircleIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleProgressChange('forward')}
              disabled={currentStepIndex >= PROGRESS_STEPS.length - 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Move to next step"
            >
              <PlusCircleIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-5 left-3 right-3 h-0.5 bg-gray-200">
          <div
            className="absolute h-full bg-indigo-600 transition-all duration-500"
            style={{
              width: `${(currentStepIndex / (PROGRESS_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {PROGRESS_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step.status}
                className={cn(
                  'flex flex-col items-center',
                  interactive && 'group cursor-pointer',
                )}
                onClick={() => interactive && onStatusChange?.(step.status)}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200',
                    isCompleted ? 'bg-indigo-600' : 'bg-gray-200',
                    interactive && !isCompleted && 'group-hover:bg-indigo-100',
                  )}
                >
                  <CheckCircleIcon 
                    className={cn(
                      'w-6 h-6',
                      isCompleted ? 'text-white' : 'text-gray-400',
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium whitespace-nowrap transition-colors duration-200',
                    isCurrent ? 'text-indigo-600' : 'text-gray-500',
                    interactive && 'group-hover:text-indigo-600',
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 