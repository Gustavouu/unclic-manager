
import { ValidationRule, ValidationService } from './ValidationService';

export class ContextValidations {
  private static instance: ContextValidations;
  private validationService: ValidationService;

  private constructor() {
    this.validationService = ValidationService.getInstance();
  }

  public static getInstance(): ContextValidations {
    if (!ContextValidations.instance) {
      ContextValidations.instance = new ContextValidations();
    }
    return ContextValidations.instance;
  }

  // Validações específicas para clientes
  public getClientValidationRules(): ValidationRule[] {
    return [
      {
        field: 'name',
        required: true,
        minLength: 2,
        maxLength: 100,
        custom: (value: string) => {
          if (value && !/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
            return 'Nome deve conter apenas letras e espaços';
          }
          return null;
        }
      },
      {
        field: 'email',
        pattern: ValidationService.PATTERNS.EMAIL,
        custom: (value: string) => {
          if (value && value.includes('+')) {
            return 'Email não pode conter o caractere +';
          }
          return null;
        }
      },
      {
        field: 'phone',
        pattern: ValidationService.PATTERNS.PHONE,
        custom: (value: string) => {
          if (value) {
            const numbers = value.replace(/\D/g, '');
            if (numbers.length < 10 || numbers.length > 11) {
              return 'Telefone deve ter 10 ou 11 dígitos';
            }
          }
          return null;
        }
      }
    ];
  }

  // Validações específicas para serviços
  public getServiceValidationRules(): ValidationRule[] {
    return [
      {
        field: 'name',
        required: true,
        minLength: 3,
        maxLength: 100
      },
      {
        field: 'duration',
        required: true,
        custom: (value: any) => {
          const duration = Number(value);
          if (isNaN(duration) || duration < 5) {
            return 'Duração deve ser de pelo menos 5 minutos';
          }
          if (duration > 480) {
            return 'Duração não pode exceder 8 horas';
          }
          return null;
        }
      },
      {
        field: 'price',
        required: true,
        custom: (value: any) => {
          const price = Number(value);
          if (isNaN(price) || price < 0) {
            return 'Preço deve ser um valor positivo';
          }
          if (price > 10000) {
            return 'Preço não pode exceder R$ 10.000';
          }
          return null;
        }
      }
    ];
  }

  // Validações específicas para agendamentos
  public getAppointmentValidationRules(): ValidationRule[] {
    return [
      {
        field: 'clientId',
        required: true,
        custom: (value: string) => {
          if (!value || value === '') {
            return 'Cliente é obrigatório';
          }
          return null;
        }
      },
      {
        field: 'serviceId',
        required: true,
        custom: (value: string) => {
          if (!value || value === '') {
            return 'Serviço é obrigatório';
          }
          return null;
        }
      },
      {
        field: 'date',
        required: true,
        custom: (value: any) => {
          if (!value) {
            return 'Data é obrigatória';
          }
          
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) {
            return 'Data não pode ser no passado';
          }
          
          // Não permitir agendamentos com mais de 90 dias de antecedência
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + 90);
          
          if (selectedDate > maxDate) {
            return 'Agendamentos podem ser feitos com até 90 dias de antecedência';
          }
          
          return null;
        }
      },
      {
        field: 'time',
        required: true,
        custom: (value: string) => {
          if (!value) {
            return 'Horário é obrigatório';
          }
          
          const [hours, minutes] = value.split(':').map(Number);
          if (hours < 6 || hours > 22) {
            return 'Horário deve ser entre 06:00 e 22:00';
          }
          
          return null;
        }
      }
    ];
  }

  // Validações específicas para profissionais
  public getProfessionalValidationRules(): ValidationRule[] {
    return [
      {
        field: 'name',
        required: true,
        minLength: 2,
        maxLength: 100
      },
      {
        field: 'email',
        pattern: ValidationService.PATTERNS.EMAIL
      },
      {
        field: 'phone',
        pattern: ValidationService.PATTERNS.PHONE
      },
      {
        field: 'commission_percentage',
        custom: (value: any) => {
          if (value !== null && value !== undefined) {
            const commission = Number(value);
            if (isNaN(commission) || commission < 0 || commission > 100) {
              return 'Comissão deve ser entre 0% e 100%';
            }
          }
          return null;
        }
      }
    ];
  }

  // Validações específicas para produtos de estoque
  public getInventoryValidationRules(): ValidationRule[] {
    return [
      {
        field: 'name',
        required: true,
        minLength: 2,
        maxLength: 100
      },
      {
        field: 'quantity',
        required: true,
        custom: (value: any) => {
          const qty = Number(value);
          if (isNaN(qty) || qty < 0) {
            return 'Quantidade deve ser um número positivo';
          }
          return null;
        }
      },
      {
        field: 'minQuantity',
        required: true,
        custom: (value: any) => {
          const minQty = Number(value);
          if (isNaN(minQty) || minQty < 0) {
            return 'Quantidade mínima deve ser um número positivo';
          }
          return null;
        }
      },
      {
        field: 'price',
        custom: (value: any) => {
          if (value !== null && value !== undefined) {
            const price = Number(value);
            if (isNaN(price) || price < 0) {
              return 'Preço deve ser um valor positivo';
            }
          }
          return null;
        }
      }
    ];
  }

  // Método para obter regras por contexto
  public getValidationRulesForContext(context: string): ValidationRule[] {
    switch (context) {
      case 'client':
        return this.getClientValidationRules();
      case 'service':
        return this.getServiceValidationRules();
      case 'appointment':
        return this.getAppointmentValidationRules();
      case 'professional':
        return this.getProfessionalValidationRules();
      case 'inventory':
        return this.getInventoryValidationRules();
      default:
        return [];
    }
  }
}
