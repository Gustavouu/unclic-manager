import React from 'react';
import { ValidationService, ValidationRule } from './ValidationService';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'date' | 'textarea' | 'select';
  rules: ValidationRule[];
  required?: boolean;
}

export interface FormValidationConfig {
  fields: FormFieldConfig[];
  onSubmit?: (data: Record<string, any>) => Promise<void>;
}

export class FormValidationService {
  private static instance: FormValidationService;
  private validationService: ValidationService;

  private constructor() {
    this.validationService = ValidationService.getInstance();
  }

  public static getInstance(): FormValidationService {
    if (!FormValidationService.instance) {
      FormValidationService.instance = new FormValidationService();
    }
    return FormValidationService.instance;
  }

  public validateForm(data: Record<string, any>, config: FormValidationConfig) {
    const rules = config.fields.map(field => ({
      field: field.name,
      required: field.required,
      ...field.rules[0] // Simplificado para este exemplo
    }));

    return this.validationService.validateForm(data, rules);
  }

  public validateField(value: any, fieldConfig: FormFieldConfig): string | null {
    for (const rule of fieldConfig.rules) {
      const error = this.validationService.validateForm({ [fieldConfig.name]: value }, [rule]);
      if (!error.isValid) {
        return error.errors[fieldConfig.name];
      }
    }
    return null;
  }

  public getFieldErrorMessage(fieldName: string, errors: Record<string, string>): string | null {
    return errors[fieldName] || null;
  }

  // Configurações pré-definidas para formulários comuns
  public static readonly FORM_CONFIGS = {
    CLIENT_FORM: {
      fields: [
        {
          name: 'name',
          label: 'Nome',
          type: 'text' as const,
          required: true,
          rules: [ValidationService.RULES.REQUIRED_NAME]
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email' as const,
          required: false,
          rules: [ValidationService.RULES.OPTIONAL_EMAIL]
        },
        {
          name: 'phone',
          label: 'Telefone',
          type: 'phone' as const,
          required: false,
          rules: [ValidationService.RULES.OPTIONAL_PHONE]
        }
      ]
    },
    SERVICE_FORM: {
      fields: [
        {
          name: 'name',
          label: 'Nome do Serviço',
          type: 'text' as const,
          required: true,
          rules: [ValidationService.RULES.REQUIRED_NAME]
        },
        {
          name: 'description',
          label: 'Descrição',
          type: 'textarea' as const,
          required: true,
          rules: [ValidationService.RULES.REQUIRED_DESCRIPTION]
        },
        {
          name: 'price',
          label: 'Preço',
          type: 'number' as const,
          required: true,
          rules: [ValidationService.RULES.REQUIRED_PRICE]
        }
      ]
    },
    APPOINTMENT_FORM: {
      fields: [
        {
          name: 'client_id',
          label: 'Cliente',
          type: 'select' as const,
          required: true,
          rules: [{ field: 'client_id', required: true }]
        },
        {
          name: 'service_id',
          label: 'Serviço',
          type: 'select' as const,
          required: true,
          rules: [{ field: 'service_id', required: true }]
        },
        {
          name: 'booking_date',
          label: 'Data',
          type: 'date' as const,
          required: true,
          rules: [{ field: 'booking_date', required: true }]
        }
      ]
    }
  };

  // Helpers para formatação de campos
  public formatPhoneNumber(phone: string): string {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return phone;
  }

  public formatCEP(cep: string): string {
    const numbers = cep.replace(/\D/g, '');
    if (numbers.length === 8) {
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    }
    return cep;
  }

  public formatCurrency(value: string): string {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  // Validadores específicos
  public validateCPF(cpf: string): boolean {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    // Validação do CPF
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (parseInt(numbers[9]) !== digit) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (parseInt(numbers[10]) !== digit) return false;

    return true;
  }

  public validateCNPJ(cnpj: string): boolean {
    const numbers = cnpj.replace(/\D/g, '');
    if (numbers.length !== 14) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(numbers)) return false;

    // Validação do CNPJ
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(numbers[i]) * weights1[i];
    }
    let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (parseInt(numbers[12]) !== digit) return false;

    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(numbers[i]) * weights2[i];
    }
    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (parseInt(numbers[13]) !== digit) return false;

    return true;
  }
}

// Hook para usar validação em componentes React
export const useFormValidation = (config: FormValidationConfig) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isValid, setIsValid] = React.useState(true);
  const validationService = FormValidationService.getInstance();

  const validateField = (fieldName: string, value: any) => {
    const fieldConfig = config.fields.find(f => f.name === fieldName);
    if (!fieldConfig) return;

    const error = validationService.validateField(value, fieldConfig);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error || ''
    }));
  };

  const validateForm = (data: Record<string, any>) => {
    const result = validationService.validateForm(data, config);
    setErrors(result.errors);
    setIsValid(result.isValid);
    return result;
  };

  const clearErrors = () => {
    setErrors({});
    setIsValid(true);
  };

  return {
    errors,
    isValid,
    validateField,
    validateForm,
    clearErrors,
    getFieldError: (fieldName: string) => errors[fieldName] || null
  };
};
