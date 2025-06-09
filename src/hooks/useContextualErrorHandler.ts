
import { useCallback } from 'react';
import { ErrorSeverity, ErrorContext } from '@/services/error/ErrorHandlingService';
import { GlobalErrorHandler } from '@/services/error/GlobalErrorHandler';
import { toast } from 'sonner';

interface ContextualErrorOptions {
  showToast?: boolean;
  customMessage?: string;
  retryAction?: () => void;
}

export const useContextualErrorHandler = (component: string) => {
  const errorHandler = GlobalErrorHandler.getInstance();

  const handleError = useCallback((
    error: Error | string,
    severity: ErrorSeverity = 'medium',
    options: ContextualErrorOptions = {}
  ): string => {
    const {
      showToast = true,
      customMessage,
      retryAction
    } = options;

    const context: ErrorContext = {
      component,
      action: 'user_action',
      additionalData: {
        hasRetryAction: !!retryAction,
        customMessage
      }
    };

    const errorId = errorHandler.handleError(error, severity, context);

    if (showToast) {
      const message = customMessage || errorHandler.errorService.getUserFriendlyMessage(error);
      
      if (severity === 'high' || severity === 'critical') {
        toast.error(message, {
          description: retryAction ? 'Clique para tentar novamente' : `Código: ${errorId.slice(-8)}`,
          action: retryAction ? {
            label: 'Tentar novamente',
            onClick: retryAction
          } : undefined,
          duration: 6000,
        });
      } else if (severity === 'medium') {
        toast.warning(message, {
          description: `Código: ${errorId.slice(-8)}`,
          duration: 4000,
        });
      } else {
        toast.info(message, {
          duration: 3000,
        });
      }
    }

    return errorId;
  }, [component, errorHandler]);

  const handleAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string,
    options: ContextualErrorOptions = {}
  ): Promise<T | null> => {
    try {
      return await operation();
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error(String(error)),
        'medium',
        {
          ...options,
          customMessage: options.customMessage || `Erro em ${operationName}`
        }
      );
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncOperation,
    getErrorHistory: () => errorHandler.getErrorHistory(),
    getErrorStats: () => errorHandler.getErrorStats()
  };
};

export const useReportsErrorHandler = () => {
  return useContextualErrorHandler('Reports');
};
