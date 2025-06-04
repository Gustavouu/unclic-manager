import { supabase } from '@/integrations/supabase/client';

export const normalizeClientData = (client: any) => {
  return {
    id: client.id,
    name: client.name || client.nome || '',
    email: client.email || '',
    phone: client.phone || client.telefone || '',
    birth_date: client.birth_date || client.data_nascimento || '',
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
    created_at: client.created_at || client.criado_em,
    updated_at: client.updated_at || client.atualizado_em || client.created_at || client.criado_em,
    business_id: client.business_id || client.id_negocio,
    user_id: client.user_id || client.id_usuario,
    preferences: client.preferences || client.preferencias || {}
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
