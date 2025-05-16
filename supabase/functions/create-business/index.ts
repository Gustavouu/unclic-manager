import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    console.log("Function initialization:");
    console.log(`SUPABASE_URL: ${supabaseUrl ? "set" : "missing"}`);
    console.log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? "set" : "missing"}`);
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing environment variables");
      throw new Error("Missing environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Log do payload recebido
    const requestBody = await req.json();
    console.log("Payload recebido:", JSON.stringify(requestBody));

    // Permite tanto formato aninhado quanto plano, de forma segura
    let businessData = null;
    let userId = null;

    if (requestBody.businessData && requestBody.userId) {
      businessData = requestBody.businessData;
      userId = requestBody.userId;
    } else if (requestBody.name && requestBody.userId) {
      // formato plano
      businessData = requestBody;
      userId = requestBody.userId;
    }

    console.log("businessData extraído:", businessData);
    console.log("userId extraído:", userId);

    if (!businessData || !userId) {
      console.error("Business data and user ID are required", { businessData, userId });
      return new Response(
        JSON.stringify({ success: false, error: "Business data and user ID are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 2. Gerar slug único
    const timestamp = Date.now().toString().slice(-6);
    const baseSlug = businessData.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    const slug = `${baseSlug}-${timestamp}`;

    // 3. Preparar dados para inserir (ajustando nomes conforme schema)
    const dadosParaInserir = {
      name: businessData.name,
      slug,
      admin_email: businessData.admin_email || businessData.email,
      phone: businessData.phone,
      zip_code: businessData.zip_code || businessData.cep,
      address: businessData.address,
      address_number: businessData.address_number || businessData.number,
      address_complement: businessData.address_complement,
      neighborhood: businessData.neighborhood,
      city: businessData.city,
      state: businessData.state,
      status: 'active'
    };
    console.log("Dados para inserir:", JSON.stringify(dadosParaInserir));

    // 4. Inserir no banco
    const { data: businessInserted, error: businessError } = await supabase
      .from('businesses')
      .insert([dadosParaInserir])
      .select('id, slug')
      .single();

    if (businessError) {
      console.error('Erro ao criar negócio:', businessError);
      return new Response(
        JSON.stringify({ success: false, error: businessError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    console.log('Negócio criado:', businessInserted);

    // 5. Associação com usuário
    const { error: userError } = await supabase
      .from('business_users')
      .insert([{ business_id: businessInserted.id, user_id: userId, role: 'owner' }]);
    if (userError) {
      console.error('Erro ao associar usuário ao negócio:', userError);
    } else {
      console.log('Associação usuário-negócio criada com sucesso');
    }

    // 6. Settings (opcional)
    // ... mantenha seu bloco de settings se necessário ...

    return new Response(
      JSON.stringify({ success: true, businessId: businessInserted.id, businessSlug: slug }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erro inesperado na função create-business:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Erro inesperado" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
