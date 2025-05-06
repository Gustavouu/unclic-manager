
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow POST requests (for security)
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { name } = await req.json();
    
    if (!name) {
      return new Response(JSON.stringify({ error: 'Job name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Run the appropriate job based on the name
    let result;
    
    switch (name) {
      case 'send-appointment-reminders':
        result = await runAppointmentReminders();
        break;
      default:
        return new Response(JSON.stringify({ error: `Unknown job: ${name}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function runAppointmentReminders() {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    
    // Call the send-appointment-reminders function
    const response = await fetch(`${supabaseUrl}/functions/v1/send-appointment-reminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to run appointment reminders: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error running appointment reminders:', error);
    throw error;
  }
}
