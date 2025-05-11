
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
    
    // STEP 1: Verify if the user exists in auth.users (important validation)
    console.log("Verifying user exists in auth system...");
    try {
      const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(userId);
      
      if (authUserError || !authUser?.user) {
        console.error("User verification failed in auth.users:", authUserError || "User not found");
        throw new Error(`Usuário não encontrado no sistema de autenticação. Por favor, faça login novamente.`);
      }
      
      console.log("Auth user verified successfully:", {
        id: authUser.user.id,
        email: authUser.user.email
      });
      
      if (authUser.user.id !== userId) {
        console.error("User ID mismatch between request and auth system:", {
          requestId: userId,
          authId: authUser.user.id
        });
        throw new Error("ID de usuário não corresponde ao usuário autenticado");
      }
    } catch (authVerificationError) {
      console.error("Error during auth user verification:", authVerificationError);
      throw new Error(`Erro ao verificar usuário: ${authVerificationError.message}`);
    }
    
    // STEP 2: Check if user exists in usuarios table with detailed error handling
    console.log("Checking if user exists in usuarios table with ID:", userId);
    let userExists = false;
    
    try {
      const { data: existingUser, error: userCheckError } = await supabase
        .from('usuarios')
        .select('id, nome_completo, email')
        .eq('id', userId)
        .maybeSingle();
      
      if (userCheckError && userCheckError.code !== 'PGRST116') { // Not found is expected
        console.error("Database error checking user existence:", userCheckError);
        throw new Error(`Erro ao verificar existência do usuário: ${userCheckError.message}`);
      }
      
      userExists = !!existingUser;
      console.log("User existence check result:", { userExists, existingUser });
    } catch (userCheckException) {
      console.error("Exception checking user existence:", userCheckException);
      throw new Error(`Exceção ao verificar existência do usuário: ${userCheckException.message}`);
    }
    
    // STEP 3: If user doesn't exist, create them with proper error handling and retries
    if (!userExists) {
      console.log("User not found in usuarios table. Creating new user record.");
      
      // Fetch user data from auth to get email and name
      console.log("Fetching user data from auth.users with ID:", userId);
      const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(userId);
      
      if (authUserError || !authUser?.user) {
        console.error("Error fetching auth user:", authUserError || "User not found");
        throw new Error(`Não foi possível obter dados do usuário autenticado`);
      }
      
      const userName = authUser.user.user_metadata?.name || businessData.name || "Usuário";
      const userEmail = authUser.user.email || businessData.email;
      
      if (!userEmail) {
        console.error("No email available for user");
        throw new Error("Email do usuário não encontrado");
      }
      
      const userToCreate = {
        id: userId,
        email: userEmail,
        nome_completo: userName,
        status: 'ativo'
      };
      
      console.log("Creating user in usuarios table with data:", JSON.stringify(userToCreate));
      
      // Create user with retry mechanism for better reliability
      let userCreated = false;
      let attempts = 0;
      let createdUser = null;
      
      while (!userCreated && attempts < 3) {
        attempts++;
        console.log(`Attempt ${attempts} to create user`);
        
        try {
          const { data, error } = await supabase
            .from('usuarios')
            .insert([userToCreate])
            .select();
          
          if (error) {
            console.error(`Attempt ${attempts} failed:`, error);
            if (attempts < 3) {
              await sleep(500); // Wait before retrying
              continue;
            }
            throw error;
          }
          
          createdUser = data?.[0];
          userCreated = true;
          console.log("User created successfully:", createdUser);
        } catch (createError) {
          console.error(`Create user attempt ${attempts} exception:`, createError);
          if (attempts >= 3) {
            throw new Error(`Falha ao criar registro de usuário após ${attempts} tentativas: ${createError.message}`);
          }
          await sleep(500); // Wait before retrying
        }
      }
      
      // Double-check user was actually created
      console.log("Verifying user creation with direct query...");
      try {
        const { data: verifyUser, error: verifyError } = await supabase
          .from('usuarios')
          .select('id, nome_completo, email')
          .eq('id', userId)
          .single();
        
        if (verifyError || !verifyUser) {
          console.error("User verification failed after creation:", verifyError || "User not found");
          throw new Error("Usuário não foi criado corretamente no banco de dados");
        }
        
        console.log("User verified successfully after creation:", verifyUser);
      } catch (verifyException) {
        console.error("Exception during user verification:", verifyException);
        throw new Error(`Falha ao verificar criação do usuário: ${verifyException.message}`);
      }
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
    
    // 1. Create the business record with the unique slug
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
    
    // 2. Update the user profile with the business ID
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
    
    // 3. Verify user record was updated correctly
    console.log("Verifying user-business association...");
    const { data: verifiedUser, error: verifyUserError } = await supabase
      .from('usuarios')
      .select('id, id_negocio')
      .eq('id', userId)
      .single();
      
    if (verifyUserError || !verifiedUser || verifiedUser.id_negocio !== businessId) {
      console.error("User-business association verification failed:", 
        verifyUserError || 
        `Expected business ID ${businessId}, but found ${verifiedUser?.id_negocio}`);
      throw new Error("Falha na verificação da associação do usuário ao negócio");
    }
    
    console.log("User-business association verified:", verifiedUser);
    
    // 4. Create access profile with additional validation and more explicit error handling
    try {
      console.log("Creating access profile for user:", userId, "and business:", businessId);
      
      // Double-check user exists before creating access profile
      const { data: userCheck, error: userCheckError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('id', userId)
        .single();
        
      if (userCheckError || !userCheck) {
        console.error("Error: User does not exist before creating access profile:", userCheckError || "User not found");
        throw new Error(`Usuário não encontrado para criar perfil de acesso. Erro: ${userCheckError?.message || "Registro não existe"}`);
      }
      
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
      
      console.log("Access profile data:", JSON.stringify(accessProfileData));
      
      const { data: profileData, error: profileError } = await supabase
        .from('perfis_acesso')
        .insert([accessProfileData])
        .select();
      
      if (profileError) {
        console.error("Error creating access profile:", profileError);
        
        // Check specifically for FK constraint violation
        if (profileError.code === '23503' && profileError.message.includes('perfis_acesso_id_usuario_fkey')) {
          console.error("Critical error: FK constraint violation despite previous checks");
          console.error("Detailed error info:", profileError);
          
          // Emergency direct check of usuarios table
          const { data: emergencyUserCheck } = await supabase
            .from('usuarios')
            .select('id, email, nome_completo')
            .eq('id', userId);
            
          console.error("Emergency user check result:", emergencyUserCheck);
          
          throw new Error(`Erro crítico: O usuário (${userId}) existe no sistema de autenticação mas não foi encontrado na tabela de usuários mesmo após tentativa de criação. Tente novamente ou entre em contato com o suporte.`);
        }
        
        throw new Error(`Erro ao criar perfil de acesso: ${profileError.message}`);
      }
      
      console.log("Access profile created successfully:", profileData);
    } catch (profileCreationError) {
      console.error("Exception during profile creation:", profileCreationError);
      throw new Error(`Exceção ao criar perfil de acesso: ${profileCreationError.message}`);
    }
    
    // 5. Create business settings
    console.log("Creating business settings...");
    try {
      const { error: configError } = await supabase
        .from('configuracoes_negocio')
        .insert([{ 
          id_negocio: businessId
        }]);
        
      if (configError) {
        console.error("Error creating business settings:", configError);
        // Non-critical, continue despite error
        console.warn("Continuing despite business settings error");
      } else {
        console.log("Business settings created successfully");
      }
    } catch (configErr) {
      console.warn("Warning when creating business settings:", configErr);
      // Non-critical, continue despite error
    }
    
    // 6. Create services
    if (businessData.services && businessData.services.length > 0) {
      console.log("Creating services...");
      try {
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
          console.error("Error creating services:", servicesError);
          // Non-critical, continue despite error
          console.warn("Continuing despite services error");
        } else {
          console.log(`Created ${createdServices.length} services successfully`);
        }
      } catch (servicesException) {
        console.warn("Exception when creating services:", servicesException);
        // Non-critical, continue despite error
      }
    }
    
    // 7. Create staff members (if applicable)
    if (businessData.hasStaff && businessData.staffMembers && businessData.staffMembers.length > 0) {
      console.log("Creating staff members...");
      try {
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
          console.error("Error creating staff members:", staffError);
          // Non-critical, continue despite error
          console.warn("Continuing despite staff error");
        } else {
          console.log(`Created ${createdStaff.length} staff members successfully`);
        }
      } catch (staffException) {
        console.warn("Exception when creating staff:", staffException);
        // Non-critical, continue despite error
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
