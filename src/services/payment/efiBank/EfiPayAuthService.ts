
import { supabase } from '@/integrations/supabase/client';

export class EfiPayAuthService {
  private static instance: EfiPayAuthService;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  private constructor() {}

  static getInstance(): EfiPayAuthService {
    if (!EfiPayAuthService.instance) {
      EfiPayAuthService.instance = new EfiPayAuthService();
    }
    return EfiPayAuthService.instance;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      // Get credentials from business settings
      const { data: settings, error } = await supabase
        .from('business_settings')
        .select('notes')
        .single();

      if (error || !settings?.notes) {
        throw new Error('EfiPay credentials not found in business settings');
      }

      const credentials = settings.notes as any;
      const sandbox = typeof credentials === 'object' && credentials.sandbox === true;
      
      if (!credentials.client_id || !credentials.client_secret) {
        throw new Error('EfiPay credentials incomplete');
      }

      const baseUrl = sandbox 
        ? 'https://pix-h.api.efipay.com.br'
        : 'https://pix.api.efipay.com.br';

      const auth = Buffer.from(`${credentials.client_id}:${credentials.client_secret}`).toString('base64');

      const response = await fetch(`${baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));

      return this.accessToken;
    } catch (error) {
      console.error('Error getting EfiPay access token:', error);
      throw error;
    }
  }

  async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAccessToken();
    
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }

    return response.json();
  }
}
