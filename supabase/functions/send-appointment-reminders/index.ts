
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { format } from 'https://esm.sh/date-fns@3.6.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

const supabase = createClient(supabaseUrl, supabaseKey);

interface Appointment {
  id: string;
  id_negocio: string;
  data: string;
  id_cliente: string;
  id_servico: string;
  id_funcionario: string;
  status: string;
}

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

interface Negocio {
  id: string;
  nome: string;
}

interface Servico {
  id: string;
  nome: string;
}

interface Funcionario {
  id: string;
  nome: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
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
    // Get appointments for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);
    
    const { data: appointments, error: appointmentsError } = await supabase
      .from('agendamentos')
      .select('id, id_negocio, data, id_cliente, id_servico, id_funcionario, status')
      .gte('data', tomorrow.toISOString())
      .lte('data', tomorrowEnd.toISOString())
      .eq('status', 'confirmado');
      
    if (appointmentsError) {
      throw appointmentsError;
    }
    
    if (!appointments || appointments.length === 0) {
      return new Response(JSON.stringify({ message: 'No appointments to remind' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const results = {
      total: appointments.length,
      processed: 0,
      success: 0,
      failed: 0,
      details: [] as any[]
    };
    
    // Process each appointment
    for (const appointment of appointments) {
      results.processed++;
      
      try {
        // Get client information
        const { data: client, error: clientError } = await supabase
          .from('clientes')
          .select('id, nome, email, telefone')
          .eq('id', appointment.id_cliente)
          .single();
          
        if (clientError || !client) {
          throw new Error(`Client not found: ${clientError?.message || 'Unknown error'}`);
        }
        
        // Get business information
        const { data: business, error: businessError } = await supabase
          .from('negocios')
          .select('id, nome')
          .eq('id', appointment.id_negocio)
          .single();
          
        if (businessError || !business) {
          throw new Error(`Business not found: ${businessError?.message || 'Unknown error'}`);
        }
        
        // Get service information
        const { data: service, error: serviceError } = await supabase
          .from('servicos')
          .select('id, nome')
          .eq('id', appointment.id_servico)
          .single();
          
        if (serviceError || !service) {
          throw new Error(`Service not found: ${serviceError?.message || 'Unknown error'}`);
        }
        
        // Get professional information
        const { data: professional, error: professionalError } = await supabase
          .from('funcionarios')
          .select('id, nome')
          .eq('id', appointment.id_funcionario)
          .single();
          
        if (professionalError || !professional) {
          throw new Error(`Professional not found: ${professionalError?.message || 'Unknown error'}`);
        }
        
        // Format appointment date
        const appointmentDate = new Date(appointment.data);
        const formattedDate = format(appointmentDate, 'dd/MM/yyyy');
        const formattedTime = format(appointmentDate, 'HH:mm');
        
        // Get notification settings
        const { data: settings, error: settingsError } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('id_negocio', appointment.id_negocio)
          .maybeSingle();
          
        if (settingsError) {
          throw new Error(`Failed to get notification settings: ${settingsError.message}`);
        }
        
        // Check if email notifications are enabled
        if (settings?.email_enabled && client.email) {
          // In a real implementation, you would call an email service here
          // For demonstration, we'll just log to the notification_logs table
          const { error: logError } = await supabase
            .from('notification_logs')
            .insert({
              id_negocio: appointment.id_negocio,
              tipo: 'email',
              evento: 'appointment_reminder',
              destinatario: client.email,
              mensagem: `Olá ${client.nome}, lembramos que você tem um agendamento amanhã, ${formattedDate} às ${formattedTime} com ${professional.nome} para o serviço de ${service.nome}.`,
              data_envio: new Date().toISOString(),
              status: 'enviado'
            });
            
          if (logError) {
            throw new Error(`Failed to log email notification: ${logError.message}`);
          }
        }
        
        // Check if SMS notifications are enabled
        if (settings?.sms_enabled && client.telefone) {
          // In a real implementation, you would call an SMS service here
          // For demonstration, we'll just log to the notification_logs table
          const { error: logError } = await supabase
            .from('notification_logs')
            .insert({
              id_negocio: appointment.id_negocio,
              tipo: 'sms',
              evento: 'appointment_reminder',
              destinatario: client.telefone,
              mensagem: `Lembrete: Seu agendamento é amanhã, ${formattedDate} às ${formattedTime}.`,
              data_envio: new Date().toISOString(),
              status: 'enviado'
            });
            
          if (logError) {
            throw new Error(`Failed to log SMS notification: ${logError.message}`);
          }
        }
        
        // Update the appointment to indicate reminder was sent
        const { error: updateError } = await supabase
          .from('agendamentos')
          .update({ lembrete_enviado: true })
          .eq('id', appointment.id);
          
        if (updateError) {
          throw new Error(`Failed to update appointment: ${updateError.message}`);
        }
        
        // Record success
        results.success++;
        results.details.push({
          appointmentId: appointment.id,
          clientId: client.id,
          clientName: client.nome,
          status: 'success'
        });
      } catch (error) {
        // Record failure
        results.failed++;
        results.details.push({
          appointmentId: appointment.id,
          error: error instanceof Error ? error.message : String(error),
          status: 'failed'
        });
      }
    }
    
    return new Response(JSON.stringify(results), {
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
