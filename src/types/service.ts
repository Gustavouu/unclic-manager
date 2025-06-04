
export interface Service {
  id: string;
  id_negocio: string;
  nome: string;
  descricao?: string;
  duracao: number;
  preco: number;
  categoria: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  // English aliases for compatibility
  business_id?: string;
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  category?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
}

export interface ServiceCreate extends ServiceFormData {
  business_id: string;
}

export interface ServiceUpdate extends Partial<ServiceFormData> {}
