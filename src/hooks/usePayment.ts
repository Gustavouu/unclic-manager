
import { useState } from "react";
import { PaymentRequest, PaymentResponse, PaymentService } from "@/services/PaymentService";

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  
  const processPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
    setIsLoading(true);
    setError(null);
    setPaymentUrl(null);
    
    try {
      // Envia requisição para o Efi Bank
      const response = await PaymentService.createPayment(request);
      
      // Se tiver uma URL de pagamento, armazena para redirecionamento quando necessário
      if (response.paymentUrl) {
        setPaymentUrl(response.paymentUrl);
      }
      
      // Se o pagamento estiver pendente ou em processamento, consulta o status
      if (response.status === 'pending' || response.status === 'processing') {
        return await pollPaymentStatus(response.id);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao processar pagamento";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPaymentStatus = async (paymentId: string): Promise<PaymentResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await PaymentService.getPaymentStatus(paymentId);
      
      // Se tiver uma URL de pagamento, armazena para redirecionamento quando necessário
      if (response.paymentUrl) {
        setPaymentUrl(response.paymentUrl);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao consultar status do pagamento";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para fazer polling do status de pagamento (útil para PIX e outros métodos assíncronos)
  const pollPaymentStatus = async (paymentId: string, attempts = 5, interval = 3000): Promise<PaymentResponse> => {
    let currentAttempt = 0;
    
    const checkStatus = async (): Promise<PaymentResponse> => {
      try {
        const statusResponse = await PaymentService.getPaymentStatus(paymentId);
        
        // Se o pagamento não estiver mais pendente ou em processamento, retorna o resultado
        if (statusResponse.status !== 'pending' && statusResponse.status !== 'processing') {
          return statusResponse;
        }
        
        // Se chegou ao número máximo de tentativas, retorna o último status conhecido
        if (currentAttempt >= attempts) {
          return statusResponse;
        }
        
        // Incrementa a tentativa e aguarda o intervalo antes de tentar novamente
        currentAttempt++;
        await new Promise(resolve => setTimeout(resolve, interval));
        return checkStatus();
      } catch (error) {
        // Em caso de erro, retorna uma resposta com status pendente
        return {
          id: paymentId,
          status: 'pending',
          amount: 0,
          paymentMethod: '',
          createdAt: new Date().toISOString()
        };
      }
    };
    
    return checkStatus();
  };
  
  const openPaymentUrl = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };
  
  return {
    processPayment,
    getPaymentStatus,
    openPaymentUrl,
    paymentUrl,
    isLoading,
    error
  };
};
