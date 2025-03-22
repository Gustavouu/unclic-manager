
export interface ServiceData {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
  isPopular: boolean;
  isFeatured: boolean;
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
  },
  {
    id: "2",
    name: "Corte de Cabelo Masculino",
    duration: 30,
    price: 50.00,
    category: "Cabelo",
    isPopular: true,
    isFeatured: false,
  },
  {
    id: "3",
    name: "Coloração",
    duration: 90,
    price: 120.00,
    category: "Cabelo",
    isPopular: false,
    isFeatured: true,
  },
  {
    id: "4",
    name: "Hidratação Profunda",
    duration: 45,
    price: 70.00,
    category: "Tratamento",
    isPopular: false,
    isFeatured: false,
  },
  {
    id: "5",
    name: "Manicure",
    duration: 40,
    price: 40.00,
    category: "Unhas",
    isPopular: true,
    isFeatured: false,
  },
  {
    id: "6",
    name: "Pedicure",
    duration: 50,
    price: 50.00,
    category: "Unhas",
    isPopular: false,
    isFeatured: false,
  },
  {
    id: "7",
    name: "Limpeza de Pele",
    duration: 60,
    price: 90.00,
    category: "Rosto",
    isPopular: false,
    isFeatured: true,
  },
  {
    id: "8",
    name: "Design de Sobrancelhas",
    duration: 30,
    price: 35.00,
    category: "Rosto",
    isPopular: true,
    isFeatured: false,
  },
];
