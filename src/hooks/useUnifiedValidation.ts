
import { useState, useCallback } from 'react';
import { FormValidationService, FormValidationConfig, ValidationResult } from '@/services/validation/FormValidationService';

export interface ValidationState {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isValidating: boolean;
}

export interface UnifiedValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

export const useUnifiedValidation = (
  config: FormValidationConfig,
  options: UnifiedValidationOptions = {}
) => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    debounceMs = 300
  } = options;

  const [state, setState] = useState<ValidationState>({
    errors: {},
    touched: {},
    isValid: true,
    isValidating: false
  });

  const validationService = FormValidationService.getInstance();

  const validateField = useCallback(
    async (fieldName: string, value: any, showErrors = true) => {
      setState(prev => ({ ...prev, isValidating: true }));

      try {
        const fieldConfig = config.fields.find(f => f.name === fieldName);
        if (!fieldConfig) return true;

        const error = validationService.validateField(value, fieldConfig);
        
        if (showErrors) {
          setState(prev => ({
            ...prev,
            errors: {
              ...prev.errors,
              [fieldName]: error || ''
            },
            touched: {
              ...prev.touched,
              [fieldName]: true
            },
            isValidating: false
          }));
        }

        return !error;
      } catch (err) {
        console.error('Validation error:', err);
        setState(prev => ({ ...prev, isValidating: false }));
        return false;
      }
    },
    [config, validationService]
  );

  const validateForm = useCallback(
    async (data: Record<string, any>) => {
      setState(prev => ({ ...prev, isValidating: true }));

      try {
        const result = validationService.validateForm(data, config);
        
        setState(prev => ({
          ...prev,
          errors: result.errors,
          touched: Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
          isValid: result.isValid,
          isValidating: false
        }));

        return result;
      } catch (err) {
        console.error('Form validation error:', err);
        setState(prev => ({ 
          ...prev, 
          isValid: false,
          isValidating: false 
        }));
        return { isValid: false, errors: { _form: 'Erro na validação do formulário' } };
      }
    },
    [config, validationService]
  );

  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: {},
      touched: {},
      isValid: true
    }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [fieldName]: ''
      }
    }));
  }, []);

  const setFieldTouched = useCallback((fieldName: string, touched = true) => {
    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [fieldName]: touched
      }
    }));
  }, []);

  const getFieldError = useCallback((fieldName: string) => {
    return state.errors[fieldName] || null;
  }, [state.errors]);

  const isFieldTouched = useCallback((fieldName: string) => {
    return !!state.touched[fieldName];
  }, [state.touched]);

  const hasFieldError = useCallback((fieldName: string) => {
    return !!state.errors[fieldName] && state.touched[fieldName];
  }, [state.errors, state.touched]);

  return {
    ...state,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    setFieldTouched,
    getFieldError,
    isFieldTouched,
    hasFieldError
  };
};
