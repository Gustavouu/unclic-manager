
export type AppointmentStatus = "agendado" | "concluído" | "cancelado";
export type ServiceType = "all" | "haircut" | "barber" | "combo" | "treatment";
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

// Map service types to display names for barbershop
export const SERVICE_TYPE_NAMES: Record<ServiceType, string> = {
  all: "Todos os Serviços",
  haircut: "Corte de Cabelo",
  barber: "Barba",
  combo: "Corte e Barba",
  treatment: "Tratamentos"
};
