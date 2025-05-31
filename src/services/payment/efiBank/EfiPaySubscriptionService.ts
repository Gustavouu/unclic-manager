
import { supabase } from '@/integrations/supabase/client';
import { EfiPayAuthService } from './EfiPayAuthService';
import { Subscription, Invoice, SubscriptionStatus, InvoiceStatus } from './types';

export class EfiPaySubscriptionService {
  private authService: EfiPayAuthService;

  constructor() {
    this.authService = EfiPayAuthService.getInstance();
  }

  async createSubscription(data: {
    customer_id: string;
    plan_id: string;
    payment_method?: string;
    metadata?: Record<string, any>;
  }): Promise<Subscription> {
    try {
      // Get customer data from clients table
      const { data: customerData, error: customerError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', data.customer_id)
        .single();

      if (customerError || !customerData) {
        throw new Error('Customer not found');
      }

      // Create subscription in EfiPay
      const efiSubscription = await this.createEfiSubscription({
        customer: {
          name: customerData.name || '',
          email: customerData.email || '',
          cpf: '', // Would need to be added to client model
          phone: customerData.phone || '',
        },
        planId: data.plan_id,
        paymentMethod: data.payment_method || '',
      });

      // Save subscription in local database
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .insert({
          customer_id: data.customer_id,
          plan_id: data.plan_id,
          status: 'active' as SubscriptionStatus,
          start_date: new Date().toISOString(),
          payment_method: data.payment_method,
          provider_subscription_id: efiSubscription.id,
          metadata: data.metadata || {},
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: subscription.id,
        customer_id: subscription.customer_id,
        plan_id: subscription.plan_id,
        status: subscription.status as SubscriptionStatus,
        start_date: new Date(subscription.start_date),
        end_date: subscription.end_date ? new Date(subscription.end_date) : new Date(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at) : new Date(),
        payment_method: subscription.payment_method,
        provider_subscription_id: subscription.provider_subscription_id,
        metadata: typeof subscription.metadata === 'object' ? subscription.metadata as Record<string, any> : {},
        created_at: new Date(subscription.created_at),
        updated_at: new Date(subscription.updated_at),
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async getCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(subscription => ({
        id: subscription.id,
        customer_id: subscription.customer_id,
        plan_id: subscription.plan_id,
        status: subscription.status as SubscriptionStatus,
        start_date: new Date(subscription.start_date),
        end_date: subscription.end_date ? new Date(subscription.end_date) : new Date(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at) : new Date(),
        payment_method: subscription.payment_method,
        provider_subscription_id: subscription.provider_subscription_id,
        metadata: typeof subscription.metadata === 'object' ? subscription.metadata as Record<string, any> : {},
        created_at: new Date(subscription.created_at),
        updated_at: new Date(subscription.updated_at),
      }));
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  }

  async getSubscriptionInvoices(subscriptionId: string): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(invoice => ({
        id: invoice.id,
        subscription_id: invoice.subscription_id,
        customer_id: invoice.customer_id,
        amount: invoice.amount,
        status: invoice.status as InvoiceStatus,
        due_date: invoice.due_date ? new Date(invoice.due_date) : new Date(),
        paid_date: invoice.paid_date ? new Date(invoice.paid_date) : new Date(),
        payment_method: invoice.payment_method,
        provider_invoice_id: invoice.provider_invoice_id,
        line_items: Array.isArray(invoice.line_items) ? invoice.line_items : [],
        metadata: typeof invoice.metadata === 'object' ? invoice.metadata as Record<string, any> : {},
        created_at: new Date(invoice.created_at),
        updated_at: new Date(invoice.updated_at),
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  async createInvoice(
    customerId: string,
    amount: number,
    description: string,
    dueDate?: Date,
    subscriptionId?: string,
    businessId?: string
  ): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          customer_id: customerId,
          subscription_id: subscriptionId,
          amount,
          status: 'open' as InvoiceStatus,
          due_date: dueDate?.toISOString(),
          tenant_id: businessId,
          metadata: { description },
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        subscription_id: data.subscription_id,
        customer_id: data.customer_id,
        amount: data.amount,
        status: data.status as InvoiceStatus,
        due_date: data.due_date ? new Date(data.due_date) : new Date(),
        paid_date: data.paid_date ? new Date(data.paid_date) : new Date(),
        payment_method: data.payment_method,
        provider_invoice_id: data.provider_invoice_id,
        line_items: [],
        metadata: typeof data.metadata === 'object' ? data.metadata as Record<string, any> : {},
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  }

  async updateInvoiceStatus(
    invoiceId: string, 
    status: InvoiceStatus,
    paymentMethod?: string
  ): Promise<boolean> {
    try {
      const updateData: any = { status };
      if (paymentMethod) {
        updateData.payment_method = paymentMethod;
      }
      if (status === 'paid') {
        updateData.paid_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', invoiceId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      return false;
    }
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = false): Promise<boolean> {
    try {
      const updateData: any = {
        status: 'canceled',
        cancel_at_period_end: cancelAtPeriodEnd,
        updated_at: new Date().toISOString(),
      };

      if (!cancelAtPeriodEnd) {
        updateData.canceled_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', subscriptionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  }

  private async createEfiSubscription(data: any): Promise<any> {
    // Mock implementation - replace with actual EfiPay API call
    return {
      id: `efi_sub_${Date.now()}`,
      ...data,
    };
  }
}

export const efiPaySubscriptionService = new EfiPaySubscriptionService();
