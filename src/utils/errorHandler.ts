
/**
 * General error handler utility for the application with Portuguese translations
 */

/**
 * Maps technical error messages to user-friendly Portuguese messages
 */
export const translateErrorMessage = (error: any): string => {
  if (!error) return 'Ocorreu um erro inesperado';
  
  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || error.toString();
  
  // Database errors
  if (errorMessage.includes('duplicate key')) {
    return 'Este registro já existe no sistema';
  }
  
  if (errorMessage.includes('column') && errorMessage.includes('does not exist')) {
    return 'Erro interno do sistema. Entre em contato com o suporte técnico';
  }
  
  if (errorMessage.includes('violates row-level security')) {
    return 'Você não tem permissão para acessar este recurso';
  }
  
  if (errorMessage.includes('permission denied')) {
    return 'Permissão negada para esta operação';
  }
  
  if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
    return 'Recurso não encontrado no sistema';
  }
  
  // Authentication errors
  if (errorMessage.includes('Invalid login credentials')) {
    return 'Email ou senha incorretos';
  }
  
  if (errorMessage.includes('Email not confirmed')) {
    return 'Email não confirmado. Verifique sua caixa de entrada';
  }
  
  if (errorMessage.includes('User already registered')) {
    return 'Este email já está em uso';
  }
  
  if (errorMessage.includes('Password should be at least')) {
    return 'A senha deve ter pelo menos 6 caracteres';
  }
  
  if (errorMessage.includes('invalid format')) {
    return 'Formato de email inválido';
  }
  
  if (errorMessage.includes('rate limit')) {
    return 'Muitas tentativas. Aguarde um momento antes de tentar novamente';
  }
  
  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('fetch')) {
    return 'Erro de conexão. Verifique sua internet e tente novamente';
  }
  
  if (errorMessage.includes('timeout')) {
    return 'Operação demorou mais que o esperado. Tente novamente';
  }
  
  // HTTP status errors
  if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
    return 'Sessão expirada. Faça login novamente';
  }
  
  if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
    return 'Você não tem permissão para realizar esta ação';
  }
  
  if (errorMessage.includes('404') || errorMessage.includes('not found')) {
    return 'Recurso não encontrado';
  }
  
  if (errorMessage.includes('500') || errorMessage.includes('internal server')) {
    return 'Erro interno do servidor. Nossa equipe foi notificada';
  }
  
  // Validation errors
  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return 'Dados inválidos. Verifique as informações e tente novamente';
  }
  
  if (errorMessage.includes('required')) {
    return 'Campos obrigatórios não preenchidos';
  }
  
  // Business logic errors
  if (errorMessage.includes('insufficient')) {
    return 'Recursos insuficientes para completar a operação';
  }
  
  if (errorMessage.includes('conflict')) {
    return 'Conflito detectado. Verifique os dados e tente novamente';
  }
  
  // If we couldn't identify the error, return a generic message
  return 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde';
};

/**
 * Logs detailed error information to the console
 */
export const logError = (context: string, error: any, additionalInfo?: Record<string, any>) => {
  console.group(`Erro em ${context}`);
  console.error('Erro:', error);
  
  if (error.code) {
    console.error('Código do erro:', error.code);
  }
  
  if (error.response) {
    console.error('Resposta do erro:', error.response);
  }
  
  if (additionalInfo) {
    console.error('Informações adicionais:', additionalInfo);
  }
  
  console.trace('Stack trace:');
  console.groupEnd();
};

/**
 * Processes an error, logs it, and returns a user-friendly Portuguese message
 */
export const handleError = (context: string, error: any, additionalInfo?: Record<string, any>): string => {
  logError(context, error, additionalInfo);
  return translateErrorMessage(error);
};

/**
 * Client-specific error handler
 */
export const handleClientError = (error: any, operation: string): string => {
  const context = `Operação de cliente: ${operation}`;
  return handleError(context, error);
};

/**
 * Authentication-specific error handler
 */
export const handleAuthError = (error: any, operation: string): string => {
  const context = `Operação de autenticação: ${operation}`;
  return handleError(context, error);
};

/**
 * Business-specific error handler
 */
export const handleBusinessError = (error: any, operation: string): string => {
  const context = `Operação de negócio: ${operation}`;
  return handleError(context, error);
};

/**
 * Generic API error handler
 */
export const handleApiError = (error: any, endpoint: string, operation: string = 'unknown'): string => {
  const context = `API ${endpoint} - ${operation}`;
  return handleError(context, error);
};

/**
 * Get error message using Supabase function (if available)
 */
export const getSupabaseErrorMessage = async (errorCode: string, defaultMessage?: string): Promise<string> => {
  try {
    const { data } = await supabase.rpc('get_error_message', {
      error_code: errorCode,
      default_message: defaultMessage || 'Erro interno'
    });
    return data || defaultMessage || 'Erro interno';
  } catch (error) {
    console.error('Error fetching Supabase error message:', error);
    return defaultMessage || 'Erro interno';
  }
};
