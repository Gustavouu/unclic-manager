
export interface BarberServiceTemplate {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  category: string;
}

export const barberServiceTemplates: BarberServiceTemplate[] = [
  {
    id: "corte-padrao",
    name: "Corte de Cabelo Masculino",
    duration: 30,
    price: 40.00,
    description: "Corte de cabelo masculino tradicional, inclui lavagem e finalização com produtos.",
    category: "Cabelo"
  },
  {
    id: "corte-degrade",
    name: "Corte Degradê",
    duration: 30,
    price: 45.00,
    description: "Corte de cabelo com técnica degradê, fade nas laterais e acabamento personalizado.",
    category: "Cabelo"
  },
  {
    id: "barba-completa",
    name: "Barba Completa",
    duration: 30,
    price: 35.00,
    description: "Serviço completo de barba com toalha quente, navalha e produtos de finalização.",
    category: "Barba"
  },
  {
    id: "barba-simples",
    name: "Barba Simples",
    duration: 20,
    price: 25.00,
    description: "Aparar e modelar a barba com máquina e tesoura, inclui acabamentos.",
    category: "Barba"
  },
  {
    id: "corte-barba",
    name: "Corte + Barba",
    duration: 60,
    price: 70.00,
    description: "Combo com corte de cabelo masculino e serviço completo de barba.",
    category: "Combo"
  },
  {
    id: "pigmentacao",
    name: "Pigmentação de Barba",
    duration: 30,
    price: 50.00,
    description: "Aplicação de tintura específica para barba, cobrindo falhas e grisalhos.",
    category: "Barba"
  },
  {
    id: "selagem-capilar",
    name: "Selagem Capilar",
    duration: 60,
    price: 120.00,
    description: "Tratamento para redução de volume e frizz, deixa os fios mais alinhados.",
    category: "Tratamento"
  },
  {
    id: "hot-towel",
    name: "Hot Towel Shave",
    duration: 45,
    price: 60.00,
    description: "Barbear tradicional com toalhas quentes e produtos premium para o cuidado da pele.",
    category: "Barba"
  },
  {
    id: "corte-infantil",
    name: "Corte Infantil",
    duration: 30,
    price: 35.00,
    description: "Corte de cabelo para crianças até 12 anos, com abordagem especial e cuidadosa.",
    category: "Cabelo"
  },
  {
    id: "depilacao-orelha-nariz",
    name: "Depilação Orelha e Nariz",
    duration: 15,
    price: 20.00,
    description: "Remoção de pelos da orelha e nariz com cera ou aparelho específico.",
    category: "Rosto"
  }
];
