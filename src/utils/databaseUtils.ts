
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
    name: professional.name || '',
    email: professional.email || '',
    phone: professional.phone || '',
    photo_url: professional.photo_url || professional.avatar_url,
    position: professional.position || '',
    specialties: professional.specialties || [],
    status: professional.status || 'active',
    commission_percentage: professional.commission_percentage || 0,
    hire_date: professional.hire_date,
    bio: professional.bio || '',
    business_id: professional.business_id
  };
};

export const normalizeServiceData = (service: any) => {
  return {
    id: service.id,
    name: service.name || '',
    description: service.description || '',
    price: service.price || 0,
    duration: service.duration || 60,
    category_id: service.category_id,
    is_active: service.is_active !== undefined ? service.is_active : true,
    image_url: service.image_url || ''
  };
};

export const normalizeAppointmentData = (appointment: any) => {
  return {
    id: appointment.id,
    date: new Date(appointment.booking_date),
    clientId: appointment.client_id,
    clientName: appointment.clients?.name || 'Cliente',
    serviceId: appointment.service_id,
    serviceName: appointment.services?.name || 'Serviço',
    serviceType: appointment.services?.category || 'Geral',
    professionalId: appointment.employee_id,
    professionalName: appointment.professionals?.name || 'Profissional',
    duration: appointment.duration || 60,
    price: appointment.price || 0,
    status: appointment.status || 'scheduled',
    notes: appointment.notes || '',
    paymentMethod: appointment.payment_method,
    confirmed: appointment.status === 'confirmed',
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
    name: business.name || '',
    slug: business.slug || '',
    admin_email: business.admin_email || '',
    phone: business.phone || '',
    zip_code: business.zip_code || '',
    address: business.address || '',
    address_number: business.address_number || '',
    address_complement: business.address_complement || '',
    neighborhood: business.neighborhood || '',
    city: business.city || '',
    state: business.state || '',
    logo_url: business.logo_url || '',
    description: business.description || '',
    ein: business.ein || '',
    legal_name: business.legal_name || '',
    trade_name: business.trade_name || '',
    status: business.status || 'pending',
    subscription_status: business.subscription_status || 'trial',
    timezone: business.timezone || 'America/Sao_Paulo',
    currency: business.currency || 'BRL',
    language: business.language || 'pt-BR',
    latitude: business.latitude || null,
    longitude: business.longitude || null,
    trial_end_date: business.trial_end_date,
    subscription_end_date: business.subscription_end_date,
    created_at: business.created_at,
    updated_at: business.updated_at
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

// Data integrity check function - updated to work with new tables
export const checkDataIntegrity = async (): Promise<any[]> => {
  try {
    const results = [];
    
    // Check clients with invalid emails
    const { data: clientsWithInvalidEmails, error: emailError } = await supabase
      .from('clients')
      .select('id, email')
      .not('email', 'is', null)
      .neq('email', '');
    
    if (!emailError && clientsWithInvalidEmails) {
      const invalidEmails = clientsWithInvalidEmails.filter(client => 
        !validateEmail(client.email)
      );
      
      if (invalidEmails.length > 0) {
        results.push({
          table_name: 'clients',
          issue_type: 'invalid_email',
          issue_count: invalidEmails.length,
          description: 'Clientes com emails inválidos'
        });
      }
    }
    
    // Check appointments with time inconsistencies
    const { data: appointments, error: appointmentError } = await supabase
      .from('Appointments')
      .select('id, start_time, end_time')
      .gte('start_time', 'end_time');
    
    if (!appointmentError && appointments && appointments.length > 0) {
      results.push({
        table_name: 'Appointments',
        issue_type: 'invalid_time',
        issue_count: appointments.length,
        description: 'Agendamentos com horários inconsistentes'
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error checking data integrity:', error);
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

// Simplified table existence check
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
