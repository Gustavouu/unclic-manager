export class RefundService {
  static async requestRefund(paymentId: string, amount: number): Promise<void> {
    // Placeholder for integration with payment provider to trigger refund
    console.log('Requesting refund', paymentId, amount);
  }
}
