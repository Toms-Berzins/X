import React, { useState } from 'react';
import { usePriceCalculator } from '../../hooks/usePriceCalculator';

interface Dimensions {
  height: number;
  width: number;
  depth: number;
}

export const PriceCalculator: React.FC = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
    depth: 0,
  });

  const { calculatePrice } = usePriceCalculator();
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Dimensions
  ) => {
    const value = parseFloat(e.target.value);
    setDimensions((prev) => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value,
    }));
  };

  const handleCalculate = () => {
    const price = calculatePrice(dimensions);
    setCalculatedPrice(price);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Calculate Price</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Height (cm)
          </label>
          <input
            type="number"
            value={dimensions.height || ''}
            onChange={(e) => handleInputChange(e, 'height')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter height"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Width (cm)
          </label>
          <input
            type="number"
            value={dimensions.width || ''}
            onChange={(e) => handleInputChange(e, 'width')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter width"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Depth (cm)
          </label>
          <input
            type="number"
            value={dimensions.depth || ''}
            onChange={(e) => handleInputChange(e, 'depth')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter depth"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calculate Price
      </button>

      {calculatedPrice !== null && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900">Price Breakdown</h3>
          <div className="mt-2 text-sm text-gray-600">
            <p>Total Surface Area: {dimensions.height * dimensions.width * dimensions.depth} cm²</p>
            <p className="text-xl font-bold text-gray-900 mt-2">
              Final Price: ${calculatedPrice.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 