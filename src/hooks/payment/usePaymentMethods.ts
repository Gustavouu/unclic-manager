
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type PaymentMethodType = 'pix' | 'credit_card' | 'debit_card' | 'bank_slip' | 'bank_transfer';

export interface PaymentMethod {
  id: string;
  customerId: string;
  type: PaymentMethodType;
  isDefault: boolean;
  lastFour?: string;
  expiryDate?: string;
  brand?: string;
  holderName?: string;
  createdAt: Date;
}

export const usePaymentMethods = (customerId?: string) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setIsLoading(false);
      return;
    }

    const fetchPaymentMethods = async () => {
      try {
        // For now, return empty array since the payment_methods table doesn't exist
        // In a real implementation, this would fetch from a payment_methods table
        setPaymentMethods([]);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching payment methods:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [customerId]);

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => {
    // Implementation would go here
    console.log('Adding payment method:', method);
  };

  const removePaymentMethod = async (methodId: string) => {
    // Implementation would go here
    console.log('Removing payment method:', methodId);
  };

  const setDefaultPaymentMethod = async (methodId: string) => {
    // Implementation would go here
    console.log('Setting default payment method:', methodId);
  };

  return {
    paymentMethods,
    isLoading,
    error,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
  };
};
