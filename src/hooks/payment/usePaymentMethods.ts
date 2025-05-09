
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentMethod {
  id: string;
  customer_id: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'bank_slip' | 'bank_transfer';
  is_default: boolean;
  last_four?: string;
  expiry_date?: string;
  brand?: string;
  holder_name?: string;
  created_at: Date;
}

export function usePaymentMethods(customerId?: string) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPaymentMethods = async (id?: string) => {
    const custId = id || customerId;
    if (!custId) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('customer_id', custId)
        .order('is_default', { ascending: false });

      if (fetchError) {
        throw new Error(`Failed to fetch payment methods: ${fetchError.message}`);
      }

      setPaymentMethods(data.map(pm => ({
        id: pm.id,
        customer_id: pm.customer_id,
        type: pm.type,
        is_default: pm.is_default,
        last_four: pm.last_four,
        expiry_date: pm.expiry_date,
        brand: pm.brand,
        holder_name: pm.holder_name,
        created_at: new Date(pm.created_at)
      })));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch payment methods'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchPaymentMethods();
    }
  }, [customerId]);

  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    if (!customerId) return false;
    
    try {
      setIsLoading(true);
      setError(null);

      // First, set all payment methods for this customer to not default
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('customer_id', customerId);
      
      // Then set the selected one as default
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', paymentMethodId);

      if (updateError) {
        throw new Error(`Failed to set default payment method: ${updateError.message}`);
      }

      // Update local state
      setPaymentMethods(prev => 
        prev.map(pm => ({
          ...pm,
          is_default: pm.id === paymentMethodId
        }))
      );

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set default payment method'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePaymentMethod = async (paymentMethodId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentMethodId);

      if (deleteError) {
        throw new Error(`Failed to delete payment method: ${deleteError.message}`);
      }

      // Update local state
      setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete payment method'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    paymentMethods,
    isLoading,
    error,
    fetchPaymentMethods,
    setDefaultPaymentMethod,
    deletePaymentMethod,
  };
}
