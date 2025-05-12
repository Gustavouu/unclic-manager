
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

export interface ClientFormData {
  nome: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
}
