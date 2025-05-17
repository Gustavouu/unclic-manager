
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
    // Create Supabase client with service role key for admin access (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    console.log("Starting create-business function execution");
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

    console.log("Received request to create business with valid user ID:", userId);

    // Verify user exists in auth system
    console.log("Verifying user exists in auth system...");
    try {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError || !userData?.user) {
        throw new Error(`User not found in auth: ${userError?.message || 'unknown error'}`);
      }
      
      console.log("Auth user verified:", userData.user.email);
    } catch (verifyError) {
      console.error("Error verifying auth user:", verifyError);
      // Continue anyway as the user might exist only in the users table
    }

    // Generate a slug from business name
    const timestamp = Date.now().toString().slice(-6);
    // Convert to lowercase, replace spaces with hyphens, remove special characters
    const baseSlug = businessData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
      
    const slug = `${baseSlug}-${timestamp}`;
    
    console.log("Creating business with data:", {
      name: businessData.name,
      email: businessData.email,
      slug,
      userId
    });
    
    let businessId: string | null = null;
    
    try {
      // Create business in businesses table with service role client (bypass RLS)
      const { data: business, error: businessError } = await supabase
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
          status: 'active' // Set to active to skip further setup
        }])
        .select('id, slug')
        .single();
        
      if (businessError) {
        console.error('Error creating business:', businessError);
        throw businessError;
      }
      
      if (!business?.id) {
        throw new Error("Business creation succeeded but no ID was returned");
      }
      
      businessId = business.id;
      console.log('Business created with ID:', businessId);
      
      // Create association between business and user in business_users table
      const { error: userError } = await supabase
        .from('business_users')
        .insert([{
          business_id: businessId,
          user_id: userId,
          role: 'owner'
        }]);
        
      if (userError) {
        console.error('Error creating business-user association:', userError);
        // Continue anyway, as we want to return the business even if association fails
      } else {
        console.log('Business-user association created successfully');
      }
      
      // Create default business settings
      const { error: settingsError } = await supabase
        .from('business_settings')
        .insert([{
          business_id: businessId,
          logo_url: businessData.logoUrl,
          banner_url: businessData.bannerUrl,
          primary_color: '#213858',
          secondary_color: '#33c3f0',
          allow_online_booking: true,
          require_advance_payment: false,
          minimum_notice_time: 30,
          maximum_days_in_advance: 30,
          notes: JSON.stringify({
            webhook_config: {},
            business_hours: {},
          })
        }]);
        
      if (settingsError) {
        console.error('Failed to create business settings:', settingsError);
      } else {
        console.log('Business settings created successfully');
      }
      
      // Call verificar_completar_onboarding to ensure onboarding is marked as complete
      if (businessId) {
        try {
          const { data: verificationResult, error: verificationError } = await supabase
            .rpc('verificar_completar_onboarding', {
              business_id_param: businessId
            });
          
          if (verificationError) {
            console.error('Error verifying onboarding:', verificationError);
          } else {
            console.log('Onboarding verification result:', verificationResult);
          }
        } catch (onboardingError) {
          console.error('Failed to verify onboarding status:', onboardingError);
        }
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
      
    } catch (dbError: any) {
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

  } catch (error: any) {
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
