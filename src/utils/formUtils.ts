
import { toast } from "sonner";

/**
 * Simulates an API call to save data
 * @returns Promise that resolves to true after a delay (simulating success)
 */
export const mockSaveFunction = (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1500);
  });
};

/**
 * Shows a success toast notification
 * @param message Success message to display
 */
export const showSuccessToast = (message: string = "Operação realizada com sucesso!") => {
  toast.success(message);
};

/**
 * Shows an error toast notification
 * @param message Error message to display
 */
export const showErrorToast = (message: string = "Ocorreu um erro. Tente novamente.") => {
  toast.error(message);
};

/**
 * Formats a phone number to Brazilian pattern (XX) XXXXX-XXXX
 * @param value Phone number to format
 * @returns Formatted phone number
 */
export const formatPhone = (value: string): string => {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, '');
  
  // Format according to Brazilian patterns
  if (numbers.length <= 2) {
    return `(${numbers}`;
  } 
  
  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }
  
  if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }
  
  // Limit to 11 digits (with area code)
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

/**
 * Formats a currency value to Brazilian Real (R$)
 * @param value Number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formats a date to Brazilian format (DD/MM/YYYY)
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

/**
 * Validates if a string is a valid email
 * @param email Email to validate
 * @returns Error message or null if valid
 */
export const validateEmail = (email: string): string | null => {
  if (!email) return "Email é obrigatório";
  if (!isValidEmail(email)) return "Email inválido";
  return null;
};

/**
 * Validates if a string is a valid email
 * @param email Email to validate
 * @returns Boolean indicating if the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validates if a field is required
 * @param value Value to validate
 * @param fieldName Name of the field for error message
 * @returns Error message or null if valid
 */
export const validateRequired = (value: string, fieldName: string): string | null => {
  return value ? null : `${fieldName} é obrigatório`;
};

/**
 * Validates if a string is a valid phone number
 * @param phone Phone to validate
 * @returns Error message or null if valid
 */
export const validatePhone = (phone: string): string | null => {
  if (!phone) return "Telefone é obrigatório";
  
  // Remove all non-digit characters
  const numbers = phone.replace(/\D/g, '');
  
  // Check if it has at least 10 digits (including area code)
  if (numbers.length < 10) {
    return "Telefone inválido";
  }
  
  return null;
};

/**
 * Validates if a string is a valid CPF (Brazilian individual taxpayer registry)
 * @param cpf CPF to validate
 * @returns Boolean indicating if the CPF is valid
 */
export const isValidCPF = (cpf: string): boolean => {
  // Remove non-digits
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Check if it has 11 digits
  if (cleanCPF.length !== 11) {
    return false;
  }
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cleanCPF)) {
    return false;
  }
  
  // Validate the verification digits
  let sum = 0;
  let remainder;
  
  // First verification digit
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) {
    return false;
  }
  
  // Second verification digit
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) {
    return false;
  }
  
  return true;
};
