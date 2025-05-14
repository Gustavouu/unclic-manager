
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
    const { businessData, userId } = await req.json();

    if (!businessData || !userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Business data and user ID are required" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400 
        }
      );
    }

    // Generate a slug from business name
    const slug = generateSlug(businessData.name);
    
    console.log("Creating business with data:", {
      name: businessData.name,
      email: businessData.email,
      slug: slug,
      userId: userId
    });
    
    // Create business in businesses table
    const { data, error } = await supabase
      .from('businesses')
      .insert([{
        name: businessData.name,
        admin_email: businessData.email || 'contact@example.com',
        phone: businessData.phone,
        address: businessData.address,
        address_number: businessData.addressNumber || businessData.number,
        address_complement: businessData.addressComplement,
        neighborhood: businessData.neighborhood,
        city: businessData.city,
        state: businessData.state,
        zip_code: businessData.zipCode || businessData.cep,
        slug: slug,
        status: 'pending'
      }])
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating business:', error);
      throw error;
    }
    
    const businessId = data.id;
    
    // Create association between business and user
    try {
      const { error } = await supabase
        .from('business_users')
        .insert([{
          business_id: businessId,
          user_id: userId,
          role: 'owner'
        }]);
        
      if (error) throw error;
    } catch (error) {
      console.error('Failed to create business-user association:', error);
      // Continue anyway since we've created the business
    }
    
    // Create default business settings
    try {
      const { error } = await supabase
        .from('business_settings')
        .insert([{
          business_id: businessId,
          logo_url: businessData.logoUrl,
          banner_url: businessData.bannerUrl
        }]);
        
      if (error) {
        console.error('Failed to create business settings:', error);
      }
    } catch (error) {
      console.error('Failed to create business settings:', error);
      // Continue anyway since we've created the business
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        businessId,
        businessSlug: slug
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error in create-business:", error);
    
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
