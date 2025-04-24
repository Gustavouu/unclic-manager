
export type AppointmentStatus = "agendado" | "confirmado" | "pendente" | "concluido" | "cancelado" | "concluído";
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
  clientId: string; // Changed from optional to required
  professionalId?: string;
  businessId?: string;
  service?: {
    price: number;
  };
  additionalServices?: Array<{
    price: number;
  }>;
  notifications?: { // Added notifications field
    sendConfirmation: boolean;
    sendReminder: boolean;
  };
}

export interface AppointmentType {
  id: string;
  date: Date;
  clientName: string;
  serviceName: string;
  serviceType: string;
  duration: number;
  price: number;
  status?: AppointmentStatus;
  professionalId?: string;
}

// Map service types to display names for barbershop
export const SERVICE_TYPE_NAMES: Record<ServiceType, string> = {
  all: "Todos os Serviços",
  haircut: "Corte de Cabelo",
  barber: "Barba",
  combo: "Corte e Barba",
  treatment: "Tratamentos"
};
