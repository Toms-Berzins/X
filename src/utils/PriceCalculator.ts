export interface PriceCalculatorConfig {
  pricePerSqCm: number;
  difficultyPercentage: number;
  materialMultiplier?: number;
}

export class PriceCalculator {
  private pricePerSqCm: number;
  private difficultyPercentage: number;
  private materialMultiplier: number;

  constructor(config: PriceCalculatorConfig) {
    this.pricePerSqCm = config.pricePerSqCm;
    this.difficultyPercentage = config.difficultyPercentage;
    this.materialMultiplier = config.materialMultiplier || 1;
  }

  setPricePerSqCm(newPrice: number): void {
    this.pricePerSqCm = newPrice;
  }

  setDifficultyPercentage(newPercentage: number): void {
    this.difficultyPercentage = newPercentage;
  }

  setMaterialMultiplier(multiplier: number): void {
    this.materialMultiplier = multiplier;
  }

  calculateTotalArea(height: number, width: number, depth: number): number {
    return 2 * (height * width + width * depth + height * depth);
  }

  calculatePrice(height: number, width: number, depth: number): number {
    const totalArea = this.calculateTotalArea(height, width, depth);
    const baseCost = totalArea * this.pricePerSqCm;
    const difficultyAdjustedCost = baseCost * (1 + this.difficultyPercentage / 100);
    const finalCost = difficultyAdjustedCost * this.materialMultiplier;
    
    return Number(finalCost.toFixed(2));
  }

  getConfig(): PriceCalculatorConfig {
    return {
      pricePerSqCm: this.pricePerSqCm,
      difficultyPercentage: this.difficultyPercentage,
      materialMultiplier: this.materialMultiplier
    };
  }
} 