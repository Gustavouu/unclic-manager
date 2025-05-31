
import { Client } from '@/types/client';

/**
 * Maps database client record to Client interface
 */
export function mapClientFromDatabase(data: any): Client {
  if (!data) return {} as Client;
  
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    birth_date: data.birth_date,
    last_visit: data.last_visit,
    total_spent: data.total_spent || 0,
    total_appointments: data.total_appointments || 0,
    status: data.status || 'active',
    created_at: data.created_at,
    updated_at: data.updated_at,
    city: data.city,
    state: data.state,
    zip_code: data.zip_code,
    address: data.address,
    gender: data.gender,
    notes: data.notes,
    avatar: data.avatar,
    business_id: data.business_id,
    user_id: data.user_id,
    preferences: data.preferences
  };
}

/**
 * Format a phone number for display
 */
export function formatPhoneNumber(phone: string | undefined): string {
  if (!phone) return '';
  
  // Remove non-numeric characters
  const numbers = phone.replace(/\D/g, '');
  
  // Format as (XX) XXXXX-XXXX
  if (numbers.length === 11) {
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
  }
  
  // Format as (XX) XXXX-XXXX
  if (numbers.length === 10) {
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
  }
  
  return phone;
}

/**
 * Get user-friendly error message from technical error
 */
export function getClientErrorMessage(error: any): string {
  if (!error) return 'Ocorreu um erro inesperado';
  
  const errorMessage = error.message || error.toString();
  
  // Map common error messages to user-friendly versions
  if (errorMessage.includes('duplicate key')) {
    return 'Já existe um cliente com este email ou telefone';
  }
  
  if (errorMessage.includes('column') && errorMessage.includes('does not exist')) {
    return 'Ocorreu um erro no sistema. Por favor, entre em contato com o suporte';
  }
  
  if (errorMessage.includes('not found')) {
    return 'Cliente não encontrado';
  }
  
  return 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente';
}
