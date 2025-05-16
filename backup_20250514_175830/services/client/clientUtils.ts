
/**
 * Utility functions for client data
 */
import { Client } from '@/types/client';

/**
 * Maps database client record to Client interface
 */
export function mapClientFromDatabase(data: any): Client {
  if (!data) return {} as Client;
  
  return {
    id: data.id,
    name: data.nome,
    nome: data.nome,
    email: data.email,
    phone: data.telefone,
    telefone: data.telefone,
    ultima_visita: data.ultima_visita,
    valor_total_gasto: data.valor_total_gasto || 0,
    total_agendamentos: data.total_agendamentos || 0,
    status: data.status || 'active',
    criado_em: data.criado_em,
    cidade: data.cidade,
    estado: data.estado,
    notas: data.notas,
    tenant_id: data.tenant_id,
    id_negocio: data.id_negocio
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
