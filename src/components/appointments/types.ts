export type AppointmentStatus = "agendado" | "confirmado" | "pendente" | "concluido" | "cancelado" | "faltou";
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
  clientId: string;
  professionalId: string;
  businessId?: string;
  service?: {
    price: number;
  };
  additionalServices?: Array<{
    price: number;
  }>;
  notifications?: {
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
export const SERVICE_TYPE_NAMES: Record<import('@/hooks/appointments/types').ServiceType, string> = {
  all: "Todos os Serviços",
  haircut: "Corte de Cabelo",
  barber: "Barba",
  combo: "Corte e Barba",
  treatment: "Tratamentos",
  hair: "Cabelo",
  nails: "Unhas",
  makeup: "Maquiagem",
  skincare: "Cuidados com a Pele"
};

// Re-export everything from the main types file to avoid conflicts
export * from '@/hooks/appointments/types';

// Keep any component-specific types here if needed
export interface AppointmentFilters {
  searchTerm: string;
  statusFilter: string;
  serviceFilter: string;
  dateFilter: string;
  customDateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}
