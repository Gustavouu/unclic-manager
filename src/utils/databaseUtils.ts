import { PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a table exists in the database
 * @param tableName The name of the table to check
 * @returns A boolean indicating whether the table exists
 */
export async function tableExists(tableName: string): Promise<boolean> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1);
  
  return !error;
}

/**
 * Safely extracts data from a Supabase response, handling errors
 * @param response The Supabase response
 * @returns The data from the response, or an empty array if there was an error
 */
export const safeDataExtract = <T>(response: PostgrestResponse<T>): T[] => {
  if (response.error) {
    console.error('Error in database query:', response.error);
    return [];
  }
  return response.data || [];
};

/**
 * Safely extracts a single item from a Supabase response, handling errors
 * @param response The Supabase response
 * @returns The single item from the response, or null if there was an error
 */
export const safeSingleExtract = <T>(response: PostgrestSingleResponse<T>): T | null => {
  if (response.error) {
    console.error('Error in database query:', response.error);
    return null;
  }
  return response.data;
};

/**
 * Safely parse JSON string to object
 * @param jsonString The JSON string to parse
 * @param defaultValue The default value to return if parsing fails
 * @returns The parsed object or the default value
 */
export const safeJsonParse = <T>(jsonString: string | null | undefined | object, defaultValue: T): T => {
  if (!jsonString) return defaultValue;
  
  // If it's already an object, just return it
  if (typeof jsonString !== 'string') {
    return jsonString as unknown as T;
  }
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
};

/**
 * Adaptador para normalizar dados de clientes de diferentes tabelas
 * @param client Dados brutos do cliente de qualquer tabela
 * @returns Objeto cliente normalizado
 */
export const normalizeClientData = (client: any) => {
  // Verificamos quais campos existem no objeto para determinar a origem
  const isLegacy = 'nome' in client || 'telefone' in client;
  
  return {
    id: client.id,
    name: client.name || client.nome || '',
    nome: client.nome || client.name || '',
    email: client.email || '',
    phone: client.phone || client.telefone || '',
    telefone: client.telefone || client.phone || '',
    city: client.city || client.cidade || '',
    cidade: client.cidade || client.city || '',
    state: client.state || client.estado || '',
    estado: client.estado || client.state || '',
    address: client.address || client.endereco || '',
    endereco: client.endereco || client.address || '',
    birthDate: client.birth_date || client.data_nascimento,
    data_nascimento: client.data_nascimento || client.birth_date,
    birth_date: client.birth_date || client.data_nascimento,
    gender: client.gender || client.genero || '',
    genero: client.genero || client.gender || '',
    notes: client.notes || client.notas || '',
    notas: client.notas || client.notes || '',
    status: (client.last_visit || client.ultima_visita) ? 'active' : 'inactive',
    // Campos originais mantidos para compatibilidade
    ...client
  };
};

/**
 * Adaptador para normalizar dados de profissionais de diferentes tabelas
 * @param professional Dados brutos do profissional de qualquer tabela
 * @returns Objeto profissional normalizado
 */
export const normalizeProfessionalData = (professional: any) => {
  // Determina se é formato legado baseado na existência de certos campos
  const isLegacy = 'nome' in professional || 'especializacoes' in professional;
  
  return {
    id: professional.id,
    name: professional.name || professional.nome || '',
    nome: professional.nome || professional.name || '',
    email: professional.email || '',
    phone: professional.phone || professional.telefone || '',
    telefone: professional.telefone || professional.phone || '',
    position: professional.position || professional.cargo || '',
    cargo: professional.cargo || professional.position || '',
    specialties: professional.specialties || professional.especializacoes || [],
    especializacoes: professional.especializacoes || professional.specialties || [],
    bio: professional.bio || '',
    status: professional.status || 'ACTIVE',
    photo_url: professional.photo_url || professional.foto_url || '',
    foto_url: professional.foto_url || professional.photo_url || '',
    // Campos originais mantidos para compatibilidade
    ...professional
  };
};

// Helper function to convert any JSON value to array safely
export const safeJsonArray = (value: any, defaultValue: any[] = []): any[] => {
  if (!value) return defaultValue;
  if (Array.isArray(value)) return value;
  return defaultValue;
};

// Helper function to convert any JSON value to string safely
export const safeJsonString = (value: any, defaultValue: string = ''): string => {
  if (!value) return defaultValue;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return defaultValue;
};

// Helper function to convert any JSON value to number safely
export const safeJsonNumber = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};

export function normalizeServiceData(data: any) {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    duration: data.duration,
    price: data.price,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export function normalizeAppointmentData(data: any) {
  return {
    id: data.id,
    service_id: data.service_id,
    client_id: data.client_id,
    date: data.date,
    status: data.status,
    notes: data.notes,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}
