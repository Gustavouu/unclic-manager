
import { supabase } from "@/integrations/supabase/client";
import { WebhookService } from "../webhook";

/**
 * Service for handling transaction database operations
 */
export const TransactionService = {
  /**
   * Creates a transaction record in the database
   */
  async createTransaction(data: {
    serviceId: string;
    appointmentId: string | null;
    customerId: string;
    amount: number;
    paymentMethod: string;
    description: string;
    businessId?: string;
  }) {
    const { data: dbTransaction, error } = await supabase
      .from('transacoes')
      .insert({
        id_servico: data.serviceId,
        id_agendamento: data.appointmentId || null,
        id_cliente: data.customerId,
        valor: data.amount,
        metodo_pagamento: data.paymentMethod,
        descricao: data.description,
        tipo: "receita",
        status: "pendente",
        id_negocio: data.businessId || "1" // Default business ID
      })
      .select('id, status, metodo_pagamento, valor, criado_em, notas')
      .single();

    if (error) {
      console.error("Database error:", error);
      throw new Error("Erro ao registrar transação no banco de dados");
    }
    
    if (!dbTransaction) {
      throw new Error("Nenhuma transação retornada após a inserção");
    }

    return dbTransaction;
  },

  /**
   * Updates a transaction with payment provider data
   */
  async updateTransactionWithProviderData(
    transactionId: string,
    providerData: {
      transaction_id?: string;
      payment_url?: string;
      status?: string;
      provider?: string;
    }
  ) {
    try {
      // Store provider information in the notas field as JSON
      const efiDataJSON = JSON.stringify({
        transaction_id: providerData.transaction_id,
        payment_url: providerData.payment_url,
        provider: providerData.provider || 'efi_bank'
      });
      
      await supabase
        .from('transacoes')
        .update({ 
          status: providerData.status,
          notas: efiDataJSON
        })
        .eq('id', transactionId);
    } catch (error) {
      console.error("Error updating transaction with provider data:", error);
      // Continue even if update fails, as we already have the transaction in our system
    }
  },

  /**
   * Gets a transaction by ID
   */
  async getTransaction(transactionId: string) {
    const { data, error } = await supabase
      .from('transacoes')
      .select('id, status, metodo_pagamento, valor, criado_em, notas')
      .eq('id', transactionId)
      .single();

    if (error) {
      console.error("Database error:", error);
      throw new Error("Erro ao consultar transação no banco de dados");
    }
    
    if (!data) {
      throw new Error("Transação não encontrada");
    }

    return data;
  },

  /**
   * Updates the status of a transaction
   */
  async updateTransactionStatus(
    transactionId: string,
    status: string,
    isPaid: boolean = false
  ) {
    try {
      const updateData: any = { status };
      
      if (isPaid) {
        updateData.data_pagamento = new Date().toISOString();
      }
      
      await supabase
        .from('transacoes')
        .update(updateData)
        .eq('id', transactionId);
        
      // Send webhook notification
      WebhookService.sendWebhookNotification('payment.updated', {
        payment_id: transactionId,
        status,
        updated_at: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error("Error updating transaction status:", error);
      return false;
    }
  }
};
