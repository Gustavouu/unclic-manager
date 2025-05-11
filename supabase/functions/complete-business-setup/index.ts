
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers to allow requests from the browser
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// This function handles the second part of business setup - creating access profiles and optional settings
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Start execution timer
    const startTime = Date.now();
    console.log("Starting complete-business-setup function execution");
    
    // Parse request body
    const { userId, businessId, services, staffMembers, hasStaff } = await req.json();
    
    // Validate required fields
    if (!userId || !businessId) {
      throw new Error("ID de usuário e ID do negócio são obrigatórios");
    }
    
    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log("Setting up access profile for user:", userId, "business:", businessId);
    
    // Verify business exists
    const { data: businessData, error: businessCheckError } = await supabase
      .from('negocios')
      .select('id, slug')
      .eq('id', businessId)
      .maybeSingle();
      
    if (businessCheckError || !businessData) {
      throw new Error("Negócio não encontrado");
    }
    
    console.log("Business verified:", businessData);
    
    // Double-check user exists before creating access profile
    const { data: userCheck, error: userCheckError } = await supabase
      .from('usuarios')
      .select('id, email, nome_completo, id_negocio')
      .eq('id', userId)
      .maybeSingle();
    
    if (userCheckError || !userCheck) {
      throw new Error("Usuário não encontrado");
    }
    
    console.log("User verified:", userCheck);
    
    // Create access profile
    console.log("Creating access profile...");
    const { data: accessProfile, error: accessProfileError } = await supabase
      .from('perfis_acesso')
      .insert([{
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
      }])
      .select();
    
    if (accessProfileError) {
      console.error("Error creating access profile:", accessProfileError);
      throw new Error(`Erro ao criar perfil de acesso: ${accessProfileError.message}`);
    }
    
    console.log("Access profile created successfully");
    
    // OPTIONAL: Create business settings
    try {
      console.log("Creating business settings...");
      const { error: configError } = await supabase
        .from('configuracoes_negocio')
        .insert([{ 
          id_negocio: businessId
        }]);
        
      if (configError) {
        console.warn("Warning when creating business settings:", configError);
      } else {
        console.log("Business settings created successfully");
      }
    } catch (configErr) {
      console.warn("Exception when creating business settings:", configErr);
      // Continue despite error
    }
    
    // OPTIONAL: Create services if provided
    if (services && services.length > 0) {
      try {
        console.log("Creating services...");
        const servicesData = services.map(service => ({
          id_negocio: businessId,
          nome: service.name,
          descricao: service.description || null,
          preco: service.price,
          duracao: service.duration,
          ativo: true
        }));
        
        const { data: createdServices, error: servicesError } = await supabase
          .from('servicos')
          .insert(servicesData)
          .select();
        
        if (servicesError) {
          console.warn("Warning when creating services:", servicesError);
        } else {
          console.log(`Created ${createdServices.length} services successfully`);
        }
      } catch (servicesErr) {
        console.warn("Exception when creating services:", servicesErr);
        // Continue despite error
      }
    }
    
    // OPTIONAL: Create staff members if applicable
    if (hasStaff && staffMembers && staffMembers.length > 0) {
      try {
        console.log("Creating staff members...");
        const staffData = staffMembers.map(staff => ({
          id_negocio: businessId,
          nome: staff.name,
          email: staff.email || null,
          telefone: staff.phone || null,
          especializacoes: staff.specialties || null,
          status: 'ativo'
        }));
        
        const { data: createdStaff, error: staffError } = await supabase
          .from('funcionarios')
          .insert(staffData)
          .select();
        
        if (staffError) {
          console.warn("Warning when creating staff members:", staffError);
        } else {
          console.log(`Created ${createdStaff.length} staff members successfully`);
        }
      } catch (staffErr) {
        console.warn("Exception when creating staff:", staffErr);
        // Continue despite error
      }
    }
    
    const executionTime = Date.now() - startTime;
    console.log(`Business setup completed successfully! Execution time: ${executionTime}ms`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        businessId, 
        businessSlug: businessData.slug,
        message: "Configuração do estabelecimento concluída com sucesso!",
        executionTime
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error in complete-business-setup function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
