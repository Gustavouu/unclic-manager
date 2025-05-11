
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

// Helper function for robust user verification
const verifyUserExists = async (supabase, userId) => {
  try {
    console.log(`Beginning verification for user ${userId}`);
    
    // First check auth.users to verify the user exists in the auth system
    const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(userId);
    
    if (authUserError || !authUser?.user) {
      console.error("User verification failed in auth.users:", authUserError || "User not found");
      return { exists: false, error: "Usuário não encontrado no sistema de autenticação" };
    }
    
    console.log("Auth user verified:", authUser.user.email);
    
    // Check if user exists in usuarios table with detailed error handling
    const { data: existingUser, error: userCheckError } = await supabase
      .from('usuarios')
      .select('id, nome_completo, email')
      .eq('id', userId)
      .maybeSingle();
    
    if (userCheckError && userCheckError.code !== 'PGRST116') { // Not found is expected
      console.error("Database error checking user existence:", userCheckError);
      return { exists: !!existingUser, error: userCheckError.message };
    }
    
    console.log("User check complete:", existingUser ? "User exists" : "User does not exist in usuarios table");
    
    return { 
      exists: !!existingUser, 
      authUser: authUser.user, 
      user: existingUser,
      email: authUser.user.email,
      name: authUser.user.user_metadata?.name
    };
  } catch (err) {
    console.error("Exception in verifyUserExists:", err);
    return { exists: false, error: err.message };
  }
};

// Helper function to create user with retries
const createUserRecord = async (supabase, userId, userEmail, userName, maxRetries = 5) => {
  let attempt = 0;
  let error = null;
  let createdUser = null;
  
  while (attempt < maxRetries) {
    attempt++;
    console.log(`Attempt ${attempt}/${maxRetries} to create user ${userId}`);
    
    try {
      // First, check if the user already exists - maybe it was created in a previous attempt
      const { data: existingUser, error: checkError } = await supabase
        .from('usuarios')
        .select('id, nome_completo, email')
        .eq('id', userId)
        .maybeSingle();
        
      if (!checkError && existingUser) {
        console.log("User already exists, no need to create:", existingUser);
        return { success: true, user: existingUser };
      }
      
      const userToCreate = {
        id: userId,
        email: userEmail,
        nome_completo: userName || "Usuário",
        status: 'ativo'
      };
      
      console.log("Creating user with data:", userToCreate);
      
      const { data, error: createError } = await supabase
        .from('usuarios')
        .insert([userToCreate])
        .select();
      
      if (createError) {
        console.error(`User creation attempt ${attempt} failed:`, createError);
        error = createError;
        // Wait longer between each retry - exponential backoff
        await sleep(2000 * attempt); 
        continue;
      }
      
      createdUser = data?.[0];
      console.log("User created successfully:", createdUser);
      
      // Important: Wait longer to ensure database consistency - increased from 2000ms to 4000ms
      await sleep(4000);
      
      // Verify user was actually created with direct query
      const { data: verifyUser, error: verifyError } = await supabase
        .from('usuarios')
        .select('id, nome_completo, email')
        .eq('id', userId)
        .single();
      
      if (verifyError || !verifyUser) {
        console.error("User verification failed after creation:", verifyError || "User not found");
        error = verifyError || new Error("User creation verification failed");
        await sleep(2000 * attempt);
        continue;
      }
      
      console.log("User verified successfully after creation:", verifyUser);
      return { success: true, user: verifyUser };
    } catch (createError) {
      console.error(`Create user attempt ${attempt} exception:`, createError);
      error = createError;
      await sleep(2000 * attempt);
    }
  }
  
  return { success: false, error };
};

