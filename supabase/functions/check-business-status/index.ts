
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { businessId } = await req.json();

    if (!businessId) {
      throw new Error("ID do negócio ausente");
    }

    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Configurações do Supabase não encontradas");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Results container
    const results = {
      businesses: {
        exists: false,
        status: null,
        data: null,
        error: null
      },
      negocios: {
        exists: false,
        status: null,
        data: null,
        error: null
      },
      business_users: {
        exists: false,
        count: 0,
        error: null
      },
      perfis_acesso: {
        exists: false,
        count: 0,
        error: null
      }
    };
    
    // Check businesses table
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", businessId)
        .maybeSingle();
        
      results.businesses.error = error?.message || null;
      
      if (!error && data) {
        results.businesses.exists = true;
        results.businesses.status = data.status;
        results.businesses.data = data;
      }
    } catch (error) {
      results.businesses.error = error.message;
    }
    
    // Check negocios table
    try {
      const { data, error } = await supabase
        .from("negocios")
        .select("*")
        .eq("id", businessId)
        .maybeSingle();
        
      results.negocios.error = error?.message || null;
      
      if (!error && data) {
        results.negocios.exists = true;
        results.negocios.status = data.status;
        results.negocios.data = data;
      }
    } catch (error) {
      results.negocios.error = error.message;
    }
    
    // Check business_users table
    try {
      const { data, count, error } = await supabase
        .from("business_users")
        .select("*", { count: 'exact' })
        .eq("business_id", businessId);
        
      results.business_users.error = error?.message || null;
      
      if (!error) {
        results.business_users.exists = count > 0;
        results.business_users.count = count;
      }
    } catch (error) {
      results.business_users.error = error.message;
    }
    
    // Check perfis_acesso table
    try {
      const { data, count, error } = await supabase
        .from("perfis_acesso")
        .select("*", { count: 'exact' })
        .eq("id_negocio", businessId);
        
      results.perfis_acesso.error = error?.message || null;
      
      if (!error) {
        results.perfis_acesso.exists = count > 0;
        results.perfis_acesso.count = count;
      }
    } catch (error) {
      results.perfis_acesso.error = error.message;
    }
    
    // Determine if business exists in any table
    const businessExists = results.businesses.exists || results.negocios.exists;
    const businessStatus = results.businesses.status || results.negocios.status;
    
    return new Response(
      JSON.stringify({
        success: true,
        exists: businessExists,
        status: businessStatus,
        details: results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error checking business status:", error);
    
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
