
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
    
    // Log environment information for debugging
    console.log("Function initialization:");
    console.log(`SUPABASE_URL: ${supabaseUrl ? "set" : "missing"}`);
    console.log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseKey ? "set" : "missing"}`);
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

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
    const slug = generateSlug(businessData.name);
    
    console.log("Creating business with data:", {
      name: businessData.name,
      email: businessData.email,
      slug: slug,
      userId: userId
    });
    
    // Check if the businesses table exists
    try {
      const { data: tableCheck, error: tableError } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);
      
      if (tableError) {
        console.error('Error checking businesses table:', tableError);
        throw new Error(`Table check error: ${tableError.message}`);
      }
      
      console.log('Businesses table check:', tableCheck ? 'Table exists' : 'Table not found');
    } catch (tableCheckError) {
      console.error('Failed to check businesses table:', tableCheckError);
      throw new Error(`Table verification failed: ${tableCheckError.message}`);
    }
    
    // Create business in businesses table
    let businessResult;
    try {
      businessResult = await supabase
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
        
      if (businessResult.error) {
        console.error('Error creating business:', businessResult.error);
        throw new Error(`Business creation error: ${businessResult.error.message}`);
      }
    } catch (insertError) {
      console.error('Exception during business creation:', insertError);
      throw new Error(`Business insertion failed: ${insertError.message}`);
    }
    
    if (!businessResult?.data?.id) {
      throw new Error("Business creation succeeded but no ID was returned");
    }
    
    const businessId = businessResult.data.id;
    console.log('Business created with ID:', businessId);
    
    // Create association between business and user
    try {
      const { error } = await supabase
        .from('business_users')
        .insert([{
          business_id: businessId,
          user_id: userId,
          role: 'owner'
        }]);
        
      if (error) {
        console.error('Error creating business-user association:', error);
        throw error;
      }
      console.log('Business-user association created successfully');
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
      } else {
        console.log('Business settings created successfully');
      }
    } catch (error) {
      console.error('Exception during business settings creation:', error);
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
