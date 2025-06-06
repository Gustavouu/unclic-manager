
export interface Client {
  id: string;
  business_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  notes?: string | null;
  status: 'active' | 'inactive';
  preferences: Record<string, any>;
  last_visit?: string | null;
  total_spent: number;
  total_appointments?: number;
  created_at: string;
  updated_at: string;
}

export interface ClientFormData {
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  notes?: string;
  status?: 'active' | 'inactive';
  preferences?: Record<string, any>;
}

export interface ClientSearchParams {
  business_id: string;
  search?: string;
  status?: string;
  last_visit_from?: string;
  last_visit_to?: string;
  limit?: number;
  offset?: number;
}

export interface ClientStats {
  total: number;
  active: number;
  inactive: number;
  new_this_month: number;
  total_spent: number;
  average_spent: number;
  last_30_days: number;
}

export interface ClientFilters {
  search: string;
  status: string;
  city: string;
  gender: string;
  dateRange: string;
  spendingRange: string;
}
