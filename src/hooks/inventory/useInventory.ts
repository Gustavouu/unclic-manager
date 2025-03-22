
import { useState } from "react";
import { Product } from "./types";
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
      updatedAt: new Date()
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

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById
  };
};
