
export const validateRequired = (value: string): string => {
  return value.trim() === '' ? 'Este campo é obrigatório' : '';
};

export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return 'Email é obrigatório';
  }
  if (!emailRegex.test(email)) {
    return 'Email inválido';
  }
  return '';
};

export const validatePhone = (phone: string): string => {
  const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  if (!phone.trim()) {
    return 'Telefone é obrigatório';
  }
  if (!phoneRegex.test(phone)) {
    return 'Formato de telefone inválido';
  }
  return '';
};

export const formatPhone = (value: string): string => {
  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, '');
  
  // Apply the Brazilian phone format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
  if (cleaned.length <= 2) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  } else if (cleaned.length <= 7) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
  } else {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  }
};

export const showSuccessToast = (message: string) => {
  // Using dynamic import to avoid circular dependencies
  import('sonner').then(({ toast }) => {
    toast.success(message);
  });
};

export const showErrorToast = (message?: string) => {
  // Using dynamic import to avoid circular dependencies
  import('sonner').then(({ toast }) => {
    toast.error(message || 'Ocorreu um erro inesperado');
  });
};
