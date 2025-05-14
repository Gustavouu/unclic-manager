
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
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get business ID from request body
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
    
    console.log("Checking business status for ID:", businessId);
    
    // Check if business exists in businesses table
    const { data: business, error } = await supabase
      .from('businesses')
      .select('id, status')
      .eq('id', businessId)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking business status:", error);
      throw error;
    }
    
    if (business) {
      console.log("Business found:", business);
      return new Response(
        JSON.stringify({ 
          success: true,
          exists: true,
          status: business.status
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      console.log("Business not found");
      return new Response(
        JSON.stringify({ 
          success: true,
          exists: false
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
