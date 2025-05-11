
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers to allow requests from the browser
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to generate a unique slug based on a name
const generateUniqueSlug = (name, attempt = 0) => {
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

// SIMPLIFIED FUNCTION - Focus only on creating the business entity
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
    
    // Check if user exists in usuarios table
    const { data: existingUser, error: userCheckError } = await supabase
      .from('usuarios')
      .select('id, nome_completo, email')
      .eq('id', userId)
      .maybeSingle();
    
    // Create user if doesn't exist
    if (!existingUser) {
      console.log("User not found in usuarios table. Creating new user record.");
      
      const userName = authUser.user.user_metadata?.name || businessData.name || "Usuário";
      const userEmail = authUser.user.email || businessData.email;
      
      if (!userEmail) {
        throw new Error("Email do usuário não encontrado");
      }
      
      // Create user record
      const { data: createdUser, error: createUserError } = await supabase
        .from('usuarios')
        .insert([{
          id: userId,
          email: userEmail,
          nome_completo: userName,
          status: 'ativo'
        }])
        .select();
      
      if (createUserError) {
        console.error("Error creating user:", createUserError);
        throw new Error(`Falha ao criar registro de usuário: ${createUserError.message}`);
      }
      
      console.log("User created successfully");
      
      // Wait for database consistency
      await sleep(2000);
    }
    
    // Generate and verify unique slug for the business
    let businessSlug = generateUniqueSlug(businessData.name);
    let attempt = 0;
    let isSlugUnique = false;
    
    // Try to find a unique slug (max 5 attempts)
    while (!isSlugUnique && attempt < 5) {
      // Check if slug already exists
      const { data: existingBusiness, error: slugCheckError } = await supabase
        .from('negocios')
        .select('id')
        .eq('slug', businessSlug)
        .maybeSingle();
      
      if (slugCheckError && slugCheckError.code === 'PGRST116') {
        // PGRST116 means no rows returned, so slug is unique
        isSlugUnique = true;
      } else if (!slugCheckError && existingBusiness) {
        // Slug exists, try a new one with a numeric suffix
        attempt++;
        businessSlug = generateUniqueSlug(businessData.name, attempt);
      } else if (slugCheckError) {
        // Some other error occurred
        console.error("Error checking slug uniqueness:", slugCheckError);
        throw new Error(`Error checking slug uniqueness: ${slugCheckError.message}`);
      }
    }
    
    if (!isSlugUnique) {
      throw new Error("Não foi possível gerar um slug único para o nome do estabelecimento. Por favor, tente um nome diferente.");
    }
    
    // Create the business record with the unique slug
    console.log("Creating business record with slug:", businessSlug);
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
          slug: businessSlug,
          status: 'ativo'
        }
      ])
      .select('id')
      .single();
    
    if (businessError) {
      console.error("Error creating business:", businessError);
      
      // Check specifically for duplicate slug error
      if (businessError.code === '23505' && businessError.message.includes('negocios_slug_key')) {
        throw new Error("O nome do estabelecimento já está em uso. Por favor, escolha um nome diferente.");
      }
      
      throw new Error(`Erro ao criar negócio: ${businessError.message}`);
    }
    
    if (!businessRecord) {
      throw new Error("Não foi possível obter o ID do estabelecimento criado");
    }
    
    const businessId = businessRecord.id;
    console.log("Business created successfully. ID:", businessId);
    
    // Update the user profile with the business ID - SIMPLIFIED
    console.log("Updating user record with business ID association");
    const { error: userError } = await supabase
      .from('usuarios')
      .update({ id_negocio: businessId })
      .eq('id', userId);
    
    if (userError) {
      console.error("Error updating user profile:", userError);
      // Don't throw, just log the error and continue
      console.warn("Continuing despite user update error");
    } else {
      console.log("User profile updated with business ID");
    }
    
    const executionTime = Date.now() - startTime;
    console.log(`Business creation completed successfully! Execution time: ${executionTime}ms`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        businessId, 
        businessSlug,
        message: "Estabelecimento criado com sucesso! Clique para completar a configuração.",
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
