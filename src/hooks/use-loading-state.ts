
import { useState, useCallback } from 'react';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface UseLoadingStateProps {
  initialState?: LoadingState;
}

export function useLoadingState({ initialState = 'idle' }: UseLoadingStateProps = {}) {
  const [state, setState] = useState<LoadingState>(initialState);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setState('loading');
    setError(null);
  }, []);

  const setSuccess = useCallback(() => {
    setState('success');
  }, []);

  const setError = useCallback((message: string) => {
    setState('error');
    setError(message);
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setError(null);
  }, []);

  return {
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    isIdle: state === 'idle',
    state,
    error,
    startLoading,
    setSuccess,
    setError,
    reset
  };
}
