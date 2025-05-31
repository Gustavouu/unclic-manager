
import { useState, useEffect } from 'react';

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'cash';
  isActive: boolean;
}

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', name: 'Cartão de Crédito', type: 'credit_card', isActive: true },
    { id: '2', name: 'Cartão de Débito', type: 'debit_card', isActive: true },
    { id: '3', name: 'PIX', type: 'pix', isActive: true },
    { id: '4', name: 'Dinheiro', type: 'cash', isActive: true },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return {
    paymentMethods,
    isLoading,
    error,
  };
}
