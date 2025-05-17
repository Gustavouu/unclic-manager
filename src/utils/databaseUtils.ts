
import { PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a table exists in the database
 * @param tableName The name of the table to check
 * @returns A boolean indicating whether the table exists
 */
export const tableExists = async (tableName: string): Promise<boolean> => {
  // We're using a simple true for now as a placeholder
  // In a real implementation, you'd want to query the information_schema
  try {
    const { data, error } = await supabase.rpc('table_exists', { table_name: tableName });
    if (error) throw error;
    return data || false;
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err);
    return false;
  }
};

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
 * Transforms a database response to handle both modern and legacy schemas
 * @param data The data to transform
 * @param transformFn The function to transform each item
 * @returns The transformed data
 */
export const transformDatabaseResponse = <T, R>(
  data: T[],
  transformFn: (item: T) => R
): R[] => {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return data.map(transformFn);
};

/**
 * Safely parse JSON string to object
 * @param jsonString The JSON string to parse
 * @param defaultValue The default value to return if parsing fails
 * @returns The parsed object or the default value
 */
export const safeJsonParse = <T>(jsonString: string | object, defaultValue: T): T => {
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
 * Adaptador para normalizar dados de serviços de diferentes tabelas
 * @param service Dados brutos do serviço de qualquer tabela
 * @returns Objeto serviço normalizado
 */
export const normalizeServiceData = (service: any) => {
  // Determina se é formato legado baseado na existência de certos campos
  const isLegacy = 'nome' in service || 'descricao' in service;
  
  // Normaliza os valores
  let price = 0;
  if (typeof service.price === 'string') {
    price = parseFloat(service.price);
  } else if (typeof service.price === 'number') {
    price = service.price;
  } else if (typeof service.preco === 'string') {
    price = parseFloat(service.preco);
  } else if (typeof service.preco === 'number') {
    price = service.preco;
  }
  
  return {
    id: service.id,
    name: service.name || service.nome || '',
    nome: service.nome || service.name || '',
    description: service.description || service.descricao || '',
    descricao: service.descricao || service.description || '',
    price: isNaN(price) ? 0 : price,
    preco: isNaN(price) ? 0 : price,
    duration: service.duration || service.duracao || 30,
    duracao: service.duracao || service.duration || 30,
    categoryId: service.category_id || service.id_categoria || service.categoria_id || null,
    id_categoria: service.id_categoria || service.category_id || service.categoria_id || null,
    isActive: service.is_active !== undefined ? service.is_active : service.ativo !== false,
    ativo: service.ativo !== undefined ? service.ativo : service.is_active !== false,
    image: service.image || service.image_url || service.imagem_url || '',
    imagem_url: service.imagem_url || service.image || service.image_url || '',
    // Campos originais mantidos para compatibilidade
    ...service
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

/**
 * Adaptador para normalizar dados de agendamentos de diferentes tabelas
 * @param appointment Dados brutos do agendamento de qualquer tabela
 * @returns Objeto agendamento normalizado
 */
export const normalizeAppointmentData = (appointment: any) => {
  // Determina se é formato legado baseado na existência de certos campos
  const isLegacy = 'data' in appointment || 'hora_inicio' in appointment;
  
  // Trata o cliente
  let clientName = '';
  if (appointment.clients) {
    clientName = appointment.clients.name || appointment.clients.nome || '';
  } else if (appointment.clientes) {
    clientName = appointment.clientes.nome || '';
  }
  
  // Trata o profissional
  let professionalName = '';
  if (appointment.employees) {
    professionalName = appointment.employees.name || appointment.employees.nome || '';
  } else if (appointment.funcionarios) {
    professionalName = appointment.funcionarios.nome || '';
  }
  
  // Trata o serviço
  let serviceName = '';
  if (appointment.services_v2) {
    serviceName = appointment.services_v2.name || appointment.services_v2.nome || '';
  } else if (appointment.servicos) {
    serviceName = appointment.servicos.nome || '';
  }
  
  // Cria um objeto Date a partir da data e hora
  let dateObj;
  if (isLegacy) {
    const dateStr = appointment.data || '';
    const timeStr = appointment.hora_inicio || '';
    const dateTimeStr = `${dateStr}T${timeStr}`;
    dateObj = new Date(dateTimeStr);
  } else {
    const dateStr = appointment.booking_date || '';
    const timeStr = appointment.start_time || '';
    const dateTimeStr = `${dateStr}T${timeStr}`;
    dateObj = new Date(dateTimeStr);
  }
  
  return {
    id: appointment.id,
    clientId: appointment.client_id || appointment.id_cliente,
    id_cliente: appointment.id_cliente || appointment.client_id,
    clientName,
    serviceId: appointment.service_id || appointment.id_servico,
    id_servico: appointment.id_servico || appointment.service_id,
    serviceName,
    professionalId: appointment.employee_id || appointment.id_funcionario,
    id_funcionario: appointment.id_funcionario || appointment.employee_id,
    professionalName,
    date: dateObj,
    duration: appointment.duration || appointment.duracao || 30,
    duracao: appointment.duracao || appointment.duration || 30,
    price: appointment.price || appointment.valor || 0,
    valor: appointment.valor || appointment.price || 0,
    status: appointment.status || 'scheduled',
    notes: appointment.notes || appointment.observacoes || '',
    observacoes: appointment.observacoes || appointment.notes || '',
    paymentMethod: appointment.payment_method || appointment.forma_pagamento,
    forma_pagamento: appointment.forma_pagamento || appointment.payment_method,
    // Campos originais mantidos para compatibilidade
    ...appointment
  };
};
