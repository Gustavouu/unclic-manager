
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers to allow requests from the browser
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { businessData, userId } = await req.json();
    
    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log("Received request to create business:", { businessData, userId });
    
    // 1. Create the business record (no RLS restrictions with service role)
    const { data: businessRecord, error: businessError } = await supabase
      .from('negocios')
      .insert([
        {
          nome: businessData.name,
          email_admin: businessData.email,
          telefone: businessData.phone,
          endereco: businessData.address,
          numero: businessData.number,
          bairro: businessData.neighborhood,
          cidade: businessData.city,
          estado: businessData.state,
          cep: businessData.cep,
          slug: businessData.slug,
          status: 'ativo'
        }
      ])
      .select('id')
      .single();
    
    if (businessError) {
      console.error("Error creating business:", businessError);
      throw new Error(businessError.message);
    }
    
    if (!businessRecord) {
      throw new Error("Could not get business ID");
    }
    
    const businessId = businessRecord.id;
    console.log("Business created successfully. ID:", businessId);
    
    // 2. Update the user profile with the business ID
    const { error: userError } = await supabase
      .from('usuarios')
      .update({ id_negocio: businessId })
      .eq('id', userId);
    
    if (userError) {
      console.error("Error updating user profile:", userError);
      throw new Error(`Error updating user profile: ${userError.message}`);
    }
    
    // 3. Create access profile (admin)
    const { error: profileError } = await supabase
      .from('perfis_acesso')
      .insert([
        {
          id_usuario: userId,
          id_negocio: businessId,
          e_administrador: true,
          acesso_configuracoes: true,
          acesso_agendamentos: true,
          acesso_clientes: true,
          acesso_financeiro: true,
          acesso_estoque: true,
          acesso_marketing: true,
          acesso_relatorios: true
        }
      ]);
    
    if (profileError) {
      console.error("Error creating access profile:", profileError);
      throw new Error(`Error creating access profile: ${profileError.message}`);
    }
    
    // 4. Create services
    if (businessData.services && businessData.services.length > 0) {
      const servicesData = businessData.services.map(service => ({
        id_negocio: businessId,
        nome: service.name,
        descricao: service.description || null,
        preco: service.price,
        duracao: service.duration,
        ativo: true
      }));
      
      const { error: servicesError } = await supabase
        .from('servicos')
        .insert(servicesData);
      
      if (servicesError) {
        console.error("Error creating services:", servicesError);
        // Continue despite service errors
      }
    }
    
    // 5. Create staff members (if applicable)
    if (businessData.hasStaff && businessData.staffMembers && businessData.staffMembers.length > 0) {
      const staffData = businessData.staffMembers.map(staff => ({
        id_negocio: businessId,
        nome: staff.name,
        email: staff.email || null,
        telefone: staff.phone || null,
        especializacoes: staff.specialties || null,
        status: 'ativo'
      }));
      
      const { error: staffError } = await supabase
        .from('funcionarios')
        .insert(staffData);
      
      if (staffError) {
        console.error("Error creating staff members:", staffError);
        // Continue despite staff errors
      }
    }
    
    // 6. Create business settings
    try {
      const { error: configError } = await supabase
        .from('configuracoes_negocio')
        .insert([{ 
          id_negocio: businessId
          // Use default values for other settings
        }]);
        
      if (configError) {
        console.error("Error creating business settings:", configError);
      }
    } catch (configErr) {
      console.warn("Warning when creating business settings:", configErr);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        businessId, 
        message: "Business created successfully" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error in create-business function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
