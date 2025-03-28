
import { mapEfiBankStatus } from "../utils";
import { PaymentResponse } from "../types";

/**
 * Maps database transaction data to payment response format
 */
export const PaymentResponseMapper = {
  mapToPaymentResponse(
    transactionData: any,
    providerData?: {
      status?: string;
      transactionId?: string;
      paymentUrl?: string;
    }
  ): PaymentResponse {
    // Extract transaction_id and payment_url from notes if available
    let transactionId = providerData?.transactionId || '';
    let paymentUrl = providerData?.paymentUrl || '';
    
    // Try to parse the notes if it contains payment provider data
    if (transactionData.notas) {
      try {
        const notesData = JSON.parse(transactionData.notas);
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

    return {
      id: transactionData.id,
      status: providerData?.status 
        ? mapEfiBankStatus(providerData.status) 
        : transactionData.status,
      transactionId,
      paymentUrl,
      amount: transactionData.valor,
      paymentMethod: transactionData.metodo_pagamento,
      createdAt: transactionData.criado_em
    };
  }
};
