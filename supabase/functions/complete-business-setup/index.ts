
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
    const { userId, businessId, services, staffMembers, hasStaff, businessHours } = await req.json();

    if (!businessId || !userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Business ID and user ID are required"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        }
      );
    }

    console.log("Processing business setup:", businessId);
    
    // Update business status to active
    const { error: updateError } = await supabase
      .from('businesses')
      .update({
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId);

    if (updateError) {
      console.error("Error updating business status:", updateError);
      throw updateError;
    }
    
    // If there are services, insert them
    if (services && services.length > 0) {
      console.log("Adding services:", services.length);
      
      const servicesData = services.map(service => ({
        name: service.name,
        duration: service.duration,
        price: service.price,
        description: service.description || '',
        business_id: businessId
      }));
      
      const { error: servicesError } = await supabase
        .from('services')
        .insert(servicesData);
        
      if (servicesError) {
        console.error("Error adding services:", servicesError);
      }
    }
    
    // If there are staff members, insert them
    if (hasStaff && staffMembers && staffMembers.length > 0) {
      console.log("Adding staff members:", staffMembers.length);
      
      const professionalsData = staffMembers.map(staff => ({
        name: staff.name,
        role: staff.role,
        email: staff.email || null,
        phone: staff.phone || null,
        specialties: staff.specialties || [],
        business_id: businessId
      }));
      
      const { error: staffError } = await supabase
        .from('professionals')
        .insert(professionalsData);
        
      if (staffError) {
        console.error("Error adding staff members:", staffError);
      }
    }
    
    // Ensure the user has proper permissions
    try {
      // Check if the user already has permissions
      const { data: existingPermissions, error: permissionsCheckError } = await supabase
        .from('permissions')
        .select('id')
        .eq('user_id', userId)
        .eq('business_id', businessId);
        
      if (permissionsCheckError) {
        throw permissionsCheckError;
      }
      
      // If no permissions exist, create them
      if (!existingPermissions || existingPermissions.length === 0) {
        const { error: permissionsError } = await supabase
          .from('permissions')
          .insert([
            { user_id: userId, business_id: businessId, resource: 'appointments', action: 'manage' },
            { user_id: userId, business_id: businessId, resource: 'clients', action: 'manage' },
            { user_id: userId, business_id: businessId, resource: 'professionals', action: 'manage' },
            { user_id: userId, business_id: businessId, resource: 'services', action: 'manage' },
            { user_id: userId, business_id: businessId, resource: 'settings', action: 'manage' }
          ]);
          
        if (permissionsError) {
          console.error("Error setting user permissions:", permissionsError);
        }
      }
    } catch (permissionsError) {
      console.error("Error handling permissions:", permissionsError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Business setup completed successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in complete-business-setup:", error);
    
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
