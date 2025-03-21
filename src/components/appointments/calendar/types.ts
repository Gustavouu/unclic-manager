
import { ReactNode } from "react";

export type ServiceType = "all" | "hair" | "barber" | "nails" | "makeup" | "skincare";

export type AppointmentType = {
  id: string;
  date: Date;
  clientName: string;
  serviceName: string;
  serviceType: string;
  duration: number;
  price: number;
};

// Map service types to display names
export const SERVICE_TYPE_NAMES: Record<ServiceType, string> = {
  all: "Todos os Serviços",
  hair: "Cabelo",
  barber: "Barbearia",
  nails: "Manicure/Pedicure",
  makeup: "Maquiagem",
  skincare: "Estética Facial"
};

export type CalendarViewType = "month" | "week" | "day";
