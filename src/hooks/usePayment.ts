
import { useState } from "react";
import { PaymentRequest, PaymentResponse, PaymentService } from "@/services/payment";

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const processPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
    setIsLoading(true);
    setError(null);
    setPaymentUrl(null);

    try {
      const response = await PaymentService.createPayment(request);
      
      if (response.paymentUrl) {
        setPaymentUrl(response.paymentUrl);
      }
      
      return response;
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err : new Error("Unknown payment error"));
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
      console.error("Payment status error:", err);
      setError(err instanceof Error ? err : new Error("Unknown payment status error"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const openPaymentUrl = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  return {
    processPayment,
    getPaymentStatus,
    isLoading,
    error,
    paymentUrl,
    openPaymentUrl
  };
};
