import { Material, MaterialCategory } from '@/hooks/useSettings';

export const DEFAULT_MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Materials for automotive applications and components'
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Heavy-duty industrial equipment and machinery components'
  },
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'Commercial and retail applications'
  },
  {
    id: 'architectural',
    name: 'Architectural',
    description: 'Building and construction components'
  },
  {
    id: 'consumer',
    name: 'Consumer Products',
    description: 'Consumer goods and appliances'
  }
];

export const DEFAULT_MATERIALS: Material[] = [
  // Automotive Materials
  {
    name: 'Alloy Wheels',
    pricePerUnit: 45.00,
    unit: 'wheel',
    category: 'automotive',
    description: 'Custom alloy wheels, various sizes available',
    minQuantity: 1,
    maxQuantity: 20
  },
  {
    name: 'Suspension Components',
    pricePerUnit: 28.50,
    unit: 'piece',
    category: 'automotive',
    description: 'Control arms, springs, and other suspension parts',
    minQuantity: 1,
    maxQuantity: 50
  },
  {
    name: 'Engine Components',
    pricePerUnit: 35.75,
    unit: 'piece',
    category: 'automotive',
    description: 'Valve covers, intake manifolds, and brackets',
    minQuantity: 1,
    maxQuantity: 30
  },
  {
    name: 'Body Panels',
    pricePerUnit: 55.00,
    unit: 'panel',
    category: 'automotive',
    description: 'Custom automotive body panels and trim pieces',
    minQuantity: 1,
    maxQuantity: 25
  },

  // Industrial Materials
  {
    name: 'Heavy Machinery Parts',
    pricePerUnit: 65.00,
    unit: 'piece',
    category: 'industrial',
    description: 'Large industrial equipment components',
    minQuantity: 1,
    maxQuantity: 40
  },
  {
    name: 'Industrial Shelving',
    pricePerUnit: 42.50,
    unit: 'section',
    category: 'industrial',
    description: 'Heavy-duty storage and shelving units',
    minQuantity: 2,
    maxQuantity: 100
  },
  {
    name: 'Machine Guards',
    pricePerUnit: 38.75,
    unit: 'piece',
    category: 'industrial',
    description: 'Safety guards for industrial machinery',
    minQuantity: 1,
    maxQuantity: 50
  },
  {
    name: 'Tool Frames',
    pricePerUnit: 32.00,
    unit: 'frame',
    category: 'industrial',
    description: 'Frames and housings for industrial tools',
    minQuantity: 1,
    maxQuantity: 75
  },

  // Commercial Materials
  {
    name: 'Store Fixtures',
    pricePerUnit: 48.50,
    unit: 'piece',
    category: 'commercial',
    description: 'Retail display and fixture components',
    minQuantity: 2,
    maxQuantity: 60
  },
  {
    name: 'Sign Components',
    pricePerUnit: 36.25,
    unit: 'sq ft',
    category: 'commercial',
    description: 'Commercial signage and display parts',
    minQuantity: 4,
    maxQuantity: 200
  },
  {
    name: 'Restaurant Equipment',
    pricePerUnit: 52.75,
    unit: 'piece',
    category: 'commercial',
    description: 'Food service equipment components',
    minQuantity: 1,
    maxQuantity: 40
  },

  // Architectural Materials
  {
    name: 'Railing Systems',
    pricePerUnit: 42.00,
    unit: 'linear ft',
    category: 'architectural',
    description: 'Decorative and functional railings',
    minQuantity: 4,
    maxQuantity: 100
  },
  {
    name: 'Window Frames',
    pricePerUnit: 38.50,
    unit: 'frame',
    category: 'architectural',
    description: 'Aluminum window frames and components',
    minQuantity: 1,
    maxQuantity: 50
  },
  {
    name: 'Door Hardware',
    pricePerUnit: 28.75,
    unit: 'piece',
    category: 'architectural',
    description: 'Door handles, hinges, and accessories',
    minQuantity: 2,
    maxQuantity: 150
  },
  {
    name: 'Structural Elements',
    pricePerUnit: 45.50,
    unit: 'piece',
    category: 'architectural',
    description: 'Support brackets and structural components',
    minQuantity: 1,
    maxQuantity: 75
  },

  // Consumer Products
  {
    name: 'Appliance Parts',
    pricePerUnit: 32.25,
    unit: 'piece',
    category: 'consumer',
    description: 'Home appliance components and panels',
    minQuantity: 1,
    maxQuantity: 100
  },
  {
    name: 'Furniture Components',
    pricePerUnit: 28.50,
    unit: 'piece',
    category: 'consumer',
    description: 'Metal furniture parts and frames',
    minQuantity: 2,
    maxQuantity: 120
  },
  {
    name: 'Lighting Fixtures',
    pricePerUnit: 35.75,
    unit: 'fixture',
    category: 'consumer',
    description: 'Decorative and functional lighting components',
    minQuantity: 1,
    maxQuantity: 80
  },
  {
    name: 'Garden Equipment',
    pricePerUnit: 25.50,
    unit: 'piece',
    category: 'consumer',
    description: 'Outdoor furniture and equipment parts',
    minQuantity: 1,
    maxQuantity: 150
  }
]; 