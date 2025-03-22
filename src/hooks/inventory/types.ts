
export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  minQuantity: number;
  supplier?: string;
  createdAt: Date;
  updatedAt: Date;
  salesCount?: number; // Number of times this product was sold
  lastSoldAt?: Date; // Last time this product was sold
}

// For analytics display
export interface ProductAnalytics {
  bestSellers: Product[];
  needsRestock: Product[];
  slowMoving: Product[];
}
