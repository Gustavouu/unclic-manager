
import { mapToEfiBankStatus } from "../utils";

// Valid payment status types
type ValidStatus = "pending" | "approved" | "rejected" | "cancelled" | "processing";

/**
 * Ensures the status string is a valid payment status
 */
const validateStatus = (status: string): ValidStatus => {
  const validStatuses: ValidStatus[] = [
    "pending", "approved", "rejected", "cancelled", "processing"
  ];
  
  // If status is already valid, return it
  if (validStatuses.includes(status as ValidStatus)) {
    return status as ValidStatus;
  }
  
  // Map EFI Bank status to our valid status
  switch (status) {
    case 'aprovado':
      return "approved";
    case 'pendente':
      return "pending";
    case 'processando':
      return "processing";
    case 'rejeitado':
      return "rejected";
    case 'cancelado':
      return "cancelled";
    default:
      return "pending"; // Default to pending for unknown statuses
  }
};

/**
 * Maps transaction data to payment response format
 */
export const PaymentResponseMapper = {
  mapToPaymentResponse(transaction: any, efiData: {
    status?: string;
    transactionId?: string;
    paymentUrl?: string | null;
  }) {
    // Get the raw status
    const rawStatus = efiData.status || mapToEfiBankStatus(transaction.status) || "pending";
    
    // Validate and convert to a valid status type
    const validStatus = validateStatus(rawStatus);
    
    return {
      id: transaction.id,
      status: validStatus,
      transactionId: efiData.transactionId || transaction.id,
      amount: transaction.valor,
      paymentMethod: transaction.metodo_pagamento,
      createdAt: transaction.criado_em,
      paymentUrl: efiData.paymentUrl || null
    };
  }
};
