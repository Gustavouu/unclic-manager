
import type { AppointmentStatus, ServiceType } from "@/hooks/appointments/types";

export type CalendarViewType = "month" | "week" | "day";

// Re-export ServiceType so it's available
export type { ServiceType };

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

export interface BusinessHour {
  isOpen: boolean;
  hours?: string;
}
