
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormValidationService, FormValidationConfig, useFormValidation } from '@/services/validation/FormValidationService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidatedFormProps {
  config: FormValidationConfig;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  submitButtonText?: string;
  isLoading?: boolean;
  className?: string;
}

interface FieldProps {
  name: string;
  label: string;
  type: string;
  value: any;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  onChange: (value: any) => void;
  onBlur: () => void;
}

const FormField: React.FC<FieldProps> = ({
  name,
  label,
  type,
  value,
  error,
  required,
  placeholder,
  options,
  onChange,
  onBlur
}) => {
  const fieldId = `field-${name}`;
  const hasError = !!error;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            className={cn(hasError && 'border-red-500')}
          />
        );
      
      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className={cn(hasError && 'border-red-500')}>
              <SelectValue placeholder={placeholder || `Selecionar ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'number':
        return (
          <Input
            id={fieldId}
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            className={cn(hasError && 'border-red-500')}
          />
        );
      
      case 'date':
        return (
          <Input
            id={fieldId}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={cn(hasError && 'border-red-500')}
          />
        );
      
      case 'email':
        return (
          <Input
            id={fieldId}
            type="email"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder || 'exemplo@email.com'}
            className={cn(hasError && 'border-red-500')}
          />
        );
      
      case 'phone':
        const formattedValue = value ? FormValidationService.getInstance().formatPhoneNumber(value) : '';
        return (
          <Input
            id={fieldId}
            type="tel"
            value={formattedValue}
            onChange={(e) => {
              const formatted = FormValidationService.getInstance().formatPhoneNumber(e.target.value);
              onChange(formatted);
            }}
            onBlur={onBlur}
            placeholder={placeholder || '(11) 99999-9999'}
            className={cn(hasError && 'border-red-500')}
          />
        );
      
      default:
        return (
          <Input
            id={fieldId}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            className={cn(hasError && 'border-red-500')}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className={cn(required && 'after:content-["*"] after:text-red-500 after:ml-1')}>
        {label}
      </Label>
      {renderInput()}
      {hasError && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export const ValidatedForm: React.FC<ValidatedFormProps> = ({
  config,
  initialData = {},
  onSubmit,
  submitButtonText = 'Salvar',
  isLoading = false,
  className
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const {
    errors,
    isValid,
    validateField,
    validateForm,
    clearErrors,
    getFieldError
  } = useFormValidation(config);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setSubmitError(null); // Limpar erro de submit quando o usuário editar
  };

  const handleFieldBlur = (fieldName: string) => {
    validateField(fieldName, formData[fieldName]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateForm(formData);
    if (!validation.isValid) {
      return;
    }

    try {
      await onSubmit(formData);
      clearErrors();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar dados';
      setSubmitError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {config.fields.map((field) => (
          <FormField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            value={formData[field.name]}
            error={getFieldError(field.name)}
            required={field.required}
            onChange={(value) => handleFieldChange(field.name, value)}
            onBlur={() => handleFieldBlur(field.name)}
          />
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={isLoading || !isValid}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </form>
  );
};

// Hook para facilitar o uso de formulários com validação
export const useValidatedForm = (config: FormValidationConfig, initialData = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      if (config.onSubmit) {
        await config.onSubmit(data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar formulário';
      setSubmitError(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitError,
    handleSubmit,
    clearSubmitError: () => setSubmitError(null)
  };
};
