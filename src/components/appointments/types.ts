export type AppointmentStatus = "agendado" | "concluído" | "cancelado";
export type ServiceType = "all" | "haircut" | "barber" | "combo" | "treatment";
export type DateFilter = "all" | "today" | "tomorrow" | "thisWeek" | "custom";
export type CalendarViewType = "month" | "week" | "day";

export interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  date: Date;
  status: AppointmentStatus;
  price: number;
  serviceType: string;
  duration: number;
  notes?: string;
  paymentMethod?: string;
  serviceId?: string;
  clientId?: string;
  professionalId?: string;
  businessId?: string;
}

export interface AppointmentType {
  id: string;
  date: Date;
  clientName: string;
  serviceName: string;
  serviceType: string;
  duration: number;
  price: number;
  status?: string;
}

// Map service types to display names for barbershop
export const SERVICE_TYPE_NAMES: Record<ServiceType, string> = {
  all: "Todos os Serviços",
  haircut: "Corte de Cabelo",
  barber: "Barba",
  combo: "Corte e Barba",
  treatment: "Tratamentos"
};
