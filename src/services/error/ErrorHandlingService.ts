
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  businessId?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorReport {
  id: string;
  message: string;
  severity: ErrorSeverity;
  context: ErrorContext;
  stackTrace?: string;
  timestamp: Date;
  resolved: boolean;
}

export class ErrorHandlingService {
  private static instance: ErrorHandlingService;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 100;

  public static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  public handleError(
    error: Error | string,
    severity: ErrorSeverity = 'medium',
    context: ErrorContext = {}
  ): string {
    const errorId = this.generateErrorId();
    const message = typeof error === 'string' ? error : error.message;
    const stackTrace = error instanceof Error ? error.stack : undefined;

    const errorReport: ErrorReport = {
      id: errorId,
      message,
      severity,
      context,
      stackTrace,
      timestamp: new Date(),
      resolved: false
    };

    this.addToQueue(errorReport);
    this.logError(errorReport);

    // Para erros críticos, também enviamos para um serviço de monitoramento
    if (severity === 'critical') {
      this.reportCriticalError(errorReport);
    }

    return errorId;
  }

  public getUserFriendlyMessage(error: Error | string): string {
    const message = typeof error === 'string' ? error : error.message;

    // Mapeamento de erros técnicos para mensagens amigáveis
    const errorMappings = [
      {
        pattern: /network|connection|fetch/i,
        message: 'Erro de conexão. Verifique sua internet e tente novamente.'
      },
      {
        pattern: /unauthorized|401/i,
        message: 'Sessão expirada. Faça login novamente.'
      },
      {
        pattern: /forbidden|403/i,
        message: 'Você não tem permissão para realizar esta ação.'
      },
      {
        pattern: /not found|404/i,
        message: 'Recurso não encontrado.'
      },
      {
        pattern: /timeout/i,
        message: 'Operação demorou mais que o esperado. Tente novamente.'
      },
      {
        pattern: /validation|invalid/i,
        message: 'Dados inválidos. Verifique as informações e tente novamente.'
      },
      {
        pattern: /duplicate|already exists/i,
        message: 'Este registro já existe no sistema.'
      },
      {
        pattern: /database|sql/i,
        message: 'Erro interno do sistema. Nossa equipe foi notificada.'
      }
    ];

    for (const mapping of errorMappings) {
      if (mapping.pattern.test(message)) {
        return mapping.message;
      }
    }

    // Mensagem genérica para erros não mapeados
    return 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.';
  }

  public async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) {
          break;
        }

        // Delay exponencial entre tentativas
        await this.delay(delayMs * Math.pow(2, attempt - 1));
      }
    }

    throw lastError!;
  }

  public getErrorHistory(limit: number = 50): ErrorReport[] {
    return this.errorQueue
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public markErrorAsResolved(errorId: string): boolean {
    const error = this.errorQueue.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
      return true;
    }
    return false;
  }

  public getErrorStats(): {
    total: number;
    bySevertiy: Record<ErrorSeverity, number>;
    resolved: number;
    unresolved: number;
  } {
    const stats = {
      total: this.errorQueue.length,
      bySevertiy: { low: 0, medium: 0, high: 0, critical: 0 } as Record<ErrorSeverity, number>,
      resolved: 0,
      unresolved: 0
    };

    this.errorQueue.forEach(error => {
      stats.bySevertiy[error.severity]++;
      if (error.resolved) {
        stats.resolved++;
      } else {
        stats.unresolved++;
      }
    });

    return stats;
  }

  private generateErrorId(): string {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private addToQueue(error: ErrorReport): void {
    this.errorQueue.push(error);
    
    // Manter o tamanho da fila controlado
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }
  }

  private logError(error: ErrorReport): void {
    const logLevel = this.getLogLevel(error.severity);
    
    console[logLevel](`[${error.severity.toUpperCase()}] ${error.message}`, {
      errorId: error.id,
      context: error.context,
      timestamp: error.timestamp,
      stackTrace: error.stackTrace
    });
  }

  private getLogLevel(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
    switch (severity) {
      case 'low':
        return 'log';
      case 'medium':
        return 'warn';
      case 'high':
      case 'critical':
        return 'error';
      default:
        return 'warn';
    }
  }

  private reportCriticalError(error: ErrorReport): void {
    // Em um ambiente real, isso enviaria para um serviço como Sentry, Bugsnag, etc.
    console.error('CRITICAL ERROR REPORTED:', {
      id: error.id,
      message: error.message,
      context: error.context,
      stackTrace: error.stackTrace,
      timestamp: error.timestamp
    });

    // Poderia também enviar um email ou notificação para a equipe
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Hook para usar o serviço de erros nos componentes React
export const useErrorHandler = () => {
  const errorService = ErrorHandlingService.getInstance();

  const handleError = (
    error: Error | string,
    severity: ErrorSeverity = 'medium',
    context: ErrorContext = {}
  ) => {
    return errorService.handleError(error, severity, context);
  };

  const getUserFriendlyMessage = (error: Error | string) => {
    return errorService.getUserFriendlyMessage(error);
  };

  const retryOperation = <T>(
    operation: () => Promise<T>,
    maxRetries?: number,
    delayMs?: number
  ) => {
    return errorService.retryOperation(operation, maxRetries, delayMs);
  };

  return {
    handleError,
    getUserFriendlyMessage,
    retryOperation,
    getErrorHistory: () => errorService.getErrorHistory(),
    getErrorStats: () => errorService.getErrorStats()
  };
};
