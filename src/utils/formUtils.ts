
import { toast } from "sonner";

// Função para validar campos obrigatórios
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === "") {
    return `O campo ${fieldName} é obrigatório`;
  }
  return null;
};

// Adaptadores para useFormValidation (aceitam apenas um argumento)
export const createRequiredValidator = (fieldName: string) => {
  return (value: string): string | null => validateRequired(value, fieldName);
};

// Função para validar email
export const validateEmail = (email: string): string | null => {
  if (!email) return null;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Email inválido";
  }
  return null;
};

// Função para formatar telefone com máscara (xx) xxxxx-xxxx
export const formatPhone = (phone: string): string => {
  // Remove todos os caracteres não numéricos
  const numericValue = phone.replace(/\D/g, '');
  
  // Limita a 11 dígitos (DDD + 9 dígitos)
  const limitedValue = numericValue.slice(0, 11);
  
  // Aplica a máscara conforme o tamanho
  if (limitedValue.length <= 2) {
    return limitedValue;
  } else if (limitedValue.length <= 7) {
    return `(${limitedValue.slice(0, 2)}) ${limitedValue.slice(2)}`;
  } else {
    return `(${limitedValue.slice(0, 2)}) ${limitedValue.slice(2, 7)}-${limitedValue.slice(7)}`;
  }
};

// Função para validar telefone
export const validatePhone = (phone: string): string | null => {
  if (!phone) return null;
  
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  if (!phoneRegex.test(phone)) {
    return "Telefone inválido (formato: (xx) xxxxx-xxxx)";
  }
  return null;
};

// Função para mostrar mensagem de sucesso
export const showSuccessToast = (message: string = "Alterações salvas com sucesso!") => {
  toast.success(message);
};

// Função para mostrar mensagem de erro
export const showErrorToast = (message: string = "Erro ao salvar alterações. Tente novamente.") => {
  toast.error(message);
};

// Mock de função de salvamento
export const mockSaveFunction = async (): Promise<boolean> => {
  // Simula uma chamada de API com 90% de chance de sucesso
  return new Promise((resolve) => {
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1; // 90% de chance de sucesso
      resolve(isSuccess);
    }, 1000);
  });
};
