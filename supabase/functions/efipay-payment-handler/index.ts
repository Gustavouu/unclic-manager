
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// CORS headers para permitir requisições do frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Interface para tipagem da requisição
interface EfiPayRequest {
  paymentType: "pix" | "credit_card" | "boleto";
  amount: number;
  description: string;
  customer: {
    name: string;
    document: string;
    email?: string;
  };
  expiresIn?: number;
  appointmentId?: string;
}

serve(async (req: Request) => {
  // Tratar preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  // Verificar método
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método não permitido" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
    );
  }

  try {
    // Obter as credenciais do ambiente Supabase
    const merchantId = Deno.env.get("EFIPAY_MERCHANT_ID");
    const apiKey = Deno.env.get("EFIPAY_API_KEY");
    const isSandbox = Deno.env.get("EFIPAY_SANDBOX") === "true";

    if (!merchantId || !apiKey) {
      console.error("Credenciais da EFI Pay não configuradas");
      return new Response(
        JSON.stringify({ error: "Credenciais da EFI Pay não configuradas" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Obter dados da requisição
    const requestData: EfiPayRequest = await req.json();
    const { paymentType, amount, description, customer, expiresIn, appointmentId } = requestData;

    console.log("Recebido pedido de pagamento:", {
      paymentType,
      amount,
      description,
      customerName: customer.name,
      customerDocument: customer.document,
      appointmentId
    });

    // Configurar URL base da API
    const baseUrl = isSandbox
      ? "https://api-sandbox.efipay.com.br"
      : "https://api.efipay.com.br";

    // Configurar endpoint baseado no tipo de pagamento
    let endpoint = "";
    let paymentData = {};

    // Configurar dados específicos para cada tipo de pagamento
    if (paymentType === "pix") {
      endpoint = "/v1/payments/pix";
      paymentData = {
        amount: amount,
        description: description,
        expiresIn: expiresIn || 3600, // Padrão: 1 hora
        customer: {
          name: customer.name,
          document: customer.document
        },
        metadata: {
          appointmentId: appointmentId
        }
      };
    } else if (paymentType === "credit_card") {
      endpoint = "/v1/payments/card";
      // Implementar dados para cartão de crédito conforme necessário
      paymentData = {
        // Dados específicos para pagamento com cartão
      };
    } else if (paymentType === "boleto") {
      endpoint = "/v1/payments/boleto";
      // Implementar dados para boleto conforme necessário
      paymentData = {
        // Dados específicos para pagamento com boleto
      };
    } else {
      return new Response(
        JSON.stringify({ error: "Tipo de pagamento inválido" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Configurar headers para autenticação Basic
    const authString = btoa(`${merchantId}:${apiKey}`);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${authString}`
    };

    console.log(`Enviando requisição para EFI Pay: ${baseUrl}${endpoint}`);

    // Enviar requisição para a API da EFI Pay
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(paymentData)
    });

    // Processar resposta
    const responseData = await response.json();

    if (!response.ok) {
      console.error("Erro na API EFI Pay:", responseData);
      return new Response(
        JSON.stringify({ 
          error: "Erro na API EFI Pay", 
          details: responseData 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status }
      );
    }

    console.log("Resposta da EFI Pay:", responseData);

    // Retornar resposta bem-sucedida
    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao processar pagamento", details: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
