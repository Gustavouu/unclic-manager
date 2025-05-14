
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
    
    // Check which tables exist in the database
    const tablesInfo: { 
      businesses: boolean; 
      negocios: boolean; 
      business_users: boolean;
      perfis_acesso: boolean;
      services: boolean;
      servicos: boolean;
      professionals: boolean;
      funcionarios: boolean;
    } = {
      businesses: false,
      negocios: false,
      business_users: false,
      perfis_acesso: false,
      services: false,
      servicos: false,
      professionals: false,
      funcionarios: false
    };
    
    // Check all tables existence
    for (const tableName of Object.keys(tablesInfo)) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
          
        if (!error) {
          tablesInfo[tableName as keyof typeof tablesInfo] = true;
          console.log(`Table ${tableName} exists`);
        } else {
          console.log(`Error checking table ${tableName}:`, error);
        }
      } catch (e) {
        console.log(`Table ${tableName} doesn't exist or error checking it:`, e);
      }
    }
    
    // Double check if the business exists
    console.log("Verifying business exists...");
    let businessExists = false;
    let businessTable = '';
    
    if (tablesInfo.businesses) {
      const { data, error } = await supabase
        .from('businesses')
        .select('id')
        .eq('id', businessId)
        .maybeSingle();
      
      if (!error && data) {
        businessExists = true;
        businessTable = 'businesses';
        console.log("Business found in businesses table");
      }
    }
    
    if (!businessExists && tablesInfo.negocios) {
      const { data, error } = await supabase
        .from('negocios')
        .select('id')
        .eq('id', businessId)
        .maybeSingle();
      
      if (!error && data) {
        businessExists = true;
        businessTable = 'negocios';
        console.log("Business found in negocios table");
      }
    }
    
    if (!businessExists) {
      console.error("Business not found in any table");
      throw new Error("Negócio não encontrado");
    }
    
    // Create business_user association if table exists
    if (tablesInfo.business_users) {
      console.log("Creating business_users association");
      
      const { data: existingAssociation, error: checkError } = await supabase
        .from('business_users')
        .select('id')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .maybeSingle();
        
      if (!existingAssociation && !checkError) {
        const { error: associationError } = await supabase
          .from('business_users')
          .insert({
            user_id: userId,
            business_id: businessId,
            role: 'owner'
          });
          
        if (associationError) {
          console.error("Error creating business_users association:", associationError);
        } else {
          console.log("business_users association created successfully");
        }
      } else if (existingAssociation) {
        console.log("business_users association already exists");
      } else if (checkError) {
        console.error("Error checking business_users association:", checkError);
      }
    }
    
    // Create or update access profile for legacy system if table exists
    if (tablesInfo.perfis_acesso) {
      console.log("Checking if user has access profile for business");
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('perfis_acesso')
        .select('id')
        .eq('id_usuario', userId)
        .eq('id_negocio', businessId)
        .maybeSingle();
      
      if (profileCheckError) {
        console.error("Error checking access profile:", profileCheckError);
      }
      
      // If profile doesn't exist, create a new one
      if (!existingProfile && !profileCheckError) {
        console.log("Creating new access profile for user");
        
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
        } else {
          console.log("Access profile created successfully");
        }
      } else {
        console.log("Access profile already exists, skipping creation");
      }
    }
    
    // Create services
    if (services && services.length > 0) {
      console.log("Creating services:", services.length);
      
      if (tablesInfo.services) {
        const servicesToInsert = services.map(service => ({
          id: uuidv4(),
          business_id: businessId,
          name: service.name,
          description: service.description || null,
          price: service.price,
          duration: service.duration,
          commission_percentage: 0,
          is_active: true
        }));
        
        const { error: servicesError } = await supabase
          .from('services')
          .insert(servicesToInsert);
        
        if (servicesError) {
          console.error("Error creating services in services table:", servicesError);
        } else {
          console.log("Services created successfully in services table");
        }
      }
      
      if (tablesInfo.servicos) {
        const servicosToInsert = services.map(service => ({
          id: uuidv4(),
          id_negocio: businessId,
          nome: service.name,
          descricao: service.description || null,
          preco: service.price,
          duracao: service.duration,
          comissao_percentual: 0,
          ativo: true
        }));
        
        const { error: servicosError } = await supabase
          .from('servicos')
          .insert(servicosToInsert);
        
        if (servicosError) {
          console.error("Error creating services in servicos table:", servicosError);
        } else {
          console.log("Services created successfully in servicos table");
        }
      }
    } else {
      console.log("No services to create");
    }
    
    // Wait a moment to prevent race conditions
    await sleep(500);
    
    // Create staff members if hasStaff is true
    if (hasStaff && staffMembers && staffMembers.length > 0) {
      console.log("Creating staff members:", staffMembers.length);
      
      if (tablesInfo.professionals) {
        const professionalsToInsert = staffMembers.map(staff => ({
          id: uuidv4(),
          business_id: businessId,
          name: staff.name,
          position: staff.role || "Professional",
          email: staff.email || null,
          phone: staff.phone || null,
          specialties: staff.specialties || [],
          status: "active"
        }));
        
        const { error: professionalsError } = await supabase
          .from('professionals')
          .insert(professionalsToInsert);
        
        if (professionalsError) {
          console.error("Error creating staff members in professionals table:", professionalsError);
        } else {
          console.log("Staff members created successfully in professionals table");
        }
      }
      
      if (tablesInfo.funcionarios) {
        const funcionariosToInsert = staffMembers.map(staff => ({
          id: uuidv4(),
          id_negocio: businessId,
          nome: staff.name,
          cargo: staff.role || "Profissional",
          email: staff.email || null,
          telefone: staff.phone || null,
          especializacoes: staff.specialties || [],
          status: "ativo"
        }));
        
        const { error: funcionariosError } = await supabase
          .from('funcionarios')
          .insert(funcionariosToInsert);
        
        if (funcionariosError) {
          console.error("Error creating staff members in funcionarios table:", funcionariosError);
        } else {
          console.log("Staff members created successfully in funcionarios table");
        }
      }
    } else {
      console.log("No staff members to create");
    }
    
    // Update business status to active
    console.log("Updating business status to active");
    let statusUpdateSuccess = false;

    // Log the business table we're going to update
    console.log(`Updating business status in ${businessTable} table`);
    
    // Try direct update based on table detected earlier
    if (businessTable === 'businesses') {
      const { error: businessesError } = await supabase
        .from('businesses')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId);
        
      if (businessesError) {
        console.error("Error updating businesses status:", businessesError);
      } else {
        console.log("Business status updated successfully in businesses table");
        statusUpdateSuccess = true;
      }
    } else if (businessTable === 'negocios') {
      const { error: negociosError } = await supabase
        .from('negocios')
        .update({ 
          status: 'ativo',
          atualizado_em: new Date().toISOString()
        })
        .eq('id', businessId);
        
      if (negociosError) {
        console.error("Error updating negocios status:", negociosError);
      } else {
        console.log("Business status updated successfully in negocios table");
        statusUpdateSuccess = true;
      }
    }
    
    // If direct update failed, try RPC function
    if (!statusUpdateSuccess) {
      try {
        console.log("Trying RPC method to update status");
        const { data: rpcData, error: rpcError } = await supabase.rpc('set_business_status', {
          business_id: businessId,
          new_status: 'active'
        });
        
        if (rpcError) {
          console.error("Error in RPC status update:", rpcError);
        } else {
          console.log("Business status updated via RPC function");
          statusUpdateSuccess = true;
        }
      } catch (rpcFailure) {
        console.error("Failed to call RPC function:", rpcFailure);
      }
    }
    
    // Try fallback methods if both previous methods failed
    if (!statusUpdateSuccess) {
      console.log("Previous update methods failed, trying fallbacks");
      
      // Try businesses table as fallback
      if (tablesInfo.businesses && businessTable !== 'businesses') {
        const { error: businessesError } = await supabase
          .from('businesses')
          .update({ 
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', businessId);
          
        if (businessesError) {
          console.error("Fallback: Error updating businesses status:", businessesError);
        } else {
          console.log("Fallback: Business status updated successfully in businesses table");
          statusUpdateSuccess = true;
        }
      }
      
      // Try negocios table as a last resort
      if (!statusUpdateSuccess && tablesInfo.negocios && businessTable !== 'negocios') {
        const { error: negociosError } = await supabase
          .from('negocios')
          .update({ 
            status: 'ativo',
            atualizado_em: new Date().toISOString()
          })
          .eq('id', businessId);
          
        if (negociosError) {
          console.error("Fallback: Error updating negocios status:", negociosError);
        } else {
          console.log("Fallback: Business status updated successfully in negocios table");
          statusUpdateSuccess = true;
        }
      }
    }
    
    if (!statusUpdateSuccess) {
      console.warn("Could not update business status in any table");
    }
    
    const executionTime = Date.now() - startTime;
    console.log(`Business setup completed! Execution time: ${executionTime}ms`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Configuração concluída com sucesso!",
        executionTime,
        businessId,
        statusUpdated: statusUpdateSuccess
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
