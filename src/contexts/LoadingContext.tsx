
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
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // Global timeout to prevent indefinite loading
      const id = setTimeout(() => {
        if (isLoading) {
          console.warn(`Loading timeout occurred at stage: ${currentStage}`);
          setError({
            code: 'TIMEOUT_ERROR',
            message: 'O carregamento está demorando mais do que o esperado.',
            details: { stage: currentStage }
          });
          setIsLoading(false);
          setTimeoutOccurred(true);
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

  // Add an additional safety net to force finish loading after 45 seconds
  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn("Emergency loading timeout triggered! Forcing app to continue.");
        setIsLoading(false);
        
        // If we have an error and reached emergency timeout, still show it but let the app proceed
        if (error) {
          console.error("App initialized with errors:", error);
        }
      }
    }, 45000); // 45 seconds emergency timeout
    
    return () => clearTimeout(emergencyTimeout);
  }, []);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setCurrentStage('initializing');
    setTimeoutOccurred(false);
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
    console.log(`Loading stage: ${stage}`);
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
          console.warn(`Stage timeout occurred: ${stage}`);
          if (!timeoutOccurred) {
            setError({
              code: 'TIMEOUT_ERROR',
              message: `O carregamento está demorando na etapa: ${stage}`,
              details: { stage }
            });
            setTimeoutOccurred(true);
          }
        }
      }, timeout / 2); // Each stage gets half the total timeout
      
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
