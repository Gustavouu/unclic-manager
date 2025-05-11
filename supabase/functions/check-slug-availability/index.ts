
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate a slug from a string (name)
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Function to check if a slug is available and/or generate alternatives
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { name } = await req.json();
    
    if (!name || typeof name !== 'string') {
      throw new Error("Nome do negócio é obrigatório");
    }
    
    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Generate slug from the business name
    const baseSlug = generateSlug(name);
    
    // Check if the slug already exists
    const { data: existingBusiness, error: slugCheckError } = await supabase
      .from('negocios')
      .select('id, nome')
      .eq('slug', baseSlug)
      .maybeSingle();
    
    // If slug is available
    if (!existingBusiness) {
      return new Response(
        JSON.stringify({
          isAvailable: true,
          slug: baseSlug,
          suggestions: []
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
    
    // If slug is not available, generate and check alternatives
    const suggestions = [];
    for (let i = 1; i <= 3; i++) {
      const altSlug = `${baseSlug}-${i}`;
      const { data: exists } = await supabase
        .from('negocios')
        .select('id')
        .eq('slug', altSlug)
        .maybeSingle();
        
      if (!exists) {
        suggestions.push({ 
          name: `${name} ${i}`,
          slug: altSlug
        });
      }
    }
    
    return new Response(
      JSON.stringify({
        isAvailable: false,
        slug: baseSlug,
        existingBusiness: {
          id: existingBusiness.id,
          name: existingBusiness.nome
        },
        suggestions: suggestions
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error in slug availability check:", error);
    
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
