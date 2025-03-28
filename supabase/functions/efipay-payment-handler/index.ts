
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
    console.log("EFI Pay handler received request");
    
    // Mock de credenciais para modo de demonstração 
    // (normalmente, seriam obtidas do ambiente Supabase)
    const merchantId = "DEMO_MERCHANT_ID";
    const apiKey = "DEMO_API_KEY";
    const isSandbox = true;

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

    // Em modo de demonstração, simulamos uma resposta bem-sucedida
    // Em produção, aqui faríamos a chamada real para a API da EFI Pay
    
    const mockResponse = {
      id: "EFI-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: "pending",
      created_at: new Date().toISOString(),
      description: description,
      amount: amount,
      customer: customer,
      paymentUrl: null,
      qrCodeUrl: null,
      expiresIn: expiresIn || 3600
    };
    
    // Para pagamentos PIX, adicionar URL do QR Code
    if (paymentType === "pix") {
      // No ambiente real, a API da EFI Pay retornaria uma imagem real do QR code
      // Para demonstração, usamos um QR code simulado
      mockResponse.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pix-payment-${appointmentId || "demo"}-${Date.now()}`;
      mockResponse.paymentUrl = `https://pay.efipay.com.br/pix/${mockResponse.id}`;
    } else if (paymentType === "credit_card") {
      mockResponse.paymentUrl = `https://pay.efipay.com.br/credit/${mockResponse.id}`;
    } else if (paymentType === "boleto") {
      mockResponse.paymentUrl = `https://pay.efipay.com.br/boleto/${mockResponse.id}`;
    }

    console.log("Returning mock response:", mockResponse);

    // Retornar resposta bem-sucedida
    return new Response(
      JSON.stringify(mockResponse),
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
