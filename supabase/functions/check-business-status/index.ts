
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

    const { businessId } = await req.json();

    if (!businessId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Business ID is required" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400 
        }
      );
    }

    let businessData = null;
    let tableName = null;

    // First try businesses table
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, status, name, admin_email')
        .eq('id', businessId)
        .maybeSingle();
        
      if (error && error.code !== "PGRST116") {
        console.error('Error checking businesses table:', error);
        // Continue to try next table
      } else if (data) {
        businessData = data;
        tableName = 'businesses';
      }
    } catch (error) {
      console.error('Failed to check businesses table:', error);
      // Continue to try next table
    }

    // Try negocios table if not found
    if (!businessData) {
      try {
        const { data, error } = await supabase
          .from('negocios')
          .select('id, status, nome as name, email_admin as admin_email')
          .eq('id', businessId)
          .maybeSingle();
          
        if (error && error.code !== "PGRST116") {
          console.error('Error checking negocios table:', error);
        } else if (data) {
          businessData = data;
          tableName = 'negocios';
        }
      } catch (error) {
        console.error('Failed to check negocios table:', error);
      }
    }

    if (businessData) {
      return new Response(
        JSON.stringify({ 
          success: true,
          exists: true,
          tableName,
          status: businessData.status,
          businessId: businessData.id,
          name: businessData.name,
          adminEmail: businessData.admin_email,
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: true,
          exists: false,
          message: "Business not found in any table" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error) {
    console.error("Error in check-business-status:", error);
    
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
