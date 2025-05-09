
import { supabase } from '@/integrations/supabase/client';

export interface EfiPayCredentials {
  client_id: string;
  client_secret: string;
  sandbox: boolean;
}

export interface EfiPayToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  expires_at?: number;
}

/**
 * Service to handle EFI Pay authentication and token management
 */
export class EfiPayAuthService {
  private static instance: EfiPayAuthService;
  private tokenCache: Map<string, EfiPayToken> = new Map();
  
  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): EfiPayAuthService {
    if (!EfiPayAuthService.instance) {
      EfiPayAuthService.instance = new EfiPayAuthService();
    }
    return EfiPayAuthService.instance;
  }

  /**
   * Get the current business configuration for EFI Pay
   */
  public async getBusinessConfiguration(businessId?: string): Promise<EfiPayCredentials | null> {
    try {
      const { data, error } = await supabase
        .from('payment_providers')
        .select('client_id, client_secret, configuration')
        .eq('provider_name', 'efi_pay')
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        console.error('Error fetching EFI Pay configuration:', error);
        return null;
      }

      const sandbox = data.configuration?.sandbox === true || process.env.NODE_ENV !== 'production';

      return {
        client_id: data.client_id,
        client_secret: data.client_secret,
        sandbox
      };
    } catch (error) {
      console.error('Error in getBusinessConfiguration:', error);
      return null;
    }
  }

  /**
   * Get a valid token for EFI Pay API
   */
  public async getToken(businessId?: string): Promise<string | null> {
    const cacheKey = businessId || 'default';
    const cachedToken = this.tokenCache.get(cacheKey);

    // If we have a cached token and it's not expired, use it
    if (cachedToken && cachedToken.expires_at && cachedToken.expires_at > Date.now()) {
      return cachedToken.access_token;
    }

    try {
      const credentials = await this.getBusinessConfiguration(businessId);
      if (!credentials) {
        console.error('No EFI Pay credentials found');
        return null;
      }

      // Base URL depends on sandbox mode
      const baseUrl = credentials.sandbox
        ? 'https://api-pix-h.gerencianet.com.br'
        : 'https://api-pix.gerencianet.com.br';

      // Get a new token
      const auth = Buffer.from(
        `${credentials.client_id}:${credentials.client_secret}`
      ).toString('base64');

      const response = await fetch(`${baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify({
          grant_type: 'client_credentials'
        })
      });

      if (!response.ok) {
        throw new Error(`EFI Pay authentication failed: ${response.statusText}`);
      }

      const tokenData = await response.json();
      
      // Add expiration time to token data for cache validation
      const token: EfiPayToken = {
        ...tokenData,
        expires_at: Date.now() + (tokenData.expires_in * 1000 * 0.9) // 90% of expiration time to be safe
      };

      // Cache the token
      this.tokenCache.set(cacheKey, token);
      
      return token.access_token;
    } catch (error) {
      console.error('Error getting EFI Pay token:', error);
      return null;
    }
  }
}

export const efiPayAuthService = EfiPayAuthService.getInstance();
