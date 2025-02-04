import { useState } from 'react';
import type { QuoteData } from '../../pages/Quote';

interface QuoteStep1Props {
  quoteData: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
}

const itemTypes = [
  { id: 'small-parts', name: 'Small Parts', basePrice: 25 },
  { id: 'medium-parts', name: 'Medium Parts', basePrice: 50 },
  { id: 'large-parts', name: 'Large Parts', basePrice: 100 },
  { id: 'custom', name: 'Custom Size', basePrice: 150 },
];

const sizes = [
  'Up to 6"',
  '6" - 12"',
  '12" - 24"',
  '24" - 36"',
  '36"+'
];

export const QuoteStep1: React.FC<QuoteStep1Props> = ({ quoteData, onUpdate, onNext }) => {
  const [newItem, setNewItem] = useState({
    type: '',
    size: '',
    quantity: 1,
    basePrice: 0,
  });

  const handleAddItem = () => {
    if (!newItem.type || !newItem.size || newItem.quantity < 1) return;

    onUpdate({
      items: [...quoteData.items, newItem],
    });

    setNewItem({
      type: '',
      size: '',
      quantity: 1,
      basePrice: 0,
    });
  };

  const handleRemoveItem = (index: number) => {
    onUpdate({
      items: quoteData.items.filter((_, i) => i !== index),
    });
  };

  const handleTypeChange = (type: string) => {
    const selectedType = itemTypes.find(t => t.id === type);
    setNewItem({
      ...newItem,
      type,
      basePrice: selectedType?.basePrice || 0,
    });
  };

  const canProceed = quoteData.items.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What items need coating?</h2>
        <p className="text-gray-600 mb-6">
          Add the items you need powder coated. You can add multiple items of different sizes.
        </p>
      </div>

      {/* Add new item form */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Type
          </label>
          <select
            value={newItem.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select type</option>
            {itemTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size
          </label>
          <select
            value={newItem.size}
            onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select size</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleAddItem}
            disabled={!newItem.type || !newItem.size}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Items list */}
      {quoteData.items.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Added Items</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quoteData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {itemTypes.find(t => t.id === item.type)?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.basePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-end">
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