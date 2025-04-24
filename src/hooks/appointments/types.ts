
import { SetStateAction } from "react";

export type AppointmentStatus = 
  | "agendado" 
  | "confirmado" 
  | "pendente" 
  | "concluido" 
  | "cancelado";

export interface Appointment {
  id: string;
  date: Date;
  clientId: string;
  clientName: string;
  serviceId?: string;
  serviceName: string;
  serviceType: string;
  professionalId?: string;
  professionalName?: string;
  duration: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  paymentMethod?: string;
  confirmed?: boolean;
  notifications?: { // Added notifications property
    sendConfirmation: boolean;
    sendReminder: boolean;
  };
  additionalServices?: Array<{
    id?: string;
    name?: string;
    duration?: number;
    price: number;
  }>;
}

export interface UpdatedAppointmentData {
  date?: Date;
  clientId?: string;
  clientName?: string;
  serviceId?: string;
  serviceName?: string;
  serviceType?: string;
  professionalId?: string;
  professionalName?: string;
  duration?: number;
  price?: number;
  status?: AppointmentStatus;
  notes?: string;
  paymentMethod?: string;
  confirmed?: boolean;
  notifications?: { // Added notifications property
    sendConfirmation: boolean;
    sendReminder: boolean;
  };
  additionalServices?: Array<{
    id?: string;
    name?: string;
    duration?: number;
    price: number;
  }>;
}

export interface CreateAppointmentData {
  date: Date;
  clientId: string;
  clientName: string;
  serviceId?: string;
  serviceName: string;
  serviceType: string;
  professionalId?: string;
  professionalName?: string;
  duration: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  paymentMethod?: string;
  isEmergency?: boolean;
  emergencyReason?: string;
  notifications?: {
    sendConfirmation: boolean;
    sendReminder: boolean;
  };
  additionalServices?: Array<{
    id?: string;
    name?: string;
    duration?: number;
    price: number;
  }>;
}

export interface AppointmentHookReturn {
  appointments: Appointment[];
  isLoading: boolean;
  error: Error | null;
  fetchAppointments: () => void;
  createAppointment: (data: Omit<Appointment, "id">) => Promise<string>;
  updateAppointment: (id: string, changes: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}
