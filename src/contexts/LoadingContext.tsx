
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
  allowContinueDespiteErrors: boolean;
  setAllowContinueDespiteErrors: (allow: boolean) => void;
  bypassConnectivityCheck: boolean;
  setBypassConnectivityCheck: (bypass: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
  timeout?: number;
}

export function LoadingProvider({ children, timeout = 60000 }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState<LoadingStage>('initializing');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<any | null>(null);
  const [allowContinueDespiteErrors, setAllowContinueDespiteErrors] = useState(false);
  const [bypassConnectivityCheck, setBypassConnectivityCheck] = useState(false);
  
  // Check for emergency continue flag in localStorage
  useEffect(() => {
    const hasEmergencyFlag = localStorage.getItem('app_emergency_continue') === 'true';
    const hasConnectivityBypassFlag = localStorage.getItem('bypass_connectivity_check') === 'true';
    
    if (hasEmergencyFlag) {
      console.log("Emergency continue flag detected, will attempt to load app despite errors");
      setAllowContinueDespiteErrors(true);
      // Clear the flag after reading it
      localStorage.removeItem('app_emergency_continue');
    }
    
    if (hasConnectivityBypassFlag) {
      console.log("Connectivity check bypass flag detected, will skip DB connection check");
      setBypassConnectivityCheck(true);
      localStorage.removeItem('bypass_connectivity_check');
    }
  }, []);

  // Global timeout for loading
  useEffect(() => {
    if (isLoading) {
      // Set a generous timeout to prevent indefinite loading
      const id = setTimeout(() => {
        if (isLoading) {
          console.warn(`Global loading timeout reached after ${timeout/1000} seconds`);
          // Don't show error immediately if emergency continue is enabled
          if (!allowContinueDespiteErrors) {
            setError({
              code: 'TIMEOUT_ERROR',
              message: 'O carregamento está demorando mais do que o esperado.',
              details: { stage: currentStage, timeout: timeout/1000 }
            });
            setIsLoading(false);
          } else {
            console.log("Emergency continue enabled, finishing loading despite timeout");
            finishLoading();
          }
        }
      }, timeout);
      
      return () => clearTimeout(id);
    }
  }, [isLoading, currentStage, timeout, allowContinueDespiteErrors]);

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
  };

  const handleRetry = () => {
    startLoading();
    window.location.reload();
  };

  // If we have an error but emergency continue is enabled, show children anyway
  const shouldShowChildren = !isLoading && (!error || allowContinueDespiteErrors);

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
      finishLoading,
      allowContinueDespiteErrors,
      setAllowContinueDespiteErrors,
      bypassConnectivityCheck,
      setBypassConnectivityCheck
    }}>
      {isLoading ? (
        <LoadingScreen stage={currentStage} progress={progress} />
      ) : error && !allowContinueDespiteErrors ? (
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
