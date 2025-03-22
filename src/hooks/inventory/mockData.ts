
import { Product } from "./types";
import { v4 as uuidv4 } from "uuid";

// Helper function to create dates in the past
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const mockProducts: Product[] = [
  {
    id: uuidv4(),
    name: "Shampoo Profissional",
    description: "Shampoo profissional para todos os tipos de cabelo",
    category: "hair",
    price: 45.90,
    quantity: 25,
    minQuantity: 10,
    supplier: "Fornecedor ABC",
    createdAt: daysAgo(30),
    updatedAt: daysAgo(15)
  },
  {
    id: uuidv4(),
    name: "Condicionador Hidratante",
    description: "Condicionador hidratante para cabelos secos",
    category: "hair",
    price: 42.50,
    quantity: 18,
    minQuantity: 10,
    supplier: "Fornecedor ABC",
    createdAt: daysAgo(30),
    updatedAt: daysAgo(15)
  },
  {
    id: uuidv4(),
    name: "Máscara Capilar",
    description: "Máscara de tratamento intensivo para cabelos danificados",
    category: "hair",
    price: 65.00,
    quantity: 12,
    minQuantity: 8,
    supplier: "Fornecedor XYZ",
    createdAt: daysAgo(25),
    updatedAt: daysAgo(10)
  },
  {
    id: uuidv4(),
    name: "Óleo de Argan",
    description: "Óleo de argan puro para finalização",
    category: "hair",
    price: 78.90,
    quantity: 8,
    minQuantity: 5,
    supplier: "Fornecedor XYZ",
    createdAt: daysAgo(20),
    updatedAt: daysAgo(5)
  },
  {
    id: uuidv4(),
    name: "Base Líquida Matte",
    description: "Base líquida de alta cobertura com acabamento matte",
    category: "makeup",
    price: 89.90,
    quantity: 15,
    minQuantity: 10,
    supplier: "Fornecedor Makeup",
    createdAt: daysAgo(18),
    updatedAt: daysAgo(3)
  },
  {
    id: uuidv4(),
    name: "Batom Cremoso",
    description: "Batom cremoso de longa duração",
    category: "makeup",
    price: 35.00,
    quantity: 24,
    minQuantity: 15,
    supplier: "Fornecedor Makeup",
    createdAt: daysAgo(15),
    updatedAt: daysAgo(2)
  },
  {
    id: uuidv4(),
    name: "Esmalte Hipoalergênico",
    description: "Esmalte hipoalergênico de secagem rápida",
    category: "nail",
    price: 22.90,
    quantity: 30,
    minQuantity: 20,
    supplier: "Fornecedor Nails",
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1)
  },
  {
    id: uuidv4(),
    name: "Creme Hidratante Facial",
    description: "Creme hidratante para todos os tipos de pele",
    category: "skincare",
    price: 65.50,
    quantity: 10,
    minQuantity: 10,
    supplier: "Fornecedor Skin",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1)
  },
  {
    id: uuidv4(),
    name: "Protetor Solar Facial",
    description: "Protetor solar facial FPS 50",
    category: "skincare",
    price: 73.90,
    quantity: 5,
    minQuantity: 8,
    supplier: "Fornecedor Skin",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1)
  },
  {
    id: uuidv4(),
    name: "Gel Modelador",
    description: "Gel modelador para cabelo com fixação forte",
    category: "hair",
    price: 32.00,
    quantity: 0,
    minQuantity: 15,
    supplier: "Fornecedor ABC",
    createdAt: daysAgo(45),
    updatedAt: daysAgo(20)
  }
];
