
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormValidationConfig } from '@/services/validation/FormValidationService';
import { useUnifiedValidation } from '@/hooks/useUnifiedValidation';
import { ContextValidations } from '@/services/validation/ContextValidations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AsyncFeedback } from '@/components/ui/async-feedback';

interface EnhancedValidatedFormProps {
  config: FormValidationConfig;
  context?: string;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
  className?: string;
  showSuccessMessage?: boolean;
  autoFocus?: boolean;
}

interface FieldProps {
  name: string;
  label: string;
  type: string;
  value: any;
  error?: string;
  touched?: boolean;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  disabled?: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
  onFocus?: () => void;
}

const EnhancedFormField: React.FC<FieldProps> = ({
  name,
  label,
  type,
  value,
  error,
  touched,
  required,
  placeholder,
  options,
  disabled,
  onChange,
  onBlur,
  onFocus
}) => {
  const fieldId = `enhanced-field-${name}`;
  const hasError = !!(error && touched);

  const renderInput = () => {
    const baseClasses = cn(
      hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500'
    );

    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
            className={baseClasses}
            rows={3}
          />
        );
      
      case 'select':
        return (
          <Select 
            value={value || ''} 
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger className={baseClasses}>
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
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
            className={baseClasses}
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
            onFocus={onFocus}
            disabled={disabled}
            className={baseClasses}
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
            onFocus={onFocus}
            placeholder={placeholder || 'exemplo@email.com'}
            disabled={disabled}
            className={baseClasses}
          />
        );
      
      case 'tel':
      case 'phone':
        return (
          <Input
            id={fieldId}
            type="tel"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder || '(11) 99999-9999'}
            disabled={disabled}
            className={baseClasses}
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
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={fieldId} 
        className={cn(
          'text-sm font-medium',
          hasError && 'text-red-700',
          required && 'after:content-["*"] after:text-red-500 after:ml-1'
        )}
      >
        {label}
      </Label>
      {renderInput()}
      {hasError && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export const EnhancedValidatedForm: React.FC<EnhancedValidatedFormProps> = ({
  config,
  context,
  initialData = {},
  onSubmit,
  onCancel,
  submitButtonText = 'Salvar',
  cancelButtonText = 'Cancelar',
  isLoading = false,
  className,
  showSuccessMessage = false,
  autoFocus = false
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Aplicar validações específicas do contexto se fornecido
  const enhancedConfig = React.useMemo(() => {
    if (context) {
      const contextValidations = ContextValidations.getInstance();
      const contextRules = contextValidations.getValidationRulesForContext(context);
      
      // Mesclar regras de contexto com configuração existente
      return {
        ...config,
        fields: config.fields.map(field => {
          const contextRule = contextRules.find(rule => rule.field === field.name);
          if (contextRule) {
            return {
              ...field,
              rules: [...field.rules, contextRule]
            };
          }
          return field;
        })
      };
    }
    return config;
  }, [config, context]);

  const validation = useUnifiedValidation(enhancedConfig, {
    validateOnChange: true,
    validateOnBlur: true,
    debounceMs: 300
  });

  useEffect(() => {
    setFormData(initialData);
    validation.clearErrors();
    setSubmitError(null);
    setSubmitSuccess(false);
  }, [initialData]);

  const handleFieldChange = async (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setSubmitError(null);
    setSubmitSuccess(false);
    
    // Validação em tempo real
    await validation.validateField(fieldName, value);
  };

  const handleFieldBlur = async (fieldName: string) => {
    validation.setFieldTouched(fieldName, true);
    await validation.validateField(fieldName, formData[fieldName]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    const validationResult = await validation.validateForm(formData);
    if (!validationResult.isValid) {
      return;
    }

    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
      
      if (showSuccessMessage) {
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar dados';
      setSubmitError(errorMessage);
    }
  };

  if (submitSuccess && showSuccessMessage) {
    return (
      <AsyncFeedback
        status="success"
        message="Dados salvos com sucesso!"
        className="py-8"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {enhancedConfig.fields.map((field, index) => (
          <EnhancedFormField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            value={formData[field.name]}
            error={validation.getFieldError(field.name)}
            touched={validation.isFieldTouched(field.name)}
            required={field.required}
            disabled={isLoading}
            onChange={(value) => handleFieldChange(field.name, value)}
            onBlur={() => handleFieldBlur(field.name)}
            onFocus={index === 0 && autoFocus ? undefined : undefined}
          />
        ))}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelButtonText}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || !validation.isValid || validation.isValidating}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : submitSuccess ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Salvo!
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </form>
  );
};
