
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest, PaymentResponse } from "./types";
import { EfiBankService } from "./efiBank";
import { mapEfiBankStatus } from "./utils";
import { WebhookService } from "./webhookService";

/**
 * Service for handling payment processing with Efi Bank
 */
export const PaymentService = {
  /**
   * Creates a new payment request
   */
  async createPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      // First, get the Efi Bank configuration
      const efiConfig = await EfiBankService.getConfiguration();
      
      // Register the transaction in our database
      const { data: dbTransaction, error: dbError } = await supabase
        .from('transacoes')
        .insert({
          id_servico: payment.serviceId,
          id_agendamento: payment.appointmentId || null,
          id_cliente: payment.customerId,
          valor: payment.amount,
          metodo_pagamento: payment.paymentMethod,
          descricao: payment.description || "Pagamento de serviço",
          tipo: "receita",
          status: "pendente",
          id_negocio: "1" // Example: current business ID (should be dynamic in prod)
        })
        .select('id, status, metodo_pagamento, valor, criado_em, notas')
        .single();

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Erro ao registrar transação no banco de dados");
      }
      
      if (!dbTransaction) {
        throw new Error("Nenhuma transação retornada após a inserção");
      }
      
      // Configure the data for the Efi Bank API call
      const efiPaymentData = efiConfig 
        ? await EfiBankService.callEfiBankAPI({
            amount: payment.amount,
            description: payment.description || "Pagamento de serviço",
            paymentMethod: payment.paymentMethod,
            referenceId: dbTransaction.id,
            merchantId: efiConfig.merchant_id,
            apiKey: efiConfig.api_key,
            isTestMode: efiConfig.is_test_mode
          })
        : await EfiBankService.simulateEfiBankAPICall({
            amount: payment.amount,
            description: payment.description || "Pagamento de serviço",
            paymentMethod: payment.paymentMethod,
            referenceId: dbTransaction.id
          });
      
      // Update the transaction with the data returned by Efi Bank
      if (efiPaymentData.transactionId) {
        try {
          // Since we don't have transaction_id and payment_url columns,
          // store this information in the notas field as JSON
          const efiDataJSON = JSON.stringify({
            transaction_id: efiPaymentData.transactionId,
            payment_url: efiPaymentData.paymentUrl,
            provider: 'efi_bank'
          });
          
          await supabase
            .from('transacoes')
            .update({ 
              status: mapEfiBankStatus(efiPaymentData.status),
              notas: efiDataJSON
            })
            .eq('id', dbTransaction.id);
        } catch (error) {
          console.error("Error updating transaction with Efi Bank data:", error);
          // Continue even if update fails, as we already have the transaction in our system
        }
      }

      // Parse the transaction notes to get payment data
      let transactionId = efiPaymentData.transactionId;
      let paymentUrl = efiPaymentData.paymentUrl;
      
      // Try to parse the notes if it contains Efi Bank data
      if (dbTransaction.notas) {
        try {
          const notesData = JSON.parse(dbTransaction.notas);
          if (notesData.transaction_id) {
            transactionId = notesData.transaction_id;
          }
          if (notesData.payment_url) {
            paymentUrl = notesData.payment_url;
          }
        } catch (e) {
          console.log("Notes is not valid JSON:", e);
        }
      }

      const paymentResponse = {
        id: dbTransaction.id,
        status: mapEfiBankStatus(efiPaymentData.status),
        transactionId,
        paymentUrl,
        amount: dbTransaction.valor,
        paymentMethod: dbTransaction.metodo_pagamento,
        createdAt: dbTransaction.criado_em
      };

      // Enviar notificação de webhook, se estiver configurado
      WebhookService.sendWebhookNotification('payment.created', {
        payment_id: paymentResponse.id,
        status: paymentResponse.status,
        amount: paymentResponse.amount,
        payment_method: paymentResponse.paymentMethod
      });

      return paymentResponse;
    } catch (error) {
      console.error("Erro ao processar pagamento com Efi Bank:", error);
      throw new Error("Não foi possível processar o pagamento. Tente novamente mais tarde.");
    }
  },

  /**
   * Checks the status of a payment in Efi Bank
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select('id, status, metodo_pagamento, valor, criado_em, notas')
        .eq('id', paymentId)
        .single();

      if (error) {
        console.error("Database error:", error);
        throw new Error("Erro ao consultar transação no banco de dados");
      }
      
      if (!data) {
        throw new Error("Transação não encontrada");
      }
      
      // Parse transaction notes to get Efi Bank data
      let transactionId = '';
      let paymentUrl = '';
      
      if (data.notas) {
        try {
          const notesData = JSON.parse(data.notas);
          transactionId = notesData.transaction_id || '';
          paymentUrl = notesData.payment_url || '';
        } catch (e) {
          console.log("Notes is not valid JSON:", e);
        }
      }
      
      // Get the Efi Bank configuration
      const efiConfig = await EfiBankService.getConfiguration();
      
      // Query the status in the Efi Bank API or simulate the query
      const efiStatusData = await EfiBankService.simulateEfiBankStatusCheck(transactionId || paymentId);
      
      // Update the status if there's a change
      if (data.status !== mapEfiBankStatus(efiStatusData.status)) {
        try {
          await supabase
            .from('transacoes')
            .update({ 
              status: mapEfiBankStatus(efiStatusData.status),
              data_pagamento: efiStatusData.status === "approved" ? new Date().toISOString() : null
            })
            .eq('id', paymentId);
            
          // Enviar notificação de webhook, se estiver configurado
          WebhookService.sendWebhookNotification('payment.updated', {
            payment_id: paymentId,
            status: mapEfiBankStatus(efiStatusData.status),
            updated_at: new Date().toISOString()
          });
        } catch (updateError) {
          console.error("Error updating transaction status:", updateError);
          // Continue despite error, we'll return the latest status from API
        }
      }
      
      return {
        id: data.id,
        status: mapEfiBankStatus(efiStatusData.status),
        transactionId: transactionId || efiStatusData.transactionId,
        paymentUrl: paymentUrl || efiStatusData.paymentUrl,
        amount: data.valor,
        paymentMethod: data.metodo_pagamento,
        createdAt: data.criado_em
      };
    } catch (error) {
      console.error("Erro ao consultar status do pagamento no Efi Bank:", error);
      throw new Error("Não foi possível obter o status do pagamento.");
    }
  }
};
