
// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface Appointment {
  id: string;
  id_negocio: string;
  id_cliente: string;
  data: string;
  hora_inicio: string;
  nome_cliente: string;
  email_cliente: string;
  telefone_cliente: string;
  nome_negocio: string;
}

interface NotificationSettings {
  id: string;
  id_negocio: string;
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  message_template: string;
}

serve(async (req) => {
  // Handle OPTIONS for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log("Processing appointment reminders...");

    // Get current time in hours (0-23)
    const now = new Date();
    const currentHour = now.getHours();
    
    // Get all businesses that have notification settings
    const { data: notificationSettings, error: settingsError } = await supabase
      .from("notification_settings")
      .select("*");

    if (settingsError) {
      throw new Error(`Error fetching notification settings: ${settingsError.message}`);
    }

    console.log(`Found ${notificationSettings?.length || 0} businesses with notification settings`);

    let totalSent = 0;
    let totalErrors = 0;

    // For each business
    for (const settings of notificationSettings || []) {
      // Check if current time is within quiet hours
      const quietStart = parseInt(settings.quiet_hours_start, 10);
      const quietEnd = parseInt(settings.quiet_hours_end, 10);
      
      // Determine if we're in quiet hours (handles both cases, e.g. 22-8 or 8-22)
      const isQuietHours = quietStart < quietEnd 
        ? (currentHour >= quietStart && currentHour < quietEnd)
        : (currentHour >= quietStart || currentHour < quietEnd);

      if (isQuietHours) {
        console.log(`Skipping reminders for business ${settings.id_negocio} due to quiet hours (${quietStart}-${quietEnd})`);
        continue;
      }

      // Get upcoming appointments for next 24 hours that haven't had reminders sent
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      
      const { data: appointments, error: apptError } = await supabase
        .from("agendamentos")
        .select(`
          id,
          id_negocio,
          id_cliente,
          data,
          hora_inicio,
          clientes!inner(nome, email, telefone),
          negocios!inner(nome)
        `)
        .eq("id_negocio", settings.id_negocio)
        .eq("lembrete_enviado", false)
        .gte("data", now.toISOString().split("T")[0])
        .lte("data", tomorrow.toISOString().split("T")[0]);

      if (apptError) {
        console.error(`Error fetching appointments for business ${settings.id_negocio}: ${apptError.message}`);
        continue;
      }

      console.log(`Found ${appointments?.length || 0} appointments needing reminders for business ${settings.id_negocio}`);

      // Process each appointment
      for (const appt of appointments || []) {
        try {
          // Format the client data for template
          const clientName = appt.clientes.nome;
          const businessName = appt.negocios.nome;
          const appointmentDate = new Date(appt.data).toLocaleDateString("pt-BR");
          const appointmentTime = appt.hora_inicio;
          
          // Parse template and replace variables
          let message = settings.message_template
            .replace("{cliente}", clientName)
            .replace("{negócio}", businessName)
            .replace("{data}", appointmentDate)
            .replace("{hora}", appointmentTime);

          // Log notification to notification_logs table
          const { error: logError } = await supabase
            .from("notification_logs")
            .insert({
              id_negocio: settings.id_negocio,
              tipo: settings.email_enabled ? "email" : (settings.sms_enabled ? "sms" : "push"),
              evento: "appointment_reminder",
              destinatario: appt.clientes.email || appt.clientes.telefone,
              mensagem: message,
              status: "enviado" // In a real implementation, this would be updated after actual sending
            });

          if (logError) {
            console.error(`Error logging notification: ${logError.message}`);
            totalErrors++;
            continue;
          }

          // Update appointment to mark reminder as sent
          const { error: updateError } = await supabase
            .from("agendamentos")
            .update({ lembrete_enviado: true })
            .eq("id", appt.id);

          if (updateError) {
            console.error(`Error updating appointment ${appt.id}: ${updateError.message}`);
            totalErrors++;
            continue;
          }

          // In a real implementation, you would integrate with email, SMS providers here
          console.log(`Sent reminder for appointment ${appt.id} to ${clientName} via ${settings.email_enabled ? "email" : (settings.sms_enabled ? "SMS" : "push")}`);
          
          totalSent++;
        } catch (apptError) {
          console.error(`Error processing appointment ${appt.id}: ${apptError}`);
          totalErrors++;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed reminders. Sent: ${totalSent}, Errors: ${totalErrors}`,
        sent: totalSent,
        errors: totalErrors
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error in appointment reminders: ${error.message}`);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
