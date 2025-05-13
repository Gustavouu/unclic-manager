
/**
 * General error handler utility for the application
 */

/**
 * Maps technical error messages to user-friendly messages
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
  
  // Authentication errors
  if (errorMessage.includes('auth/invalid-email')) {
    return 'Email inválido';
  }
  
  if (errorMessage.includes('auth/user-not-found')) {
    return 'Usuário não encontrado';
  }
  
  if (errorMessage.includes('auth/wrong-password')) {
    return 'Senha incorreta';
  }
  
  if (errorMessage.includes('auth/email-already-in-use')) {
    return 'Este email já está sendo usado';
  }
  
  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('connection')) {
    return 'Erro de conexão. Verifique sua internet e tente novamente';
  }
  
  // If we couldn't identify the error, return a generic message
  return 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde';
};

/**
 * Logs detailed error information to the console
 */
export const logError = (context: string, error: any, additionalInfo?: Record<string, any>) => {
  console.group(`Error in ${context}`);
  console.error('Error:', error);
  
  if (error.code) {
    console.error('Error code:', error.code);
  }
  
  if (error.response) {
    console.error('Error response:', error.response);
  }
  
  if (additionalInfo) {
    console.error('Additional information:', additionalInfo);
  }
  
  console.trace('Stack trace:');
  console.groupEnd();
};

/**
 * Processes an error, logs it, and returns a user-friendly message
 */
export const handleError = (context: string, error: any, additionalInfo?: Record<string, any>): string => {
  logError(context, error, additionalInfo);
  return translateErrorMessage(error);
};

/**
 * Client-specific error handler
 */
export const handleClientError = (error: any, operation: string): string => {
  const context = `Client operation: ${operation}`;
  return handleError(context, error);
};
