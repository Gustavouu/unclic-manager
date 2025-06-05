
import { useState, useEffect } from 'react';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { useNotifications } from '@/hooks/useNotifications';

interface ScheduledNotification {
  id: string;
  type: 'appointment_reminder' | 'payment_due' | 'system';
  scheduledFor: Date;
  recipientId: string;
  message: string;
  status: 'scheduled' | 'sent' | 'failed';
}

export const useNotificationScheduler = () => {
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { businessId } = useCurrentBusiness();
  const { sendNotification } = useNotifications();

  const scheduleAppointmentReminder = async (appointmentId: string, clientEmail: string, appointmentDate: Date) => {
    const reminderTime = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000); // 24 horas antes
    
    const notification: ScheduledNotification = {
      id: Date.now().toString(),
      type: 'appointment_reminder',
      scheduledFor: reminderTime,
      recipientId: clientEmail,
      message: `Lembrete: Você tem um agendamento marcado para ${appointmentDate.toLocaleDateString('pt-BR')}`,
      status: 'scheduled',
    };

    setScheduledNotifications(prev => [...prev, notification]);
    return notification;
  };

  const schedulePaymentReminder = async (clientId: string, amount: number, dueDate: Date) => {
    const notification: ScheduledNotification = {
      id: Date.now().toString(),
      type: 'payment_due',
      scheduledFor: dueDate,
      recipientId: clientId,
      message: `Lembrete: Pagamento de R$ ${amount.toFixed(2)} vence hoje`,
      status: 'scheduled',
    };

    setScheduledNotifications(prev => [...prev, notification]);
    return notification;
  };

  const processScheduledNotifications = async () => {
    setIsProcessing(true);
    const now = new Date();

    try {
      const pendingNotifications = scheduledNotifications.filter(
        notification => notification.status === 'scheduled' && notification.scheduledFor <= now
      );

      for (const notification of pendingNotifications) {
        try {
          await sendNotification({
            type: notification.type,
            title: 'Lembrete Automático',
            message: notification.message,
            recipient_email: notification.recipientId,
            status: 'sent',
            scheduled_for: notification.scheduledFor.toISOString(),
          });

          setScheduledNotifications(prev =>
            prev.map(n =>
              n.id === notification.id
                ? { ...n, status: 'sent' as const }
                : n
            )
          );
        } catch (error) {
          console.error('Erro ao enviar notificação:', error);
          setScheduledNotifications(prev =>
            prev.map(n =>
              n.id === notification.id
                ? { ...n, status: 'failed' as const }
                : n
            )
          );
        }
      }
    } catch (error) {
      console.error('Erro no processamento de notificações:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(processScheduledNotifications, 60000); // Verificar a cada minuto
    return () => clearInterval(interval);
  }, [scheduledNotifications]);

  return {
    scheduledNotifications,
    isProcessing,
    scheduleAppointmentReminder,
    schedulePaymentReminder,
    processScheduledNotifications,
  };
};
