
import { Appointment } from "@/hooks/appointments/types";

// Sample data
export const appointments: Appointment[] = [
  {
    id: "1",
    clientName: "Maria Silva",
    serviceName: "Corte e Coloração",
    date: new Date(2024, 6, 12, 10, 0),
    status: "agendado",
    price: 180,
    serviceType: "hair",
    duration: 120,
    clientId: "client1",
    professionalId: "prof1",
    serviceId: "service1",
    professionalName: "João Silva",
    notes: "Cliente preferencial"
  },
  {
    id: "2",
    clientName: "Carlos Santos",
    serviceName: "Barba e Cabelo",
    date: new Date(2024, 6, 12, 14, 30),
    status: "concluido",
    price: 95,
    serviceType: "barber",
    duration: 60,
    clientId: "client2",
    professionalId: "prof2",
    serviceId: "service2",
    professionalName: "Ana Costa",
    notes: "Primeira vez no salão"
  },
  {
    id: "3",
    clientName: "Ana Costa",
    serviceName: "Manicure",
    date: new Date(2024, 6, 15, 11, 0),
    status: "cancelado",
    price: 60,
    serviceType: "nails",
    duration: 45,
    clientId: "client3",
    professionalId: "prof3",
    serviceId: "service3",
    professionalName: "Maria Santos",
    notes: "Cancelado por motivos pessoais"
  },
  {
    id: "4",
    clientName: "Fernanda Lima",
    serviceName: "Maquiagem para Evento",
    date: new Date(2024, 6, 16, 15, 0),
    status: "agendado",
    price: 120,
    serviceType: "makeup",
    duration: 90,
    clientId: "client4",
    professionalId: "prof1",
    serviceId: "service4",
    professionalName: "João Silva",
    notes: "Evento especial - casamento"
  },
  {
    id: "5",
    clientName: "Paulo Mendes",
    serviceName: "Limpeza de Pele",
    date: new Date(2024, 6, 17, 9, 0),
    status: "agendado",
    price: 150,
    serviceType: "skincare",
    duration: 75,
    clientId: "client5",
    professionalId: "prof2",
    serviceId: "service5",
    professionalName: "Ana Costa",
    notes: "Primeira sessão de tratamento"
  },
];
