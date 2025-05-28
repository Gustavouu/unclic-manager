
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
    status: client.status || 'active'
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

export const safeJsonObject = (obj: any): any => {
  try {
    return obj ? JSON.parse(JSON.stringify(obj)) : {};
  } catch {
    return {};
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
