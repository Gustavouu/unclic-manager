
import { supabase } from '@/integrations/supabase/client';
import { EfiPayAuthService } from './EfiPayAuthService';
import { Subscription, Invoice, SubscriptionStatus, InvoiceStatus } from './types';

export class EfiPaySubscriptionService {
  private authService: EfiPayAuthService;

  constructor() {
    this.authService = EfiPayAuthService.getInstance();
  }

  async createSubscription(data: {
    customerId: string;
    planId: string;
    paymentMethod: string;
    startDate?: Date;
  }): Promise<Subscription> {
    try {
      // Get customer data from clients table
      const { data: customerData, error: customerError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', data.customerId)
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
        planId: data.planId,
        paymentMethod: data.paymentMethod,
      });

      // Save subscription in local database
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .insert({
          customer_id: data.customerId,
          plan_id: data.planId,
          status: 'active' as SubscriptionStatus,
          start_date: data.startDate || new Date(),
          payment_method: data.paymentMethod,
          provider_subscription_id: efiSubscription.id,
          metadata: {},
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
        end_date: new Date(subscription.end_date),
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: new Date(subscription.canceled_at),
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

  async getSubscriptions(customerId?: string): Promise<Subscription[]> {
    try {
      let query = supabase
        .from('subscriptions')
        .select('*');

      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(subscription => ({
        id: subscription.id,
        customer_id: subscription.customer_id,
        plan_id: subscription.plan_id,
        status: subscription.status as SubscriptionStatus,
        start_date: new Date(subscription.start_date),
        end_date: new Date(subscription.end_date),
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: new Date(subscription.canceled_at),
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

  async getInvoices(subscriptionId?: string): Promise<Invoice[]> {
    try {
      let query = supabase
        .from('invoices')
        .select('*');

      if (subscriptionId) {
        query = query.eq('subscription_id', subscriptionId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(invoice => ({
        id: invoice.id,
        subscription_id: invoice.subscription_id,
        customer_id: invoice.customer_id,
        amount: invoice.amount,
        status: invoice.status as InvoiceStatus,
        due_date: new Date(invoice.due_date),
        paid_date: new Date(invoice.paid_date),
        payment_method: invoice.payment_method,
        provider_invoice_id: invoice.provider_invoice_id,
        line_items: invoice.line_items,
        metadata: invoice.metadata,
        created_at: new Date(invoice.created_at),
        updated_at: new Date(invoice.updated_at),
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriptionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  private async createEfiSubscription(data: any): Promise<any> {
    // Mock implementation - replace with actual EfiPay API call
    return {
      id: `efi_sub_${Date.now()}`,
      ...data,
    };
  }

  async updateSubscriptionFromWebhook(webhookData: any): Promise<void> {
    try {
      // Get customer data from clients table
      const { data: customerData, error: customerError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', webhookData.customer_id)
        .single();

      if (customerError || !customerData) {
        throw new Error('Customer not found for webhook update');
      }

      // Update subscription based on webhook data
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: webhookData.status,
          updated_at: new Date().toISOString(),
        })
        .eq('provider_subscription_id', webhookData.subscription_id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating subscription from webhook:', error);
      throw error;
    }
  }
}
