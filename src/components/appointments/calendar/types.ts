
export type ServiceType = "all" | "haircut" | "barber" | "combo" | "treatment";
export type CalendarViewType = "month" | "week" | "day";

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

export interface BusinessHour {
  isOpen: boolean;
  hours?: string;
}
