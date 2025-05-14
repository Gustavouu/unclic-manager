
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers to allow requests from the browser
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to generate a unique slug based on a name
const generateUniqueSlug = (name: string, attempt = 0) => {
  const baseSlug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  
  // If it's first attempt, return as is, otherwise append a number
  return attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Start execution timer
    const startTime = Date.now();
    console.log("Starting create-business function execution");
    
    // Parse request body
    const { businessData, userId } = await req.json();
    
    // Validate userId format and existence
    if (!userId || typeof userId !== 'string' || !userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.error("Invalid user ID format:", userId);
      throw new Error("ID de usuário inválido ou ausente");
    }
    
    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log("Received request to create business with valid user ID:", userId);
    
    // Verify the auth user exists
    console.log("Verifying user exists in auth system...");
    const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(userId);
    
    if (authUserError || !authUser?.user) {
      console.error("User verification failed in auth.users:", authUserError || "User not found");
      throw new Error("Usuário não encontrado no sistema de autenticação");
    }
    
    console.log("Auth user verified:", authUser.user.email);
    
    // Generate and verify unique slug for the business
    let businessSlug = generateUniqueSlug(businessData.name);
    let attempt = 0;
    let isSlugUnique = false;
    
    // Try to find a unique slug (max 5 attempts)
    while (!isSlugUnique && attempt < 5) {
      // Check if slug already exists in businesses table
      const { data: existingBusinessNew, error: slugCheckErrorNew } = await supabase
        .from('businesses')
        .select('id')
        .eq('slug', businessSlug)
        .maybeSingle();
      
      // Only check negocios if needed and if it exists
      let existingBusinessOld = null;
      let slugCheckErrorOld = null;
      
      try {
        const response = await supabase
          .from('negocios')
          .select('id')
          .eq('slug', businessSlug)
          .maybeSingle();
          
        existingBusinessOld = response.data;
        slugCheckErrorOld = response.error;
      } catch (error) {
        // Table might not exist, ignore this error
        console.log("Error checking slug in negocios table (might not exist):", error);
      }
      
      if (
        (slugCheckErrorNew && slugCheckErrorNew.code === 'PGRST116') &&
        (!existingBusinessOld || (slugCheckErrorOld && slugCheckErrorOld.code === 'PGRST116'))
      ) {
        // PGRST116 means no rows returned, so slug is unique
        isSlugUnique = true;
      } else if (
        (!slugCheckErrorNew && existingBusinessNew) || 
        (!slugCheckErrorOld && existingBusinessOld)
      ) {
        // Slug exists in either table, try a new one with a numeric suffix
        attempt++;
        businessSlug = generateUniqueSlug(businessData.name, attempt);
      } else if (slugCheckErrorNew && slugCheckErrorNew.code !== 'PGRST116') {
        // Some other error occurred with businesses table
        console.error("Error checking slug uniqueness in businesses:", slugCheckErrorNew);
        throw new Error(`Error checking slug uniqueness: ${slugCheckErrorNew.message}`);
      } else {
        // No error and no business found, which means slug is unique
        isSlugUnique = true;
      }
    }
    
    if (!isSlugUnique) {
      throw new Error("Não foi possível gerar um slug único para o nome do estabelecimento. Por favor, tente um nome diferente.");
    }
    
    // Create the business record with the unique slug in the businesses table
    console.log("Creating business record in businesses table with slug:", businessSlug);
    
    let businessId: string | null = null;
    
    try {
      const { data: businessRecord, error: businessError } = await supabase
        .from('businesses')
        .insert([
          {
            name: businessData.name,
            admin_email: businessData.email,
            phone: businessData.phone,
            address: businessData.address,
            address_number: businessData.number,
            neighborhood: businessData.neighborhood,
            city: businessData.city,
            state: businessData.state,
            zip_code: businessData.cep || businessData.zipCode,
            slug: businessSlug,
            status: 'pending'
          }
        ])
        .select('id')
        .single();
      
      if (businessError) {
        console.error("Error creating business in businesses table:", businessError);
        
        // Check specifically for duplicate slug error
        if (businessError.code === '23505' && businessError.message.includes('slug')) {
          throw new Error("O nome do estabelecimento já está em uso. Por favor, escolha um nome diferente.");
        }
        
        // If the error is related to the businesses table not existing, try legacy table
        if (businessError.code === '42P01') {
          console.log("businesses table doesn't exist, trying negocios table instead");
          
          // Try to create in legacy negocios table
          const { data: legacyRecord, error: legacyError } = await supabase
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
                cep: businessData.cep || businessData.zipCode,
                slug: businessSlug,
                status: 'pendente'
              }
            ])
            .select('id')
            .single();
            
          if (legacyError) {
            console.error("Error creating business in negocios table:", legacyError);
            throw new Error(`Erro ao criar negócio: ${legacyError.message}`);
          }
          
          if (!legacyRecord) {
            throw new Error("Não foi possível obter o ID do estabelecimento criado");
          }
          
          businessId = legacyRecord.id;
          console.log("Business created successfully in negocios table. ID:", businessId);
        } else {
          throw new Error(`Erro ao criar negócio: ${businessError.message}`);
        }
      } else if (!businessRecord) {
        throw new Error("Não foi possível obter o ID do estabelecimento criado");
      } else {
        businessId = businessRecord.id;
        console.log("Business created successfully in businesses table. ID:", businessId);
      }
      
    } catch (error) {
      console.error("Error creating business record:", error);
      throw error;
    }
    
    if (!businessId) {
      throw new Error("Falha ao criar o estabelecimento: ID não foi gerado");
    }
    
    // Create association between user and business in business_users table
    console.log("Creating business_users association");
    
    try {
      const { error: associationError } = await supabase
        .from('business_users')
        .insert([
          {
            user_id: userId,
            business_id: businessId,
            role: 'owner'
          }
        ]);
        
      if (associationError && associationError.code !== '42P01') {
        console.error("Error creating business_users association:", associationError);
        // Don't throw here, try the legacy approach
      } else if (!associationError) {
        console.log("business_users association created successfully");
      }
    } catch (businessUserError) {
      console.error("Error trying to create business_users association:", businessUserError);
      // Continue despite error
    }
    
    // As fallback, try to update user in usuarios table if it exists
    try {
      const { error: userError } = await supabase
        .from('usuarios')
        .update({ id_negocio: businessId })
        .eq('id', userId);
      
      if (userError && userError.code !== '42P01') {
        console.error("Error updating user profile in usuarios:", userError);
      } else if (!userError) {
        console.log("User profile updated with business ID in usuarios table");
      }
    } catch (error) {
      console.error("Error trying to update user in usuarios:", error);
    }
    
    // Function execution summary
    const executionTime = Date.now() - startTime;
    console.log(`Business creation completed successfully! Execution time: ${executionTime}ms`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        businessId, 
        businessSlug,
        message: "Estabelecimento criado com sucesso!",
        needsProfileSetup: true,
        executionTime
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error in create-business function:", error);
    
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
