import { ErrorService } from './ErrorService';
import { ErrorSeverity, ErrorContext } from './ErrorHandlingService';
import { toast } from 'sonner';

export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorService: ErrorService;
  private isProduction: boolean;

  private constructor() {
    this.errorService = ErrorService.getInstance();
    this.isProduction = import.meta.env.PROD;
    this.setupGlobalHandlers();
  }

  public static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  private setupGlobalHandlers(): void {
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'high', {
        component: 'Global',
        action: 'unhandled_error',
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'high', {
        component: 'Global',
        action: 'unhandled_promise_rejection'
      });
    });

    if (!this.isProduction) {
      console.log('🛡️ Global Error Handler initialized');
    }
  }

  public handleError(
    error: Error | string,
    severity: ErrorSeverity = 'medium',
    context: ErrorContext = {}
  ): string {
    const errorId = this.errorService.handleError(error, severity, context);
    
    if (severity === 'high' || severity === 'critical') {
      const userMessage = this.errorService.getUserFriendlyMessage(error);
      toast.error(userMessage, {
        description: `Código do erro: ${errorId.slice(-8)}`,
        duration: 6000,
      });
    }

    if (this.isProduction && severity === 'critical') {
      this.reportToMonitoringService(error, errorId, context);
    }

    return errorId;
  }

  public handleApiError(
    error: any,
    endpoint: string,
    operation: string = 'unknown'
  ): string {
    const context: ErrorContext = {
      component: 'API',
      action: operation,
      additionalData: {
        endpoint,
        status: error.status,
        statusText: error.statusText,
        response: error.response
      }
    };

    let severity: ErrorSeverity = 'medium';
    
    if (error.status >= 500) {
      severity = 'high';
    } else if (error.status === 401 || error.status === 403) {
      severity = 'medium';
    } else if (error.status >= 400) {
      severity = 'low';
    }

    return this.handleError(error, severity, context);
  }

  public handleFormError(
    error: any,
    formName: string,
    fieldName?: string
  ): string {
    const context: ErrorContext = {
      component: 'Form',
      action: 'validation_error',
      additionalData: {
        formName,
        fieldName
      }
    };

    return this.handleError(error, 'low', context);
  }

  public handleDatabaseError(
    error: any,
    table: string,
    operation: string
  ): string {
    const context: ErrorContext = {
      component: 'Database',
      action: operation,
      additionalData: {
        table,
        code: error.code,
        details: error.details
      }
    };

    // Erros de banco são geralmente de alta severidade
    const severity: ErrorSeverity = error.code?.startsWith('23') ? 'medium' : 'high';
    
    return this.handleError(error, severity, context);
  }

  public async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000,
    context: ErrorContext = {}
  ): Promise<T> {
    return this.errorService.retryOperation(operation, maxRetries, delayMs);
  }

  private reportToMonitoringService(
    error: Error | string,
    errorId: string,
    context: ErrorContext
  ): void {
    const errorData = {
      errorId,
      message: typeof error === 'string' ? error : error.message,
      stack: error instanceof Error ? error.stack : undefined,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('🚨 Critical Error Reported to Monitoring:', errorData);
  }

  public getErrorHistory(limit?: number) {
    return this.errorService.getErrorHistory(limit);
  }

  public getErrorStats() {
    return this.errorService.getErrorStats();
  }

  public markErrorAsResolved(errorId: string): boolean {
    return this.errorService.markErrorAsResolved(errorId);
  }

  public clearOldErrors(olderThanDays: number = 7): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    console.log(`Clearing errors older than ${olderThanDays} days`);
  }
}

export const useErrorHandler = () => {
  const errorHandler = GlobalErrorHandler.getInstance();

  const handleError = (
    error: Error | string,
    severity: ErrorSeverity = 'medium',
    context: ErrorContext = {}
  ) => {
    return errorHandler.handleError(error, severity, context);
  };

  const handleApiError = (error: any, endpoint: string, operation?: string) => {
    return errorHandler.errorService.handleApiError(error, endpoint, operation);
  };

  return {
    handleError,
    handleApiError,
    getErrorHistory: () => errorHandler.errorService.getErrorHistory(),
    getErrorStats: () => errorHandler.errorService.getErrorStats()
  };
};

export const initializeGlobalErrorHandler = () => {
  GlobalErrorHandler.getInstance();
};
