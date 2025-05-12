
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Define loading stages
export type LoadingStage = "initializing" | "auth" | "config" | "user_data" | "business_data" | "complete";

// Define error types
export type LoadingError = {
  code: string;
  message: string;
  details?: any;
};

interface LoadingContextType {
  stage: LoadingStage;
  progress: number;
  error: LoadingError | null;
  isLoading: boolean;
  setStage: (stage: LoadingStage) => void;
  setProgress: (progress: number) => void;
  setError: (error: LoadingError | null) => void;
  resetLoading: () => void;
  completeLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<LoadingStage>("initializing");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<LoadingError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const resetLoading = useCallback(() => {
    setStage("initializing");
    setProgress(0);
    setError(null);
    setIsLoading(true);
  }, []);

  const completeLoading = useCallback(() => {
    setStage("complete");
    setProgress(100);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        stage,
        progress,
        error,
        isLoading,
        setStage,
        setProgress,
        setError,
        resetLoading,
        completeLoading
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
