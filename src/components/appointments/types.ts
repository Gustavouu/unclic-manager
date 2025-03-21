
export type AppointmentStatus = "agendado" | "concluído" | "cancelado";
export type ServiceType = "all" | "hair" | "barber" | "nails" | "makeup" | "skincare";
export type DateFilter = "all" | "today" | "tomorrow" | "thisWeek" | "custom";

export interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  date: Date;
  status: AppointmentStatus;
  price: number;
  serviceType: string;
}

// Map service types to display names
export const SERVICE_TYPE_NAMES: Record<ServiceType, string> = {
  all: "Todos os Serviços",
  hair: "Cabelo",
  barber: "Barbearia",
  nails: "Manicure/Pedicure",
  makeup: "Maquiagem",
  skincare: "Estética Facial"
};
