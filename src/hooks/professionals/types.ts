
export enum ProfessionalStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_VACATION = 'on_vacation',
  ON_LEAVE = 'on_leave'
}

// Map legacy status values to the new ProfessionalStatus enum
export const STATUS_MAPPING = {
  'active': ProfessionalStatus.ACTIVE,
  'inactive': ProfessionalStatus.INACTIVE,
  'on_vacation': ProfessionalStatus.ON_VACATION,
  'on_leave': ProfessionalStatus.ON_LEAVE
};

export interface Professional {
  id: string;
  business_id: string;
  user_id?: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  bio?: string;
  specialties?: string[];
  photo_url?: string;
  hire_date?: string;
  commission_percentage?: number;
  status?: ProfessionalStatus;
  working_hours?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ProfessionalFormData {
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  bio?: string;
  specialties?: string[];
  photo_url?: string;
  hire_date?: string;
  commission_percentage?: number;
  status?: ProfessionalStatus;
}
