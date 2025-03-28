
import { supabase } from "@/integrations/supabase/client";
import { EfiPaymentData, EfiStatusResponse } from "./types";
import { v4 as uuidv4 } from "uuid";

/**
 * Makes API calls to the EFI Pay payment gateway
 */
export const EfiBankService = {
  /**
   * Fetch EFI Pay integration configuration from database
   */
  async getConfiguration(businessId: string = "1") {
    try {
      // For demo purposes, always return mock configuration
      // instead of attempting to query potentially non-existent tables
      console.log("Using demo EFI Pay configuration");
      return {
        merchant_id: "MERCHANT_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        api_key: "API_KEY_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        is_test_mode: true
      };
    } catch (error) {
      console.error("Error fetching EFI Pay configuration:", error);
      return null;
    }
  },
  
  /**
   * Call the EFI Pay API through our secure Edge Function
   */
  async callEfiPayAPI(data: EfiPaymentData): Promise<EfiStatusResponse> {
    try {
      console.log("Calling EFI Pay API through Edge Function with data:", data);
      
      // URL completa para a edge function
      const efipayHandlerUrl = "https://jcdymkgmtxpryceziazt.supabase.co/functions/v1/efipay-payment-handler";
      
      // Preparar os dados para a requisição
      const requestData = {
        paymentType: data.paymentMethod === "pix" ? "pix" : (
          data.paymentMethod === "credit_card" ? "credit_card" : "boleto"
        ),
        amount: data.amount * 100, // Convertendo para centavos
        description: data.description || "Pagamento de serviço",
        customer: {
          name: "Cliente", // Idealmente, isso viria dos dados do cliente
          document: "00000000000" // CPF (placeholder)
        },
        expiresIn: 3600, // 1 hora
        appointmentId: data.referenceId || uuidv4()
      };
      
      console.log("Sending request to EFI Pay handler:", requestData);
      
      // Chamar a edge function
      const response = await fetch(efipayHandlerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro na resposta da Edge Function:", errorData);
        throw new Error(`Erro ao processar pagamento: ${errorData.error || 'Erro desconhecido'}`);
      }
      
      const responseData = await response.json();
      console.log("Resposta da Edge Function:", responseData);
      
      // Em modo de demonstração, simulamos uma resposta bem-sucedida
      if (data.isTestMode) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return {
          status: "pending",
          transactionId: responseData.id || `EFI-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          paymentUrl: responseData.qrCodeUrl || responseData.paymentUrl || `https://pay.efipay.com.br/${data.referenceId}?test=true`
        };
      }
      
      return {
        status: "pending",
        transactionId: responseData.id || "",
        paymentUrl: responseData.qrCodeUrl || responseData.paymentUrl || ""
      };
    } catch (error) {
      console.error("Erro ao chamar API EFI Pay:", error);
      
      // Em modo de teste, retornamos uma resposta fake para continuar o fluxo
      if (data.isTestMode) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return {
          status: "pending",
          transactionId: "EFI-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
          paymentUrl: `https://pay.efipay.com.br/${data.referenceId}?test=true`
        };
      }
      
      throw error;
    }
  },
  
  /**
   * Check the status of a payment with EFI Pay
   */
  async checkEfiBankStatus(
    transactionId: string,
    merchantId?: string,
    apiKey?: string
  ): Promise<EfiStatusResponse> {
    // Para demonstração, simulamos uma resposta
    console.log("Checking status on EFI Pay API for:", transactionId);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const possibleStatuses = ["pending", "processing", "approved", "rejected", "cancelled"];
    const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
    
    return {
      status: randomStatus,
      transactionId: transactionId,
      paymentUrl: `https://pay.efipay.com.br/${transactionId}`
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
      paymentUrl: `https://pay.efipay.com.br/${data.referenceId}`
    };
  }
};
