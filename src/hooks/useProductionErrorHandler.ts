
import { useCallback } from 'react';
import { useContextualErrorHandler } from './useContextualErrorHandler';
import { useErrorHandling } from '@/contexts/ErrorHandlingContext';
import { ErrorSeverity } from '@/services/error/ErrorHandlingService';

interface ProductionErrorOptions {
  trackPerformance?: boolean;
  createAlert?: boolean;
  notifyUser?: boolean;
  retryCount?: number;
}

export const useProductionErrorHandler = (component: string) => {
  const contextualHandler = useContextualErrorHandler(component);
  const { performanceMonitor, alertService } = useErrorHandling();

  const handleProductionError = useCallback(async (
    error: Error | string,
    operation: string,
    severity: ErrorSeverity = 'medium',
    options: ProductionErrorOptions = {}
  ) => {
    const {
      trackPerformance = true,
      createAlert = true,
      notifyUser = true,
      retryCount = 0
    } = options;

    const startTime = performance.now();
    let errorId: string;

    try {
      // Handle the error with contextual handler
      errorId = contextualHandler.handleError(error, severity, {
        showToast: notifyUser,
        customMessage: `Erro em ${operation}${retryCount > 0 ? ` (tentativa ${retryCount})` : ''}`
      });

      // Track performance impact
      if (trackPerformance) {
        const duration = performance.now() - startTime;
        performanceMonitor.trackMetric(`error_handling_duration_${component}`, duration);
        performanceMonitor.trackMetric(`error_count_${component}`, 1);
      }

      // Create alert for high severity errors
      if (createAlert && (severity === 'high' || severity === 'critical')) {
        alertService.checkMetric('error_rate', 1);
      }

      return errorId;
    } catch (handlingError) {
      console.error('Error in production error handler:', handlingError);
      return '';
    }
  }, [component, contextualHandler, performanceMonitor, alertService]);

  const handleAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string,
    options: ProductionErrorOptions = {}
  ): Promise<T | null> => {
    const { retryCount = 0 } = options;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const startTime = performance.now();
        const result = await operation();
        
        // Track successful operation
        const duration = performance.now() - startTime;
        performanceMonitor.trackMetric(`${operationName}_duration`, duration);
        performanceMonitor.trackMetric(`${operationName}_success`, 1);
        
        return result;
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        const severity: ErrorSeverity = isLastAttempt ? 'high' : 'medium';
        
        await handleProductionError(
          error instanceof Error ? error : new Error(String(error)),
          operationName,
          severity,
          { ...options, retryCount: attempt }
        );

        if (isLastAttempt) {
          return null;
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    return null;
  }, [handleProductionError, performanceMonitor]);

  const trackUserAction = useCallback((action: string, metadata?: Record<string, any>) => {
    try {
      performanceMonitor.trackMetric(`user_action_${action}`, 1, metadata);
    } catch (error) {
      console.error('Error tracking user action:', error);
    }
  }, [performanceMonitor]);

  return {
    handleProductionError,
    handleAsyncOperation,
    trackUserAction,
    getErrorHistory: () => contextualHandler.getErrorHistory(),
    getErrorStats: () => contextualHandler.getErrorStats()
  };
};
