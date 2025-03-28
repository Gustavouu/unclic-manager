
import { supabase } from "@/integrations/supabase/client";

export interface PaymentRequest {
  serviceId: string;
  amount: number;
  customerId: string;
  paymentMethod: string;
  description: string;
  appointmentId?: string;
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
      const paymentId = `PAY-${Math.random().toString(36).substring(2, 15)}`;
      
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
          id_servico: request.serviceId, // Renamed from id_servico to match column name
          id_cliente: request.customerId,
          id_agendamento: request.appointmentId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      let paymentUrl = null;
      
      if (request.paymentMethod === 'pix') {
        // In a real implementation, we would generate a PIX code or URL
        paymentUrl = `https://efi-bank.com/payment/${paymentId}`;
      } else if (request.paymentMethod === 'credit_card') {
        // In a real implementation, we would redirect to a credit card payment page
        paymentUrl = `https://efi-bank.com/payment/${paymentId}`;
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
      
      if (error) throw error;
      
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
