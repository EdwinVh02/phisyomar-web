import { useState, useCallback } from 'react';
import { useToast } from './useToast';

export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError, showSuccess } = useToast();

  const execute = useCallback(async (operation, options = {}) => {
    const {
      successMessage = null,
      errorMessage = 'Ha ocurrido un error',
      showSuccessToast = false,
      showErrorToast = true
    } = options;

    try {
      setLoading(true);
      setError(null);
      
      const result = await operation();
      
      if (successMessage && showSuccessToast) {
        showSuccess(successMessage);
      }
      
      return { success: true, data: result };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || errorMessage;
      setError(errorMsg);
      
      if (showErrorToast) {
        showError(errorMsg);
      }
      
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    reset
  };
};

export default useAsyncOperation;