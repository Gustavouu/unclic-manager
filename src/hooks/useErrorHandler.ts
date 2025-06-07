
import { useCallback } from 'react';
import { handleError, showErrorToast } from '@/utils/errorHandling';

export function useErrorHandler() {
  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string,
    showToast: boolean = true
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      if (showToast) {
        showErrorToast(error, context);
      } else {
        handleError(error, context);
      }
      return null;
    }
  }, []);

  const handleSyncError = useCallback((
    error: unknown,
    context?: string,
    showToast: boolean = true
  ) => {
    if (showToast) {
      showErrorToast(error, context);
    } else {
      handleError(error, context);
    }
  }, []);

  return {
    handleAsyncError,
    handleSyncError
  };
}
