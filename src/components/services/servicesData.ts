
export interface ServiceData {
  id: string;
  name: string;
  duration: number;
  price: number | string; // Updated to allow both number and string
  category: string;
  isPopular: boolean;
  isFeatured: boolean;
  isActive?: boolean;
  description?: string;
}

// Sample services data
export const services: ServiceData[] = [
  {
    id: "1",
    name: "Corte de Cabelo Feminino",
    duration: 60,
    price: 80.00,
    category: "Cabelo",
    isPopular: true,
    isFeatured: true,
    isActive: true,
    description: "Corte personalizado para todos os tipos de cabelo feminino, incluindo lavagem e finalização."
  },
  {
    id: "2",
    name: "Corte de Cabelo Masculino",
    duration: 30,
    price: 50.00,
    category: "Cabelo",
    isPopular: true,
    isFeatured: false,
    isActive: true,
    description: "Corte moderno e rápido para cabelo masculino, inclui lavagem."
  },
  {
    id: "3",
    name: "Coloração",
    duration: 90,
    price: 120.00,
    category: "Cabelo",
    isPopular: false,
    isFeatured: true,
    isActive: true,
    description: "Coloração completa com produtos de alta qualidade, inclui tratamento pós-coloração."
  },
  {
    id: "4",
    name: "Hidratação Profunda",
    duration: 45,
    price: 70.00,
    category: "Tratamento",
    isPopular: false,
    isFeatured: false,
    isActive: true,
    description: "Tratamento intensivo para cabelos danificados, inclui produtos especiais de reconstrução."
  },
  {
    id: "5",
    name: "Manicure",
    duration: 40,
    price: 40.00,
    category: "Unhas",
    isPopular: true,
    isFeatured: false,
    isActive: true,
    description: "Cuidado completo para unhas das mãos, inclui esfoliação, hidratação e esmalte."
  },
  {
    id: "6",
    name: "Pedicure",
    duration: 50,
    price: 50.00,
    category: "Unhas",
    isPopular: false,
    isFeatured: false,
    isActive: true,
    description: "Tratamento completo para os pés, inclui esfoliação, hidratação e esmalte."
  },
  {
    id: "7",
    name: "Limpeza de Pele",
    duration: 60,
    price: 90.00,
    category: "Rosto",
    isPopular: false,
    isFeatured: true,
    isActive: true,
    description: "Limpeza profunda com extração de cravos e aplicação de máscara hidratante."
  },
  {
    id: "8",
    name: "Design de Sobrancelhas",
    duration: 30,
    price: 35.00,
    category: "Rosto",
    isPopular: true,
    isFeatured: false,
    isActive: true,
    description: "Modelagem e design personalizado de sobrancelhas com linha ou pinça."
  },
];
