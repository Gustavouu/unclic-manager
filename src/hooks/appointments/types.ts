
import { Appointment, AppointmentStatus } from "@/components/appointments/types";

export type CreateAppointmentData = {
  clientId: string;
  serviceId: string;
  professionalId: string;
  businessId?: string; // Make this optional to match usage in the code
  date: Date;
  status: AppointmentStatus;
  price: number;
  duration: number;
  notes?: string;
  paymentMethod: string;
  serviceType: string;
  clientName: string;
  serviceName: string;
  notifications: {
    sendConfirmation: boolean;
    sendReminder: boolean;
  };
  additionalServices?: Array<{
    serviceId: string;
    duration: number;
    price: number;
  }>;
  isEmergency?: boolean;
  emergencyReason?: string;
};

export interface AppointmentHookReturn {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  createAppointment: (appointmentData: CreateAppointmentData) => Promise<string>;
  updateAppointment: (id: string, changes: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}
