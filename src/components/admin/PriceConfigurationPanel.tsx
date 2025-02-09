import React, { useState } from 'react';
import { PriceCalculatorConfig } from '../../utils/PriceCalculator';

interface PriceConfigurationPanelProps {
  currentConfig: PriceCalculatorConfig;
  onConfigUpdate: (config: Partial<PriceCalculatorConfig>) => void;
}

export const PriceConfigurationPanel: React.FC<PriceConfigurationPanelProps> = ({
  currentConfig,
  onConfigUpdate,
}) => {
  const [localConfig, setLocalConfig] = useState(currentConfig);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof PriceCalculatorConfig
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      const newConfig = { ...localConfig, [field]: value };
      setLocalConfig(newConfig);
      onConfigUpdate({ [field]: value });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Price Configuration</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Base Price per Square CM
          </label>
          <input
            type="number"
            step="0.01"
            value={localConfig.pricePerSqCm}
            onChange={(e) => handleInputChange(e, 'pricePerSqCm')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Difficulty Percentage
          </label>
          <input
            type="number"
            step="1"
            value={localConfig.difficultyPercentage}
            onChange={(e) => handleInputChange(e, 'difficultyPercentage')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Material Multiplier
          </label>
          <input
            type="number"
            step="0.1"
            value={localConfig.materialMultiplier}
            onChange={(e) => handleInputChange(e, 'materialMultiplier')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Current Configuration:</p>
        <ul className="list-disc pl-5">
          <li>Base Price: ${localConfig.pricePerSqCm.toFixed(2)}/cm²</li>
          <li>Difficulty Adjustment: +{localConfig.difficultyPercentage}%</li>
          <li>Material Multiplier: {localConfig.materialMultiplier}x</li>
        </ul>
      </div>
    </div>
  );
}; 