import type { QuoteData } from '../../pages/Quote';

interface QuoteStep2Props {
  quoteData: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const coatingTypes = [
  { id: 'standard', name: 'Standard Powder Coating', multiplier: 1 },
  { id: 'premium', name: 'Premium Powder Coating', multiplier: 1.3 },
  { id: 'high-durability', name: 'High Durability Coating', multiplier: 1.5 },
  { id: 'custom', name: 'Custom Coating', multiplier: 1.8 },
];

const colors = [
  'Gloss Black',
  'Matte Black',
  'Gloss White',
  'Matte White',
  'Silver',
  'Bronze',
  'Custom Color',
];

const finishes = [
  'Smooth',
  'Textured',
  'Metallic',
  'Candy',
  'Chrome-like',
];

export const QuoteStep2: React.FC<QuoteStep2Props> = ({
  quoteData,
  onUpdate,
  onNext,
  onBack,
}) => {
  const handleCoatingTypeChange = (typeId: string) => {
    const selectedType = coatingTypes.find(t => t.id === typeId);
    onUpdate({
      coating: {
        ...quoteData.coating,
        type: typeId,
        priceMultiplier: selectedType?.multiplier || 1,
      },
    });
  };

  const canProceed = quoteData.coating.type && quoteData.coating.color && quoteData.coating.finish;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Coating Options</h2>
        <p className="text-gray-600 mb-6">
          Select the type of coating, color, and finish you'd like for your items.
        </p>
      </div>

      {/* Coating Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Coating Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          {coatingTypes.map((type) => (
            <div
              key={type.id}
              className={`relative rounded-lg border p-4 cursor-pointer hover:border-indigo-500 ${
                quoteData.coating.type === type.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300'
              }`}
              onClick={() => handleCoatingTypeChange(type.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {type.multiplier === 1
                      ? 'Base price'
                      : `+${((type.multiplier - 1) * 100).toFixed(0)}% cost`}
                  </p>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    quoteData.coating.type === type.id
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                  }`}
                >
                  {quoteData.coating.type === type.id && (
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Color
        </label>
        <select
          value={quoteData.coating.color}
          onChange={(e) =>
            onUpdate({
              coating: { ...quoteData.coating, color: e.target.value },
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select color</option>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      {/* Finish Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Finish
        </label>
        <div className="grid grid-cols-3 gap-3">
          {finishes.map((finish) => (
            <button
              key={finish}
              type="button"
              onClick={() =>
                onUpdate({
                  coating: { ...quoteData.coating, finish },
                })
              }
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                quoteData.coating.finish === finish
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {finish}
            </button>
          ))}
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
          disabled={!canProceed}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}; 