
/**
 * Payment request data 
 */
export interface PaymentRequest {
  serviceId: string;
  appointmentId?: string;
  customerId: string;
  amount: number;
  paymentMethod: string;
  description?: string;
  businessId?: string;
}

/**
 * Payment response data
 */
export interface PaymentResponse {
  id: string;
  status: "pending" | "approved" | "rejected" | "cancelled" | "processing";
  transactionId: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
  paymentUrl?: string | null;
}

/**
 * EFI Bank payment data
 */
export interface EfiPaymentData {
  amount: number;
  description: string;
  paymentMethod: string;
  referenceId: string;
  merchantId?: string;
  apiKey?: string;
  isTestMode?: boolean;
}

/**
 * EFI Bank status response
 */
export interface EfiStatusResponse {
  status: string;
  transactionId?: string;
  paymentUrl?: string | null;
}

/**
 * Customer data interface
 */
export interface CustomerData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}
