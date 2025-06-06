import { supabase } from '@/integrations/supabase/client';

export const normalizeClientData = (client: any) => {
  return {
    id: client.id,
    name: client.name || '',
    email: client.email || '',
    phone: client.phone || '',
    birth_date: client.birth_date || '',
    last_visit: client.last_visit,
    total_spent: client.total_spent || 0,
    total_appointments: client.total_appointments || 0,
    city: client.city || '',
    state: client.state || '',
    zip_code: client.zip_code || '',
    avatar: client.avatar || client.image_url || client.url_avatar,
    status: client.status || 'active',
    address: client.address || '',
    gender: client.gender || '',
    notes: client.notes || '',
    created_at: client.created_at,
    updated_at: client.updated_at,
    business_id: client.business_id,
    user_id: client.user_id,
    preferences: client.preferences || {}
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
    bio: professional.bio || '',
    business_id: professional.business_id || professional.id_negocio
  };
};

export const normalizeServiceData = (service: any) => {
  return {
    id: service.id,
    name: service.name || service.nome || '',
    nome: service.name || service.nome || '',
    description: service.description || service.descricao || '',
    descricao: service.description || service.descricao || '',
    price: service.price || service.preco || 0,
    preco: service.price || service.preco || 0,
    duration: service.duration || service.duracao || 60,
    duracao: service.duration || service.duracao || 60,
    category_id: service.category_id || service.categoria_id || service.id_categoria,
    categoria_id: service.category_id || service.categoria_id || service.id_categoria,
    categoryId: service.category_id || service.categoria_id || service.id_categoria,
    is_active: service.is_active !== undefined ? service.is_active : (service.ativo !== undefined ? service.ativo : true),
    ativo: service.is_active !== undefined ? service.is_active : (service.ativo !== undefined ? service.ativo : true),
    isActive: service.is_active !== undefined ? service.is_active : (service.ativo !== undefined ? service.ativo : true),
    image_url: service.image_url || service.imagem_url || '',
    imagem_url: service.image_url || service.imagem_url || ''
  };
};

export const normalizeAppointmentData = (appointment: any) => {
  return {
    id: appointment.id,
    date: new Date(appointment.booking_date || appointment.data || appointment.data_agendamento),
    clientId: appointment.client_id || appointment.id_cliente,
    clientName: appointment.clients?.name || appointment.clientes?.nome || appointment.cliente_nome || 'Cliente',
    serviceId: appointment.service_id || appointment.id_servico,
    serviceName: appointment.services_v2?.name || appointment.servicos?.nome || appointment.service_name || 'Serviço',
    serviceType: appointment.services_v2?.category || appointment.servicos?.categoria || 'Geral',
    professionalId: appointment.employee_id || appointment.id_funcionario,
    professionalName: appointment.employees?.name || appointment.funcionarios?.nome || appointment.professional_name || 'Profissional',
    duration: appointment.duration || appointment.duracao || 60,
    price: appointment.price || appointment.valor || 0,
    status: appointment.status || 'agendado',
    notes: appointment.notes || appointment.observacoes || '',
    paymentMethod: appointment.payment_method || appointment.forma_pagamento,
    confirmed: appointment.status === 'confirmado' || appointment.status === 'confirmed',
    notifications: {
      sendConfirmation: true,
      sendReminder: true
    },
    additionalServices: []
  };
};

export const normalizeBusinessData = (business: any) => {
  return {
    id: business.id,
    name: business.name || business.nome || '',
    slug: business.slug || '',
    admin_email: business.admin_email || business.email_admin || '',
    phone: business.phone || business.telefone || '',
    zip_code: business.zip_code || business.cep || '',
    address: business.address || business.endereco || '',
    address_number: business.address_number || business.numero || '',
    address_complement: business.address_complement || business.complemento || '',
    neighborhood: business.neighborhood || business.bairro || '',
    city: business.city || business.cidade || '',
    state: business.state || business.estado || '',
    logo_url: business.logo_url || business.url_logo || '',
    description: business.description || business.descricao || '',
    ein: business.ein || business.cnpj || '',
    legal_name: business.legal_name || business.razao_social || '',
    trade_name: business.trade_name || business.nome_fantasia || '',
    status: business.status || 'pending',
    subscription_status: business.subscription_status || business.status_assinatura || 'trial',
    timezone: business.timezone || business.fuso_horario || 'America/Sao_Paulo',
    currency: business.currency || business.moeda || 'BRL',
    language: business.language || business.idioma || 'pt-BR',
    latitude: business.latitude || null,
    longitude: business.longitude || null,
    trial_end_date: business.trial_end_date || business.data_fim_teste,
    subscription_end_date: business.subscription_end_date || business.data_fim_assinatura,
    created_at: business.created_at || business.criado_em,
    updated_at: business.updated_at || business.atualizado_em
  };
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return false;
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  if (!phone || phone.trim() === '') return true; // Optional field
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};

export const validateZipCode = (zipCode: string): boolean => {
  if (!zipCode || zipCode.trim() === '') return true; // Optional field
  const cleanZip = zipCode.replace(/[^0-9]/g, '');
  return cleanZip.length === 8;
};

export const normalizeClientInput = (clientData: any) => {
  return {
    ...clientData,
    name: clientData.name?.trim() || '',
    email: clientData.email?.toLowerCase().trim() || '',
    city: clientData.city?.trim() || '',
    state: clientData.state?.toUpperCase().trim() || '',
    phone: clientData.phone?.replace(/[^0-9+\-\(\)\s]/g, '') || '',
    zip_code: clientData.zip_code?.replace(/[^0-9]/g, '') || ''
  };
};

// Data integrity check function
export const checkDataIntegrity = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase.rpc('check_data_integrity');
    
    if (error) {
      console.error('Error checking data integrity:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error calling integrity check function:', error);
    return [];
  }
};

// Error message formatter for validation errors
export const formatValidationError = (error: any): string => {
  if (error?.message) {
    const message = error.message;
    
    // Handle specific validation error messages
    if (message.includes('Email inválido')) {
      return 'Por favor, insira um email válido.';
    }
    if (message.includes('Telefone inválido')) {
      return 'Por favor, insira um telefone válido (10 ou 11 dígitos).';
    }
    if (message.includes('CEP inválido')) {
      return 'Por favor, insira um CEP válido (8 dígitos).';
    }
    if (message.includes('Nome do cliente é obrigatório')) {
      return 'O nome do cliente é obrigatório.';
    }
    if (message.includes('Data de agendamento não pode ser no passado')) {
      return 'A data do agendamento deve ser no futuro.';
    }
    if (message.includes('Horário de início deve ser anterior')) {
      return 'O horário de início deve ser anterior ao horário de fim.';
    }
    if (message.includes('Preço não pode ser negativo')) {
      return 'O preço deve ser um valor positivo.';
    }
    if (message.includes('Duração deve ser positiva')) {
      return 'A duração deve ser maior que zero.';
    }
  }
  
  return 'Erro de validação. Verifique os dados inseridos.';
};

// Legacy functions maintained for compatibility
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

export const safeSingleExtract = (response: any): any | null => {
  try {
    if (response?.data) {
      return response.data;
    }
    if (response?.error) {
      console.error('Database query error:', response.error);
      return null;
    }
    return null;
  } catch (error) {
    console.error('Error extracting single data:', error);
    return null;
  }
};
