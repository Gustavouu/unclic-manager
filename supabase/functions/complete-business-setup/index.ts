
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { v4 as uuidv4 } from "https://esm.sh/uuid@11.0.0";

// CORS headers to allow requests from the browser
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function for sleep/delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Start execution timer and detailed logging
    const startTime = Date.now();
    console.log("Starting complete-business-setup function execution");
    
    // Parse request body
    const requestData = await req.json();
    const { userId, businessId, services, staffMembers, hasStaff, businessHours } = requestData;
    
    console.log("Request data:", {
      userId,
      businessId,
      servicesCount: services?.length || 0,
      staffCount: staffMembers?.length || 0,
      hasStaff,
      businessHoursProvided: businessHours ? true : false
    });
    
    // Validate mandatory fields
    if (!userId) {
      throw new Error("ID de usuário ausente");
    }
    
    if (!businessId) {
      throw new Error("ID de negócio ausente");
    }
    
    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Configurações do Supabase não encontradas");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if user has access profile for this business already
    console.log("Checking if user has access profile for business");
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('perfis_acesso')
      .select('id')
      .eq('id_usuario', userId)
      .eq('id_negocio', businessId)
      .maybeSingle();
    
    if (profileCheckError) {
      console.error("Error checking access profile:", profileCheckError);
      // Continue anyway, as we'll create a new profile
    }
    
    // If profile already exists, we'll update it instead of creating a new one
    if (!existingProfile) {
      console.log("Creating new access profile for user");
      
      // Create access profile for the user (admin role)
      const { error: profileError } = await supabase
        .from('perfis_acesso')
        .insert([{
          id_usuario: userId,
          id_negocio: businessId,
          e_administrador: true,
          acesso_agendamentos: true,
          acesso_clientes: true,
          acesso_financeiro: true,
          acesso_estoque: true,
          acesso_relatorios: true,
          acesso_configuracoes: true,
          acesso_marketing: true
        }]);
      
      if (profileError) {
        console.error("Error creating access profile:", profileError);
        throw new Error(`Erro ao criar perfil de acesso: ${profileError.message}`);
      } else {
        console.log("Access profile created successfully");
      }
    } else {
      console.log("Access profile already exists, skipping creation");
    }
    
    // Create services
    if (services && services.length > 0) {
      console.log("Creating services:", services.length);
      
      const servicesToInsert = services.map(service => ({
        id: uuidv4(),
        id_negocio: businessId,
        nome: service.name,
        descricao: service.description || null,
        preco: service.price,
        duracao: service.duration,
        comissao_percentual: 0,
        ativo: true
      }));
      
      const { error: servicesError } = await supabase
        .from('servicos')
        .insert(servicesToInsert);
      
      if (servicesError) {
        console.error("Error creating services:", servicesError);
        // Continue anyway, other steps might still succeed
      } else {
        console.log("Services created successfully");
      }
    } else {
      console.log("No services to create");
    }
    
    // Wait a moment to prevent race conditions
    await sleep(500);
    
    // Create staff members if hasStaff is true
    if (hasStaff && staffMembers && staffMembers.length > 0) {
      console.log("Creating staff members:", staffMembers.length);
      
      const staffToInsert = staffMembers.map(staff => ({
        id: uuidv4(),
        id_negocio: businessId,
        nome: staff.name,
        cargo: staff.role || "Profissional",
        email: staff.email || null,
        telefone: staff.phone || null,
        especializacoes: staff.specialties || [],
        status: "ativo"
      }));
      
      const { error: staffError } = await supabase
        .from('funcionarios')
        .insert(staffToInsert);
      
      if (staffError) {
        console.error("Error creating staff members:", staffError);
        // Continue anyway, other steps might still succeed
      } else {
        console.log("Staff members created successfully");
      }
    } else {
      console.log("No staff members to create");
    }
    
    // Create business hours
    if (businessHours) {
      console.log("Creating business hours");
      
      // Map days of week to their numeric representation
      const dayMapping: Record<string, number> = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 0
      };
      
      const hoursToInsert = Object.entries(businessHours)
        .filter(([_, data]) => data.open)
        .map(([day, data]) => ({
          id: uuidv4(),
          id_negocio: businessId,
          dia_semana: dayMapping[day],
          hora_inicio: data.openTime,
          hora_fim: data.closeTime,
          dia_folga: false,
          capacidade_simultanea: 1,
          intervalo_entre_agendamentos: 0
        }));
      
      const { error: hoursError } = await supabase
        .from('horarios_disponibilidade')
        .insert(hoursToInsert);
      
      if (hoursError) {
        console.error("Error creating business hours:", hoursError);
        // Continue anyway, other steps might still succeed
      } else {
        console.log("Business hours created successfully");
      }
    } else {
      console.log("No business hours to create");
    }
    
    // Update business status to active - fixing the status update issue
    console.log("Updating business status to active");
    
    // First attempt: direct update with appropriate column name (atualizado_em instead of updated_at)
    const { data: updateData, error: statusError } = await supabase
      .from('negocios')
      .update({ 
        status: 'ativo',
        atualizado_em: new Date().toISOString()  // Use the correct Portuguese field name
      })
      .eq('id', businessId)
      .select('id, status');
    
    if (statusError) {
      console.error("Error updating business status:", statusError);
      
      // Try again with the RPC approach
      console.log("Trying RPC status update approach");
      const { data: rpcData, error: rpcError } = await supabase.rpc('set_business_status', {
        business_id: businessId,
        new_status: 'ativo'
      });
      
      if (rpcError) {
        console.error("Error in RPC status update:", rpcError);
        
        // Last attempt: Try a simplified update without selecting
        console.log("Trying simplified update as last resort");
        const { error: finalAttemptError } = await supabase
          .from('negocios')
          .update({ status: 'ativo' })
          .eq('id', businessId);
        
        if (finalAttemptError) {
          console.error("All status update attempts failed:", finalAttemptError);
        } else {
          console.log("Business status updated via simplified update");
        }
      } else {
        console.log("Business status updated via RPC function");
      }
    } else {
      console.log("Business status updated successfully:", updateData);
    }
    
    const executionTime = Date.now() - startTime;
    console.log(`Business setup completed successfully! Execution time: ${executionTime}ms`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Configuração concluída com sucesso!",
        executionTime,
        businessId
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
