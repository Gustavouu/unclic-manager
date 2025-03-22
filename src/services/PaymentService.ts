
import { supabase } from "@/integrations/supabase/client";

export interface PaymentRequest {
  serviceId: string;
  appointmentId?: string;
  amount: number;
  customerId: string;
  paymentMethod: string;
  description?: string;
}

export interface PaymentResponse {
  id: string;
  status: "pending" | "approved" | "rejected" | "cancelled" | "processing";
  transactionId?: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
  paymentUrl?: string; // URL para pagamento via Efi Bank quando aplicável
}

export const PaymentService = {
  /**
   * Envia uma solicitação de pagamento para o Efi Bank
   */
  async createPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Primeiro, busca as configurações da Efi Bank
      const { data: efiConfig, error: configError } = await supabase
        .from('efi_bank_integrations')
        .select('*')
        .eq('business_id', "1") // Este deve ser o ID do negócio atual
        .single();
      
      if (configError && configError.code !== 'PGRST116') {
        console.error("Erro ao buscar configurações da Efi Bank:", configError);
      }
      
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
        ? await callEfiBankAPI({
            amount: payment.amount,
            description: payment.description || "Pagamento de serviço",
            paymentMethod: payment.paymentMethod,
            referenceId: dbTransaction.id,
            merchantId: efiConfig.merchant_id,
            apiKey: efiConfig.api_key,
            isTestMode: efiConfig.is_test_mode
          })
        : await simulateEfiBankAPICall({
            amount: payment.amount,
            description: payment.description || "Pagamento de serviço",
            paymentMethod: payment.paymentMethod,
            referenceId: dbTransaction.id
          });
      
      // Atualiza a transação com os dados retornados pelo Efi Bank
      if (efiPaymentData.transactionId) {
        await supabase
          .from('transacoes')
          .update({ 
            efi_bank_transaction_id: efiPaymentData.transactionId,
            payment_url: efiPaymentData.paymentUrl,
            status: mapEfiBankStatus(efiPaymentData.status)
          })
          .eq('id', dbTransaction.id);
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
        .select('id, status, metodo_pagamento, valor, criado_em, payment_url, efi_bank_transaction_id')
        .eq('id', paymentId)
        .single();

      if (error) throw error;
      
      // Busca as configurações da Efi Bank
      const { data: efiConfig, error: configError } = await supabase
        .from('efi_bank_integrations')
        .select('*')
        .eq('business_id', "1") // Este deve ser o ID do negócio atual
        .single();
      
      if (configError && configError.code !== 'PGRST116') {
        console.error("Erro ao buscar configurações da Efi Bank:", configError);
      }
      
      // Consulta o status na API do Efi Bank ou simula a consulta
      const efiStatusData = efiConfig && data.efi_bank_transaction_id
        ? await checkEfiBankStatus(data.efi_bank_transaction_id, efiConfig.merchant_id, efiConfig.api_key)
        : await simulateEfiBankStatusCheck(paymentId);
      
      // Atualiza o status se houver mudança
      if (data.status !== mapEfiBankStatus(efiStatusData.status)) {
        await supabase
          .from('transacoes')
          .update({ 
            status: mapEfiBankStatus(efiStatusData.status),
            data_pagamento: efiStatusData.status === "approved" ? new Date().toISOString() : null
          })
          .eq('id', paymentId);
      }
      
      return {
        id: data.id,
        status: mapEfiBankStatus(efiStatusData.status),
        transactionId: efiStatusData.transactionId,
        paymentUrl: data.payment_url || efiStatusData.paymentUrl,
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

// Função para fazer as chamadas reais para a API do Efi Bank
async function callEfiBankAPI(data: {
  amount: number;
  description: string;
  paymentMethod: string;
  referenceId: string;
  merchantId: string;
  apiKey: string;
  isTestMode: boolean;
}): Promise<{
  status: string;
  transactionId: string;
  paymentUrl: string;
}> {
  // Em produção, isso seria uma chamada real para a API da Efi Bank
  // Por enquanto, vamos simular
  console.log("Chamando API da Efi Bank com configurações reais:", data.merchantId, data.isTestMode);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    status: "pending",
    transactionId: "EFI-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    paymentUrl: `https://pay.efibank.com.br/${data.referenceId}?test=${data.isTestMode ? 'true' : 'false'}`
  };
}

// Função para verificar o status de um pagamento na API do Efi Bank
async function checkEfiBankStatus(
  transactionId: string,
  merchantId: string,
  apiKey: string
): Promise<{
  status: string;
  transactionId: string;
  paymentUrl?: string;
}> {
  // Em produção, isso seria uma chamada real para a API da Efi Bank
  // Por enquanto, vamos simular
  console.log("Verificando status na API da Efi Bank para:", transactionId);
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const possibleStatuses = ["pending", "processing", "approved", "rejected", "cancelled"];
  const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
  
  return {
    status: randomStatus,
    transactionId: transactionId,
    paymentUrl: `https://pay.efibank.com.br/${transactionId}`
  };
}

// Função auxiliar para mapear status do Efi Bank para o nosso sistema
function mapEfiBankStatus(efiBankStatus: string): PaymentResponse['status'] {
  switch (efiBankStatus) {
    case 'completed':
    case 'approved':
      return 'approved';
    case 'failed':
    case 'rejected':
      return 'rejected';
    case 'canceled':
    case 'cancelled':
      return 'cancelled';
    case 'processing':
      return 'processing';
    case 'pending':
    default:
      return 'pending';
  }
}

// Simulação de chamada para API do Efi Bank - em produção, seria substituído pela API real
async function simulateEfiBankAPICall(data: {
  amount: number;
  description: string;
  paymentMethod: string;
  referenceId: string;
}): Promise<{
  status: string;
  transactionId: string;
  paymentUrl: string;
}> {
  // Simula tempo de resposta da API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simula resposta da API
  return {
    status: "pending",
    transactionId: "EFI-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    paymentUrl: `https://pay.efibank.com.br/${data.referenceId}`
  };
}

// Simulação de verificação de status na API do Efi Bank
async function simulateEfiBankStatusCheck(transactionId: string): Promise<{
  status: string;
  transactionId: string;
  paymentUrl?: string;
}> {
  // Simula tempo de resposta da API
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Simula vários estados possíveis para testar a interface
  const possibleStatuses = ["pending", "processing", "approved", "rejected", "cancelled"];
  const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
  
  return {
    status: randomStatus,
    transactionId: "EFI-" + transactionId.substring(0, 8).toUpperCase(),
    paymentUrl: `https://pay.efibank.com.br/${transactionId}`
  };
}
