
import { supabase } from "@/integrations/supabase/client";

interface WebhookPayload {
  event: string;
  data: any;
}

type WebhookHandler = (data: any) => Promise<void>;

export class WebhookIntegration {
  private static handlers: Record<string, WebhookHandler[]> = {};

  /**
   * Register a handler for a specific webhook event
   */
  public static on(event: string, handler: WebhookHandler): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  /**
   * Process an incoming webhook
   */
  public static async processWebhook(payload: WebhookPayload): Promise<{ success: boolean; message?: string }> {
    try {
      const { event, data } = payload;
      
      if (!event || !data) {
        return { success: false, message: "Invalid webhook payload" };
      }
      
      console.log(`Processing webhook event: ${event}`);
      
      // Store the webhook in the database
      await this.storeWebhookEvent(event, data);
      
      // Call registered handlers
      if (this.handlers[event]) {
        await Promise.all(
          this.handlers[event].map(handler => handler(data))
        );
      } else {
        console.warn(`No handler registered for event: ${event}`);
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Error processing webhook:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Store webhook event in the database
   */
  private static async storeWebhookEvent(
    eventType: string, 
    payload: any
  ): Promise<void> {
    try {
      await supabase.from('webhook_events').insert({
        event_type: eventType,
        payload,
        provider: payload.provider || 'system',
        event_id: payload.id || crypto.randomUUID(),
        processed: false
      });
    } catch (error) {
      console.error("Failed to store webhook event:", error);
      // Don't throw error, just log it
    }
  }

  /**
   * Initialize standard webhook integrations
   */
  public static initializeIntegrations(): void {
    // Handle appointment.completed event
    this.on('appointment.completed', async (data) => {
      try {
        console.log(`Processing appointment.completed for appointment ${data.appointmentId}`);
        
        // For now, just log the event - we can implement the full logic later
        // when we have the proper database schema in place
        console.log('Appointment completed webhook processed');
        
      } catch (error) {
        console.error("Error handling appointment.completed webhook:", error);
      }
    });
    
    // Handle payment.completed event
    this.on('payment.completed', async (data) => {
      try {
        console.log(`Processing payment.completed for transaction ${data.transactionId}`);
        
        // For now, just log the event
        console.log('Payment completed webhook processed');
        
      } catch (error) {
        console.error("Error handling payment.completed webhook:", error);
      }
    });
  }
}

// Initialize integrations
WebhookIntegration.initializeIntegrations();
