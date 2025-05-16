
// Export interface for payment request
export interface PaymentRequest {
  serviceId: string;
  appointmentId?: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  amount: number;
  description: string;
  paymentMethod: string;
  businessId?: string;
}

// Export interface for payment response
export interface PaymentResponse {
  id: string;
  transactionId?: string;
  status: string;
  amount: number;
  paymentMethod: string;
  paymentUrl?: string;
  clientSecret?: string;
  createdAt: Date;
}

// EFI Bank payment data
export interface EfiPaymentData {
  amount: number;
  description: string;
  paymentMethod: string;
  referenceId: string;
  merchantId?: string;
  apiKey?: string;
  isTestMode?: boolean;
}

// EFI Bank status response
export interface EfiStatusResponse {
  status: string;
  transactionId?: string;
  paymentUrl?: string | null;
}

// Export the PaymentService interface (if needed)
export interface PaymentServiceInterface {
  createPayment: (request: PaymentRequest) => Promise<PaymentResponse>;
  getPaymentStatus: (paymentId: string) => Promise<PaymentResponse>;
}
