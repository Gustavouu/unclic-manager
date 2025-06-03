
import { supabase } from "@/integrations/supabase/client";

export interface PaymentRequest {
  serviceId: string;
  amount: number;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod: string;
  description: string;
  appointmentId?: string;
  businessId?: string;
}

export interface PaymentResponse {
  id: string;
  status: "pending" | "approved" | "rejected" | "cancelled" | "processing";
  amount: number;
  paymentMethod: string;
  createdAt: string;
  paymentUrl?: string;
  transactionId?: string;
}

export const PaymentService = {
  /**
   * Creates a new payment transaction
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentId = crypto.randomUUID();
      
      // Create transaction in financial_transactions table
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert({
          id: paymentId,
          type: 'INCOME',
          amount: request.amount,
          paymentMethod: request.paymentMethod as any,
          status: request.paymentMethod === 'CASH' ? 'PAID' : 'PENDING',
          description: request.description,
          notes: JSON.stringify({ 
            serviceId: request.serviceId,
            source: 'payment_service' 
          }),
          customerId: request.customerId,
          appointmentId: request.appointmentId,
          tenantId: request.businessId || "1",
          accountId: "default-account"
        })
        .select()
        .single();
      
      if (error) {
        console.error("Database error:", error);
        throw new Error(`Erro de banco de dados: ${error.message}`);
      }
      
      let paymentUrl = null;
      
      if (request.paymentMethod === 'PIX') {
        const webhookUrl = new URL(window.location.origin);
        webhookUrl.pathname = "/api/webhook-handler";
        paymentUrl = `https://efi-bank.com/payment/${paymentId}?callback=${encodeURIComponent(webhookUrl.toString())}`;
      } else if (request.paymentMethod === 'CREDIT_CARD') {
        const webhookUrl = new URL(window.location.origin);
        webhookUrl.pathname = "/api/webhook-handler";
        paymentUrl = `https://efi-bank.com/payment/${paymentId}?callback=${encodeURIComponent(webhookUrl.toString())}`;
      }
      
      try {
        await fetch('/api/webhook-handler', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'payment.created',
            data: {
              payment_id: paymentId,
              status: data.status,
              amount: data.amount,
              payment_method: data.paymentMethod
            }
          })
        });
      } catch (webhookError) {
        console.warn("Could not notify webhook about new payment:", webhookError);
      }
      
      return {
        id: paymentId,
        status: data.status as any,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        createdAt: data.createdAt,
        paymentUrl: paymentUrl,
        transactionId: paymentId
      };
    } catch (error) {
      console.error("Error creating payment:", error);
      throw new Error("Falha ao processar pagamento. Por favor, tente novamente.");
    }
  },
  
  /**
   * Gets the status of a payment transaction
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select()
        .eq('id', paymentId)
        .single();
      
      if (error) {
        console.error("Database error:", error);
        throw new Error(`Erro ao consultar o status: ${error.message}`);
      }
      
      if (data && data.status === 'PENDING') {
        const shouldUpdateStatus = Math.random() > 0.7;
        
        if (shouldUpdateStatus) {
          const newStatus = Math.random() > 0.5 ? 'PAID' : 'PROCESSING';
          
          const { error: updateError } = await supabase
            .from('financial_transactions')
            .update({ 
              status: newStatus,
              paymentDate: newStatus === 'PAID' ? new Date().toISOString() : null
            })
            .eq('id', paymentId);
          
          if (updateError) {
            console.warn("Could not update payment status:", updateError);
          } else {
            data.status = newStatus;
          }
          
          try {
            await fetch('/api/webhook-handler', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                event: 'payment.updated',
                data: {
                  payment_id: paymentId,
                  status: newStatus,
                  updated_at: new Date().toISOString()
                }
              })
            });
          } catch (webhookError) {
            console.warn("Could not notify webhook about status update:", webhookError);
          }
        }
      }
      
      return {
        id: data.id,
        status: data.status as any,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        createdAt: data.createdAt,
        transactionId: data.id
      };
    } catch (error) {
      console.error("Error fetching payment status:", error);
      throw new Error("Falha ao obter o status do pagamento.");
    }
  }
};
