
// Standard type interface for professionals data
export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  specialties?: string[];
  position?: string;
  status?: string;
  isActive?: boolean;
  commission_percentage?: number;
  hire_date?: string | Date;
  business_id: string;
  user_id?: string;
  workingHours?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// Input type for creating/updating a professional
export interface ProfessionalInput {
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  specialties?: string[];
  position?: string;
  commission_percentage?: number;
  workingHours?: Record<string, any>;
}

// Filter options for fetching professionals
export interface ProfessionalFilters {
  isActive?: boolean;
  specialties?: string[];
  search?: string;
}
