
import { useState } from "react";

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface UseLoadingStateProps {
  initialState?: LoadingState;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useLoadingState = (props: UseLoadingStateProps = {}) => {
  const { initialState = 'idle', onSuccess, onError } = props;
  const [state, setState] = useState<LoadingState>(initialState);
  const [error, setError] = useState<Error | null>(null);

  const setLoading = () => setState('loading');
  const setSuccess = () => {
    setState('success');
    if (onSuccess) onSuccess();
  };
  const setError_ = (err: Error) => {
    setState('error');
    setError(err);
    if (onError) onError(err);
  };
  const reset = () => {
    setState('idle');
    setError(null);
  };

  const executeWithLoading = async <T,>(promise: Promise<T>): Promise<T | null> => {
    try {
      setLoading();
      const result = await promise;
      setSuccess();
      return result;
    } catch (err) {
      setError_(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  };

  return {
    state,
    error,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    setLoading,
    setSuccess,
    setError: setError_,
    reset,
    executeWithLoading
  };
};
