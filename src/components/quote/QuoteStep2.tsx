import type { QuoteData, QuoteCoating } from '../../types/Quote';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { 
  validateCoating, 
  labelClasses, 
  errorMessageClasses,
  getSelectClasses,
  optionClasses,
  TouchedFields,
  ValidationError 
} from '@/utils/formValidation';

interface QuoteStep2Props {
  quoteData: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
}

const coatingTypes = [
  { id: 'powder', name: 'Powder Coating', difficulty: 10 },
  { id: 'liquid', name: 'Liquid Coating', difficulty: 15 },
  { id: 'ceramic', name: 'Ceramic Coating', difficulty: 25 },
];

const colors = [
  { id: 'black', name: 'Black' },
  { id: 'white', name: 'White' },
  { id: 'gray', name: 'Gray' },
  { id: 'custom', name: 'Custom Color' },
];

const finishTypes = [
  { id: 'matte', name: 'Matte', difficulty: 5 },
  { id: 'satin', name: 'Satin', difficulty: 10 },
  { id: 'gloss', name: 'Gloss', difficulty: 15 },
  { id: 'textured', name: 'Textured', difficulty: 20 },
];

export const QuoteStep2: React.FC<QuoteStep2Props> = ({ quoteData, onUpdate }) => {
  const [errors, setErrors] = useState<ValidationError>({});
  const [touched, setTouched] = useState<TouchedFields>({
    type: false,
    color: false,
    finish: false,
  });

  const handleFieldBlur = (field: keyof QuoteCoating) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({
      ...prev,
      [field]: validateCoating(field, quoteData.coating[field]),
    }));
  };

  const calculateTotalWithDifficulty = (coating: QuoteCoating) => {
    const baseTotal = quoteData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const selectedType = coatingTypes.find(t => t.id === coating.type);
    const selectedFinish = finishTypes.find(f => f.id === coating.finish);
    
    let total = baseTotal;
    if (selectedType) {
      total += (baseTotal * selectedType.difficulty / 100);
    }
    if (selectedFinish) {
      total += (baseTotal * selectedFinish.difficulty / 100);
    }
    
    return total;
  };

  const handleCoatingChange = (field: keyof QuoteCoating, value: string) => {
    const updatedCoating = {
      ...quoteData.coating,
      [field]: value,
    };

    // Clear error when field changes
    setErrors(prev => ({ ...prev, [field]: '' }));
    
    onUpdate({
      coating: updatedCoating,
      total: calculateTotalWithDifficulty(updatedCoating),
    });
  };

  return (
    <div className="space-y-6">
      {/* Coating Type */}
      <div>
        <label className={labelClasses}>
          Coating Type <span className="text-red-500">*</span>
        </label>
        <select
          value={quoteData.coating.type}
          onChange={(e) => handleCoatingChange('type', e.target.value)}
          onBlur={() => handleFieldBlur('type')}
          className={getSelectClasses(!!errors.type, touched.type)}
        >
          <option value="" className={optionClasses}>Select Coating Type</option>
          {coatingTypes.map(type => (
            <option key={type.id} value={type.id} className={optionClasses}>
              {type.name} (+{type.difficulty}% complexity)
            </option>
          ))}
        </select>
        {errors.type && touched.type && (
          <p className={errorMessageClasses}>
            <AlertCircle className="h-4 w-4" />
            {errors.type}
          </p>
        )}
      </div>

      {/* Color Selection */}
      <div>
        <label className={labelClasses}>
          Color <span className="text-red-500">*</span>
        </label>
        <select
          value={quoteData.coating.color}
          onChange={(e) => handleCoatingChange('color', e.target.value)}
          onBlur={() => handleFieldBlur('color')}
          className={getSelectClasses(!!errors.color, touched.color)}
        >
          <option value="" className={optionClasses}>Select Color</option>
          {colors.map(color => (
            <option key={color.id} value={color.id} className={optionClasses}>
              {color.name}
            </option>
          ))}
        </select>
        {errors.color && touched.color && (
          <p className={errorMessageClasses}>
            <AlertCircle className="h-4 w-4" />
            {errors.color}
          </p>
        )}
      </div>

      {/* Finish Type */}
      <div>
        <label className={labelClasses}>
          Finish <span className="text-red-500">*</span>
        </label>
        <select
          value={quoteData.coating.finish}
          onChange={(e) => handleCoatingChange('finish', e.target.value)}
          onBlur={() => handleFieldBlur('finish')}
          className={getSelectClasses(!!errors.finish, touched.finish)}
        >
          <option value="" className={optionClasses}>Select Finish</option>
          {finishTypes.map(finish => (
            <option key={finish.id} value={finish.id} className={optionClasses}>
              {finish.name} (+{finish.difficulty}% complexity)
            </option>
          ))}
        </select>
        {errors.finish && touched.finish && (
          <p className={errorMessageClasses}>
            <AlertCircle className="h-4 w-4" />
            {errors.finish}
          </p>
        )}
      </div>
    </div>
  );
}; 