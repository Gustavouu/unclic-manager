
/**
 * Client data types and interfaces for the application
 */

/**
 * Main Client interface representing a client in the system
 */
export interface Client {
  id: string;
  name: string;
  nome: string; // Portuguese version of name
  email?: string;
  phone?: string;
  telefone?: string; // Portuguese version of phone
  ultima_visita?: string;
  valor_total_gasto?: number;
  total_agendamentos?: number;
  status?: 'active' | 'inactive';
  criado_em?: string;
  cidade?: string;
  estado?: string;
  notas?: string;
  tenant_id?: string; // Standard field
  id_negocio?: string; // Original field
}

/**
 * Data required to create a new client
 */
export interface ClientFormData {
  nome: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
}

/**
 * Search params for finding clients
 */
export interface ClientSearchParams {
  email?: string;
  telefone?: string;
  nome?: string;
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
 * Client list operation result
 */
export interface ClientListResult {
  success: boolean;
  data?: Client[];
  error?: string;
}
