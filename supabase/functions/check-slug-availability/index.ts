
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

    const { name } = await req.json();
    
    if (!name) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Name is required" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400 
        }
      );
    }

    // Generate a slug from business name
    const slug = generateSlug(name);
    let isAvailable = true;

    // Check availability in businesses table
    try {
      const { data: businessData, error } = await supabase
        .from('businesses')
        .select('slug')
        .eq('slug', slug)
        .maybeSingle();
        
      if (!error && businessData) {
        isAvailable = false;
      }
    } catch (error) {
      console.error('Error checking businesses table:', error);
    }

    // Check availability in negocios table if still available
    if (isAvailable) {
      try {
        const { data: negociosData, error } = await supabase
          .from('negocios')
          .select('slug')
          .eq('slug', slug)
          .maybeSingle();
          
        if (!error && negociosData) {
          isAvailable = false;
        }
      } catch (error) {
        console.error('Error checking negocios table:', error);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        slug,
        isAvailable
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

function generateSlug(name: string): string {
  const timestamp = Date.now().toString().slice(-6);
  // Convert to lowercase, replace spaces with hyphens, remove special characters
  const baseSlug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
    
  return `${baseSlug}-${timestamp}`;
}
