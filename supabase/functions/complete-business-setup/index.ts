
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

    const { userId, businessId, services, staffMembers, hasStaff, businessHours } = await req.json();

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

    // Check which table exists - businesses or negocios
    let tableName = null;
    
    // Try businesses first
    try {
      const { data: businessExists, error } = await supabase
        .from('businesses')
        .select('id')
        .eq('id', businessId)
        .maybeSingle();
        
      if (!error && businessExists) {
        tableName = 'businesses';
      }
    } catch (error) {
      console.error('Error checking businesses table:', error);
    }
    
    // Try negocios if businesses didn't work
    if (!tableName) {
      try {
        const { data: negocioExists, error } = await supabase
          .from('negocios')
          .select('id')
          .eq('id', businessId)
          .maybeSingle();
          
        if (!error && negocioExists) {
          tableName = 'negocios';
        }
      } catch (error) {
        console.error('Error checking negocios table:', error);
      }
    }
    
    if (!tableName) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Business not found in any table" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 404 
        }
      );
    }
    
    // Try to create services
    try {
      if (services && services.length > 0) {
        if (tableName === 'businesses') {
          try {
            // Check if services table exists
            const { error: checkError } = await supabase
              .from('services')
              .select('count(*)', { count: 'exact', head: true });
            
            if (!checkError || checkError.code !== 'PGRST116') {
              // Format service data
              const serviceData = services.map(service => ({
                name: service.name,
                price: service.price,
                duration: service.duration,
                description: service.description || '',
                business_id: businessId
              }));
              
              // Insert services
              await supabase.from('services').insert(serviceData);
            }
          } catch (error) {
            console.error('Failed to create services:', error);
          }
        } else if (tableName === 'negocios') {
          try {
            // Check if servicos table exists
            const { error: checkError } = await supabase
              .from('servicos')
              .select('count(*)', { count: 'exact', head: true });
            
            if (!checkError || checkError.code !== 'PGRST116') {
              // Format service data
              const serviceData = services.map(service => ({
                nome: service.name,
                preco: service.price,
                duracao: service.duration,
                descricao: service.description || '',
                id_negocio: businessId
              }));
              
              // Insert services
              await supabase.from('servicos').insert(serviceData);
            }
          } catch (error) {
            console.error('Failed to create services:', error);
          }
        }
      }
    } catch (serviceError) {
      console.error('Error creating services:', serviceError);
      // Continue even if services creation fails
    }
    
    // Try to create professionals if hasStaff is true
    if (hasStaff && staffMembers && staffMembers.length > 0) {
      try {
        if (tableName === 'businesses') {
          try {
            // Check if professionals table exists
            const { error: checkError } = await supabase
              .from('professionals')
              .select('count(*)', { count: 'exact', head: true });
            
            if (!checkError || checkError.code !== 'PGRST116') {
              // Format professional data
              const professionalData = staffMembers.map(staff => ({
                name: staff.name,
                position: staff.position || '',
                phone: staff.phone || '',
                email: staff.email || '',
                business_id: businessId
              }));
              
              // Insert professionals
              await supabase.from('professionals').insert(professionalData);
            }
          } catch (error) {
            console.error('Failed to create professionals:', error);
          }
        } else if (tableName === 'negocios') {
          try {
            // Check if funcionarios table exists
            const { error: checkError } = await supabase
              .from('funcionarios')
              .select('count(*)', { count: 'exact', head: true });
            
            if (!checkError || checkError.code !== 'PGRST116') {
              // Format professional data
              const professionalData = staffMembers.map(staff => ({
                nome: staff.name,
                cargo: staff.position || '',
                telefone: staff.phone || '',
                email: staff.email || '',
                id_negocio: businessId
              }));
              
              // Insert professionals
              await supabase.from('funcionarios').insert(professionalData);
            }
          } catch (error) {
            console.error('Failed to create professionals:', error);
          }
        }
      } catch (staffError) {
        console.error('Error creating staff members:', staffError);
        // Continue even if staff creation fails
      }
    }
    
    // Update business status to active
    try {
      if (tableName === 'businesses') {
        await supabase
          .from('businesses')
          .update({ 
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', businessId);
      } else if (tableName === 'negocios') {
        await supabase
          .from('negocios')
          .update({ 
            status: 'ativo',
            atualizado_em: new Date().toISOString()
          })
          .eq('id', businessId);
      }
    } catch (statusError) {
      console.error('Error updating business status:', statusError);
      // Continue even if status update fails
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        tableName
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
