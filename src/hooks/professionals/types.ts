
import { Database } from '@/integrations/supabase/database.types';

export type Professional = Database['public']['Tables']['professionals']['Row'];

export type ProfessionalFormData = Omit<Professional, 'id' | 'created_at' | 'updated_at' | 'business_id'>;

export type ProfessionalWithServices = Professional & {
  services: {
    id: string;
    name: string;
    duration: number;
    price: number;
  }[];
};

// Define a ProfessionalStatus enum
export enum ProfessionalStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave'
}

// Define mapping for legacy status strings
export const STATUS_MAPPING = {
  'active': ProfessionalStatus.ACTIVE,
  'inactive': ProfessionalStatus.INACTIVE,
  'on_leave': ProfessionalStatus.ON_LEAVE
};

// Define type for backward compatibility
export const PROFESSIONAL_STATUS = ProfessionalStatus;

// Add AppointmentStatus enum for use in appointment-related components
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

// Add appointment status record for mapping between enum and string values
export const APPOINTMENT_STATUS_RECORD = {
  [AppointmentStatus.SCHEDULED]: 'scheduled',
  [AppointmentStatus.CONFIRMED]: 'confirmed',
  [AppointmentStatus.COMPLETED]: 'completed',
  [AppointmentStatus.CANCELLED]: 'cancelled',
  [AppointmentStatus.NO_SHOW]: 'no_show'
};
