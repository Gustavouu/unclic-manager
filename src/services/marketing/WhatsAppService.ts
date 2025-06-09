import twilio from 'twilio';

export class WhatsAppService {
  private static client = twilio(
    process.env.TWILIO_ACCOUNT_SID || '',
    process.env.TWILIO_AUTH_TOKEN || ''
  );

  static async sendMessage(to: string, message: string) {
    const from = process.env.TWILIO_WHATSAPP_FROM;
    if (!from) throw new Error('TWILIO_WHATSAPP_FROM not configured');

    return this.client.messages.create({
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
      body: message,
    });
  }
}
