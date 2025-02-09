import { QuoteDimensions } from '@/types/Quote';

export const usePriceCalculator = () => {
  const calculatePrice = (dimensions: QuoteDimensions) => {
    if (!dimensions.height || !dimensions.width || !dimensions.depth) {
      return 0;
    }

    // Calculate surface area in square inches
    const surfaceArea = 2 * (
      dimensions.height * dimensions.width +
      dimensions.height * dimensions.depth +
      dimensions.width * dimensions.depth
    );

    // Base rate per square inch
    const baseRate = 0.15;

    // Calculate base price
    let price = surfaceArea * baseRate;

    // Add complexity factor based on size
    if (Math.max(dimensions.height, dimensions.width, dimensions.depth) > 36) {
      price *= 1.5; // 50% increase for large items
    } else if (Math.max(dimensions.height, dimensions.width, dimensions.depth) > 24) {
      price *= 1.3; // 30% increase for medium-large items
    }

    // Round to 2 decimal places
    return Math.round(price * 100) / 100;
  };

  return {
    calculatePrice
  };
}; 