
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
      // Generate a payment ID for this transaction
      const paymentId = crypto.randomUUID(); // Using UUID instead of random string
      
      // Create a transaction record in the database
      const { data, error } = await supabase
        .from('transacoes')
        .insert({
          id: paymentId,
          tipo: 'receita',
          valor: request.amount,
          metodo_pagamento: request.paymentMethod,
          status: request.paymentMethod === 'cash' ? 'approved' : 'pending',
          descricao: request.description,
          // Store service ID in notes as JSON since there's no direct column for it
          notas: JSON.stringify({ 
            serviceId: request.serviceId,
            source: 'payment_service' 
          }),
          id_cliente: request.customerId,
          id_agendamento: request.appointmentId,
          id_negocio: request.businessId || "1" // Default to "1" if not provided
        })
        .select()
        .single();
      
      if (error) {
        console.error("Database error:", error);
        throw new Error(`Erro de banco de dados: ${error.message}`);
      }
      
      let paymentUrl = null;
      
      // For non-cash payments, generate appropriate payment URLs
      if (request.paymentMethod === 'pix') {
        // In a real implementation, we would generate a PIX code or URL
        const webhookUrl = new URL(window.location.origin);
        webhookUrl.pathname = "/api/webhook-handler";
        paymentUrl = `https://efi-bank.com/payment/${paymentId}?callback=${encodeURIComponent(webhookUrl.toString())}`;
      } else if (request.paymentMethod === 'credit_card') {
        // In a real implementation, we would redirect to a credit card payment page
        const webhookUrl = new URL(window.location.origin);
        webhookUrl.pathname = "/api/webhook-handler";
        paymentUrl = `https://efi-bank.com/payment/${paymentId}?callback=${encodeURIComponent(webhookUrl.toString())}`;
      }
      
      // Notify our webhook handler about the new payment
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
              amount: data.valor,
              payment_method: data.metodo_pagamento
            }
          })
        });
      } catch (webhookError) {
        // Log but don't fail the transaction if webhook notification fails
        console.warn("Could not notify webhook about new payment:", webhookError);
      }
      
      return {
        id: paymentId,
        status: data.status as "pending" | "approved" | "rejected" | "cancelled" | "processing",
        amount: data.valor,
        paymentMethod: data.metodo_pagamento,
        createdAt: data.criado_em,
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
        .from('transacoes')
        .select()
        .eq('id', paymentId)
        .single();
      
      if (error) {
        console.error("Database error:", error);
        throw new Error(`Erro ao consultar o status: ${error.message}`);
      }
      
      // If successful, check if we need to simulate a status update for demo purposes
      if (data && data.status === 'pending') {
        // Randomly decide if we should update the status (for demo purposes)
        const shouldUpdateStatus = Math.random() > 0.7;
        
        if (shouldUpdateStatus) {
          const newStatus = Math.random() > 0.5 ? 'approved' : 'processing';
          
          // Update the transaction status in the database
          const { error: updateError } = await supabase
            .from('transacoes')
            .update({ 
              status: newStatus,
              data_pagamento: newStatus === 'approved' ? new Date().toISOString() : null
            })
            .eq('id', paymentId);
          
          if (updateError) {
            console.warn("Could not update payment status:", updateError);
          } else {
            data.status = newStatus;
          }
          
          // Notify webhook about the status change
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
        status: data.status as "pending" | "approved" | "rejected" | "cancelled" | "processing",
        amount: data.valor,
        paymentMethod: data.metodo_pagamento,
        createdAt: data.criado_em,
        transactionId: data.id
      };
    } catch (error) {
      console.error("Error fetching payment status:", error);
      throw new Error("Falha ao obter o status do pagamento.");
    }
  }
};
