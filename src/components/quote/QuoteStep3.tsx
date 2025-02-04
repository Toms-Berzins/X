import { useState } from 'react';
import type { QuoteData } from '../../pages/Quote';

interface QuoteStep3Props {
  quoteData: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const additionalServices = [
  {
    id: 'sandblasting',
    name: 'Sandblasting',
    description: 'Surface preparation for better coating adhesion',
    price: '+15% of base price',
  },
  {
    id: 'priming',
    name: 'Priming',
    description: 'Additional protection against corrosion',
    price: '+10% of base price',
  },
  {
    id: 'rushOrder',
    name: 'Rush Order',
    description: 'Expedited processing and handling',
    price: '+25% of base price',
  },
];

export const QuoteStep3: React.FC<QuoteStep3Props> = ({
  quoteData,
  onUpdate,
  onNext,
  onBack,
}) => {
  const handleServiceToggle = (serviceId: keyof typeof quoteData.additionalServices) => {
    onUpdate({
      additionalServices: {
        ...quoteData.additionalServices,
        [serviceId]: !quoteData.additionalServices[serviceId],
      },
    });
  };

  const [promoError, setPromoError] = useState('');

  const handlePromoCode = (code: string) => {
    setPromoError('');
    if (code && code !== 'WELCOME10') {
      setPromoError('Invalid promo code');
    }
    onUpdate({ promoCode: code });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Services</h2>
        <p className="text-gray-600 mb-6">
          Enhance your powder coating with these additional services.
        </p>
      </div>

      {/* Additional Services */}
      <div className="space-y-4">
        {additionalServices.map((service) => (
          <div
            key={service.id}
            className={`relative rounded-lg border p-4 cursor-pointer hover:border-indigo-500 ${
              quoteData.additionalServices[service.id as keyof typeof quoteData.additionalServices]
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300'
            }`}
            onClick={() => handleServiceToggle(service.id as keyof typeof quoteData.additionalServices)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                <p className="text-sm font-medium text-indigo-600 mt-1">{service.price}</p>
              </div>
              <div
                className={`h-5 w-5 rounded border flex items-center justify-center ${
                  quoteData.additionalServices[service.id as keyof typeof quoteData.additionalServices]
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-gray-300'
                }`}
              >
                {quoteData.additionalServices[service.id as keyof typeof quoteData.additionalServices] && (
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="mt-6">
        <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700">
          Promo Code
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="promo-code"
            value={quoteData.promoCode}
            onChange={(e) => handlePromoCode(e.target.value.toUpperCase())}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter promo code"
          />
          {promoError && (
            <p className="mt-2 text-sm text-red-600">{promoError}</p>
          )}
          {quoteData.promoCode === 'WELCOME10' && (
            <p className="mt-2 text-sm text-green-600">Promo code applied: 10% off</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-white text-gray-700 px-6 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}; 