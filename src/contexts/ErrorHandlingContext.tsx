
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { GlobalErrorHandler } from '@/services/error/GlobalErrorHandler';
import { PerformanceMonitor } from '@/services/monitoring/PerformanceMonitor';
import { AlertService } from '@/services/monitoring/AlertService';
import { useContextualErrorHandler } from '@/hooks/useContextualErrorHandler';

interface ErrorHandlingContextType {
  errorHandler: GlobalErrorHandler;
  performanceMonitor: PerformanceMonitor;
  alertService: AlertService;
  isInitialized: boolean;
  errorCount: number;
  alertCount: number;
}

const ErrorHandlingContext = createContext<ErrorHandlingContextType | undefined>(undefined);

interface ErrorHandlingProviderProps {
  children: ReactNode;
}

export function ErrorHandlingProvider({ children }: ErrorHandlingProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);

  const errorHandler = GlobalErrorHandler.getInstance();
  const performanceMonitor = PerformanceMonitor.getInstance();
  const alertService = AlertService.getInstance();

  const contextErrorHandler = useContextualErrorHandler('ErrorHandlingProvider');

  useEffect(() => {
    const initializeServices = async () => {
      try {
        console.log('🔧 Initializing error handling services...');

        // Subscribe to alerts to update counter
        const unsubscribeAlerts = alertService.subscribe(() => {
          setAlertCount(alertService.getUnacknowledgedCount());
        });

        // Update error count periodically
        const updateErrorCount = () => {
          const stats = errorHandler.getErrorStats();
          setErrorCount(stats.unresolved);
        };

        updateErrorCount();
        const errorInterval = setInterval(updateErrorCount, 30000); // Update every 30 seconds

        // Initialize performance monitoring
        performanceMonitor.trackMetric('system_startup', Date.now());

        setIsInitialized(true);
        console.log('✅ Error handling services initialized successfully');

        return () => {
          unsubscribeAlerts();
          clearInterval(errorInterval);
        };
      } catch (error) {
        contextErrorHandler.handleError(
          error instanceof Error ? error : new Error(String(error)),
          'critical',
          { customMessage: 'Failed to initialize error handling services' }
        );
      }
    };

    initializeServices();
  }, []);

  const value: ErrorHandlingContextType = {
    errorHandler,
    performanceMonitor,
    alertService,
    isInitialized,
    errorCount,
    alertCount,
  };

  return (
    <ErrorHandlingContext.Provider value={value}>
      {children}
    </ErrorHandlingContext.Provider>
  );
}

export function useErrorHandling() {
  const context = useContext(ErrorHandlingContext);
  if (context === undefined) {
    throw new Error('useErrorHandling must be used within an ErrorHandlingProvider');
  }
  return context;
}
