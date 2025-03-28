
import { mapToEfiBankStatus } from "../utils";

/**
 * Maps transaction data to payment response format
 */
export const PaymentResponseMapper = {
  mapToPaymentResponse(transaction: any, efiData: {
    status?: string;
    transactionId?: string;
    paymentUrl?: string | null;
  }) {
    return {
      id: transaction.id,
      status: efiData.status || mapToEfiBankStatus(transaction.status) || "pending",
      transactionId: efiData.transactionId || transaction.id,
      amount: transaction.valor,
      paymentMethod: transaction.metodo_pagamento,
      createdAt: transaction.criado_em,
      paymentUrl: efiData.paymentUrl || null
    };
  }
};
