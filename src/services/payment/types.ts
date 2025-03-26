
/**
 * Payment service type definitions
 */

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

export interface EfiPaymentData {
  amount: number;
  description: string;
  paymentMethod: string;
  referenceId: string;
  merchantId?: string;
  apiKey?: string;
  isTestMode?: boolean;
}

export interface EfiStatusResponse {
  status: string;
  transactionId: string;
  paymentUrl?: string;
}
