
export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  bio?: string;
  photo_url?: string;
  status?: 'active' | 'inactive';
  commission_percentage?: number;
  hire_date?: string;
  working_hours?: any;
  specialties?: string[];
  business_id: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
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
