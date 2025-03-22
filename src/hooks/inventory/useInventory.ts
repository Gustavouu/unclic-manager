
import { useState } from "react";
import { Product, ProductAnalytics } from "./types";
import { v4 as uuidv4 } from "uuid";
import { mockProducts } from "./mockData";

// Updated NewProduct type to be more explicit about required fields
export type NewProduct = {
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  minQuantity: number;
  supplier?: string;
};

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isLoading, setIsLoading] = useState(false);

  const addProduct = (product: NewProduct) => {
    const newProduct: Product = {
      id: uuidv4(),
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
      salesCount: 0
    };
    
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, product: Partial<NewProduct>) => {
    setProducts((prev) => 
      prev.map((p) => 
        p.id === id 
          ? { ...p, ...product, updatedAt: new Date() } 
          : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  // Calculate analytics based on current inventory
  const getInventoryAnalytics = (): ProductAnalytics => {
    // Find products that need restocking (quantity <= minQuantity)
    const needsRestock = products.filter(product => 
      product.quantity <= product.minQuantity
    );

    // Best sellers (top 5 by salesCount)
    const bestSellers = [...products]
      .filter(p => p.salesCount && p.salesCount > 0)
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 5);

    // Slow moving products (hasn't been sold in the last 30 days or never sold)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const slowMoving = products.filter(product => 
      !product.lastSoldAt || new Date(product.lastSoldAt) < thirtyDaysAgo
    );

    return {
      bestSellers,
      needsRestock,
      slowMoving
    };
  };

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getInventoryAnalytics
  };
};
