
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { efiPaySubscriptionService } from './EfiPaySubscriptionService';
import crypto from 'crypto';

export interface WebhookEvent {
  id: string;
  provider: string;
  event_type: string;
  event_id: string;
  payload: any;
  processed: boolean;
  processed_at?: Date;
  error?: string;
  created_at: Date;
}

/**
 * Service to handle EFI Pay webhooks
 */
export class EfiPayWebhookService {
  private static instance: EfiPayWebhookService;

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): EfiPayWebhookService {
    if (!EfiPayWebhookService.instance) {
      EfiPayWebhookService.instance = new EfiPayWebhookService();
    }
    return EfiPayWebhookService.instance;
  }

  /**
   * Validate webhook signature
   */
  public validateSignature(payload: string, signature: string, secret: string): boolean {
    try {
      const hmac = crypto.createHmac('sha256', secret);
      const expectedSignature = hmac.update(payload).digest('hex');
      return crypto.timingSafeEqual(
        Buffer.from(signature), 
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('Error validating webhook signature:', error);
      return false;
    }
  }

  /**
   * Process an incoming webhook
   */
  public async processWebhook(
    event: string, 
    payload: any, 
    eventId: string,
    businessId?: string
  ): Promise<boolean> {
    try {
      // Check if we've already processed this event
      const { data: existingEvent } = await supabase
        .from('webhook_events')
        .select('id')
        .eq('provider', 'efi_pay')
        .eq('event_id', eventId)
        .single();

      if (existingEvent) {
        console.log(`Event ${eventId} already processed, skipping`);
        return true;
      }

      // Store the webhook event
      const { error: insertError } = await supabase
        .from('webhook_events')
        .insert({
          id: uuidv4(),
          tenant_id: businessId,
          provider: 'efi_pay',
          event_type: event,
          event_id: eventId,
          payload: payload,
          processed: false
        });

      if (insertError) {
        console.error('Error storing webhook event:', insertError);
        return false;
      }

      // Process the webhook based on event type
      let success = false;

      switch (event) {
        case 'charge.status_updated':
          success = await this.handleChargeStatusUpdate(payload);
          break;
        case 'subscription.created':
        case 'subscription.updated':
          success = await this.handleSubscriptionUpdate(payload);
          break;
        case 'subscription.canceled':
          success = await this.handleSubscriptionCanceled(payload);
          break;
        default:
          console.log(`Unhandled event type: ${event}`);
          success = true; // Mark as processed since we don't need to handle it
      }

      // Mark the webhook as processed
      if (success) {
        await supabase
          .from('webhook_events')
          .update({
            processed: true,
            processed_at: new Date().toISOString()
          })
          .eq('provider', 'efi_pay')
          .eq('event_id', eventId);
      } else {
        await supabase
          .from('webhook_events')
          .update({
            error: 'Failed to process webhook'
          })
          .eq('provider', 'efi_pay')
          .eq('event_id', eventId);
      }

      return success;
    } catch (error) {
      console.error('Error processing webhook:', error);
      return false;
    }
  }

  /**
   * Handle charge status update events
   */
  private async handleChargeStatusUpdate(payload: any): Promise<boolean> {
    try {
      const chargeId = payload.data.charge_id;
      const status = payload.data.status;
      
      // Find the invoice with this charge ID
      const { data: invoice, error } = await supabase
        .from('invoices')
        .select('id')
        .eq('provider_invoice_id', chargeId)
        .single();

      if (error || !invoice) {
        console.error('Error finding invoice for charge:', error);
        return false;
      }

      // Map EFI Pay status to our status
      let invoiceStatus: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
      switch (status) {
        case 'paid':
          invoiceStatus = 'paid';
          break;
        case 'canceled':
          invoiceStatus = 'void';
          break;
        case 'expired':
          invoiceStatus = 'uncollectible';
          break;
        case 'waiting':
          invoiceStatus = 'open';
          break;
        default:
          invoiceStatus = 'open';
      }

      // Update the invoice status
      return await efiPaySubscriptionService.updateInvoiceStatus(
        invoice.id, 
        invoiceStatus,
        payload.data.payment?.payment_method
      );
    } catch (error) {
      console.error('Error handling charge status update:', error);
      return false;
    }
  }

  /**
   * Handle subscription update events
   */
  private async handleSubscriptionUpdate(payload: any): Promise<boolean> {
    try {
      const subscriptionId = payload.data.subscription_id;
      const status = payload.data.status;
      
      // Find the subscription with this provider ID
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('provider_subscription_id', subscriptionId)
        .single();

      if (error || !subscription) {
        console.error('Error finding subscription:', error);
        return false;
      }

      // Map EFI Pay status to our status
      let subStatus: 'active' | 'canceled' | 'past_due' | 'pending' | 'trialing' | 'unpaid';
      switch (status) {
        case 'active':
          subStatus = 'active';
          break;
        case 'canceled':
          subStatus = 'canceled';
          break;
        case 'expired':
          subStatus = 'canceled';
          break;
        default:
          subStatus = 'active';
      }

      // Update the subscription
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ status: subStatus })
        .eq('id', subscription.id);

      return !updateError;
    } catch (error) {
      console.error('Error handling subscription update:', error);
      return false;
    }
  }

  /**
   * Handle subscription canceled events
   */
  private async handleSubscriptionCanceled(payload: any): Promise<boolean> {
    try {
      const subscriptionId = payload.data.subscription_id;
      
      // Find the subscription with this provider ID
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('provider_subscription_id', subscriptionId)
        .single();

      if (error || !subscription) {
        console.error('Error finding subscription:', error);
        return false;
      }

      // Update the subscription
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          canceled_at: new Date().toISOString()
        })
        .eq('id', subscription.id);

      return !updateError;
    } catch (error) {
      console.error('Error handling subscription canceled:', error);
      return false;
    }
  }

  /**
   * Log webhook related events
   */
  public async logEvent(
    operation: string, 
    status: string, 
    details?: any,
    businessId?: string
  ): Promise<void> {
    try {
      await supabase
        .from('payment_logs')
        .insert({
          id: uuidv4(),
          tenant_id: businessId,
          operation,
          status,
          details
        });
    } catch (error) {
      console.error('Error logging webhook event:', error);
    }
  }
}

export const efiPayWebhookService = EfiPayWebhookService.getInstance();
