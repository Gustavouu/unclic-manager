
export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  bio?: string;
  photo_url?: string;
  status?: ProfessionalStatus | string;
  commission_percentage?: number;
  hire_date?: string;
  working_hours?: any;
  specialties?: string[];
  business_id: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export enum ProfessionalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE'
}

export const PROFESSIONAL_STATUS = {
  ACTIVE: ProfessionalStatus.ACTIVE,
  INACTIVE: ProfessionalStatus.INACTIVE,
  ON_LEAVE: ProfessionalStatus.ON_LEAVE
};

export const STATUS_MAPPING = {
  'active': ProfessionalStatus.ACTIVE,
  'inactive': ProfessionalStatus.INACTIVE,
  'on_leave': ProfessionalStatus.ON_LEAVE
};

export interface ProfessionalFormData {
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  bio?: string;
  specialties?: string[];
  commission_percentage?: number;
  status?: ProfessionalStatus;
  photo_url?: string;
  working_hours?: any;
  hire_date?: string;
}

export interface ProfessionalService {
  id: string;
  professional_id: string;
  service_id: string;
  custom_price?: number;
  custom_duration?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Re-export appointment status types needed by other components
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  NO_SHOW = 'no-show'
}

export const APPOINTMENT_STATUS_RECORD = {
  SCHEDULED: AppointmentStatus.SCHEDULED,
  CONFIRMED: AppointmentStatus.CONFIRMED,
  COMPLETED: AppointmentStatus.COMPLETED,
  CANCELED: AppointmentStatus.CANCELED,
  NO_SHOW: AppointmentStatus.NO_SHOW
};
