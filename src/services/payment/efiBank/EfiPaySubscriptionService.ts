
import { supabase } from '@/integrations/supabase/client';
import { efiPayAuthService } from './EfiPayAuthService';
import { v4 as uuidv4 } from 'uuid';

export interface Subscription {
  id: string;
  customer_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'pending' | 'trialing' | 'unpaid';
  start_date: Date;
  end_date?: Date;
  cancel_at_period_end: boolean;
  canceled_at?: Date;
  payment_method?: string;
  provider_subscription_id?: string;
  metadata?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

export interface Invoice {
  id: string;
  subscription_id?: string;
  customer_id: string;
  amount: number;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  due_date?: Date;
  paid_date?: Date;
  payment_method?: string;
  provider_invoice_id?: string;
  payment_url?: string;
  line_items?: Array<{
    description: string;
    amount: number;
    quantity?: number;
  }>;
  metadata?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

interface CreateSubscriptionParams {
  customer_id: string;
  plan_id: string;
  payment_method?: string;
  metadata?: Record<string, any>;
}

/**
 * Service to manage EFI Pay subscriptions and invoices
 */
export class EfiPaySubscriptionService {
  private static instance: EfiPaySubscriptionService;
  private baseUrl: string = '';

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): EfiPaySubscriptionService {
    if (!EfiPaySubscriptionService.instance) {
      EfiPaySubscriptionService.instance = new EfiPaySubscriptionService();
    }
    return EfiPaySubscriptionService.instance;
  }

  private async getBaseUrl(): Promise<string> {
    if (this.baseUrl) return this.baseUrl;
    
    const config = await efiPayAuthService.getBusinessConfiguration();
    if (!config) throw new Error('No EFI Pay configuration found');
    
    this.baseUrl = config.sandbox
      ? 'https://api-pix-h.gerencianet.com.br'
      : 'https://api-pix.gerencianet.com.br';
    
    return this.baseUrl;
  }

  /**
   * Create a new subscription for a customer
   */
  public async createSubscription(subData: CreateSubscriptionParams, businessId?: string): Promise<Subscription | null> {
    try {
      // Get the plan details first
      const { data: planData, error: planError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', subData.plan_id)
        .single();

      if (planError || !planData) {
        console.error('Error fetching plan:', planError);
        return null;
      }

      // Get the customer details
      const { data: customerData, error: customerError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', subData.customer_id)
        .single();

      if (customerError || !customerData) {
        console.error('Error fetching customer:', customerError);
        return null;
      }

      const token = await efiPayAuthService.getToken(businessId);
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      const baseUrl = await this.getBaseUrl();
      
      // Format the subscription data for EFI Pay API
      const efiPaySubData = {
        plan_id: planData.provider_plan_id,
        customer: {
          name: customerData.nome,
          email: customerData.email,
          cpf: customerData.cpf,
          phone_number: customerData.telefone
        }
      };

      // Create subscription in EFI Pay
      const response = await fetch(`${baseUrl}/v1/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(efiPaySubData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create subscription: ${JSON.stringify(errorData)}`);
      }

      const efiPayResponse = await response.json();
      
      // Store subscription in our database
      const subscriptionId = uuidv4();
      const now = new Date();
      
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          id: subscriptionId,
          tenant_id: businessId,
          customer_id: subData.customer_id,
          plan_id: subData.plan_id,
          status: 'pending',
          start_date: now.toISOString(),
          payment_method: subData.payment_method,
          provider_subscription_id: efiPayResponse.subscription_id,
          metadata: subData.metadata || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing subscription in database:', error);
        return null;
      }

      return {
        id: data.id,
        customer_id: data.customer_id,
        plan_id: data.plan_id,
        status: data.status,
        start_date: new Date(data.start_date),
        end_date: data.end_date ? new Date(data.end_date) : undefined,
        cancel_at_period_end: data.cancel_at_period_end,
        canceled_at: data.canceled_at ? new Date(data.canceled_at) : undefined,
        payment_method: data.payment_method,
        provider_subscription_id: data.provider_subscription_id,
        metadata: data.metadata,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return null;
    }
  }

  /**
   * Get subscriptions for a customer
   */
  public async getCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscriptions:', error);
        return [];
      }

