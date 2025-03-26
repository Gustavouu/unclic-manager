
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest, PaymentResponse } from "./types";
import { EfiBankService } from "./efiBank";
import { mapEfiBankStatus } from "./utils";

export { PaymentRequest, PaymentResponse } from "./types";

export const PaymentService = {
  /**
   * Envia uma solicitação de pagamento para o Efi Bank
   */
  async createPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Primeiro, busca as configurações da Efi Bank
      const efiConfig = await EfiBankService.getConfiguration();
      
      // Registra a transação no nosso banco de dados
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
          id_negocio: "1" // Exemplo: ID do negócio atual (deve ser dinâmico em prod)
        })
        .select('id, status, metodo_pagamento, valor, criado_em')
        .single();

      if (dbError) throw dbError;
      
      // Configura os dados para a chamada da API do Efi Bank
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
      
      // Atualiza a transação com os dados retornados pelo Efi Bank
      if (efiPaymentData.transactionId) {
        try {
          await supabase
            .from('transacoes')
            .update({ 
              status: mapEfiBankStatus(efiPaymentData.status)
            })
            .eq('id', dbTransaction.id);
        } catch (error) {
          console.error("Error updating transaction with Efi Bank data:", error);
          // Continue even if update fails, as we already have the transaction in our system
        }
      }

      return {
        id: dbTransaction.id,
        status: mapEfiBankStatus(efiPaymentData.status),
        transactionId: efiPaymentData.transactionId,
        paymentUrl: efiPaymentData.paymentUrl,
        amount: dbTransaction.valor,
        paymentMethod: dbTransaction.metodo_pagamento,
        createdAt: dbTransaction.criado_em
      };
    } catch (error) {
      console.error("Erro ao processar pagamento com Efi Bank:", error);
      throw new Error("Não foi possível processar o pagamento. Tente novamente mais tarde.");
    }
  },

  /**
   * Consulta o status de um pagamento no Efi Bank
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select('id, status, metodo_pagamento, valor, criado_em')
        .eq('id', paymentId)
        .single();

      if (error) throw error;
      
      // Busca as configurações da Efi Bank
      const efiConfig = await EfiBankService.getConfiguration();
      
      // Consulta o status na API do Efi Bank ou simula a consulta
      const efiStatusData = await EfiBankService.simulateEfiBankStatusCheck(paymentId);
      
      // Atualiza o status se houver mudança
      if (data.status !== mapEfiBankStatus(efiStatusData.status)) {
        try {
          await supabase
            .from('transacoes')
            .update({ 
              status: mapEfiBankStatus(efiStatusData.status),
              data_pagamento: efiStatusData.status === "approved" ? new Date().toISOString() : null
            })
            .eq('id', paymentId);
        } catch (updateError) {
          console.error("Error updating transaction status:", updateError);
          // Continue despite error, we'll return the latest status from API
        }
      }
      
      return {
        id: data.id,
        status: mapEfiBankStatus(efiStatusData.status),
        transactionId: efiStatusData.transactionId,
        paymentUrl: efiStatusData.paymentUrl,
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
