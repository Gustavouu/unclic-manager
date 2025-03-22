
import { useState } from "react";
import { PaymentRequest, PaymentResponse, PaymentService } from "@/services/PaymentService";

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const processPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simula o tempo de processamento real
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Envia requisição para criar o pagamento
      const response = await PaymentService.createPayment(request);
      
      // Se o pagamento for criado com sucesso, consulta o status
      // (em uma aplicação real, poderia haver um webhook ou polling)
      if (response.id) {
        const statusResponse = await PaymentService.getPaymentStatus(response.id);
        return statusResponse;
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
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao consultar status do pagamento";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    processPayment,
    getPaymentStatus,
    isLoading,
    error
  };
};
