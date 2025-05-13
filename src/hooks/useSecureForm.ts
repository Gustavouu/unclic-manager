
import { useState, useCallback } from 'react';
import { sanitizeFormData } from '@/utils/sanitize';

interface UseSecureFormOptions<T> {
  initialValues: T;
  onSubmit?: (data: T) => Promise<void> | void;
  validate?: (data: T) => Record<string, string> | null;
}

interface UseSecureFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  handleChange: (name: keyof T, value: any) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

export function useSecureForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate
}: UseSecureFormOptions<T>): UseSecureFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form values
  const validateForm = useCallback(() => {
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors || {});
      return !validationErrors || Object.keys(validationErrors).length === 0;
    }
    return true;
  }, [values, validate]);

  // Handle form field change
  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle form field blur
  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate single field on blur
    if (validate) {
      const validationErrors = validate(values);
      if (validationErrors && validationErrors[name as string]) {
        setErrors(prev => ({ ...prev, [name]: validationErrors[name as string] }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name as string];
          return newErrors;
        });
      }
    }
  }, [values, validate]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setTouched(allTouched);
    
    // Validate form
    const isValid = validateForm();
    
    if (isValid && onSubmit) {
      setIsSubmitting(true);
      try {
        // Sanitize form data before submission
        const sanitizedValues = sanitizeFormData(values);
        await onSubmit(sanitizedValues);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateForm, onSubmit]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  };
}
