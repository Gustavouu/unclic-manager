
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
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request data
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
    
    console.log("Completing business setup:", {
      businessId,
      userId,
      servicesCount: services?.length || 0,
      staffCount: staffMembers?.length || 0,
      hasStaff
    });
    
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
    
    // Add services if provided
    if (services && services.length > 0) {
      try {
        const servicesData = services.map(service => ({
          business_id: businessId,
          name: service.name,
          duration: service.duration,
          price: service.price,
          description: service.description || null,
          isActive: true,
          allowOnlineBooking: true
        }));
        
        const { error: servicesError } = await supabase
          .from('services')
          .insert(servicesData);
          
        if (servicesError) {
          console.error("Error adding services:", servicesError);
          // Continue even if there's an error
        } else {
          console.log(`${services.length} services added successfully`);
        }
      } catch (error) {
        console.error("Exception during services creation:", error);
        // Continue even if there's an error
      }
    }
    
    // Add staff members if provided
    if (staffMembers && staffMembers.length > 0 && hasStaff) {
      try {
        const staffData = staffMembers.map(staff => ({
          business_id: businessId,
          name: staff.name,
          email: staff.email || null,
          phone: staff.phone || null,
          position: staff.position || null,
          commission_percentage: staff.commission || 0,
          isActive: true
        }));
        
        const { error: staffError } = await supabase
          .from('professionals')
          .insert(staffData);
          
        if (staffError) {
          console.error("Error adding staff members:", staffError);
          // Continue even if there's an error
        } else {
          console.log(`${staffMembers.length} staff members added successfully`);
        }
      } catch (error) {
        console.error("Exception during staff creation:", error);
        // Continue even if there's an error
      }
    }
    
    // Update business settings with business hours if provided
    if (businessHours) {
      try {
        // First try finding existing settings
        const { data: existingSettings } = await supabase
          .from('business_settings')
          .select('id, notes')
          .eq('business_id', businessId)
          .maybeSingle();
          
        if (existingSettings) {
          // If settings exist, update them
          let notesObj = {};
          
          // If notes exist, parse them
          if (existingSettings.notes) {
            try {
              notesObj = typeof existingSettings.notes === 'string' 
                ? JSON.parse(existingSettings.notes) 
                : existingSettings.notes;
            } catch (e) {
              notesObj = {};
            }
          }
          
          // Add working hours to notes
          notesObj.working_hours = businessHours;
          
          const { error: hoursError } = await supabase
            .from('business_settings')
            .update({ 
              notes: JSON.stringify(notesObj),
              updated_at: new Date().toISOString()
            })
            .eq('business_id', businessId);
            
          if (hoursError) {
            console.error("Error updating business hours:", hoursError);
            // Continue even if there's an error
          } else {
            console.log("Business hours updated successfully");
          }
        } else {
          // If settings don't exist, create them
          const { error: createError } = await supabase
            .from('business_settings')
            .insert({
              business_id: businessId,
              primary_color: '#213858',
              secondary_color: '#33c3f0',
              notes: JSON.stringify({ working_hours: businessHours })
            });
            
          if (createError) {
            console.error("Error creating business settings with hours:", createError);
            // Continue even if there's an error
          } else {
            console.log("Business settings with hours created successfully");
          }
        }
      } catch (error) {
        console.error("Exception during business hours update:", error);
        // Continue even if there's an error
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
