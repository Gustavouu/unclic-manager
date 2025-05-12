
import { useEffect, useRef } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { InitializationService } from '@/services/InitializationService';

export function useInitialization() {
  const { setStage, setProgress, setError, isLoading } = useLoading();
  const initializationAttempted = useRef(false);

  useEffect(() => {
    if (isLoading && !initializationAttempted.current) {
      initializationAttempted.current = true;
      
      // Register our loading handlers with the initialization service
      InitializationService.setLoadingHandlers(
        (stage) => setStage(stage as any),
        setProgress,
        setError
      );
      
      // Start the initialization process
      setTimeout(() => {
        try {
          InitializationService.initialize();
        } catch (error) {
          console.error("Error during initialization:", error);
          setError({
            code: "INIT_ERROR",
            message: "Falha ao inicializar a aplicação",
            details: error
          });
        }
      }, 100);
    }
  }, [isLoading, setStage, setProgress, setError]);
}
