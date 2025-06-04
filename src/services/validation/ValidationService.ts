
export interface ValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class ValidationService {
  private static instance: ValidationService;

  public static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  public validateForm(data: Record<string, any>, rules: ValidationRule[]): ValidationResult {
    const errors: Record<string, string> = {};

    for (const rule of rules) {
      const value = data[rule.field];
      const error = this.validateField(value, rule);
      
      if (error) {
        errors[rule.field] = error;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  private validateField(value: any, rule: ValidationRule): string | null {
    // Required validation
    if (rule.required && this.isEmpty(value)) {
      return `${this.getFieldDisplayName(rule.field)} é obrigatório`;
    }

    // Skip other validations if field is empty and not required
    if (this.isEmpty(value) && !rule.required) {
      return null;
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return `${this.getFieldDisplayName(rule.field)} deve ter pelo menos ${rule.minLength} caracteres`;
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return `${this.getFieldDisplayName(rule.field)} deve ter no máximo ${rule.maxLength} caracteres`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return this.getPatternErrorMessage(rule.field);
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }

  private isEmpty(value: any): boolean {
    return value === null || 
           value === undefined || 
           value === '' || 
           (Array.isArray(value) && value.length === 0);
  }

  private getFieldDisplayName(field: string): string {
    const fieldNames: Record<string, string> = {
      name: 'Nome',
      email: 'Email',
      phone: 'Telefone',
      password: 'Senha',
      confirmPassword: 'Confirmação de senha',
      address: 'Endereço',
      city: 'Cidade',
      state: 'Estado',
      zipCode: 'CEP',
      businessName: 'Nome do negócio',
      description: 'Descrição',
      price: 'Preço',
      duration: 'Duração',
      date: 'Data',
      time: 'Horário'
    };

    return fieldNames[field] || field;
  }

  private getPatternErrorMessage(field: string): string {
    const messages: Record<string, string> = {
      email: 'Email deve ter um formato válido',
      phone: 'Telefone deve ter um formato válido',
      zipCode: 'CEP deve ter um formato válido',
      cpf: 'CPF deve ter um formato válido',
      cnpj: 'CNPJ deve ter um formato válido'
    };

    return messages[field] || `${this.getFieldDisplayName(field)} tem formato inválido`;
  }

  // Common validation patterns
  public static readonly PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    ZIP_CODE: /^\d{5}-?\d{3}$/,
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
  };

  // Common validation rules
  public static readonly RULES = {
    REQUIRED_NAME: { field: 'name', required: true, minLength: 2, maxLength: 100 },
    REQUIRED_EMAIL: { field: 'email', required: true, pattern: ValidationService.PATTERNS.EMAIL },
    OPTIONAL_EMAIL: { field: 'email', pattern: ValidationService.PATTERNS.EMAIL },
    REQUIRED_PHONE: { field: 'phone', required: true, pattern: ValidationService.PATTERNS.PHONE },
    OPTIONAL_PHONE: { field: 'phone', pattern: ValidationService.PATTERNS.PHONE },
    REQUIRED_PASSWORD: { field: 'password', required: true, minLength: 6, maxLength: 50 },
    REQUIRED_DESCRIPTION: { field: 'description', required: true, minLength: 10, maxLength: 500 },
    REQUIRED_PRICE: { 
      field: 'price', 
      required: true, 
      custom: (value: any) => {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) return 'Preço deve ser um valor válido';
        return null;
      }
    }
  };
}
