
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
