
export type ProfessionalStatus = 'active' | 'inactive' | 'on_vacation' | 'on_leave';

export interface Professional {
  id: string;
  business_id: string;
  user_id?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  specialties?: string[] | null;
  commission_percentage?: number | null;
  hire_date?: string | null;
  status?: ProfessionalStatus | null;
  working_hours?: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
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
  working_hours?: Record<string, any>;
}

export interface ProfessionalSchedule {
  id: string;
  professional_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  is_working_day: boolean;
  created_at?: string;
  updated_at?: string;
}
