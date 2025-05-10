
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers to allow requests from the browser
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
    const { name } = await req.json();
    
    if (!name || typeof name !== 'string') {
      throw new Error("O nome do estabelecimento é obrigatório");
    }
    
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Generate slug from the name
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    
    // Check if slug already exists
    const { data, error } = await supabase
      .from('negocios')
      .select('id, nome')
      .eq('slug', slug)
      .single();
    
    const isAvailable = error && error.code === 'PGRST116'; // PGRST116 means no rows returned
    
    // Generate alternative suggestions
    let suggestions = [];
    if (!isAvailable) {
      // Generate three alternative slugs with numbers
      for (let i = 1; i <= 3; i++) {
        suggestions.push({
          name: `${name} ${i}`,
          slug: `${slug}-${i}`
        });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        slug,
        isAvailable,
        existingBusiness: isAvailable ? null : { id: data?.id, name: data?.nome },
        suggestions
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
