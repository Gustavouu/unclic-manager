
import { supabase } from '@/integrations/supabase/client';

export const normalizeClientData = (client: any) => {
  return {
    id: client.id,
    name: client.name || client.nome || '',
    email: client.email || '',
    phone: client.phone || client.telefone || '',
    birth_date: client.birth_date || client.data_nascimento,
    last_visit: client.last_visit || client.ultima_visita,
    total_spent: client.total_spent || client.valor_total_gasto || 0,
    total_appointments: client.total_appointments || client.total_agendamentos || 0,
    city: client.city || client.cidade || '',
    state: client.state || client.estado || '',
    zip_code: client.zip_code || client.cep || '',
    avatar: client.avatar || client.image_url || client.url_avatar,
    status: client.status || 'active',
    address: client.address || client.endereco || '',
    gender: client.gender || client.genero || '',
    notes: client.notes || client.notas || '',
    created_at: client.created_at || client.criado_em
  };
};

export const normalizeProfessionalData = (professional: any) => {
  return {
    id: professional.id,
    name: professional.name || professional.nome || '',
    email: professional.email || '',
    phone: professional.phone || professional.telefone || '',
    photo_url: professional.photo_url || professional.foto_url,
    position: professional.position || professional.cargo || '',
    specialties: professional.specialties || professional.especializacoes || [],
    status: professional.status || 'active',
    commission_percentage: professional.commission_percentage || professional.comissao_percentual || 0,
    hire_date: professional.hire_date || professional.data_contratacao,
    bio: professional.bio || ''
  };
};

export const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName as any)
      .select('*')
      .limit(1);
    
    return !error;
  } catch {
    return false;
  }
};

export const safeJsonObject = (obj: any, defaultValue: any = {}): any => {
  try {
    if (!obj) return defaultValue;
    if (typeof obj === 'object' && obj !== null) {
      return obj;
    }
    if (typeof obj === 'string') {
      return JSON.parse(obj);
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
};

export const safeJsonArray = (arr: any, defaultValue: any[] = []): any[] => {
  try {
    if (Array.isArray(arr)) {
      return arr;
    }
    if (arr && typeof arr === 'object') {
      return [arr];
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
};

export const safeJsonNumber = (value: any, defaultValue: number = 0): number => {
  try {
    const num = typeof value === 'number' ? value : parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  } catch {
    return defaultValue;
  }
};

export const safeJsonParse = (jsonString: any, defaultValue: any = null): any => {
  try {
    if (typeof jsonString === 'string') {
      return JSON.parse(jsonString);
    }
    return jsonString || defaultValue;
  } catch {
    return defaultValue;
  }
};

export const safeDataExtract = (response: any): any[] => {
  try {
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }
    if (response?.error) {
      console.error('Database query error:', response.error);
      return [];
    }
    return [];
  } catch (error) {
    console.error('Error extracting data:', error);
    return [];
  }
};
