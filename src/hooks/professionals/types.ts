
export interface Professional {
  id: string;
  name: string;
  business_id: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  specialties?: string[] | null;
  commission_percentage?: number | null;
  hire_date?: string | null;
  status?: string | null;
  working_hours?: any | null;
  created_at?: string;
  updated_at?: string;
  user_id?: string | null;
}

export interface ProfessionalFormData {
  name: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  bio?: string | null;
  photo?: File | null;
  photo_url?: string | null;
  specialties?: string[];
  commission_percentage?: number;
}

// Add missing ProfessionalStatus enum
export enum ProfessionalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE'
}

// Add missing STATUS_MAPPING
export const STATUS_MAPPING = {
  'active': ProfessionalStatus.ACTIVE,
  'inactive': ProfessionalStatus.INACTIVE,
  'on_leave': ProfessionalStatus.ON_LEAVE
};

// Add missing PROFESSIONAL_STATUS
export const PROFESSIONAL_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ON_LEAVE: 'ON_LEAVE'
};

// Add appointment status for the useAppointmentCreate hook
export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  NO_SHOW = 'NO_SHOW'
}

export const APPOINTMENT_STATUS_RECORD = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
  NO_SHOW: 'NO_SHOW'
};
