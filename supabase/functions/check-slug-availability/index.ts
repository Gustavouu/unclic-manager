
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

    // Generate a slug from business name
    const baseSlug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    
    // Check if the slug exists
    const { data, error } = await supabase
      .from('businesses')
      .select('slug')
      .eq('slug', baseSlug)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking slug availability:', error);
      throw error;
    }
    
    const isAvailable = !data;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        isAvailable,
        suggestedSlug: isAvailable ? baseSlug : `${baseSlug}-${Date.now().toString().slice(-6)}`
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
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
