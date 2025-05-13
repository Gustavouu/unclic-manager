
export type Professional = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  photo_url?: string;
  bio?: string;
  position?: string;
  hire_date?: Date | string; // Supporting both Date and string format
  commission_percentage?: number;
  isActive?: boolean;
  status?: ProfessionalStatus;
  business_id?: string;
  user_id?: string;
  
  // Adding fields for backwards compatibility
  role?: string; // Alias for position
  photoUrl?: string; // Alias for photo_url
  commissionPercentage?: number; // Alias for commission_percentage
  userId?: string; // Alias for user_id
  hireDate?: Date | string; // Alias for hire_date
};

export enum ProfessionalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE'
}

// Status mapping for compatibility with string statuses
export const STATUS_MAPPING = {
  'active': ProfessionalStatus.ACTIVE,
  'inactive': ProfessionalStatus.INACTIVE,
  'on_leave': ProfessionalStatus.ON_LEAVE,
  'vacation': ProfessionalStatus.ON_LEAVE
};

export const PROFESSIONAL_STATUS = ProfessionalStatus;

export type ProfessionalFormValues = {
  name: string;
  email: string;
  phone: string;
  position?: string;
  specialties: string[];
  photo_url?: string;
  bio?: string;
  commission_percentage?: number;
  status?: ProfessionalStatus;
  
  // Adding fields for backwards compatibility
  role?: string;
  photoUrl?: string;
  commissionPercentage?: number;
  hire_date?: string;
  hireDate?: string;
};

// For backward compatibility with existing code
export type ProfessionalCreateForm = ProfessionalFormValues;
