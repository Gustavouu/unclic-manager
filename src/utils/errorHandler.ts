
import { toast } from 'sonner';

// Tipos de erro
export type ApiErrorType = 'AUTH' | 'VALIDATION' | 'SERVER' | 'NOT_FOUND' | 'PERMISSION' | 'UNKNOWN';

// Interface para erros estruturados
export interface ErrorDetails {
  type: ApiErrorType;
  message: string;
  technicalDetails?: any;
}

// Mapeamento de erros técnicos para mensagens amigáveis
const errorMessages: Record<string, {message: string, type: ApiErrorType}> = {
  // Erros de autenticação
  'invalid login credentials': {
    message: 'Email ou senha incorretos. Verifique suas credenciais.',
    type: 'AUTH'
  },
  'Email not confirmed': {
    message: 'Seu email ainda não foi confirmado. Verifique sua caixa de entrada.',
    type: 'AUTH'
  },
  'JWT expired': {
    message: 'Sua sessão expirou. Por favor, faça login novamente.',
    type: 'AUTH'
  },
  
  // Erros de banco de dados
  'new row violates row-level security policy': {
    message: 'Você não tem permissão para realizar esta operação.',
    type: 'PERMISSION'
  },
  'violates foreign key constraint': {
    message: 'Este registro está vinculado a outros dados e não pode ser modificado.',
    type: 'VALIDATION'
  },
  'duplicate key value violates unique constraint': {
    message: 'Este registro já existe no sistema.',
    type: 'VALIDATION'
  },
  'column does not exist': {
    message: 'Ocorreu um erro no sistema. Por favor, tente novamente.',
    type: 'SERVER'
  },
  
  // Erros de API
  '404': {
    message: 'Recurso não encontrado.',
    type: 'NOT_FOUND'
  },
  '401': {
    message: 'Não autorizado. Faça login novamente.',
    type: 'AUTH'
  },
  '403': {
    message: 'Você não tem permissão para acessar este recurso.',
    type: 'PERMISSION'
  },
  '500': {
    message: 'Erro no servidor. Nossa equipe foi notificada.',
    type: 'SERVER'
  }
};

/**
 * Obtém uma mensagem de erro amigável com base no erro técnico
 * @param error Objeto de erro ou mensagem de erro
 * @returns Detalhes do erro estruturados
 */
export const getErrorDetails = (error: any): ErrorDetails => {
  if (!error) {
    return {
      type: 'UNKNOWN',
      message: 'Ocorreu um erro desconhecido.'
    };
  }
  
  // Extrair mensagem de erro
  const errorMessage = 
    error.message || 
    error.error_description || 
    error.error || 
    error.toString();
  
  // Se for um erro de status HTTP
  if (error.status) {
    const statusError = errorMessages[error.status.toString()];
    if (statusError) {
      return {
        type: statusError.type,
        message: statusError.message,
        technicalDetails: error
      };
    }
  }
  
  // Verificar se o erro corresponde a algum dos padrões conhecidos
  for (const [technicalError, errorInfo] of Object.entries(errorMessages)) {
    if (errorMessage.includes(technicalError)) {
      return {
        type: errorInfo.type,
        message: errorInfo.message,
        technicalDetails: error
      };
    }
  }
  
  // Mensagem genérica para erros desconhecidos
  console.error('Erro não mapeado:', error);
  return {
    type: 'UNKNOWN',
    message: 'Ocorreu um erro. Por favor, tente novamente.',
    technicalDetails: error
  };
};

/**
 * Manipula erros de API, registra no console e exibe toast para o usuário
 * @param error Erro a ser tratado
 * @param customMessage Mensagem personalizada opcional
 * @returns Detalhes do erro estruturados
 */
export const handleApiError = (error: any, customMessage: string | null = null): ErrorDetails => {
  // Registrar o erro técnico no console para depuração
  console.error('Erro técnico:', error);
  
  // Obter detalhes do erro
  const errorDetails = getErrorDetails(error);
  
  // Exibir mensagem amigável para o usuário
  const friendlyMessage = customMessage || errorDetails.message;
  
  // Exibir toast com base no tipo de erro
  switch (errorDetails.type) {
    case 'AUTH':
      toast.error('Erro de autenticação', {
        description: friendlyMessage,
      });
      break;
    case 'PERMISSION':
      toast.error('Erro de permissão', {
        description: friendlyMessage,
      });
      break;
    case 'VALIDATION':
      toast.error('Erro de validação', {
        description: friendlyMessage,
      });
      break;
    case 'NOT_FOUND':
      toast.error('Não encontrado', {
        description: friendlyMessage,
      });
      break;
    default:
      toast.error('Erro', {
        description: friendlyMessage,
      });
  }
  
  return errorDetails;
};

/**
 * Função para tratar erros de formulário do Zod
 * @param errors Erros do Zod
 */
export const handleFormErrors = (errors: any) => {
  const errorMessages: string[] = [];
  
  // Extrair mensagens de erro
  if (errors._errors) {
    errorMessages.push(...errors._errors);
  }
  
  // Verificar campos individuais
  Object.entries(errors).forEach(([key, value]: [string, any]) => {
    if (key !== '_errors' && value._errors && value._errors.length) {
      errorMessages.push(`${key}: ${value._errors.join(', ')}`);
    }
  });
  
  // Mostrar toast se houver mensagens
  if (errorMessages.length > 0) {
    toast.error('Erro no formulário', {
      description: errorMessages[0],
    });
  }
  
  return errorMessages;
};

/**
 * Registra erro em serviço de monitoramento (simulado)
 * @param error Erro a ser registrado
 * @param context Informações adicionais sobre o contexto do erro
 */
export const logErrorToService = (error: any, context: Record<string, any> = {}) => {
  // Aqui você integraria com um serviço como Sentry, LogRocket, etc.
  console.error('Error logged to monitoring service:', {
    error,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
};
