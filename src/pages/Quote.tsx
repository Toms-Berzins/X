import { useState } from 'react';
import { QuoteStep1 } from '../components/quote/QuoteStep1';
import { QuoteStep2 } from '../components/quote/QuoteStep2';
import { QuoteStep3 } from '../components/quote/QuoteStep3';
import { QuoteStep4 } from '../components/quote/QuoteStep4';
import { QuoteSummary } from '../components/quote/QuoteSummary';

// Helper functions for formatting
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDimension = (size: string) => {
  const sizeMap: { [key: string]: string } = {
    'Up to 6"': 'Up to 15cm',
    '6" - 12"': '15cm - 30cm',
    '12" - 24"': '30cm - 60cm',
    '24" - 36"': '60cm - 90cm',
    '36"+'     : '90cm+'
  };
  return sizeMap[size] || size;
};

export interface QuoteData {
  items: {
    type: string;
    size: string;
    quantity: number;
    basePrice: number;
  }[];
  coating: {
    type: string;
    color: string;
    finish: string;
    priceMultiplier: number;
  };
  additionalServices: {
    sandblasting: boolean;
    priming: boolean;
    rushOrder: boolean;
  };
  promoCode: string;
  subtotal: number;
  discount: number;
  total: number;
}

const initialQuoteData: QuoteData = {
  items: [],
  coating: {
    type: '',
    color: '',
    finish: '',
    priceMultiplier: 1,
  },
  additionalServices: {
    sandblasting: false,
    priming: false,
    rushOrder: false,
  },
  promoCode: '',
  subtotal: 0,
  discount: 0,
  total: 0,
};

export const itemTypes = [
  { id: 'small-parts', name: 'Small Parts', basePrice: 25.00 },
  { id: 'medium-parts', name: 'Medium Parts', basePrice: 50.00 },
  { id: 'large-parts', name: 'Large Parts', basePrice: 100.00 },
  { id: 'custom', name: 'Custom Size', basePrice: 150.00 },
];

export const sizes = [
  'Up to 15cm',
  '15cm - 30cm',
  '30cm - 60cm',
  '60cm - 90cm',
  '90cm+'
];

const steps = ['Item Details', 'Coating Options', 'Additional Services', 'Review & Submit'];

export const Quote = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<QuoteData>(initialQuoteData);

  const calculatePricing = (data: QuoteData) => {
    let subtotal = data.items.reduce((acc, item) => {
      return acc + item.basePrice * item.quantity;
    }, 0);

    // Apply coating multiplier
    subtotal *= data.coating.priceMultiplier;

    // Add additional services
    if (data.additionalServices.sandblasting) subtotal += subtotal * 0.15;
    if (data.additionalServices.priming) subtotal += subtotal * 0.10;
    if (data.additionalServices.rushOrder) subtotal += subtotal * 0.25;

    // Apply bulk discount
    let discount = 0;
    const totalItems = data.items.reduce((acc, item) => acc + item.quantity, 0);
    if (totalItems >= 50) discount = 0.15;
    else if (totalItems >= 25) discount = 0.10;
    else if (totalItems >= 10) discount = 0.05;

    // Apply promo code if valid
    if (data.promoCode === 'WELCOME10') discount += 0.10;

    const total = subtotal * (1 - discount);

    return {
      ...data,
      subtotal,
      discount: discount * 100,
      total,
    };
  };

  const updateQuoteData = (updates: Partial<QuoteData>) => {
    const newData = {
      ...quoteData,
      ...updates,
    };
    const calculatedData = calculatePricing(newData);
    setQuoteData(calculatedData);
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index + 1 <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="mt-2 text-sm font-medium text-gray-600">{step}</div>
              </div>
            ))}
            {/* Progress bar */}
            <div className="absolute top-4 left-0 right-0 h-0.5 -z-10">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
              <div className="h-full bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Quote Form */}
            <div className="col-span-2">
              {currentStep === 1 && (
                <QuoteStep1
                  quoteData={quoteData}
                  onUpdate={updateQuoteData}
                  onNext={handleNext}
                />
              )}
              {currentStep === 2 && (
                <QuoteStep2
                  quoteData={quoteData}
                  onUpdate={updateQuoteData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {currentStep === 3 && (
                <QuoteStep3
                  quoteData={quoteData}
                  onUpdate={updateQuoteData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {currentStep === 4 && (
                <QuoteStep4
                  quoteData={quoteData}
                  onUpdate={updateQuoteData}
                  onBack={handleBack}
                />
              )}
            </div>

            {/* Live Summary */}
            <div className="col-span-1">
              <QuoteSummary quoteData={quoteData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 