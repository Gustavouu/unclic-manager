
import { EfiPaymentData, EfiStatusResponse } from "./types";

// URL for the EFI Pay payment handler Edge Function
const efipayHandlerUrl = "https://jcdymkgmtxpryceziazt.supabase.co/functions/v1/efipay-payment-handler";

/**
 * Service for interacting with Efi Bank payment provider
 */
export const EfiBankService = {
  /**
   * Gets the Efi Bank configuration from the database
   */
  async getConfiguration() {
    try {
      // In a real implementation, this would fetch configuration from a database
      // For demo purposes, we return a hardcoded configuration
      return {
        merchant_id: "DEMO_MERCHANT_ID",
        api_key: "DEMO_API_KEY",
        is_test_mode: true
      };
    } catch (error) {
      console.error("Error getting Efi Bank configuration:", error);
      return null;
    }
  },

  /**
   * Calls the Efi Bank API to create a payment
   */
  async callEfiPayAPI(data: EfiPaymentData): Promise<EfiStatusResponse> {
    try {
      console.log("Calling Efi Pay API with data:", data);
      
      // Determine which payment type to use based on payment method
      const paymentType = data.paymentMethod === 'pix' 
        ? 'pix' 
        : (data.paymentMethod === 'credit_card' ? 'credit_card' : 'boleto');
      
      // Call the EFI Pay Edge Function
      const response = await fetch(efipayHandlerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentType: paymentType,
          amount: data.amount,
          description: data.description,
          customer: {
            name: "Cliente do site",
            document: "000.000.000-00",
            email: "cliente@exemplo.com"
          },
          expiresIn: 3600, // 1 hour expiration
          appointmentId: data.referenceId
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      
      console.log("Efi Pay API response:", result);
      
      return {
        status: result.status || 'pending',
        transactionId: result.id || '',
        paymentUrl: result.qrCodeUrl || result.paymentUrl || ''
      };
    } catch (error) {
      console.error("Error calling Efi Pay API:", error);
      
      // Return a fallback response with a pending status
      return {
        status: 'pending',
        transactionId: `local-${Date.now()}`,
        paymentUrl: null
      };
    }
  },

  /**
   * Simulates a call to the Efi Bank API for demo purposes
   */
  async simulateEfiBankAPICall(data: EfiPaymentData): Promise<EfiStatusResponse> {
    try {
      // We'll attempt to call the real Edge Function if available
      return await this.callEfiPayAPI(data);
    } catch (error) {
      console.warn("Falling back to simulated API call:", error);
      
      // Generate a transaction ID
      const transactionId = `EFI-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      // Simulate a payment URL
      let paymentUrl = null;
      
      if (data.paymentMethod === 'pix') {
        paymentUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pix-payment-${data.referenceId}-${Date.now()}`;
      } else if (data.paymentMethod === 'credit_card') {
        paymentUrl = `https://pay.efipay.com.br/credit/${transactionId}`;
      }
      
      return {
        status: 'pending',
        transactionId: transactionId,
        paymentUrl: paymentUrl
      };
    }
  },

  /**
   * Checks the status of a payment in Efi Bank
   */
  async checkEfiBankStatus(transactionId: string): Promise<EfiStatusResponse> {
    try {
      // In a real implementation, this would call an Efi Bank API endpoint
      // For demo purposes, we return a hardcoded status
      const randomStatus = Math.random();
      let status = 'pending';
      
      // 60% chance of being approved, 20% still pending, 20% processing
      if (randomStatus < 0.6) {
        status = 'approved';
      } else if (randomStatus < 0.8) {
        status = 'pending';
      } else {
        status = 'processing';
      }
      
      return {
        status: status,
        transactionId: transactionId
      };
    } catch (error) {
      console.error("Error checking Efi Bank status:", error);
      return {
        status: 'pending',
        transactionId: transactionId
      };
    }
  }
};