// Helper function to create access profile with robust retries
const createAccessProfile = async (supabase, userId, businessId, maxRetries = 5) => {
  let attempt = 0;
  let error = null;
  
  while (attempt < maxRetries) {
    attempt++;
    console.log(`Attempt ${attempt}/${maxRetries} to create access profile for user ${userId} and business ${businessId}`);
    
    try {
      // Double-check user exists before creating access profile with a direct query
      // This is critical to prevent foreign key constraint errors
      const { data: userCheck, error: userCheckError } = await supabase
        .from('usuarios')
        .select('id, email, nome_completo, id_negocio')
        .eq('id', userId)
        .maybeSingle();
      
      if (userCheckError || !userCheck) {
        console.log(`User ${userId} check failed in attempt ${attempt}:`, userCheckError || "User not found");
        // Progressive wait - exponentially increased
        await sleep(3000 * attempt); 
        continue;
      }
      
      // Now verify business ID
      const { data: businessCheck, error: businessCheckError } = await supabase
        .from('negocios')
        .select('id, nome')
        .eq('id', businessId)
        .maybeSingle();
        
      if (businessCheckError || !businessCheck) {
        console.log(`Business ${businessId} check failed in attempt ${attempt}:`, businessCheckError || "Business not found");
        await sleep(3000 * attempt); 
        continue;
      }
      
      // Update user with business ID if not already set
      if (!userCheck.id_negocio) {
        console.log(`Updating user ${userId} with business ID ${businessId}`);
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ id_negocio: businessId })
          .eq('id', userId);
          
        if (updateError) {
          console.error(`Failed to update user with business ID in attempt ${attempt}:`, updateError);
          await sleep(2000 * attempt);
          continue;
        }
        
        // Wait longer for update to complete - increased from 1500ms to 3000ms
        await sleep(3000);
      } else if (userCheck.id_negocio !== businessId) {
        console.log(`User already has different business ID: ${userCheck.id_negocio}, expected: ${businessId}`);
      }
      
      // Check if access profile already exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('perfis_acesso')
        .select('id')
        .eq('id_usuario', userId)
        .eq('id_negocio', businessId)
        .maybeSingle();
        
      if (!profileCheckError && existingProfile) {
        console.log("Access profile already exists:", existingProfile);
        return { success: true, profile: existingProfile };
      }
      
      console.log(`User ${userId} confirmed to exist with business ${businessId}, proceeding with access profile creation`);
      
      // Added a final sleep before profile creation to ensure DB consistency - NEW
      await sleep(2000);
      
      const accessProfileData = {
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
      };
      
      // Try-catch specifically for the profile insertion
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('perfis_acesso')
          .insert([accessProfileData])
          .select();
        
        if (profileError) {
          if (profileError.code === '23503') { // Foreign key violation error
            console.error(`Foreign key violation in profile creation (attempt ${attempt}):`, profileError);
            // For FK violations, wait even longer
            await sleep(4000 * attempt);
            continue;
          } else {
            console.error(`Access profile creation attempt ${attempt} failed:`, profileError);
            error = profileError;
            await sleep(2000 * attempt);
            continue;
          }
        }
        
        console.log("Access profile created successfully:", profileData);
        return { success: true, profile: profileData };
      } catch (insertError) {
        console.error(`Profile insertion attempt ${attempt} exception:`, insertError);
        error = insertError;
        await sleep(2000 * attempt);
        continue;
      }
    } catch (profileError) {
      console.error(`Access profile attempt ${attempt} exception:`, profileError);
      error = profileError;
      await sleep(2000 * attempt);
    }
  }
  
  // If all attempts fail but we have valid user and business, return partial success
  try {
    const { data: userBizCheck } = await supabase
      .from('usuarios')
      .select('id_negocio')
      .eq('id', userId)
      .single();
      
    if (userBizCheck && userBizCheck.id_negocio === businessId) {
      return { 
        success: false, 
        error: error,
        partialSuccess: true, 
        message: "Negócio criado e associado ao usuário, mas o perfil de acesso não foi criado"
      };
    }
  } catch (e) {
    console.error("Error in final check:", e);
  }
  
  return { success: false, error };
};

