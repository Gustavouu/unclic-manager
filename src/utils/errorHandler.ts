/**
 * Enhanced error handler utility for the application
 */
import { toast } from 'sonner';

/**
 * Error types for better categorization
 */
export enum ErrorType {
  // Backend errors
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NETWORK = 'network',
  
  // Frontend errors
  RENDERING = 'rendering',
  STATE = 'state',
  
  // General errors
  TIMEOUT = 'timeout',
  UNEXPECTED = 'unexpected'
}

/**
 * Error structure for consistent error handling
 */
export interface AppError {
  type: ErrorType;
  code?: string;
  message: string;
  originalError?: any;
  details?: Record<string, any>;
}

/**
 * Maps technical error messages to user-friendly messages
 */
export const translateErrorMessage = (error: any): string => {
  if (!error) return 'Ocorreu um erro inesperado';
  
  // If it's already our AppError type, use the message directly
  if (error.type && error.message) {
    return error.message;
  }
  
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
  
  if (errorMessage.includes('violates foreign key constraint')) {
    return 'Este registro está relacionado a outros dados e não pode ser modificado';
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
  
  if (errorMessage.includes('timeout')) {
    return 'A operação demorou muito tempo. Tente novamente mais tarde';
  }
  
  // If we couldn't identify the error, return a generic message
  return 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde';
};

/**
 * Extracts the most likely error type from an error
 */
export const getErrorType = (error: any): ErrorType => {
  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || error.toString();
  
  if (errorMessage.includes('network') || errorMessage.includes('connection')) {
    return ErrorType.NETWORK;
  }
  
  if (errorMessage.includes('auth/') || errorMessage.includes('authentication')) {
    return ErrorType.AUTHENTICATION;
  }
  
  if (errorMessage.includes('permission') || errorMessage.includes('authorization')) {
    return ErrorType.AUTHORIZATION;
  }
  
  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return ErrorType.VALIDATION;
  }
  
  if (
    errorMessage.includes('database') || 
    errorMessage.includes('query') || 
    errorMessage.includes('column') || 
    errorMessage.includes('constraint')
  ) {
    return ErrorType.DATABASE;
  }
  
  if (errorMessage.includes('timeout')) {
    return ErrorType.TIMEOUT;
  }
  
  if (errorMessage.includes('rendering') || errorMessage.includes('component')) {
    return ErrorType.RENDERING;
  }
  
  return ErrorType.UNEXPECTED;
};

/**
 * Creates a structured error object
 */
export const createAppError = (error: any, context?: string): AppError => {
  const type = getErrorType(error);
  const message = translateErrorMessage(error);
  
  return {
    type,
    message,
    originalError: error,
    details: context ? { context } : undefined,
    code: error.code
  };
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
export const handleError = (context: string, error: any, showToast: boolean = true): AppError => {
  const appError = createAppError(error, context);
  
  logError(context, error, {
    type: appError.type,
    context
  });
  
  if (showToast) {
    toast.error(appError.message);
  }
  
  return appError;
};

/**
 * Client-specific error handler
 */
export const handleClientError = (error: any, operation: string): AppError => {
  const context = `Client operation: ${operation}`;
  return handleError(context, error);
};

/**
 * Handles errors in async operations with retry capability
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string,
  options: {
    retries?: number;
    showToast?: boolean;
  } = {}
): Promise<T> {
  const { retries = 0, showToast = true } = options;
  let attempts = 0;
  
  while (attempts <= retries) {
    try {
      return await operation();
    } catch (error) {
      attempts++;
      
      // If this was our last attempt, handle the error
      if (attempts > retries) {
        handleError(context, error, showToast);
        throw error;
      }
      
      // Otherwise wait before retrying (exponential backoff)
      const delayMs = 1000 * Math.pow(2, attempts - 1);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  // This should never happen due to the throw in the catch block
  throw new Error('Unexpected error in withErrorHandling');
}
