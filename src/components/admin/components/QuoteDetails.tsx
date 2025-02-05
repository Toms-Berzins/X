import { TruckIcon } from '@heroicons/react/24/outline';
import { Quote } from '../../../types/User';

interface QuoteDetailsProps {
  quote: Quote;
  handleProgressUpdate: (quoteId: string, newStatus: Quote['status']) => void;
  handleStatusUpdate: (quoteId: string, newStatus: 'approved' | 'rejected' | 'completed') => void;
  handleTrackingUpdate: (quoteId: string, trackingNumber: string) => void;
  trackingNumber: string;
  setTrackingNumber: (value: string) => void;
  operationLoading: boolean;
}

export const QuoteDetails: React.FC<QuoteDetailsProps> = ({
  quote,
  handleProgressUpdate,
  handleStatusUpdate,
  handleTrackingUpdate,
  trackingNumber,
  setTrackingNumber,
  operationLoading,
}) => {
  return (
    <div className="space-y-6">
      {/* Order Progress */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Order Progress</h3>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-[1.3rem] top-[1.4rem] h-[calc(100%-3rem)] w-0.5 bg-gray-200" />
          
          <div className="space-y-8">
            {/* Quote Submitted */}
            <div className="relative flex items-center justify-between group">
              <div className="flex items-center flex-1">
                <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white 
                  ${quote.status === 'pending' ? 'bg-blue-600' : 
                    ['approved', 'in_preparation', 'coating', 'curing', 'quality_check', 'completed'].includes(quote.status) ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${quote.status === 'pending' ? 'bg-white' : 
                    ['approved', 'in_preparation', 'coating', 'curing', 'quality_check', 'completed'].includes(quote.status) ? 'bg-white' : 'bg-gray-400'}`} />
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">Quote Submitted</div>
                  <div className="text-sm text-gray-500">Your quote is being reviewed by our team.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={['pending', 'approved', 'in_preparation', 'coating', 'curing', 'quality_check', 'completed'].includes(quote.status)}
                onChange={() => handleProgressUpdate(quote.id, 'pending')}
                className="ml-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Quote Approved */}
            <div className="relative flex items-center justify-between group">
              <div className="flex items-center flex-1">
                <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white 
                  ${quote.status === 'approved' ? 'bg-blue-600' : 
                    ['in_preparation', 'coating', 'curing', 'quality_check', 'completed'].includes(quote.status) ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${quote.status === 'approved' ? 'bg-white' : 
                    ['in_preparation', 'coating', 'curing', 'quality_check', 'completed'].includes(quote.status) ? 'bg-white' : 'bg-gray-400'}`} />
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">Quote Approved</div>
                  <div className="text-sm text-gray-500">Your quote has been approved and is ready for processing.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={['approved', 'in_preparation', 'coating', 'curing', 'quality_check', 'completed'].includes(quote.status)}
                onChange={() => handleProgressUpdate(quote.id, 'approved')}
                className="ml-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Surface Preparation */}
            <div className="relative flex items-center justify-between group">
              <div className="flex items-center flex-1">
                <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white 
                  ${quote.status === 'in_preparation' ? 'bg-blue-600' : 
                    ['coating', 'curing', 'quality_check', 'completed'].includes(quote.status) ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${quote.status === 'in_preparation' ? 'bg-white' : 
                    ['coating', 'curing', 'quality_check', 'completed'].includes(quote.status) ? 'bg-white' : 'bg-gray-400'}`} />
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">Surface Preparation</div>
                  <div className="text-sm text-gray-500">Items are being prepared for powder coating.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={['in_preparation', 'coating', 'curing', 'quality_check', 'completed'].includes(quote.status)}
                onChange={() => handleProgressUpdate(quote.id, 'in_preparation')}
                className="ml-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Powder Application */}
            <div className="relative flex items-center justify-between group">
              <div className="flex items-center flex-1">
                <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white 
                  ${quote.status === 'coating' ? 'bg-blue-600' : 
                    ['curing', 'quality_check', 'completed'].includes(quote.status) ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${quote.status === 'coating' ? 'bg-white' : 
                    ['curing', 'quality_check', 'completed'].includes(quote.status) ? 'bg-white' : 'bg-gray-400'}`} />
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">Powder Application</div>
                  <div className="text-sm text-gray-500">Applying powder coating with precision.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={['coating', 'curing', 'quality_check', 'completed'].includes(quote.status)}
                onChange={() => handleProgressUpdate(quote.id, 'coating')}
                className="ml-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Curing Process */}
            <div className="relative flex items-center justify-between group">
              <div className="flex items-center flex-1">
                <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white 
                  ${quote.status === 'curing' ? 'bg-blue-600' : 
                    ['quality_check', 'completed'].includes(quote.status) ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${quote.status === 'curing' ? 'bg-white' : 
                    ['quality_check', 'completed'].includes(quote.status) ? 'bg-white' : 'bg-gray-400'}`} />
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">Curing Process</div>
                  <div className="text-sm text-gray-500">Heat treatment for a durable finish.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={['curing', 'quality_check', 'completed'].includes(quote.status)}
                onChange={() => handleProgressUpdate(quote.id, 'curing')}
                className="ml-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Quality Inspection */}
            <div className="relative flex items-center justify-between group">
              <div className="flex items-center flex-1">
                <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white 
                  ${quote.status === 'quality_check' ? 'bg-blue-600' : 
                    ['completed'].includes(quote.status) ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${quote.status === 'quality_check' ? 'bg-white' : 
                    ['completed'].includes(quote.status) ? 'bg-white' : 'bg-gray-400'}`} />
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">Quality Inspection</div>
                  <div className="text-sm text-gray-500">Final quality checks and verification.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={['quality_check', 'completed'].includes(quote.status)}
                onChange={() => handleProgressUpdate(quote.id, 'quality_check')}
                className="ml-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Order Completed */}
            <div className="relative flex items-center justify-between group">
              <div className="flex items-center flex-1">
                <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white 
                  ${quote.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${quote.status === 'completed' ? 'bg-white' : 'bg-gray-400'}`} />
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">Order Completed</div>
                  <div className="text-sm text-gray-500">Your items are ready for pickup/delivery.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={quote.status === 'completed'}
                onChange={() => handleProgressUpdate(quote.id, 'completed')}
                className="ml-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Items */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Items</h4>
            {quote.items.map((item, index) => (
              <div key={index} className="mb-3">
                <div className="text-sm text-gray-900">{item.type} ({item.size})</div>
                <div className="text-sm text-gray-600">€{item.basePrice.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
              </div>
            ))}
          </div>

          {/* Coating Details */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Coating Details</h4>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="text-gray-600">Type: </span>
                <span className="text-gray-900">{quote.coating.type}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Color: </span>
                <span className="text-gray-900">{quote.coating.color}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Finish: </span>
                <span className="text-gray-900">{quote.coating.finish}</span>
              </div>
            </div>

            <h4 className="font-medium text-gray-700 mt-4 mb-2">Additional Services</h4>
            <div className="space-y-1">
              {quote.additionalServices.sandblasting && (
                <div className="text-sm text-gray-900">✓ Sandblasting</div>
              )}
              {quote.additionalServices.priming && (
                <div className="text-sm text-gray-900">✓ Priming</div>
              )}
              {quote.additionalServices.rushOrder && (
                <div className="text-sm text-gray-900">✓ Rush Order</div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-900">€{quote.subtotal.toFixed(2)}</span>
          </div>
          {quote.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount:</span>
              <span className="text-red-600">-{quote.discount}%</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-medium mt-2">
            <span className="text-gray-900">Total:</span>
            <span className="text-gray-900">€{quote.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => handleStatusUpdate(quote.id, 'approved')}
          disabled={operationLoading || quote.status === 'approved'}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Approve
        </button>
        <button
          onClick={() => handleStatusUpdate(quote.id, 'rejected')}
          disabled={operationLoading || quote.status === 'rejected'}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Reject
        </button>
        <button
          onClick={() => handleStatusUpdate(quote.id, 'completed')}
          disabled={operationLoading || quote.status === 'completed'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Complete
        </button>
      </div>

      {/* Tracking Number Section */}
      {quote.status === 'approved' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-medium mb-2">Order Tracking</h4>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <button
              onClick={() => handleTrackingUpdate(quote.id, trackingNumber)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              <TruckIcon className="h-5 w-5 mr-2" />
              Update Tracking
            </button>
          </div>
          {quote.trackingNumber && (
            <div className="mt-2 text-sm text-gray-600">
              Current tracking number: {quote.trackingNumber}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 