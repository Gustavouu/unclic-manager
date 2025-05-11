
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
    console.log("User ID type:", typeof userId, "User ID value:", userId);
    
    // Step 1: Check if the user exists in the usuarios table with more detailed debugging
    console.log("Checking if user exists in usuarios table with ID:", userId);
    const { data: existingUser, error: userCheckError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    console.log("User check result:", { existingUser, userCheckError });

    // Step 2: If user doesn't exist in the usuarios table, create them first with enhanced error handling
    if (!existingUser) {
      console.log("User not found in usuarios table. Creating new user record.");
      
      // Step 2.1: Fetch user data from auth to get email and name
      console.log("Fetching user data from auth.users with ID:", userId);
      const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(userId);
      
      console.log("Auth user fetch result:", { 
        authUserExists: !!authUser?.user, 
        authUserEmail: authUser?.user?.email,
        authUserName: authUser?.user?.user_metadata?.name,
        authUserError 
      });
      
      if (authUserError) {
        console.error("Error fetching auth user:", authUserError);
        throw new Error(`Não foi possível obter dados do usuário: ${authUserError.message}`);
      }
      
      if (!authUser?.user) {
        console.error("Auth user not found with ID:", userId);
        throw new Error(`Usuário não encontrado na autenticação com ID: ${userId}`);
      }
      
      // Step 2.2: Create user record in usuarios table with detailed logging
      const userToCreate = {
        id: userId,
        email: authUser.user.email || businessData.email,
        nome_completo: authUser.user.user_metadata?.name || businessData.name || "Usuário",
        status: 'ativo'
      };
      
      console.log("Creating user in usuarios table with data:", userToCreate);
      
      const { data: createdUser, error: createUserError } = await supabase
        .from('usuarios')
        .insert([userToCreate])
        .select();
      
      console.log("Create user result:", { createdUser, createUserError });
      
      if (createUserError) {
        console.error("Error creating user record:", createUserError);
        throw new Error(`Erro ao criar registro de usuário: ${createUserError.message}`);
      }
      
      // Step 2.3: Verify the user was actually created with a separate query
      const { data: verifyUser, error: verifyError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('id', userId)
        .single();
        
      console.log("Verification of user creation:", { verifyUser, verifyError });
      
      if (verifyError) {
        console.error("Failed to verify user creation:", verifyError);
        throw new Error(`O usuário foi criado mas não pôde ser verificado: ${verifyError.message}`);
      }
      
      console.log("User record created and verified successfully for ID:", userId);
    } else {
      console.log("User already exists in usuarios table:", existingUser);
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
        .single();
      
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
      
      throw new Error(businessError.message);
    }
    
    if (!businessRecord) {
      throw new Error("Não foi possível obter o ID do estabelecimento criado");
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
      throw new Error(`Erro ao atualizar perfil do usuário: ${userError.message}`);
    }
    
    // 3. Create access profile (admin) with detailed error handling
    console.log("Creating access profile for user:", userId, "and business:", businessId);
    
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
    
    console.log("Access profile data:", accessProfileData);
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('perfis_acesso')
        .insert([accessProfileData])
        .select();
      
      console.log("Access profile creation result:", { profileData, profileError });
      
      if (profileError) {
        console.error("Error creating access profile:", profileError);
        
        // Check specifically for FK constraint violation
        if (profileError.code === '23503' && profileError.message.includes('perfis_acesso_id_usuario_fkey')) {
          throw new Error(`Erro de referência: O usuário (${userId}) não existe na tabela de usuários. Por favor, contate o suporte.`);
        }
        
        throw new Error(`Erro ao criar perfil de acesso: ${profileError.message}`);
      }
    } catch (profileCreationError: any) {
      console.error("Exception during profile creation:", profileCreationError);
      throw new Error(`Exceção ao criar perfil de acesso: ${profileCreationError.message}`);
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
