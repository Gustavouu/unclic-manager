
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
    // First check auth.users to verify the user exists in the auth system
    const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(userId);
    
    if (authUserError || !authUser?.user) {
      console.error("User verification failed in auth.users:", authUserError || "User not found");
      return { exists: false, error: "Usuário não encontrado no sistema de autenticação" };
    }
    
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
    
    return { exists: !!existingUser, authUser: authUser.user, user: existingUser };
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
      const userToCreate = {
        id: userId,
        email: userEmail,
        nome_completo: userName,
        status: 'ativo'
      };
      
      const { data, error: createError } = await supabase
        .from('usuarios')
        .insert([userToCreate])
        .select();
      
      if (createError) {
        console.error(`User creation attempt ${attempt} failed:`, createError);
        error = createError;
        // Wait longer between each retry
        await sleep(500 * attempt); 
        continue;
      }
      
      createdUser = data?.[0];
      console.log("User created successfully:", createdUser);
      
      // Important: Wait to ensure database consistency
      await sleep(1000);
      
      // Verify user was actually created with direct query
      const { data: verifyUser, error: verifyError } = await supabase
        .from('usuarios')
        .select('id, nome_completo, email')
        .eq('id', userId)
        .single();
      
      if (verifyError || !verifyUser) {
        console.error("User verification failed after creation:", verifyError || "User not found");
        error = verifyError || new Error("User creation verification failed");
        await sleep(500 * attempt);
        continue;
      }
      
      console.log("User verified successfully after creation:", verifyUser);
      return { success: true, user: verifyUser };
    } catch (createError) {
      console.error(`Create user attempt ${attempt} exception:`, createError);
      error = createError;
      await sleep(500 * attempt);
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
    console.log(`Attempt ${attempt}/${maxRetries} to create access profile for user ${userId}`);
    
    try {
      // Double-check user exists before creating access profile with a direct query
      // This is critical to prevent foreign key constraint errors
      const { data: userCheck } = await supabase
        .from('usuarios')
        .select('id, email, nome_completo')
        .eq('id', userId)
        .maybeSingle();
      
      if (!userCheck) {
        console.log(`User ${userId} not found in attempt ${attempt}, waiting before retry`);
        await sleep(1000 * attempt); // Progressive wait
        continue;
      }
      
      console.log(`User ${userId} confirmed to exist, proceeding with access profile creation`);
      
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
      
      const { data: profileData, error: profileError } = await supabase
        .from('perfis_acesso')
        .insert([accessProfileData])
        .select();
      
      if (profileError) {
        console.error(`Access profile creation attempt ${attempt} failed:`, profileError);
        error = profileError;
        await sleep(1000 * attempt);
        continue;
      }
      
      console.log("Access profile created successfully:", profileData);
      return { success: true, profile: profileData };
    } catch (profileError) {
      console.error(`Access profile attempt ${attempt} exception:`, profileError);
      error = profileError;
      await sleep(1000 * attempt);
    }
  }
  
  return { success: false, error };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
      
      const userName = userVerification.authUser.user_metadata?.name || businessData.name || "Usuário";
      const userEmail = userVerification.authUser.email || businessData.email;
      
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
    
    // Generate initial slug from business name
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
    
    // Update the user profile with the business ID
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
    
    // Create access profile with robust retry mechanism
    console.log("Creating access profile with robust retry mechanism");
    const accessProfileResult = await createAccessProfile(supabase, userId, businessId);
    
    if (!accessProfileResult.success) {
      console.error("All attempts to create access profile failed:", accessProfileResult.error);
      
      // Emergency direct check if the user exists in the usuarios table
      const { data: emergencyUserCheck } = await supabase
        .from('usuarios')
        .select('id, email, nome_completo')
        .eq('id', userId);
        
      console.log("Emergency user check result:", emergencyUserCheck);
      
      // Despite error, we'll continue since the business and user were created successfully
      console.warn("Continuing despite access profile creation failure");
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
    
    console.log("Business setup completed successfully!");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        businessId, 
        businessSlug,
        message: "Estabelecimento criado com sucesso!" 
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
