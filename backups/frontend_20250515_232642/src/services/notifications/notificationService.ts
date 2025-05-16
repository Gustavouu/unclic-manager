
import { supabase } from '@/integrations/supabase/client';
import { WebhookService } from '../payment/webhook';

export type NotificationType = 'email' | 'sms' | 'push';
export type NotificationEvent = 'appointment_created' | 'appointment_reminder' | 'appointment_cancelled' | 'client_feedback';

export interface NotificationPayload {
  businessId: string;
  businessName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientName?: string;
  subject?: string;
  message: string;
  data?: Record<string, any>;
}

export const NotificationService = {
  /**
   * Send a notification to a recipient
   */
  async sendNotification(
    type: NotificationType,
    event: NotificationEvent,
    payload: NotificationPayload
  ): Promise<boolean> {
    try {
      // Log the notification attempt
      console.log(`Sending ${type} notification for event: ${event}`);
      
      // Check if the notification settings allow this type of notification
      const { data: settings, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('id_negocio', payload.businessId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching notification settings:', error);
        return false;
      }
      
      if (!settings) {
        console.error('No notification settings found for business:', payload.businessId);
        return false;
      }
      
      // Check if the notification type is enabled
      let isEnabled = false;
      
      switch (type) {
        case 'email':
          isEnabled = settings.email_enabled;
          break;
        case 'sms':
          isEnabled = settings.sms_enabled;
          break;
        case 'push':
          isEnabled = settings.push_enabled;
          break;
      }
      
      if (!isEnabled) {
        console.log(`${type} notifications are disabled for business: ${payload.businessId}`);
        return false;
      }
      
      // Check if the notification event is enabled
      switch (event) {
        case 'appointment_created':
          isEnabled = settings.new_appointment_alert;
          break;
        case 'appointment_cancelled':
          isEnabled = settings.cancel_appointment_alert;
          break;
        case 'client_feedback':
          isEnabled = settings.client_feedback_alert;
          break;
        case 'appointment_reminder':
          // Reminders are always enabled if the notification type is enabled
          break;
      }
      
      if (!isEnabled) {
        console.log(`${event} notifications are disabled for business: ${payload.businessId}`);
        return false;
      }
      
      // Check quiet hours
      const now = new Date();
      const currentHour = now.getHours();
      const quietHoursStart = parseInt(settings.quiet_hours_start, 10);
      const quietHoursEnd = parseInt(settings.quiet_hours_end, 10);
      
      // Determine if current time is within quiet hours
      let isQuietHours = false;
      if (quietHoursStart > quietHoursEnd) { // Spans midnight
        isQuietHours = currentHour >= quietHoursStart || currentHour < quietHoursEnd;
      } else {
        isQuietHours = currentHour >= quietHoursStart && currentHour < quietHoursEnd;
      }
      
      if (isQuietHours && event !== 'appointment_reminder') {
        console.log(`Not sending ${type} notification during quiet hours`);
        return false;
      }
      
      // Process the message template
      let message = payload.message;
      
      if (settings.message_template && !payload.message.includes('{')) {
        message = settings.message_template
          .replace('{cliente}', payload.recipientName || '')
          .replace('{negócio}', payload.businessName || '')
          .replace('{data}', payload.data?.date || '')
          .replace('{hora}', payload.data?.time || '');
      }
      
      // Send the notification based on type
      let success = false;
      
      switch (type) {
        case 'email':
          if (payload.recipientEmail) {
            // In a real implementation, you would call an email service here
            // For now, we just log it and send a webhook notification
            console.log(`Sending email to ${payload.recipientEmail}: ${message}`);
            success = await WebhookService.sendWebhookNotification('email_notification', {
              to: payload.recipientEmail,
              subject: payload.subject || `Notificação: ${event.replace('_', ' ')}`,
              message
            });
          }
          break;
        case 'sms':
          if (payload.recipientPhone) {
            // In a real implementation, you would call an SMS service here
            // For now, we just log it and send a webhook notification
            console.log(`Sending SMS to ${payload.recipientPhone}: ${message}`);
            success = await WebhookService.sendWebhookNotification('sms_notification', {
              to: payload.recipientPhone,
              message
            });
          }
          break;
        case 'push':
          // In a real implementation, you would call a push notification service here
          // For now, we just log it
          console.log(`Sending push notification: ${message}`);
          success = true;
          break;
      }
      
      // Log the notification to the database for audit and tracking
      const { error: logError } = await supabase
        .from('notification_logs')
        .insert({
          id_negocio: payload.businessId,
          tipo: type,
          evento: event,
          destinatario: type === 'email' ? payload.recipientEmail : payload.recipientPhone,
          mensagem: message,
          data_envio: new Date().toISOString(),
          status: success ? 'enviado' : 'falha'
        });
      
      if (logError) {
        console.error('Error logging notification:', logError);
      }
      
      return success;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  },
  
  /**
   * Send an appointment confirmation notification
   */
  async sendAppointmentConfirmation(
    businessId: string,
    businessName: string,
    clientEmail: string,
    clientPhone: string,
    clientName: string,
    appointmentDetails: {
      date: string;
      time: string;
      service: string;
      professional: string;
    }
  ): Promise<boolean> {
    const emailSuccess = await this.sendNotification('email', 'appointment_created', {
      businessId,
      businessName,
      recipientEmail: clientEmail,
      recipientName: clientName,
      subject: 'Confirmação de Agendamento',
      message: `Olá ${clientName}, seu agendamento foi confirmado para ${appointmentDetails.date} às ${appointmentDetails.time} com ${appointmentDetails.professional} para o serviço de ${appointmentDetails.service}.`,
      data: appointmentDetails
    });
    
    const smsSuccess = await this.sendNotification('sms', 'appointment_created', {
      businessId,
      businessName,
      recipientPhone: clientPhone,
      recipientName: clientName,
      message: `Agendamento confirmado para ${appointmentDetails.date} às ${appointmentDetails.time}.`,
      data: appointmentDetails
    });
    
    return emailSuccess || smsSuccess;
  },
  
  /**
   * Send an appointment reminder notification
   */
  async sendAppointmentReminder(
    businessId: string,
    businessName: string,
    clientEmail: string,
    clientPhone: string,
    clientName: string,
    appointmentDetails: {
      date: string;
      time: string;
      service: string;
      professional: string;
    }
  ): Promise<boolean> {
    const emailSuccess = await this.sendNotification('email', 'appointment_reminder', {
      businessId,
      businessName,
      recipientEmail: clientEmail,
      recipientName: clientName,
      subject: 'Lembrete de Agendamento',
      message: `Olá ${clientName}, lembramos que você tem um agendamento amanhã, ${appointmentDetails.date} às ${appointmentDetails.time} com ${appointmentDetails.professional} para o serviço de ${appointmentDetails.service}.`,
      data: appointmentDetails
    });
    
    const smsSuccess = await this.sendNotification('sms', 'appointment_reminder', {
      businessId,
      businessName,
      recipientPhone: clientPhone,
      recipientName: clientName,
      message: `Lembrete: Seu agendamento é amanhã, ${appointmentDetails.date} às ${appointmentDetails.time}.`,
      data: appointmentDetails
    });
    
    return emailSuccess || smsSuccess;
  }
};
