
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorScreen } from "@/components/ui/error-screen";

export type LoadingStage = 'initializing' | 'auth' | 'config' | 'user_data' | 'business_data' | 'complete';

interface LoadingContextType {
  isLoading: boolean;
  currentStage: LoadingStage;
  progress: number;
  error: any | null;
  setStage: (stage: LoadingStage) => void;
  setProgress: (progress: number) => void;
  setError: (error: any) => void;
  startLoading: () => void;
  finishLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
  timeout?: number;
}

export function LoadingProvider({ children, timeout = 30000 }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState<LoadingStage>('initializing');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<any | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Set timeout to prevent indefinite loading
      const id = setTimeout(() => {
        if (isLoading) {
          setError({
            code: 'TIMEOUT_ERROR',
            message: 'O carregamento está demorando mais do que o esperado.',
            details: { stage: currentStage }
          });
          setIsLoading(false);
        }
      }, timeout);
      
      setTimeoutId(id);
      
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [isLoading, currentStage, timeout]);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setCurrentStage('initializing');
  };

  const finishLoading = () => {
    setIsLoading(false);
    setProgress(100);
    setCurrentStage('complete');
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  const setStage = (stage: LoadingStage) => {
    setCurrentStage(stage);
    
    // Update progress based on stage
    const stages: LoadingStage[] = ['initializing', 'auth', 'config', 'user_data', 'business_data', 'complete'];
    const currentIndex = stages.indexOf(stage);
    if (currentIndex >= 0) {
      setProgress(Math.round(((currentIndex + 1) / stages.length) * 100));
    }
    
    // Reset timeout when stage changes
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    if (isLoading) {
      const id = setTimeout(() => {
        if (isLoading && currentStage === stage) {
          setError({
            code: 'TIMEOUT_ERROR',
            message: `O carregamento está demorando na etapa: ${stage}`,
            details: { stage }
          });
          setIsLoading(false);
        }
      }, timeout);
      
      setTimeoutId(id);
    }
  };

  const handleRetry = () => {
    startLoading();
    window.location.reload();
  };

  return (
    <LoadingContext.Provider value={{
      isLoading,
      currentStage,
      progress,
      error,
      setStage,
      setProgress,
      setError,
      startLoading,
      finishLoading
    }}>
      {isLoading ? (
        <LoadingScreen stage={currentStage} progress={progress} />
      ) : error ? (
        <ErrorScreen error={error} onRetry={handleRetry} />
      ) : (
        children
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  
  return context;
}
