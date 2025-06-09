
import { AuthError } from '@supabase/supabase-js';

export const translateErrorMessage = (error: string | AuthError): string => {
  let errorMessage: string;
  
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = error.message;
  } else {
    errorMessage = String(error);
  }

  const translations: Record<string, string> = {
    'Invalid email or password': 'Email ou senha inválidos',
    'User already registered': 'Usuário já cadastrado',
    'Email not confirmed': 'Email não confirmado',
    'Too many requests': 'Muitas tentativas. Tente novamente mais tarde',
    'Network error': 'Erro de conexão. Verifique sua internet',
    'Invalid credentials': 'Credenciais inválidas',
    'User not found': 'Usuário não encontrado',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'Email rate limit exceeded': 'Limite de emails excedido. Tente novamente mais tarde',
    'Failed to fetch': 'Erro de conexão. Verifique sua internet'
  };

  // Check for partial matches in error message
  for (const [key, value] of Object.entries(translations)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return errorMessage || 'Erro desconhecido. Tente novamente.';
};