// This function will attempt to verify if a business was created for a user
// even if we don't have a direct response from the creation attempt
const verifyBusinessCreated = async (supabase, userId) => {
  try {
    console.log(`Verifying if business was created for user ${userId}`);
    
    // Check if user has a business ID
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id_negocio')
      .eq('id', userId)
      .maybeSingle();
      
    if (userError || !userData || !userData.id_negocio) {
      console.log("No business found for user:", userError || "No business ID");
      return { success: false };
    }
    
    // Verify the business exists
    const { data: businessData, error: businessError } = await supabase
      .from('negocios')
      .select('id, nome, slug, status')
      .eq('id', userData.id_negocio)
      .maybeSingle();
      
    if (businessError || !businessData) {
      console.log("Business verification failed:", businessError || "Business not found");
      return { success: false };
    }
    
    console.log("Business verified:", businessData);
    return { 
      success: true, 
      businessId: businessData.id, 
      businessSlug: businessData.slug 
    };
  } catch (err) {
    console.error("Error in verifyBusinessCreated:", err);
    return { success: false, error: err.message };
  }
};

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
    
    // STEP 1: Comprehensive user verification with detailed logging
    console.log("Starting comprehensive user verification process...");
    const userVerification = await verifyUserExists(supabase, userId);
    
    if (userVerification.error) {
      throw new Error(`Erro na verificação do usuário: ${userVerification.error}`);
    }
    
    // STEP 2: Create user record if it doesn't exist
    let userRecord = userVerification.user;
    
    if (!userVerification.exists) {
      console.log("User not found in usuarios table. Creating new user record.");
      
      if (!userVerification.authUser) {
        throw new Error("Dados do usuário não encontrados no sistema de autenticação");
      }
      
      const userName = userVerification.name || businessData.name || "Usuário";
      const userEmail = userVerification.email || businessData.email;
      
      if (!userEmail) {
        throw new Error("Email do usuário não encontrado");
      }
      
      // Create user with robust retry mechanism
      const userCreation = await createUserRecord(
        supabase, 
        userId,
        userEmail,
        userName,
        5 // Max 5 retries
      );
      
      if (!userCreation.success) {
        throw new Error(`Falha ao criar registro de usuário: ${userCreation.error?.message || "Erro desconhecido"}`);
      }
      
      userRecord = userCreation.user;
    } else {
      console.log("User already exists in the database:", userRecord);
    }
    
    // STEP 3: Generate and verify unique slug for the business
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
    
    // STEP 4: Create the business record with the unique slug
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
    
    // STEP 5: Update the user profile with the business ID
    console.log("Updating user record with business ID association");
    const { error: userError } = await supabase
      .from('usuarios')
      .update({ id_negocio: businessId })
      .eq('id', userId);
    
    if (userError) {
      console.error("Error updating user profile:", userError);
      throw new Error(`Erro ao atualizar perfil do usuário: ${userError.message}`);
    }
    
    console.log("User profile updated with business ID");
    
    // Allow more time for database consistency - increased from 2000ms to 4000ms
    await sleep(4000);
    
    // Verify user record was updated correctly
    console.log("Verifying user-business association...");
    const { data: verifiedUser, error: verifyUserError } = await supabase
      .from('usuarios')
      .select('id, id_negocio')
      .eq('id', userId)
      .maybeSingle();
      
    if (verifyUserError || !verifiedUser || verifiedUser.id_negocio !== businessId) {
      console.error("User-business association verification failed:", 
        verifyUserError || 
        `Expected business ID ${businessId}, but found ${verifiedUser?.id_negocio}`);
      // Continue despite this issue - it's not critical
      console.warn("Continuing despite user-business association verification issue");
    } else {
      console.log("User-business association verified:", verifiedUser);
    }
    
    // STEP 6: Create access profile with robust retry mechanism
    console.log("Creating access profile with robust retry mechanism");
    const accessProfileResult = await createAccessProfile(supabase, userId, businessId);
    
    // Continue even if access profile creation fails
    if (!accessProfileResult.success) {
      console.error("All attempts to create access profile failed:", accessProfileResult.error);
      
      // Don't throw error here - we will return a warning in the response
      // The user can still proceed, and we'll try to recover in the UI
    } else {
      console.log("Access profile created successfully:", accessProfileResult.profile);
    }
    
    // Continue with optional steps regardless of access profile creation
    // These are helpful but not critical for the basic functionality
    
    // Create business settings
    try {
      console.log("Creating business settings...");
      const { error: configError } = await supabase
        .from('configuracoes_negocio')
        .insert([{ 
          id_negocio: businessId
        }]);
        
      if (configError) {
        console.warn("Error creating business settings:", configError);
      } else {
        console.log("Business settings created successfully");
      }
    } catch (configErr) {
      console.warn("Warning when creating business settings:", configErr);
    }
    
    // Create services
    if (businessData.services && businessData.services.length > 0) {
      try {
        console.log("Creating services...");
        const servicesData = businessData.services.map(service => ({
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
          console.warn("Error creating services:", servicesError);
        } else {
          console.log(`Created ${createdServices.length} services successfully`);
        }
      } catch (servicesException) {
        console.warn("Exception when creating services:", servicesException);
      }
    }
    
    // Create staff members (if applicable)
    if (businessData.hasStaff && businessData.staffMembers && businessData.staffMembers.length > 0) {
      try {
        console.log("Creating staff members...");
        const staffData = businessData.staffMembers.map(staff => ({
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
          console.warn("Error creating staff members:", staffError);
        } else {
          console.log(`Created ${createdStaff.length} staff members successfully`);
        }
      } catch (staffException) {
        console.warn("Exception when creating staff:", staffException);
      }
    }
    
    const executionTime = Date.now() - startTime;
    console.log(`Business setup completed successfully! Execution time: ${executionTime}ms`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        businessId, 
        businessSlug,
        message: "Estabelecimento criado com sucesso!",
        accessProfileCreated: accessProfileResult?.success || false,
        partialSuccess: accessProfileResult?.partialSuccess || false,
        executionTime
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error in create-business function:", error);
    
    // Try to verify if a business was created anyway
    try {
      if (req.method !== 'OPTIONS') {
        const { userId } = await req.json();
        
        if (userId) {
          const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
          const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          
          const businessVerification = await verifyBusinessCreated(supabase, userId);
          
          if (businessVerification.success) {
            // Business was created despite the error
            return new Response(
              JSON.stringify({ 
                success: true, 
                recovered: true,
                businessId: businessVerification.businessId, 
                businessSlug: businessVerification.businessSlug,
                message: "Estabelecimento criado com sucesso (recuperado após erro)!" 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200 
              }
            );
          }
        }
      }
    } catch (verifyError) {
      console.error("Error trying to verify business creation:", verifyError);
    }
    
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
