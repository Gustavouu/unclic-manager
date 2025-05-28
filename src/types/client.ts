
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
  // Legacy Portuguese fields for backward compatibility
  nome?: string;
  telefone?: string;
  data_nascimento?: string;
  ultima_visita?: string;
  valor_total_gasto?: number;
  total_agendamentos?: number;
  cidade?: string;
  estado?: string;
  cep?: string;
  image_url?: string;
  url_avatar?: string;
}
