import React, { useState, memo, ComponentType, SVGProps } from 'react';
import { cn } from '@/lib/utils.js';
import type { QuoteData, QuoteStatus } from '@/types/Quote.js';
import { formatCurrency } from '@/pages/Quote.js';
import { StatusDropdown } from './StatusDropdown.js';
import { 
  ChevronDownIcon,
  ChevronUpIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  PhotoIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid';
import { Dialog } from '@headlessui/react';
import { ImageModal } from './ImageModal';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderProgress } from './OrderProgress';

interface ActionButtonProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
  className?: string;
}

export interface QuoteCardProps {
  quote: QuoteData;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
  onStatusChange?: (status: QuoteStatus) => void;
  interactive?: boolean;
  onEdit?: (quote: QuoteData) => void;
}

export const QuoteCard = memo<QuoteCardProps>(({
  quote,
  variant = 'default',
  className,
  onStatusChange,
  interactive = false,
  onEdit,
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const totalItems = quote.items.reduce((acc: number, item: QuoteData['items'][0]) => acc + item.quantity, 0);
  
  const baseClasses = 'rounded-lg shadow-sm transition-all duration-200';
  const variantClasses = {
    default: 'bg-white p-4 border border-gray-200 hover:border-indigo-200',
    compact: 'bg-white p-3 border border-gray-200 hover:border-indigo-200',
    detailed: 'bg-white p-6 border border-gray-200 hover:border-indigo-200',
  };

  const handleStatusChange = (status: QuoteStatus) => {
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  const handleEdit = () => {
    setIsExpanded(!isExpanded);
    if (onEdit) {
      onEdit(quote);
    }
  };

  const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, onClick, className = '' }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
        className
      )}
      title={label}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <motion.div 
      layout
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {/* Header with Status and Actions */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">#{quote.id}</h3>
          <p className="text-sm text-gray-500">{new Date(quote.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          {interactive ? (
            <StatusDropdown
              status={quote.status}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <span className={cn(
              'px-3 py-1 text-sm font-medium rounded-full',
              {
                'bg-yellow-100 text-yellow-800': quote.status === 'pending',
                'bg-green-100 text-green-800': quote.status === 'approved',
                'bg-red-100 text-red-800': quote.status === 'rejected',
                'bg-blue-100 text-blue-800': quote.status === 'completed',
              }
            )}>
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quote.contactInfo && (
          <ActionButton
            icon={UserCircleIcon}
            label="Contact Info"
            onClick={() => setIsContactModalOpen(true)}
            className="text-blue-700 bg-blue-50 hover:bg-blue-100"
          />
        )}
        {quote.images && quote.images.length > 0 && (
          <ActionButton
            icon={PhotoIcon}
            label="View Images"
            onClick={() => setIsImageModalOpen(true)}
            className="text-purple-700 bg-purple-50 hover:bg-purple-100"
          />
        )}
        <ActionButton
          icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
          label={isExpanded ? "Show Less" : "Show More"}
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-700 bg-gray-50 hover:bg-gray-100"
        />
        {onEdit && (
          <ActionButton
            icon={PencilSquareIcon}
            label="Edit Quote"
            onClick={handleEdit}
            className="text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
          />
        )}
      </div>

      {/* Basic Info */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Items ({totalItems})</h4>
        <ul className="space-y-1">
          {quote.items.map((item: QuoteData['items'][0], index: number) => (
            <li key={index} className="text-sm text-gray-600 flex justify-between">
              <span>{item.quantity}x {item.type}</span>
              <span className="font-medium text-gray-900">{formatCurrency(item.basePrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Order Progress */}
            <div className="mt-4 mb-6">
              <OrderProgress
                currentStatus={quote.status}
                onStatusChange={interactive ? handleStatusChange : undefined}
                interactive={interactive}
              />
            </div>

            {/* Coating Details */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Coating</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-2 text-gray-900">{quote.coating.type}</span>
                </div>
                <div>
                  <span className="text-gray-500">Color:</span>
                  <span className="ml-2 text-gray-900">{quote.coating.color}</span>
                </div>
                <div>
                  <span className="text-gray-500">Finish:</span>
                  <span className="ml-2 text-gray-900">{quote.coating.finish}</span>
                </div>
              </div>
            </div>

            {/* Additional Services */}
            {quote.additionalServices && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Services</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(quote.additionalServices).map(([service, enabled]) => (
                    enabled && (
                      <div key={service} className="text-gray-600">
                        {service.charAt(0).toUpperCase() + service.slice(1)}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {quote.contactInfo?.notes && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{quote.contactInfo.notes}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">Total</span>
          <span className="text-lg font-semibold text-gray-900">{formatCurrency(quote.total)}</span>
        </div>
      </div>

      {/* Contact Info Modal */}
      <Dialog
        open={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <UserCircleIcon className="w-5 h-5 text-gray-600" />
              Contact Information
            </Dialog.Title>
            {quote.contactInfo && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-sm text-gray-500 block mb-1">Name</label>
                  <p className="text-gray-900 font-medium">{quote.contactInfo.name}</p>
                </div>
                {quote.contactInfo.email && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="text-sm text-gray-500 block mb-1">Email</label>
                    <a 
                      href={`mailto:${quote.contactInfo.email}`}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                    >
                      <EnvelopeIcon className="w-4 h-4" />
                      {quote.contactInfo.email}
                    </a>
                  </div>
                )}
                {quote.contactInfo.phone && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="text-sm text-gray-500 block mb-1">Phone</label>
                    <a 
                      href={`tel:${quote.contactInfo.phone}`}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                    >
                      <PhoneIcon className="w-4 h-4" />
                      {quote.contactInfo.phone}
                    </a>
                  </div>
                )}
                {quote.contactInfo.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="text-sm text-gray-500 block mb-1">Notes</label>
                    <p className="text-gray-900 whitespace-pre-wrap text-sm">{quote.contactInfo.notes}</p>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6">
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Images Modal */}
      {quote.images && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          images={quote.images}
        />
      )}
    </motion.div>
  );
});

QuoteCard.displayName = 'QuoteCard'; 