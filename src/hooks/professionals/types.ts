
export type Professional = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  photo_url?: string;
  bio?: string;
  position?: string;
  hire_date?: Date;
  commission_percentage?: number;
  isActive?: boolean;
  status?: ProfessionalStatus;
  role?: string; // Adding role for backwards compatibility
  photoUrl?: string; // Adding for backward compatibility
  commissionPercentage?: number; // Adding for backward compatibility
  business_id?: string;
  userId?: string;
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
};

// For backward compatibility with existing code
export type ProfessionalCreateForm = ProfessionalFormValues;
