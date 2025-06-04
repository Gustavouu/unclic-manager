
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
  total_appointments?: number;
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

export interface ClientStats {
  totalClients: number;
  newThisMonth: number;
  activeClients: number;
  retentionRate: number;
  totalAppointments?: number;
  completedAppointments?: number;
  cancelledAppointments?: number;
  totalSpent?: number;
}

export interface ClientSearchParams {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
  business_id?: string;
  city?: string;
  state?: string;
  page?: number;
}

export interface ClientCreate {
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
  business_id?: string;
}

export interface ClientUpdate extends Partial<ClientCreate> {}

export interface ClientListResult {
  clients: Client[];
  total: number;
  page?: number;
}

export interface ClientOperationResult {
  success: boolean;
  client?: Client;
  error?: string;
  data?: any;
}