      return data.map(sub => ({
        id: sub.id,
        customer_id: sub.customer_id,
        plan_id: sub.plan_id,
        status: sub.status,
        start_date: new Date(sub.start_date),
        end_date: sub.end_date ? new Date(sub.end_date) : undefined,
        cancel_at_period_end: sub.cancel_at_period_end,
        canceled_at: sub.canceled_at ? new Date(sub.canceled_at) : undefined,
        payment_method: sub.payment_method,
        provider_subscription_id: sub.provider_subscription_id,
        metadata: sub.metadata,
        created_at: new Date(sub.created_at),
        updated_at: new Date(sub.updated_at)
      }));
    } catch (error) {
      console.error('Error getting customer subscriptions:', error);
      return [];
    }
  }

  /**
   * Get all invoices for a subscription
   */
  public async getSubscriptionInvoices(subscriptionId: string): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('due_date', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
        return [];
      }

      return data.map(invoice => ({
        id: invoice.id,
        subscription_id: invoice.subscription_id,
        customer_id: invoice.customer_id,
        amount: invoice.amount,
        status: invoice.status,
        due_date: invoice.due_date ? new Date(invoice.due_date) : undefined,
        paid_date: invoice.paid_date ? new Date(invoice.paid_date) : undefined,
        payment_method: invoice.payment_method,
        provider_invoice_id: invoice.provider_invoice_id,
        payment_url: invoice.payment_url,
        line_items: invoice.line_items,
        metadata: invoice.metadata,
        created_at: new Date(invoice.created_at),
        updated_at: new Date(invoice.updated_at)
      }));
    } catch (error) {
      console.error('Error getting subscription invoices:', error);
      return [];
    }
  }

  /**
   * Cancel a subscription
   */
  public async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = false): Promise<boolean> {
    try {
      // Get the subscription details first
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .single();

      if (subError || !subData) {
        console.error('Error fetching subscription:', subError);
        return false;
      }

      const token = await efiPayAuthService.getToken();
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      const baseUrl = await this.getBaseUrl();
      
      // Cancel subscription in EFI Pay
      const response = await fetch(`${baseUrl}/v1/subscription/${subData.provider_subscription_id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to cancel subscription: ${JSON.stringify(errorData)}`);
      }

      // Update subscription in our database
      const now = new Date().toISOString();
      let updateData;
      
      if (cancelAtPeriodEnd) {
        updateData = { 
          cancel_at_period_end: true 
        };
      } else {
        updateData = {
          status: 'canceled',
          canceled_at: now
        };
      }
      
      const { error } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', subscriptionId);

      if (error) {
        console.error('Error updating subscription:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  }

  /**
   * Create a new invoice for a customer
   */
  public async createInvoice(
    customerId: string,
    amount: number,
    description: string,
    dueDate?: Date,
    subscriptionId?: string,
    businessId?: string
  ): Promise<Invoice | null> {
    try {
      // Get the customer details
      const { data: customerData, error: customerError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', customerId)
        .single();

      if (customerError || !customerData) {
        console.error('Error fetching customer:', customerError);
        return null;
      }

      const token = await efiPayAuthService.getToken(businessId);
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      const baseUrl = await this.getBaseUrl();
      
      // Format the charge data for EFI Pay API
      const efiPayChargeData = {
        items: [{
          name: description,
          value: amount * 100, // EFI Pay uses cents
          amount: 1
        }],
        customer: {
          name: customerData.nome,
          email: customerData.email,
          cpf: customerData.cpf,
          phone_number: customerData.telefone
        },
        expire_at: dueDate ? Math.floor(dueDate.getTime() / 1000) : undefined
      };

      // Create charge in EFI Pay
      const response = await fetch(`${baseUrl}/v1/charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(efiPayChargeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create charge: ${JSON.stringify(errorData)}`);
      }

      const efiPayResponse = await response.json();
      
      // Create payment link for the charge
      const linkResponse = await fetch(`${baseUrl}/v1/charge/${efiPayResponse.charge_id}/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          expire_at: dueDate ? Math.floor(dueDate.getTime() / 1000) : undefined,
          request_delivery_address: false,
          payment_method: "all" // Allow all payment methods
        })
      });

      if (!linkResponse.ok) {
        const errorData = await linkResponse.json();
        throw new Error(`Failed to create payment link: ${JSON.stringify(errorData)}`);
      }
      
      const linkData = await linkResponse.json();

      // Store invoice in our database
      const invoiceId = uuidv4();
      
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          id: invoiceId,
          tenant_id: businessId,
          subscription_id: subscriptionId,
          customer_id: customerId,
          amount: amount,
          status: 'open',
          due_date: dueDate?.toISOString(),
          provider_invoice_id: efiPayResponse.charge_id,
          payment_url: linkData.payment_url,
          line_items: [{
            description: description,
            amount: amount,
            quantity: 1
          }]
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing invoice in database:', error);
        return null;
      }

      return {
        id: data.id,
        subscription_id: data.subscription_id,
        customer_id: data.customer_id,
        amount: data.amount,
        status: data.status,
        due_date: data.due_date ? new Date(data.due_date) : undefined,
        paid_date: data.paid_date ? new Date(data.paid_date) : undefined,
        payment_method: data.payment_method,
        provider_invoice_id: data.provider_invoice_id,
        payment_url: data.payment_url,
        line_items: data.line_items,
        metadata: data.metadata,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  }

  /**
   * Update invoice status
   */
  public async updateInvoiceStatus(
    invoiceId: string, 
    status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void',
    paymentMethod?: string
  ): Promise<boolean> {
    try {
      const updateData: any = { status };
      
      if (status === 'paid' && !paymentMethod) {
        updateData.paid_date = new Date().toISOString();
      }
      
      if (paymentMethod) {
        updateData.payment_method = paymentMethod;
      }
      
      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', invoiceId);

      if (error) {
        console.error('Error updating invoice status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      return false;
    }
  }
}

export const efiPaySubscriptionService = EfiPaySubscriptionService.getInstance();
