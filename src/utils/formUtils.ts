
import { toast } from "sonner";

export const mockSaveFunction = async (data: any) => {
  console.log('Mock save function called with:', data);
  return Promise.resolve();
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return re.test(phone);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const formatPhone = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XX) XXXXX-XXXX for Brazilian phones
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  // Format as (XX) XXXX-XXXX for older format
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return original if doesn't match expected length
};

export const showSuccessToast = (message: string = "Operação realizada com sucesso!") => {
  toast.success(message);
};

export const showErrorToast = (message: string = "Ocorreu um erro. Tente novamente.") => {
  toast.error(message);
};
