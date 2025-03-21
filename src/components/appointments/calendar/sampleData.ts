
import { AppointmentType } from "./types";
import { setHours, setMinutes } from "date-fns";

// Sample appointments data
export const SAMPLE_APPOINTMENTS: AppointmentType[] = [
  {
    id: "1",
    date: new Date(new Date().setHours(10, 0)),
    clientName: "Mariana Silva",
    serviceName: "Corte e Coloração",
    serviceType: "hair",
    duration: 90,
    price: 180
  },
  {
    id: "2",
    date: new Date(new Date().setHours(14, 30)),
    clientName: "Carlos Santos",
    serviceName: "Barba e Cabelo",
    serviceType: "barber",
    duration: 60,
    price: 95
  },
  {
    id: "3",
    date: setHours(setMinutes(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2), 0), 11),
    clientName: "Ana Paula Costa",
    serviceName: "Manicure",
    serviceType: "nails",
    duration: 45,
    price: 60
  },
  {
    id: "4",
    date: setHours(setMinutes(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1), 0), 15),
    clientName: "Fernanda Lima",
    serviceName: "Maquiagem para Evento",
    serviceType: "makeup",
    duration: 60,
    price: 120
  },
  {
    id: "5",
    date: setHours(setMinutes(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1), 0), 9),
    clientName: "Paulo Mendes",
    serviceName: "Limpeza de Pele",
    serviceType: "skincare",
    duration: 75,
    price: 150
  },
];
