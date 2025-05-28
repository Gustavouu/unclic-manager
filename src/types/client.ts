
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  last_visit?: string;
  total_spent?: number;
  total_appointments?: number;
  city?: string;
  state?: string;
  zip_code?: string;
  avatar?: string;
  status?: string;
  address?: string;
  gender?: string;
  notes?: string;
  created_at?: string;
  business_id?: string;
  user_id?: string;
  preferences?: any;
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
  firstName?: string;
  lastName?: string;
}
