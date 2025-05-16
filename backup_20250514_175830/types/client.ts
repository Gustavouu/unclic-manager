
/**
 * Client data types and interfaces for the application
 */

/**
 * Main Client interface representing a client in the system
 */
export interface Client {
  id: string;
  name: string;
  nome?: string; // Portuguese version of name
  email?: string;
  phone?: string;
  telefone?: string; // Portuguese version of phone
  ultima_visita?: string;
  last_visit?: string;
  valor_total_gasto?: number;
  total_spent?: number;
  total_agendamentos?: number;
  total_appointments?: number;
  status?: 'active' | 'inactive';
  criado_em?: string;
  created_at?: string;
  cidade?: string;
  city?: string;
  estado?: string;
  state?: string;
  notas?: string;
  notes?: string;
  tenant_id?: string; // Standard field
  business_id?: string; // New field
  id_negocio?: string; // Original field
  gender?: string;
  genero?: string;
  birth_date?: string | Date;
  data_nascimento?: string | Date;
  address?: string;
  endereco?: string;
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
