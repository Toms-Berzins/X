import { useState } from 'react';
import type { QuoteData, QuoteAdditionalServices } from '../../types/Quote';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  validatePromoCode, 
  getInputClasses, 
  labelClasses, 
  errorMessageClasses,
  inputGroupClasses,
  TouchedFields,
  ValidationError 
} from '@/utils/formValidation';

interface QuoteStep3Props {
  quoteData: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
}

const additionalServices = [
  {
    id: 'sandblasting',
    name: 'Sandblasting',
    description: 'Surface preparation to remove rust, paint, and other contaminants',
    price: 50,
  },
  {
    id: 'priming',
    name: 'Priming',
    description: 'Base coat application for better adhesion and corrosion resistance',
    price: 35,
  },
];

export const QuoteStep3: React.FC<QuoteStep3Props> = ({
  quoteData,
  onUpdate,
}) => {
  const [errors, setErrors] = useState<ValidationError>({});
  const [touched, setTouched] = useState<TouchedFields>({
    promoCode: false,
  });

  const handleServiceToggle = (serviceId: keyof QuoteAdditionalServices) => {
    const currentServices = quoteData.additionalServices || {};
    const newServices = {
      ...currentServices,
      [serviceId]: !currentServices[serviceId],
    };

    onUpdate({
      additionalServices: newServices,
      total: calculateTotal(quoteData, newServices),
    });
  };

  const calculateTotal = (quote: QuoteData, services: QuoteAdditionalServices) => {
    const itemsTotal = quote.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const servicesTotal = Object.entries(services).reduce((sum, [service, isSelected]) => {
      if (isSelected) {
        const serviceConfig = additionalServices.find(s => s.id === service);
        return sum + (serviceConfig?.price || 0);
      }
      return sum;
    }, 0);

    return itemsTotal + servicesTotal;
  };

  const handlePromoCode = (code: string) => {
    const upperCode = code.toUpperCase();
    const error = validatePromoCode(upperCode);
    setErrors(prev => ({ ...prev, promoCode: error }));
    onUpdate({ promoCode: upperCode });
  };

  const handlePromoBlur = () => {
    setTouched(prev => ({ ...prev, promoCode: true }));
    setErrors(prev => ({ 
      ...prev, 
      promoCode: validatePromoCode(quoteData.promoCode || '') 
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Additional Services</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enhance your powder coating with these additional services.
        </p>
      </div>

      {/* Additional Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {additionalServices.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              p-6 rounded-lg border-2 cursor-pointer transition-colors
              ${quoteData.additionalServices?.[service.id as keyof QuoteAdditionalServices]
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700'
              }
            `}
            onClick={() => handleServiceToggle(service.id as keyof QuoteAdditionalServices)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{service.name}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{service.description}</p>
              </div>
              <div className="ml-4">
                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  ${service.price}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Services Summary */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mt-8">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Selected Services</h4>
        <div className="space-y-3">
          {additionalServices.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-600 dark:text-gray-400">{service.name}</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {quoteData.additionalServices?.[service.id as keyof QuoteAdditionalServices]
                  ? `+$${service.price}`
                  : 'Not selected'
                }
              </span>
            </div>
          ))}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">Total Additional Services</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                ${Object.entries(quoteData.additionalServices || {}).reduce((sum, [service, isSelected]) => {
                  if (isSelected) {
                    const serviceConfig = additionalServices.find(s => s.id === service);
                    return sum + (serviceConfig?.price || 0);
                  }
                  return sum;
                }, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className={inputGroupClasses}>
        <label htmlFor="promo-code" className={labelClasses}>
          Promo Code
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="promo-code"
            value={quoteData.promoCode || ''}
            onChange={(e) => handlePromoCode(e.target.value)}
            onBlur={handlePromoBlur}
            className={getInputClasses(!!errors.promoCode, touched.promoCode, true)}
            placeholder="Enter promo code"
          />
          {errors.promoCode && touched.promoCode && (
            <p className={errorMessageClasses}>
              <AlertCircle className="h-4 w-4" />
              {errors.promoCode}
            </p>
          )}
          {quoteData.promoCode === 'WELCOME10' && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <span className="inline-block w-4 h-4">✓</span>
              Promo code applied: 10% off
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 