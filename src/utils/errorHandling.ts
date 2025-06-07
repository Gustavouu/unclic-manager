
import { toast } from 'sonner';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export function handleError(error: unknown, context?: string): AppError {
  console.error(`Error in ${context || 'application'}:`, error);

  let appError: AppError;

  if (error instanceof Error) {
    appError = {
      message: error.message,
      details: error.stack
    };
  } else if (typeof error === 'string') {
    appError = {
      message: error
    };
  } else if (error && typeof error === 'object' && 'message' in error) {
    appError = {
      message: String(error.message),
      code: 'code' in error ? String(error.code) : undefined,
      details: error
    };
  } else {
    appError = {
      message: 'An unexpected error occurred',
      details: error
    };
  }

  return appError;
}

export function showErrorToast(error: unknown, context?: string) {
  const appError = handleError(error, context);
  toast.error(appError.message);
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && (
    error.name === 'NetworkError' ||
    error.message.includes('fetch') ||
    error.message.includes('network')
  );
}

export function isDatabaseError(error: unknown): boolean {
  return error && typeof error === 'object' && 'code' in error;
}
