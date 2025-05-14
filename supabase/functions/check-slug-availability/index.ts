
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

    // Get business name from request body
    const { name } = await req.json();

    if (!name) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Business name is required" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400 
        }
      );
    }
    
    // Generate a base slug from the business name
    const baseSlug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    
    // Check if any business with a similar slug exists
    const { data: existingBusinesses, error } = await supabase
      .from('businesses')
      .select('slug')
      .like('slug', `${baseSlug}%`);
    
    if (error) {
      console.error("Error checking slug availability:", error);
      throw error;
    }
    
    const isAvailable = !existingBusinesses || existingBusinesses.length === 0;
    
    return new Response(
      JSON.stringify({ 
        success: true,
        isAvailable,
        suggestedSlug: isAvailable ? baseSlug : `${baseSlug}-${Date.now().toString().slice(-6)}`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in check-slug-availability:", error);
    
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
