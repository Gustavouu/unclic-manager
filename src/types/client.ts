/**
 * Client data types and interfaces for the application
 */

/**
 * Main Client interface representing a client in the system
 */
export interface Client {
  id: string;
  business_id: string;
  name: string;
  email: string;
  phone: string;
  birth_date: string | null;
  gender: 'male' | 'female' | 'other' | null;
  address: string | null;
  address_number: string | null;
  address_complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  notes: string | null;
  preferences: ClientPreferences;
  status: 'active' | 'inactive' | 'blocked';
  last_appointment: string | null;
  total_appointments: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

/**
 * Data required to create a new client
 */
export interface ClientFormData {
  nome?: string;
  name?: string;
  email?: string;
  telefone?: string;
  phone?: string;
  cidade?: string;
  city?: string;
  estado?: string;
  state?: string;
  address?: string;
  gender?: string;
  notes?: string;
}

/**
 * Search params for finding clients
 */
export interface ClientSearchParams {
  email?: string;
  telefone?: string;
  phone?: string;
  nome?: string;
  name?: string;
}

/**
 * Client operation result with success/error information
 */
export interface ClientOperationResult {
  success: boolean;
  data?: Client;
  error?: string;
}

/**
 * Client list result
 */
export interface ClientListResult {
  success: boolean;
  data?: Client[];
  error?: string;
}

export interface ClientCreate {
  business_id: string;
  name: string;
  email: string;
  phone: string;
  birth_date?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  address?: string | null;
  address_number?: string | null;
  address_complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  notes?: string | null;
  preferences?: Partial<ClientPreferences>;
  status?: 'active' | 'inactive' | 'blocked';
}

export interface ClientUpdate {
  name?: string;
  email?: string;
  phone?: string;
  birth_date?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  address?: string | null;
  address_number?: string | null;
  address_complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  notes?: string | null;
  preferences?: Partial<ClientPreferences>;
  status?: 'active' | 'inactive' | 'blocked';
}

export interface ClientPreferences {
  preferred_professionals: string[];
  preferred_services: string[];
  preferred_payment_method: 'credit_card' | 'debit_card' | 'cash' | 'pix' | null;
  preferred_communication_channel: 'email' | 'sms' | 'whatsapp' | null;
  preferred_appointment_time: 'morning' | 'afternoon' | 'evening' | null;
  preferred_appointment_day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | null;
  send_reminders: boolean;
  send_followup: boolean;
  send_promotions: boolean;
  send_birthday_greeting: boolean;
  notes: string | null;
}

export interface ClientStats {
  totalAppointments: number;
  totalSpent: number;
  averageAppointmentValue: number;
  lastAppointmentDate: string | null;
  favoriteService: string | null;
  favoriteProfessional: string | null;
  noShowCount: number;
  cancellationCount: number;
}
