
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
        // Check if there's already a financial transaction for this appointment
        const { data: existingTransaction, error: checkError } = await supabase
          .from('financial_transactions')
          .select('id')
          .eq('appointmentId', data.appointmentId)
          .eq('type', 'INCOME')
          .single();
          
        if (checkError && !existingTransaction) {
          // Get appointment details
          const { data: appointment, error: appointmentError } = await supabase
            .from('appointments')
            .select(`
              id,
              tenantId,
              customerId,
              appointment_services (
                price,
                serviceId,
                services:serviceId (name)
              )
            `)
            .eq('id', data.appointmentId)
            .single();
            
          if (appointmentError) throw appointmentError;
          
          // Calculate total price from services
          const totalPrice = appointment.appointment_services?.reduce(
            (sum, service) => sum + Number(service.price), 0
          ) || 0;
          
          // Get default financial account
          const { data: accounts } = await supabase
            .from('financial_accounts')
            .select('id')
            .eq('tenantId', appointment.tenantId)
            .eq('isActive', true)
            .limit(1);
            
          if (!accounts || accounts.length === 0) {
            throw new Error("No active financial account found");
          }
          
          // Create financial transaction
          await supabase.from('financial_transactions').insert({
            id: crypto.randomUUID(),
            tenantId: appointment.tenantId,
            customerId: appointment.customerId,
            appointmentId: appointment.id,
            accountId: accounts[0].id,
            type: 'INCOME',
            amount: totalPrice,
            status: 'PENDING',
            description: `Agendamento #${appointment.id.substring(0, 8)}`,
            createdById: data.userId || null
          });
          
          console.log(`Created financial transaction for appointment ${appointment.id}`);
        }
      } catch (error) {
        console.error("Error handling appointment.completed webhook:", error);
      }
    });
    
    // Handle payment.completed event
    this.on('payment.completed', async (data) => {
      try {
        // Update the transaction status to PAID
        if (data.transactionId) {
          await supabase
            .from('financial_transactions')
            .update({ 
              status: 'PAID',
              paymentDate: new Date().toISOString(),
              paymentMethod: data.paymentMethod || 'OTHER'
            })
            .eq('id', data.transactionId);
            
          console.log(`Updated transaction ${data.transactionId} status to PAID`);
          
          // If transaction has an appointmentId, check for product usage
          if (data.appointmentId) {
            await this.handleProductConsumption(data.appointmentId);
          }
        }
      } catch (error) {
        console.error("Error handling payment.completed webhook:", error);
      }
    });
  }
  
  /**
   * Handle product consumption for appointment
   */
  private static async handleProductConsumption(appointmentId: string): Promise<void> {
    try {
      // Get services from the appointment
      const { data: appointmentServices } = await supabase
        .from('appointment_services')
        .select(`
          serviceId,
          service_products:serviceId (
            productId,
            quantity,
            products:productId (id, name)
          )
        `)
        .eq('appointmentId', appointmentId);
        
      if (!appointmentServices || appointmentServices.length === 0) return;
      
      // For each service, deduct the products used from stock
      for (const service of appointmentServices) {
        const serviceProducts = service.service_products;
        
        if (serviceProducts && Array.isArray(serviceProducts)) {
          for (const product of serviceProducts) {
            if (product.productId && product.quantity > 0) {
              // Add a stock movement for the product
              await supabase.from('stock_movements').insert({
                id: crypto.randomUUID(),
                tenantId: appointmentId, // Using appointmentId as tenantId for demo
                establishmentId: appointmentId, // Using appointmentId as establishmentId for demo
                productId: product.productId,
                quantity: product.quantity,
                type: 'OUT',
                reason: 'SERVICE_CONSUMPTION',
                notes: `Consumo em serviço - Agendamento #${appointmentId.substring(0, 8)}`
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error handling product consumption:", error);
    }
  }
}

// Initialize integrations
WebhookIntegration.initializeIntegrations();
