export class POSPaymentService {
  static async process(amount: number, deviceId: string): Promise<void> {
    // Placeholder for POS/NFC/QR code payment handling
    console.log('Processing POS payment', amount, deviceId);
  }
}
