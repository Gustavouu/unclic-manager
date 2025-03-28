
import { AppointmentType } from "./types";
import { setHours, setMinutes } from "date-fns";

// Sample appointments data
export const SAMPLE_APPOINTMENTS: AppointmentType[] = [
  {
    id: "1",
    date: new Date(new Date().setHours(10, 0)),
    clientName: "Mariana Silva",
    serviceName: "Corte e Coloração",
    serviceType: "haircut",
    status: "agendado",
    duration: 90,
    price: 180
  },
  {
    id: "2",
    date: new Date(new Date().setHours(14, 30)),
    clientName: "Carlos Santos",
    serviceName: "Barba e Cabelo",
    serviceType: "combo",
    status: "agendado",
    duration: 60,
    price: 95
  },
  {
    id: "3",
    date: setHours(setMinutes(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2), 0), 11),
    clientName: "João Paulo Costa",
    serviceName: "Corte Degradê",
    serviceType: "haircut",
    status: "agendado",
    duration: 45,
    price: 60
  },
  {
    id: "4",
    date: setHours(setMinutes(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1), 0), 15),
    clientName: "Fernando Lima",
    serviceName: "Barba Completa",
    serviceType: "barber",
    status: "agendado",
    duration: 60,
    price: 70
  },
  {
    id: "5",
    date: setHours(setMinutes(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1), 0), 9),
    clientName: "Paulo Mendes",
    serviceName: "Tratamento Capilar",
    serviceType: "treatment",
    status: "agendado",
    duration: 75,
    price: 150
  },
];
