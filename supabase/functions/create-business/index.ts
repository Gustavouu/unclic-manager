
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request body
    const { businessData, userId } = await req.json();

    if (!businessData || !userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Business data and user ID are required" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400 
        }
      );
    }

    // Generate a slug from business name
    const slug = generateSlug(businessData.name);
    
    // Try to create business in businesses table first
    let businessId = null;
    let tableName = null;
    
    try {
      // Check if businesses table exists
      const { error: checkError } = await supabase
        .from('businesses')
        .select('count(*)', { count: 'exact', head: true });
      
      if (!checkError || checkError.code !== 'PGRST116') {
        // Table exists, create business
        const { data, error } = await supabase
          .from('businesses')
          .insert([{
            name: businessData.name,
            admin_email: businessData.email || 'contact@example.com',
            phone: businessData.phone,
            address: businessData.address,
            address_number: businessData.number,
            neighborhood: businessData.neighborhood,
            city: businessData.city,
            state: businessData.state,
            zip_code: businessData.cep,
            slug: slug,
            status: 'pending'
          }])
          .select('id')
          .single();
          
        if (error) throw error;
        
        businessId = data.id;
        tableName = 'businesses';
      }
    } catch (error) {
      console.error('Failed to create in businesses table:', error);
      // Try negocios table as fallback
    }
    
    // If businessId is still null, try negocios table
    if (!businessId) {
      try {
        // Check if negocios table exists
        const { error: checkError } = await supabase
          .from('negocios')
          .select('count(*)', { count: 'exact', head: true });
        
        if (!checkError || checkError.code !== 'PGRST116') {
          // Table exists, create business
          const { data, error } = await supabase
            .from('negocios')
            .insert([{
              nome: businessData.name,
              email_admin: businessData.email || 'contact@example.com',
              telefone: businessData.phone,
              endereco: businessData.address,
              numero: businessData.number,
              bairro: businessData.neighborhood,
              cidade: businessData.city,
              estado: businessData.state,
              cep: businessData.cep,
              slug: slug,
              status: 'pendente'
            }])
            .select('id')
            .single();
            
          if (error) throw error;
          
          businessId = data.id;
          tableName = 'negocios';
        }
      } catch (error) {
        console.error('Failed to create in negocios table:', error);
      }
    }
    
    if (!businessId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to create business. Database tables might not exist." 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 500 
        }
      );
    }
    
    // Create association between business and user
    try {
      if (tableName === 'businesses') {
        // Try business_users table
        const { error: checkError } = await supabase
          .from('business_users')
          .select('count(*)', { count: 'exact', head: true });
        
        if (!checkError || checkError.code !== 'PGRST116') {
          const { error } = await supabase
            .from('business_users')
            .insert([{
              business_id: businessId,
              user_id: userId,
              role: 'owner'
            }]);
            
          if (error) throw error;
        }
      } else if (tableName === 'negocios') {
        // Update user record in usuarios table
        try {
          const { error: checkError } = await supabase
            .from('usuarios')
            .select('count(*)', { count: 'exact', head: true });
          
          if (!checkError || checkError.code !== 'PGRST116') {
            const { error } = await supabase
              .from('usuarios')
              .update({ id_negocio: businessId })
              .eq('id', userId);
              
            if (error) throw error;
          }
        } catch (updateError) {
          console.error('Failed to update user:', updateError);
        }
      }
    } catch (error) {
      console.error('Failed to create business-user association:', error);
      // Continue anyway since we've created the business
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        businessId, 
        businessSlug: slug,
        tableName
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error in create-business:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500 
      }
    );
  }
});

function generateSlug(name: string): string {
  const timestamp = Date.now().toString().slice(-6);
  // Convert to lowercase, replace spaces with hyphens, remove special characters
  const baseSlug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
    
  return `${baseSlug}-${timestamp}`;
}
