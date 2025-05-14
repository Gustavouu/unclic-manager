
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
    
    // Validar dados do negócio
    if (!businessData || !businessData.name) {
      throw new Error("Dados do negócio inválidos ou ausentes");
    }
    
    // Log complete received data for debugging
    console.log("Received business data:", businessData);
    
    // Validate userId format and existence
    if (!userId || typeof userId !== 'string' || !userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.error("Invalid user ID format:", userId);
      throw new Error("ID de usuário inválido ou ausente");
    }
    
    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Configurações do Supabase não encontradas");
    }
    
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
    
    // Check which tables exist in the database
    console.log("Verifying which tables exist in the database");
    let tablesInfo = {
      businesses: false,
      negocios: false,
      business_users: false
    };
    
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
    
    // Generate and verify unique slug for the business
    let businessSlug = generateUniqueSlug(businessData.name);
    let attempt = 0;
    let isSlugUnique = false;
    
    // Try to find a unique slug (max 5 attempts)
    while (!isSlugUnique && attempt < 5) {
      let slugExists = false;
      
      // Check in businesses table if it exists
      if (tablesInfo.businesses) {
        try {
          console.log(`Checking if slug '${businessSlug}' exists in businesses table`);
          const { data, error } = await supabase
            .from('businesses')
            .select('id')
            .eq('slug', businessSlug)
            .maybeSingle();
          
          if (error) {
            console.error("Error checking businesses table:", error);
          } else if (data) {
            console.log("Slug exists in businesses table");
            slugExists = true;
          }
        } catch (error) {
          console.error("Failed to check businesses table:", error);
        }
      }
      
      // Check in negocios table if it exists
      if (tablesInfo.negocios && !slugExists) {
        try {
          console.log(`Checking if slug '${businessSlug}' exists in negocios table`);
          const { data, error } = await supabase
            .from('negocios')
            .select('id')
            .eq('slug', businessSlug)
            .maybeSingle();
          
          if (error) {
            console.error("Error checking negocios table:", error);
          } else if (data) {
            console.log("Slug exists in negocios table");
            slugExists = true;
          }
        } catch (error) {
          console.error("Failed to check negocios table:", error);
        }
      }
      
      if (slugExists) {
        // Slug exists, try a new one with a numeric suffix
        attempt++;
        businessSlug = generateUniqueSlug(businessData.name, attempt);
        console.log(`Slug exists, trying new slug: ${businessSlug}`);
      } else {
        // Slug is unique
        isSlugUnique = true;
        console.log(`Slug '${businessSlug}' is unique`);
      }
    }
    
    if (!isSlugUnique) {
      console.error("Could not generate a unique slug after 5 attempts");
      throw new Error("Não foi possível gerar um slug único para o nome do estabelecimento. Por favor, tente um nome diferente.");
    }
    
    // Create the business record with the unique slug
    console.log(`Creating business with slug '${businessSlug}'`);
    
    let businessId: string | null = null;
    
    // Try to create in businesses table if it exists
    if (tablesInfo.businesses) {
      try {
        console.log("Creating business in businesses table");
        const { data, error } = await supabase
          .from('businesses')
          .insert([
            {
              name: businessData.name,
              admin_email: businessData.email,
              phone: businessData.phone,
              address: businessData.address,
              address_number: businessData.number || businessData.addressNumber,
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
        
        if (error) {
          console.error("Error creating business in businesses table:", error);
        } else if (data) {
          businessId = data.id;
          console.log("Business created successfully in businesses table. ID:", businessId);
        }
      } catch (error) {
        console.error("Failed to create in businesses table:", error);
      }
    }
    
    // Try to create in negocios table if businesses failed or doesn't exist
    if (!businessId && tablesInfo.negocios) {
      try {
        console.log("Creating business in negocios table");
        const { data, error } = await supabase
          .from('negocios')
          .insert([
            {
              nome: businessData.name,
              email_admin: businessData.email,
              telefone: businessData.phone,
              endereco: businessData.address,
              numero: businessData.number || businessData.addressNumber,
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
        
        if (error) {
          console.error("Error creating business in negocios table:", error);
        } else if (data) {
          businessId = data.id;
          console.log("Business created successfully in negocios table. ID:", businessId);
        }
      } catch (error) {
        console.error("Failed to create in negocios table:", error);
      }
    }
    
    if (!businessId) {
      console.error("Failed to create business in any table");
      throw new Error("Falha ao criar o estabelecimento: não foi possível criar registro");
    }
    
    // Create association between user and business
    if (tablesInfo.business_users) {
      try {
        console.log("Creating business_users association");
        const { error } = await supabase
          .from('business_users')
          .insert([
            {
              user_id: userId,
              business_id: businessId,
              role: 'owner'
            }
          ]);
        
        if (error) {
          console.error("Error creating business_users association:", error);
        } else {
          console.log("business_users association created successfully");
        }
      } catch (error) {
        console.error("Failed to create business_users association:", error);
      }
    }
    
    // Update user in usuarios table if it exists (legacy)
    try {
      console.log("Updating user in usuarios table");
      const { error } = await supabase
        .from('usuarios')
        .update({ id_negocio: businessId })
        .eq('id', userId);
      
      if (error && error.code !== '42P01') {
        console.error("Error updating user in usuarios table:", error);
      } else if (!error) {
        console.log("User updated successfully in usuarios table");
      }
    } catch (error) {
      console.error("Failed to update user in usuarios table:", error);
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
        error: error.message || "Erro desconhecido na criação do negócio"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
