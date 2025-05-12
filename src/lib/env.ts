
// Utility for validating environment variables
export function validateEnv() {
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missingEnvVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
  );

  if (missingEnvVars.length > 0) {
    console.error(
      `Variáveis de ambiente obrigatórias não encontradas: ${missingEnvVars.join(', ')}`
    );
    return false;
  }

  // Check if sensitive keys are being exposed in the client
  const clientEnvVars = Object.keys(import.meta.env).filter(
    key => key.startsWith('VITE_')
  );

  const potentiallyExposedSecrets = clientEnvVars.filter(
    key => key.includes('SECRET') || key.includes('PRIVATE') || key.includes('PASSWORD')
  );

  if (potentiallyExposedSecrets.length > 0) {
    console.warn(
      'ALERTA DE SEGURANÇA: Possíveis segredos expostos no cliente:',
      potentiallyExposedSecrets
    );
  }

  return true;
}

// Call this function early in the application lifecycle
export function initializeEnv() {
  const isValid = validateEnv();
  
  if (!isValid) {
    throw new Error("Environment validation failed");
  }
  
  // Additional environment setup could go here
  
  return isValid;
}
