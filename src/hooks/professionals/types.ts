
export type ProfessionalStatus = 'active' | 'inactive' | 'pending';

export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  photo_url?: string;
  bio?: string;
  specialties?: string[];
  status: ProfessionalStatus;
  business_id: string;
  user_id?: string;
  commission_percentage?: number;
  hire_date?: string;
  working_hours: { [day: string]: { start: string; end: string; isAvailable: boolean } };
  created_at: string;
  updated_at: string;
}

export interface ProfessionalFormData {
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  bio?: string;
  photo_url?: string;
  specialties?: string[];
  commission_percentage?: number;
  hire_date?: string;
  status?: ProfessionalStatus;
  working_hours?: { [day: string]: { start: string; end: string; isAvailable: boolean } };
}

export interface ProfessionalCreate extends ProfessionalFormData {
  business_id: string;
}

export interface ProfessionalUpdate extends Partial<ProfessionalFormData> {}

export interface ProfessionalSearchParams {
  business_id: string;
  search?: string;
  status?: string;
  specialties?: string[];
  position?: string;
}
