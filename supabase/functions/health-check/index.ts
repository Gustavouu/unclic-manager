
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    database: boolean;
    memory: number;
    uptime: number;
    errors: string[];
  };
  performance: {
    responseTime: number;
    dbQueryTime: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const errors: string[] = [];
  let dbQueryTime = 0;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test database connectivity
    const dbStart = Date.now();
    const { error: dbError } = await supabase
      .from('businesses')
      .select('count(*)')
      .limit(1);
    
    dbQueryTime = Date.now() - dbStart;

    if (dbError) {
      errors.push(`Database error: ${dbError.message}`);
    }

    // Check memory usage (basic estimation)
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

    // Calculate uptime (simplified)
    const uptime = Date.now() - startTime;

    const responseTime = Date.now() - startTime;

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    if (errors.length > 0) {
      status = 'unhealthy';
    } else if (dbQueryTime > 1000 || responseTime > 2000) {
      status = 'degraded';
    }

    const healthCheck: HealthCheck = {
      status,
      timestamp: new Date().toISOString(),
      version: '3.0.0',
      checks: {
        database: !dbError,
        memory: memoryUsage,
        uptime,
        errors
      },
      performance: {
        responseTime,
        dbQueryTime
      }
    };

    console.log('Health check completed:', healthCheck);

    return new Response(
      JSON.stringify(healthCheck),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: status === 'healthy' ? 200 : status === 'degraded' ? 206 : 503
      }
    );

  } catch (error) {
    console.error('Health check failed:', error);

    const errorHealthCheck: HealthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '3.0.0',
      checks: {
        database: false,
        memory: 0,
        uptime: 0,
        errors: [error.message]
      },
      performance: {
        responseTime: Date.now() - startTime,
        dbQueryTime: 0
      }
    };

    return new Response(
      JSON.stringify(errorHealthCheck),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 503
      }
    );
  }
});
