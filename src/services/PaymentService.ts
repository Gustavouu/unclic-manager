
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
  status: "pending" | "approved" | "rejected" | "cancelled";
  transactionId?: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
}

export const PaymentService = {
  /**
   * Envia uma solicitação de pagamento para ser processada
   * Esta requisição será encaminhada para o portal admin, que irá processar com a adquirente
   */
  async createPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      // No futuro, este será um endpoint no portal admin
      const { data, error } = await supabase
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

      if (error) throw error;

      return {
        id: data.id,
        status: mapTransactionStatus(data.status),
        amount: data.valor,
        paymentMethod: data.metodo_pagamento,
        createdAt: data.criado_em
      };
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      throw new Error("Não foi possível processar o pagamento. Tente novamente mais tarde.");
    }
  },

  /**
   * Consulta o status de um pagamento
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select('id, status, metodo_pagamento, valor, criado_em, data_pagamento')
        .eq('id', paymentId)
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        status: mapTransactionStatus(data.status),
        amount: data.valor,
        paymentMethod: data.metodo_pagamento,
        createdAt: data.criado_em,
        transactionId: data.data_pagamento ? 'TXID-' + data.id.substring(0, 8) : undefined
      };
    } catch (error) {
      console.error("Erro ao consultar status do pagamento:", error);
      throw new Error("Não foi possível obter o status do pagamento.");
    }
  }
};

// Função auxiliar para mapear status do banco para o frontend
function mapTransactionStatus(dbStatus: string | null): PaymentResponse['status'] {
  switch (dbStatus) {
    case 'concluido':
    case 'aprovado':
      return 'approved';
    case 'recusado':
      return 'rejected';
    case 'cancelado':
      return 'cancelled';
    case 'pendente':
    default:
      return 'pending';
  }
}
