
export function translateErrorMessage(message: string): string {
  const translations: { [key: string]: string } = {
    'Invalid login credentials': 'Credenciais de login inválidas',
    'Email not confirmed': 'Email não confirmado',
    'User already registered': 'Usuário já cadastrado',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'Unable to validate email address: invalid format': 'Formato de email inválido',
    'Signup requires a valid password': 'Cadastro requer uma senha válida',
    'Only an email address is required for password recovery': 'Apenas um endereço de email é necessário para recuperação de senha',
    'User not found': 'Usuário não encontrado',
    'Email rate limit exceeded': 'Limite de tentativas de email excedido',
    'Too many requests': 'Muitas tentativas. Tente novamente mais tarde',
    'Invalid email or password': 'Email ou senha inválidos',
    'Email already exists': 'Email já existe',
    'Weak password': 'Senha muito fraca'
  };

  return translations[message] || message;
}
