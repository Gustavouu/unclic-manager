
import { toast } from "sonner";

export const formatPhone = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '');
  
  // Apply mask (XX) XXXXX-XXXX
  if (digitsOnly.length <= 2) {
    return `(${digitsOnly}`;
  } else if (digitsOnly.length <= 7) {
    return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2)}`;
  } else if (digitsOnly.length <= 11) {
    return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 7)}-${digitsOnly.slice(7)}`;
  } else {
    return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 7)}-${digitsOnly.slice(7, 11)}`;
  }
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  return value.trim() ? null : `${fieldName} é obrigatório`;
};

export const createRequiredValidator = (fieldName: string) => {
  return (value: string): string | null => validateRequired(value, fieldName);
};

export const validateEmail = (value: string): string | null => {
  if (!value.trim()) return null; // Email is optional
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? null : "Email inválido";
};

export const validatePhone = (value: string): string | null => {
  if (!value.trim()) return null; // Phone is optional
  
  // Check if phone has at least 10 digits
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length >= 10 ? null : "Telefone inválido";
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string = "Ocorreu um erro. Por favor, tente novamente.") => {
  toast.error(message);
};

// Mock save function for demos
export const mockSaveFunction = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return true to simulate success
  return true;
};
