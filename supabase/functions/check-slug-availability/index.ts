
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers to allow requests from the browser
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to generate a unique slug based on a name
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { name } = await req.json();
    
    // Validate name
    if (!name || typeof name !== 'string') {
      throw new Error("Nome inválido ou ausente");
    }
    
    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Generate slug from name
    const slug = generateSlug(name);
    
    // Check if slug already exists
    const { data: existingBusiness, error: slugCheckError } = await supabase
      .from('negocios')
      .select('id, nome')
      .eq('slug', slug)
      .maybeSingle();
    
    if (slugCheckError && slugCheckError.code !== 'PGRST116') { // PGRST116 is "no rows returned", which is good for us
      console.error("Error checking slug:", slugCheckError);
      throw new Error(`Erro ao verificar disponibilidade do nome: ${slugCheckError.message}`);
    }
    
    // Generate slug suggestions if the slug is already taken
    let suggestions = [];
    if (existingBusiness) {
      suggestions = [
        { name: `${name} ${new Date().getFullYear()}`, slug: `${slug}-${new Date().getFullYear()}` },
        { name: `${name} Barbershop`, slug: `${slug}-barbershop` },
        { name: `${name} Studio`, slug: `${slug}-studio` },
        { name: `${name} Pro`, slug: `${slug}-pro` },
        { name: `${name} Elite`, slug: `${slug}-elite` }
      ];
    }
    
    return new Response(
      JSON.stringify({ 
        slug, 
        isAvailable: !existingBusiness,
        existingBusiness: existingBusiness ? { 
          id: existingBusiness.id, 
          name: existingBusiness.nome 
        } : null,
        suggestions
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error in check-slug-availability function:", error);
    
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
