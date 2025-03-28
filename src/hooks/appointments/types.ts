
import { Appointment, AppointmentStatus } from "@/components/appointments/types";

export interface CreateAppointmentData {
  clientName: string;
  serviceName: string;
  date: Date;
  status: AppointmentStatus;
  price: number;
  serviceType: string;
  duration: number;
  notes?: string;
  serviceId?: string;
  clientId?: string;
  professionalId?: string;
  businessId?: string;
  paymentMethod?: string;
}

export interface AppointmentHookReturn {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  createAppointment: (appointmentData: CreateAppointmentData) => Promise<string>;
  updateAppointment: (id: string, changes: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}
