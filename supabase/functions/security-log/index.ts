
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

// Set up CORS headers for browser clients
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a Supabase client for the function
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      })
    }

    // Parse the request body
    const body = await req.json()
    const { event_type, details, user_agent } = body

    // Get client IP address
    let clientIp = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   'unknown'
    
    // If forwarded IP contains multiple addresses, get the first one
    if (clientIp.includes(',')) {
      clientIp = clientIp.split(',')[0].trim()
    }

    // Required fields validation
    if (!event_type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Extract JWT if available to get user_id
    let userId = null
    const authHeader = req.headers.get('authorization')
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error } = await supabaseClient.auth.getUser(token)
        
        if (!error && user) {
          userId = user.id
        }
      } catch (e) {
        console.error('Error extracting user from token:', e)
      }
    }

    // Log security event
    const { data, error } = await supabaseClient
      .from('security_events')
      .insert({
        user_id: userId,
        event_type,
        details,
        ip_address: clientIp,
        user_agent
      })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Security log error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
