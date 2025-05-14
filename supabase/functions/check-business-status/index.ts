
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

    // Get request body with businessId
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

    console.log("Checking business status for:", businessId);
    
    // Check business in businesses table
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, status')
      .eq('id', businessId)
      .maybeSingle();
    
    if (businessError) {
      console.error("Error checking business:", businessError);
    }
    
    if (business) {
      return new Response(
        JSON.stringify({
          success: true,
          exists: true,
          status: business.status,
          tableName: 'businesses'
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        exists: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

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
