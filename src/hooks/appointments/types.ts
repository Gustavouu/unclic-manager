
export type AppointmentStatus = 'agendado' | 'confirmado' | 'concluido' | 'cancelado' | 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show' | 'faltou' | 'pendente';

export interface CreateAppointmentData {
  clientId: string;
  clientName?: string;
  serviceId: string;
  serviceName?: string;
  professionalId: string;
  professionalName?: string;
  date: Date;
  time: string;
  endTime?: string;
  duration?: number;
  price?: number;
  status?: AppointmentStatus;
  paymentMethod?: string;
  notes?: string;
  serviceType?: string;
  businessId?: string;
  notifications?: {
    sendConfirmation: boolean;
    sendReminder: boolean;
  };
}

export interface UpdatedAppointmentData extends Partial<CreateAppointmentData> {
  status?: AppointmentStatus;
  confirmed?: boolean;
  additionalServices?: Array<{
    price: number;
  }>;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  serviceType: string;
  professionalId: string;
  professionalName: string;
  date: Date;
  duration: number;
  price: number;
  status: AppointmentStatus;
  notes: string;
  paymentMethod?: string;
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

// Service types for appointments
export type ServiceType = "all" | "haircut" | "barber" | "combo" | "treatment" | "hair" | "nails" | "makeup" | "skincare";
export type DateFilter = "all" | "today" | "tomorrow" | "thisWeek" | "custom";
export type CalendarViewType = "month" | "week" | "day";

// Map service types to display names
export const SERVICE_TYPE_NAMES: Record<ServiceType, string> = {
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

// For backward compatibility
export type AppointmentType = Appointment;
