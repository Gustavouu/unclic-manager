
import { z } from 'zod';
import { toast } from 'sonner';

/**
 * Common validation schemas for the application
 */

// Client form schema
export const clientSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  telefone: z.string().optional().or(z.literal('')),
  cidade: z.string().optional().or(z.literal('')),
  estado: z.string().optional().or(z.literal(''))
});

// Phone number format validation
export const phoneSchema = z.string().regex(
  /^\(\d{2}\) \d{4,5}-\d{4}$/,
  { message: 'Telefone deve estar no formato (99) 99999-9999' }
);

// Email format validation with common domain checks
export const emailSchema = z.string().email({ message: 'Email inválido' })
  .refine(email => {
    const domain = email.split('@')[1];
    const commonDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
    
    // This is a soft validation - we'll allow any domain but warn about typos
    if (domain && !commonDomains.includes(domain)) {
      const similarDomain = commonDomains.find(d => 
        domain.length > 3 && 
        d.includes(domain.substring(0, 3))
      );
      
      if (similarDomain) {
        console.warn(`Email domain might have a typo. Did you mean ${similarDomain}?`);
      }
    }
    
    return true;
  });

/**
 * Validates input data against a schema and shows toast errors
 * @returns Object with validation result, errors, and validated data
 */
export function validateInput<T>(
  data: unknown, 
  schema: z.Schema<T>,
  options: {
    showToast?: boolean;
    errorTitle?: string;
  } = {}
) {
  const { showToast = true, errorTitle = 'Erro de validação' } = options;
  
  try {
    const validatedData = schema.parse(data);
    return { 
      success: true, 
      data: validatedData, 
      errors: null 
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce((acc, err) => {
        const path = err.path.join('.');
        acc[path] = err.message;
        return acc;
      }, {} as Record<string, string>);
      
      if (showToast) {
        // Show only the first error in the toast
        const firstError = error.errors[0];
        toast.error(errorTitle, {
          description: firstError.message
        });
      }
      
      return {
        success: false,
        data: null,
        errors: formattedErrors
      };
    }
    
    // Handle other types of errors
    if (showToast) {
      toast.error('Erro inesperado', { 
        description: 'Ocorreu um erro ao validar os dados'
      });
    }
    
    return {
      success: false,
      data: null,
      errors: { _form: 'Erro inesperado de validação' }
    };
  }
}

/**
 * Sanitizes input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats a phone number as the user types
 */
export function formatPhoneNumberInput(value: string): string {
  if (!value) return '';
  
  // Remove everything except numbers
  const numbers = value.replace(/\D/g, '');
  
  // Format to (XX) XXXXX-XXXX or (XX) XXXX-XXXX
  if (numbers.length <= 2) {
    return numbers.length ? `(${numbers}` : '';
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
}
