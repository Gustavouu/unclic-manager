
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
}
