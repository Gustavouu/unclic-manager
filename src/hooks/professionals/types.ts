
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
