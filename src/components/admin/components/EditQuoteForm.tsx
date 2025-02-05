import { Quote } from '../../../types/User';
import { EditFormType } from '../types/DashboardTypes';
import { PlusCircleIcon, MinusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface EditQuoteFormProps {
  quote: Quote;
  editForm: EditFormType | null;
  handleEditFormChange: (field: string, value: any) => void;
  handleEdit: (quoteId: string) => void;
  onCancel: () => void;
  handleProgressUpdate: (quoteId: string, newStatus: Quote['status']) => void;
}

export const EditQuoteForm: React.FC<EditQuoteFormProps> = ({
  quote,
  editForm,
  handleEditFormChange,
  handleEdit,
  onCancel,
  handleProgressUpdate,
}) => {
  if (!editForm) return null;

  const orderStatuses = [
    { key: 'pending', label: 'Quote Submitted', description: 'Your quote is being reviewed by our team' },
    { key: 'approved', label: 'Quote Approved', description: 'Your quote has been approved and is ready for processing' },
    { key: 'in_preparation', label: 'Surface Preparation', description: 'Items are being prepared for powder coating' },
    { key: 'coating', label: 'Powder Application', description: 'Applying powder coating with precision' },
    { key: 'curing', label: 'Curing Process', description: 'Heat treatment for a durable finish' },
    { key: 'quality_check', label: 'Quality Inspection', description: 'Final quality checks and verification' },
    { key: 'completed', label: 'Order Completed', description: 'Your items are ready for pickup/delivery' }
  ] as const;

  const currentStatusIndex = orderStatuses.findIndex(status => status.key === quote.status);

  const getNextStatus = (currentStatus: Quote['status']) => {
    const currentIndex = orderStatuses.findIndex(status => status.key === currentStatus);
    return orderStatuses[currentIndex + 1]?.key;
  };

  const getPreviousStatus = (currentStatus: Quote['status']) => {
    const currentIndex = orderStatuses.findIndex(status => status.key === currentStatus);
    return orderStatuses[currentIndex - 1]?.key;
  };

  return (
    <div className="space-y-8 bg-white p-8 rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-2xl font-bold text-gray-900">Edit Quote</h3>
        <p className="mt-2 text-sm text-gray-500">Update the quote details below. All fields marked with * are required.</p>
      </div>

      {/* Order Progress */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h4>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-[2.25rem] top-0 h-full w-px bg-gray-200" />
          
          <div className="space-y-8">
            {orderStatuses.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              
              return (
                <div key={status.key} className="relative flex items-start group">
                  <div className="flex items-center h-9">
                    <span className="relative z-10 flex items-center justify-center">
                      <span 
                        className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors
                          ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-200'}`}
                      >
                        {isCompleted ? (
                          <CheckCircleIcon className="h-6 w-6 text-white" />
                        ) : (
                          <span className={`h-2.5 w-2.5 rounded-full ${isCurrent ? 'bg-white' : 'bg-gray-400'}`} />
                        )}
                      </span>
                    </span>
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">{status.label}</div>
                    <div className="text-sm text-gray-500">{status.description}</div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    {/* Step Controls */}
                    <div className="flex items-center space-x-1">
                      {/* Back Step */}
                      {isCurrent && index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const prevStatus = getPreviousStatus(status.key);
                            if (prevStatus) handleProgressUpdate(quote.id, prevStatus);
                          }}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          title={`Go back to ${orderStatuses[index - 1].label}`}
                        >
                          <MinusCircleIcon className="h-6 w-6" />
                        </button>
                      )}
                      {/* Forward Step */}
                      {isCurrent && index < orderStatuses.length - 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const nextStatus = getNextStatus(status.key);
                            if (nextStatus) handleProgressUpdate(quote.id, nextStatus);
                          }}
                          className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                          title={`Advance to ${orderStatuses[index + 1].label}`}
                        >
                          <PlusCircleIcon className="h-6 w-6" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Order Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number *
                </label>
                <input
                  type="text"
                  value={editForm.orderNumber || ''}
                  onChange={(e) => handleEditFormChange('orderNumber', e.target.value)}
                  className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={editForm.contactInfo.name || ''}
                  onChange={(e) => handleEditFormChange('contactInfo.name', e.target.value)}
                  className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={editForm.contactInfo.email || ''}
                  onChange={(e) => handleEditFormChange('contactInfo.email', e.target.value)}
                  className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={editForm.contactInfo.phone || ''}
                  onChange={(e) => handleEditFormChange('contactInfo.phone', e.target.value)}
                  className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={editForm.contactInfo.notes || ''}
                  onChange={(e) => handleEditFormChange('contactInfo.notes', e.target.value)}
                  rows={3}
                  className="form-textarea block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Any special instructions or notes..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Coating Details */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Coating Details</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coating Type *
                </label>
                <input
                  type="text"
                  value={editForm.coating.type || ''}
                  onChange={(e) => handleEditFormChange('coating.type', e.target.value)}
                  className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color *
                </label>
                <input
                  type="text"
                  value={editForm.coating.color || ''}
                  onChange={(e) => handleEditFormChange('coating.color', e.target.value)}
                  className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Finish *
                </label>
                <input
                  type="text"
                  value={editForm.coating.finish || ''}
                  onChange={(e) => handleEditFormChange('coating.finish', e.target.value)}
                  className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Multiplier *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.coating.priceMultiplier || ''}
                  onChange={(e) => handleEditFormChange('coating.priceMultiplier', parseFloat(e.target.value))}
                  className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Services</h4>
            <div className="space-y-3">
              <label className="flex items-center p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.additionalServices.sandblasting || false}
                  onChange={(e) => handleEditFormChange('additionalServices.sandblasting', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                />
                <span className="ml-3 text-sm text-gray-700">Sandblasting</span>
              </label>
              <label className="flex items-center p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.additionalServices.priming || false}
                  onChange={(e) => handleEditFormChange('additionalServices.priming', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                />
                <span className="ml-3 text-sm text-gray-700">Priming</span>
              </label>
              <label className="flex items-center p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.additionalServices.rushOrder || false}
                  onChange={(e) => handleEditFormChange('additionalServices.rushOrder', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                />
                <span className="ml-3 text-sm text-gray-700">Rush Order</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Items Section - Full Width */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Items</h4>
          <button
            type="button"
            onClick={() => {
              const newItems = [...editForm.items, {
                type: '',
                size: '',
                quantity: 1,
                basePrice: 0
              }];
              handleEditFormChange('items', newItems);
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-transparent rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>
        <div className="space-y-4">
          {editForm.items.map((item: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 relative">
              <button
                type="button"
                onClick={() => {
                  const newItems = editForm.items.filter((_: any, i: number) => i !== index);
                  handleEditFormChange('items', newItems);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <MinusCircleIcon className="h-5 w-5" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <input
                    type="text"
                    value={item.type}
                    onChange={(e) => {
                      const newItems = [...editForm.items];
                      newItems[index] = { ...item, type: e.target.value };
                      handleEditFormChange('items', newItems);
                    }}
                    className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size *
                  </label>
                  <input
                    type="text"
                    value={item.size}
                    onChange={(e) => {
                      const newItems = [...editForm.items];
                      newItems[index] = { ...item, size: e.target.value };
                      handleEditFormChange('items', newItems);
                    }}
                    className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...editForm.items];
                      newItems[index] = { ...item, quantity: parseInt(e.target.value) };
                      handleEditFormChange('items', newItems);
                    }}
                    className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.basePrice}
                    onChange={(e) => {
                      const newItems = [...editForm.items];
                      newItems[index] = { ...item, basePrice: parseFloat(e.target.value) };
                      handleEditFormChange('items', newItems);
                    }}
                    className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtotal (€) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editForm.subtotal || 0}
              onChange={(e) => handleEditFormChange('subtotal', parseFloat(e.target.value))}
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={editForm.discount || 0}
              onChange={(e) => handleEditFormChange('discount', parseFloat(e.target.value))}
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total (€) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editForm.total || 0}
              onChange={(e) => handleEditFormChange('total', parseFloat(e.target.value))}
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleEdit(quote.id)}
          className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}; 