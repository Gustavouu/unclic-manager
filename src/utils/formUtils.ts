
import { toast } from "sonner";

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') {
    return `${fieldName} é obrigatório`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email é obrigatório";
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Email inválido";
  }
  
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return "Telefone é obrigatório";
  }
  
  // Remove non-numeric characters for validation
  const numericPhone = phone.replace(/\D/g, '');
  
  if (numericPhone.length < 10 || numericPhone.length > 11) {
    return "Telefone inválido";
  }
  
  return null;
};

export const formatPhone = (phone: string): string => {
  // Remove non-numeric characters
  const numericPhone = phone.replace(/\D/g, '');
  
  if (numericPhone.length <= 2) {
    return numericPhone;
  } else if (numericPhone.length <= 6) {
    return `(${numericPhone.slice(0, 2)}) ${numericPhone.slice(2)}`;
  } else if (numericPhone.length <= 10) {
    return `(${numericPhone.slice(0, 2)}) ${numericPhone.slice(2, 6)}-${numericPhone.slice(6)}`;
  } else {
    return `(${numericPhone.slice(0, 2)}) ${numericPhone.slice(2, 7)}-${numericPhone.slice(7, 11)}`;
  }
};

export const showErrorToast = (message: string = "Ocorreu um erro. Tente novamente.") => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right'
  });
};

export const showSuccessToast = (message: string = "Operação realizada com sucesso!") => {
  toast.success(message, {
    duration: 5000,
    position: 'top-right'
  });
};

// Mock function to simulate saving data to the server
export const mockSaveFunction = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // 90% chance of success
      const success = Math.random() < 0.9;
      resolve(success);
    }, 1000);
  });
};
