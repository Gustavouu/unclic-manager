
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

// Export the PaymentService interface (if needed)
export interface PaymentServiceInterface {
  createPayment: (request: PaymentRequest) => Promise<PaymentResponse>;
  getPaymentStatus: (paymentId: string) => Promise<PaymentResponse>;
}
