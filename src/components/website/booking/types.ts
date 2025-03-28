
import { ServiceData, StaffData } from "@/contexts/onboarding/types";

// Extended types for booking flow components
export interface ExtendedStaffData extends StaffData {
  availability?: boolean;
  bio?: string;
}

export interface ExtendedServiceData extends ServiceData {
  category?: string;
  description?: string;
}

export type BookingData = {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  professionalId: string;
  professionalName: string;
  date: Date | undefined;
  time: string;
  notes: string;
  clientId?: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
}

export interface BookingFlowProps {
  services: ServiceData[];
  staff: StaffData[];
  businessName: string;
  closeFlow: () => void;
}

export interface ClientData {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  birthDate?: string;
}
