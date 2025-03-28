
import { supabase } from "@/integrations/supabase/client";
import { WebhookService } from "../webhook";
import { v4 as uuidv4 } from "uuid";

// In-memory transactions storage for demo purposes
const transactionsStore = new Map();

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
    try {
      // Generate a unique transaction ID
      const transactionId = uuidv4();
      
      // Ensure we have a valid businessId (UUID format)
      const businessId = data.businessId && !data.businessId.includes("-") 
        ? uuidv4() // If it's not in UUID format, generate a new one
        : (data.businessId || uuidv4());
      
      // Create an in-memory transaction for demo purposes
      const transaction = {
        id: transactionId,
        id_servico: data.serviceId,
        id_agendamento: data.appointmentId,
        id_cliente: data.customerId,
        valor: data.amount,
        metodo_pagamento: data.paymentMethod,
        descricao: data.description,
        tipo: "receita",
        status: "pendente",
        id_negocio: businessId,
        criado_em: new Date().toISOString(),
        notas: null
      };
      
      // Store in our in-memory Map
      transactionsStore.set(transactionId, transaction);
      
      console.log("Transaction created (in-memory):", transactionId);
      
      return {
        id: transactionId,
        status: "pendente",
        metodo_pagamento: data.paymentMethod,
        valor: data.amount,
        criado_em: new Date().toISOString(),
        notas: null
      };
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw new Error("Erro ao registrar transação no banco de dados");
    }
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
      const transaction = transactionsStore.get(transactionId);
      
      if (!transaction) {
        console.error("Transaction not found:", transactionId);
        return;
      }
      
      // Store provider information in the notas field as JSON
      const efiDataJSON = JSON.stringify({
        transaction_id: providerData.transaction_id,
        payment_url: providerData.payment_url,
        provider: providerData.provider || 'efi_bank'
      });
      
      // Update the transaction in memory
      transaction.status = providerData.status || transaction.status;
      transaction.notas = efiDataJSON;
      
      console.log("Transaction updated (in-memory):", transactionId);
    } catch (error) {
      console.error("Error updating transaction with provider data:", error);
      // Continue even if update fails, as we already have the transaction in our system
    }
  },

  /**
   * Gets a transaction by ID
   */
  async getTransaction(transactionId: string) {
    try {
      const transaction = transactionsStore.get(transactionId);
      
      if (!transaction) {
        throw new Error("Transação não encontrada");
      }
      
      return {
        id: transaction.id,
        status: transaction.status,
        metodo_pagamento: transaction.metodo_pagamento,
        valor: transaction.valor,
        criado_em: transaction.criado_em,
        notas: transaction.notas
      };
    } catch (error) {
      console.error("Error getting transaction:", error);
      throw new Error("Erro ao consultar transação no banco de dados");
    }
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
      const transaction = transactionsStore.get(transactionId);
      
      if (!transaction) {
        console.error("Transaction not found:", transactionId);
        return false;
      }
      
      // Update the transaction
      transaction.status = status;
      
      if (isPaid) {
        transaction.data_pagamento = new Date().toISOString();
      }
      
      console.log("Transaction status updated (in-memory):", transactionId, status);
      
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
