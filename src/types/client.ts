
export interface Client {
  id: string;
  business_id: string;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  notes: string;
  created_at: string;
  updated_at: string;
  last_visit?: string | null;
  total_spent: number;
  status: string;
  preferences: Record<string, any>;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  notes: string;
}

export interface ClientFilters {
  search: string;
  status: string;
  city: string;
  gender: string;
  dateRange: string;
  spendingRange: string;
}
