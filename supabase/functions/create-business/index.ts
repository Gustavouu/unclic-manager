
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
    // Create Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    console.log("Function initialization:");
    console.log(`SUPABASE_URL: ${supabaseUrl ? "set" : "missing"}`);
    console.log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? "set" : "missing"}`);
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body
    const requestBody = await req.json();
    const { businessData, userId } = requestBody;

    console.log("Request received:", {
      hasBusinessData: !!businessData,
      hasUserId: !!userId,
      businessDataKeys: businessData ? Object.keys(businessData) : [],
      userIdType: typeof userId
    });

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
    const timestamp = Date.now().toString().slice(-6);
    // Convert to lowercase, replace spaces with hyphens, remove special characters
    const baseSlug = businessData.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
      
    const slug = `${baseSlug}-${timestamp}`;
    
    console.log("Creating business with data:", {
      name: businessData.name,
      email: businessData.email,
      slug,
      userId
    });
    
    try {
      // First check if the businesses table exists by running a simple query
      const { data: tableExists, error: tableCheckError } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);
        
      if (tableCheckError && tableCheckError.code !== 'PGRST116') {
        console.error('Error checking businesses table:', tableCheckError);
        throw new Error(`Table check error: ${tableCheckError.message}`);
      }
      
      console.log("Businesses table check result:", tableExists !== null);
      
      // Create business in businesses table
      const { data: businessData, error: businessError } = await supabase
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
          status: 'active' // Changed from 'pending' to 'active' to skip further setup
        }])
        .select('id, slug')
        .single();
        
      if (businessError) {
        console.error('Error creating business:', businessError);
        throw businessError;
      }
      
      if (!businessData?.id) {
        throw new Error("Business creation succeeded but no ID was returned");
      }
      
      const businessId = businessData.id;
      console.log('Business created with ID:', businessId);
      
      // Create association between business and user
      const { error: userError } = await supabase
        .from('business_users')
        .insert([{
          business_id: businessId,
          user_id: userId,
          role: 'owner'
        }]);
        
      if (userError) {
        console.error('Error creating business-user association:', userError);
        // Don't throw here, we'll still return success if the business was created
      } else {
        console.log('Business-user association created successfully');
      }
      
      // Create default business settings
      const { error: settingsError } = await supabase
        .from('business_settings')
        .insert([{
          business_id: businessId,
          logo_url: businessData.logoUrl,
          banner_url: businessData.bannerUrl
        }]);
        
      if (settingsError) {
        console.error('Failed to create business settings:', settingsError);
      } else {
        console.log('Business settings created successfully');
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
      
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Database error: ${dbError.message || dbError}` 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 500 
        }
      );
    }

  } catch (error) {
    console.error("Unhandled error in create-business:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unexpected error occurred" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500 
      }
    );
  }
});
