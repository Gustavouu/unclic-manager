
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
