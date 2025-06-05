
import { useCallback } from 'react';
import { GlobalErrorHandler } from '@/services/error/GlobalErrorHandler';
import { ErrorSeverity, ErrorContext } from '@/services/error/ErrorHandlingService';
import { toast } from 'sonner';

interface ContextualErrorOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  reportToService?: boolean;
  customMessage?: string;
}

export const useContextualErrorHandler = (context: string) => {
  const errorHandler = GlobalErrorHandler.getInstance();

  const handleError = useCallback((
    error: Error | string,
    severity: ErrorSeverity = 'medium',
    options: ContextualErrorOptions = {}
  ) => {
    const {
      showToast = true,
      logToConsole = true,
      reportToService = true,
      customMessage
    } = options;

    const errorContext: ErrorContext = {
      component: context,
      action: 'contextual_error',
      additionalData: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    };

    let errorId = '';
    
    if (reportToService) {
      errorId = errorHandler.handleError(error, severity, errorContext);
    }

    if (logToConsole) {
      console.group(`🚨 Error in ${context}`);
      console.error('Error:', error);
      console.error('Severity:', severity);
      console.error('Context:', errorContext);
      if (errorId) console.error('Error ID:', errorId);
      console.groupEnd();
    }

    if (showToast) {
      const message = customMessage || errorHandler.errorService.getUserFriendlyMessage(error);
      
      if (severity === 'high' || severity === 'critical') {
        toast.error(message, {
          description: errorId ? `Código: ${errorId.slice(-8)}` : undefined,
          duration: 6000,
        });
      } else if (severity === 'medium') {
        toast.error(message, {
          duration: 4000,
        });
      } else {
        toast.warning(message, {
          duration: 3000,
        });
      }
    }

    return errorId;
  }, [context, errorHandler]);

  const handleApiError = useCallback((
    error: any,
    endpoint: string,
    operation: string = 'unknown',
    options: ContextualErrorOptions = {}
  ) => {
    return errorHandler.handleApiError(error, endpoint, operation);
  }, [errorHandler]);

  const handleFormError = useCallback((
    error: any,
    formName: string,
    fieldName?: string,
    options: ContextualErrorOptions = {}
  ) => {
    return errorHandler.handleFormError(error, formName, fieldName);
  }, [errorHandler]);

  const handleDatabaseError = useCallback((
    error: any,
    table: string,
    operation: string,
    options: ContextualErrorOptions = {}
  ) => {
    return errorHandler.handleDatabaseError(error, table, operation);
  }, [errorHandler]);

  const retryOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000,
    onRetry?: (attempt: number) => void
  ): Promise<T> => {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          if (onRetry) onRetry(attempt);
          
          await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    handleError(lastError, 'high', {
      customMessage: `Operação falhou após ${maxRetries} tentativas`
    });
    
    throw lastError;
  }, [handleError]);

  return {
    handleError,
    handleApiError,
    handleFormError,
    handleDatabaseError,
    retryOperation,
    getErrorHistory: () => errorHandler.getErrorHistory(),
    getErrorStats: () => errorHandler.getErrorStats()
  };
};

// Hook específico para cada contexto
export const useClientErrorHandler = () => useContextualErrorHandler('Client');
export const useServiceErrorHandler = () => useContextualErrorHandler('Service');
export const useAppointmentErrorHandler = () => useContextualErrorHandler('Appointment');
export const useProfessionalErrorHandler = () => useContextualErrorHandler('Professional');
export const useInventoryErrorHandler = () => useContextualErrorHandler('Inventory');
export const useReportsErrorHandler = () => useContextualErrorHandler('Reports');
export const usePaymentErrorHandler = () => useContextualErrorHandler('Payment');
