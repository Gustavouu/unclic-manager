
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

export interface Notification {
  id: string;
  business_id: string;
  type: 'appointment_reminder' | 'appointment_canceled' | 'payment_due' | 'system' | 'marketing';
  title: string;
  message: string;
  recipient_id?: string;
  recipient_email?: string;
  recipient_phone?: string;
  status: 'pending' | 'sent' | 'failed' | 'read';
  scheduled_for?: string;
  sent_at?: string;
  read_at?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  const fetchNotifications = async () => {
    if (!businessId) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulando notificações já que não temos a tabela criada
      const mockNotifications: Notification[] = [
        {
          id: '1',
          business_id: businessId,
          type: 'appointment_reminder',
          title: 'Lembrete de Agendamento',
          message: 'Você tem um agendamento em 1 hora',
          recipient_email: 'cliente@email.com',
          status: 'sent',
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          business_id: businessId,
          type: 'payment_due',
          title: 'Pagamento Pendente',
          message: 'Há pagamentos pendentes para revisão',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];

      setNotifications(mockNotifications);
      console.log('Notificações carregadas:', mockNotifications.length);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, status: 'read' as const, read_at: new Date().toISOString() }
            : notification
        )
      );
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
    }
  };

  const sendNotification = async (notification: Omit<Notification, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => {
    if (!businessId) throw new Error('Nenhum negócio selecionado');

    try {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        business_id: businessId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setNotifications(prev => [newNotification, ...prev]);
      return newNotification;
    } catch (err) {
      console.error('Erro ao enviar notificação:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [businessId]);

  const unreadCount = notifications.filter(n => n.status !== 'read').length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    sendNotification,
  };
};
