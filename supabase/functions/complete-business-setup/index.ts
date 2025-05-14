
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
    const { userId, businessId, services = [], staffMembers = [], hasStaff = false, businessHours = {} } = await req.json();

    if (!userId || !businessId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "User ID and Business ID are required" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400 
        }
      );
    }

    console.log(`Completing business setup for business ID: ${businessId}`);
    
    // Update business status to active
    const { error: updateError } = await supabase
      .from('businesses')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId);
      
    if (updateError) {
      console.error('Failed to update business status:', updateError);
      throw updateError;
    }

    // Create service categories if needed
    let defaultCategoryId = null;
    const { data: categoryData, error: categoryError } = await supabase
      .from('service_categories')
      .insert([{
        business_id: businessId,
        name: 'General Services',
        display_order: 0
      }])
      .select('id')
      .single();
      
    if (!categoryError && categoryData) {
      defaultCategoryId = categoryData.id;
    } else {
      console.warn('Could not create default service category:', categoryError);
    }

    // Add services
    if (services && services.length > 0) {
      console.log(`Adding ${services.length} services`);
      
      const servicesData = services.map(service => ({
        business_id: businessId,
        name: service.name,
        price: service.price,
        duration: service.duration,
        description: service.description || '',
        category_id: defaultCategoryId,
        is_active: true
      }));
      
      const { error: servicesError } = await supabase
        .from('services')
        .insert(servicesData);
        
      if (servicesError) {
        console.error('Failed to add services:', servicesError);
      }
    }
    
    // Add staff members
    if (hasStaff && staffMembers && staffMembers.length > 0) {
      console.log(`Adding ${staffMembers.length} staff members`);
      
      const staffData = staffMembers.map(staff => ({
        business_id: businessId,
        name: staff.name,
        position: staff.role,
        email: staff.email || null,
        phone: staff.phone || null,
        specialties: staff.specialties || [],
        status: 'active'
      }));
      
      const { error: staffError } = await supabase
        .from('professionals')
        .insert(staffData);
        
      if (staffError) {
        console.error('Failed to add staff members:', staffError);
      }
    }
    
    // Set business hours if provided
    if (businessHours && Object.keys(businessHours).length > 0) {
      console.log('Setting business hours');
      
      // Store business hours in business_settings as JSON
      const { error: hoursError } = await supabase
        .from('business_settings')
        .update({
          working_hours: businessHours
        })
        .eq('business_id', businessId);
        
      if (hoursError) {
        console.error('Failed to update business hours:', hoursError);
      }
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
