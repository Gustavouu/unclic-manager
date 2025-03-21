
import { Client } from "./types";

// Sample client data
export const initialClients: Client[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@email.com",
    phone: "(11) 98765-4321",
    lastVisit: "2023-10-15",
    totalSpent: 450.00,
    gender: "Feminino",
    category: "VIP",
    city: "São Paulo"
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    phone: "(11) 91234-5678",
    lastVisit: "2023-09-28",
    totalSpent: 275.50,
    gender: "Masculino",
    category: "Regular",
    city: "Rio de Janeiro"
  },
  {
    id: "3",
    name: "Mariana Costa",
    email: "mariana.costa@email.com",
    phone: "(11) 99876-5432",
    lastVisit: "2023-10-05",
    totalSpent: 620.00,
    gender: "Feminino",
    category: "Premium",
    city: "Belo Horizonte"
  },
  {
    id: "4",
    name: "Pedro Santos",
    email: "pedro.santos@email.com",
    phone: "(11) 98877-6655",
    lastVisit: null,
    totalSpent: 0,
    gender: "Masculino",
    category: "Novo",
    city: "Curitiba"
  },
  {
    id: "5",
    name: "Juliana Pereira",
    email: "juliana.pereira@email.com",
    phone: "(11) 97788-9900",
    lastVisit: "2023-10-10",
    totalSpent: 380.75,
    gender: "Feminino",
    category: "Regular",
    city: "São Paulo"
  }
];
