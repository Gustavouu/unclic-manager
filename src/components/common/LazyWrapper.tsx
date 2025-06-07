
import React, { Suspense, lazy, ComponentType } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useProductionErrorHandler } from '@/hooks/useProductionErrorHandler';

interface LazyWrapperProps {
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  fallback = <LoadingSpinner />,
  errorFallback,
  onError,
  children
}) => {
  const { handleProductionError } = useProductionErrorHandler('LazyWrapper');

  const handleError = (error: Error) => {
    handleProductionError(error, 'lazy_loading', 'medium', {
      trackPerformance: true,
      createAlert: false,
      notifyUser: false
    });
    onError?.(error);
  };

  return (
    <ErrorBoundary
      fallback={errorFallback}
      onError={handleError}
    >
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Higher-order component for lazy loading
export function withLazyLoading<T extends ComponentType<any>>(
  componentFactory: () => Promise<{ default: T }>,
  loadingComponent?: React.ComponentType,
  errorComponent?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  const LazyComponent = lazy(componentFactory);
  
  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => {
    const [error, setError] = React.useState<Error | null>(null);
    const [retryCount, setRetryCount] = React.useState(0);

    const retry = () => {
      setError(null);
      setRetryCount(prev => prev + 1);
    };

    if (error && errorComponent) {
      const ErrorComponent = errorComponent;
      return <ErrorComponent error={error} retry={retry} />;
    }

    return (
      <LazyWrapper
        fallback={loadingComponent ? React.createElement(loadingComponent) : undefined}
        onError={setError}
      >
        <LazyComponent {...props} ref={ref} key={retryCount} />
      </LazyWrapper>
    );
  });
}

// Preload utility for better UX
export const preloadComponent = (componentFactory: () => Promise<any>) => {
  return componentFactory();
};
