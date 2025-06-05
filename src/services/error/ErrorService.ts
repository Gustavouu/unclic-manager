
import { ErrorHandlingService, ErrorSeverity, ErrorContext } from './ErrorHandlingService';

export class ErrorService {
  private static instance: ErrorService;
  private errorHandlingService: ErrorHandlingService;

  private constructor() {
    this.errorHandlingService = ErrorHandlingService.getInstance();
  }

  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  public handleError(
    error: Error | string,
    severity: ErrorSeverity = 'medium',
    context: ErrorContext = {}
  ): string {
    return this.errorHandlingService.handleError(error, severity, context);
  }

  public handleApiError(error: any, endpoint: string, operation: string = 'unknown'): string {
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

  public getUserFriendlyMessage(error: any): string {
    return this.errorHandlingService.getUserFriendlyMessage(error);
  }

  public getErrorHistory(limit?: number) {
    return this.errorHandlingService.getErrorHistory(limit);
  }

  public getErrorStats() {
    return this.errorHandlingService.getErrorStats();
  }
}
