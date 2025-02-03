import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

interface ApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

export const useApi = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const execute = useCallback(
    async (
      promise: Promise<T>,
      {
        onSuccess,
        onError,
        showSuccessToast = false,
        showErrorToast = true,
        successMessage = 'Operation completed successfully',
      }: ApiOptions<T> = {}
    ) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await promise;
        setData(result);
        if (showSuccessToast) {
          showToast(successMessage, 'success');
        }
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        if (showErrorToast) {
          showToast(error.message, 'error');
        }
        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
}; 