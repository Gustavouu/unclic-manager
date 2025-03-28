import { supabase } from "@/integrations/supabase/client";
import { EfiPaymentData, EfiStatusResponse } from "./types";

/**
 * Makes API calls to the Efi Bank payment gateway
 */
export const EfiBankService = {
  /**
   * Fetch Efi Bank integration configuration from database
   */
  async getConfiguration(businessId: string = "1") {
    try {
      // For demo purposes, always return mock configuration
      // instead of attempting to query potentially non-existent tables
      console.log("Using demo Efi Bank configuration");
      return {
        merchant_id: "MERCHANT_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        api_key: "API_KEY_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        is_test_mode: true
      };
    } catch (error) {
      console.error("Error fetching Efi Bank configuration:", error);
      return null;
    }
  },
  
  /**
   * Call the Efi Bank API to process a payment
   */
  async callEfiBankAPI(data: EfiPaymentData): Promise<EfiStatusResponse> {
    // In production, this would be a real API call to Efi Bank
    console.log("Calling Efi Bank API with configuration:", data.merchantId, data.isTestMode);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      status: "pending",
      transactionId: "EFI-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      paymentUrl: `https://pay.efibank.com.br/${data.referenceId}?test=${data.isTestMode ? 'true' : 'false'}`
    };
  },
  
  /**
   * Check the status of a payment with Efi Bank
   */
  async checkEfiBankStatus(
    transactionId: string,
    merchantId?: string,
    apiKey?: string
  ): Promise<EfiStatusResponse> {
    // In production, this would be a real API call to Efi Bank
    console.log("Checking status on Efi Bank API for:", transactionId);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const possibleStatuses = ["pending", "processing", "approved", "rejected", "cancelled"];
    const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
    
    return {
      status: randomStatus,
      transactionId: transactionId,
      paymentUrl: `https://pay.efibank.com.br/${transactionId}`
    };
  },
  
  /**
   * Simulate a payment API call (for development)
   */
  async simulateEfiBankAPICall(data: EfiPaymentData): Promise<EfiStatusResponse> {
    // Simulates response time of the API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulates API response
    return {
      status: "pending",
      transactionId: "EFI-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      paymentUrl: `https://pay.efibank.com.br/${data.referenceId}`
    };
  },
  
  /**
   * Simulate status check (for development)
   */
  async simulateEfiBankStatusCheck(transactionId: string): Promise<EfiStatusResponse> {
    // Simulates response time of the API
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simulates various possible statuses to test the interface
    const possibleStatuses = ["pending", "processing", "approved", "rejected", "cancelled"];
    const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
    
    return {
      status: randomStatus,
      transactionId: "EFI-" + transactionId.substring(0, 8).toUpperCase(),
      paymentUrl: `https://pay.efibank.com.br/${transactionId}`
    };
  }
};
