
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
