export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  features?: string[];
  price?: number;
  priceUnit?: string;
  category?: string;
  order?: number;  // Optional field for ordering services
} 