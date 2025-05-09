
import { useState, useEffect } from 'react';
import { efiPaySubscriptionService, Invoice } from '@/services/payment/efiBank/EfiPaySubscriptionService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

export function useInvoices(subscriptionId?: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { businessId } = useCurrentBusiness();

  const fetchInvoices = async (id?: string) => {
    const subId = id || subscriptionId;
    if (!subId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedInvoices = await efiPaySubscriptionService.getSubscriptionInvoices(subId);
      setInvoices(fetchedInvoices);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch invoices'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (subscriptionId) {
      fetchInvoices();
    }
  }, [subscriptionId]);

  const createInvoice = async (
    customerId: string,
    amount: number,
    description: string,
    dueDate?: Date,
    subId?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const newInvoice = await efiPaySubscriptionService.createInvoice(
        customerId,
        amount,
        description,
        dueDate,
        subId || subscriptionId,
        businessId || undefined
      );
      
      if (newInvoice && subscriptionId === subId) {
        setInvoices(prev => [newInvoice, ...prev]);
      }
      
      return newInvoice;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create invoice'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateInvoiceStatus = async (
    invoiceId: string, 
    status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void',
    paymentMethod?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await efiPaySubscriptionService.updateInvoiceStatus(
        invoiceId, 
        status, 
        paymentMethod
      );
      
      if (success) {
        setInvoices(prev => 
          prev.map(inv => 
            inv.id === invoiceId 
              ? { 
                  ...inv, 
                  status,
                  payment_method: paymentMethod || inv.payment_method,
                  paid_date: status === 'paid' ? new Date() : inv.paid_date
                } 
              : inv
          )
        );
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update invoice status'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    invoices,
    isLoading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoiceStatus,
  };
}
