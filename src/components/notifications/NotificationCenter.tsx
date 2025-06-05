
import React from 'react';
import { Bell, Clock, DollarSign, Calendar, AlertCircle, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'appointment_reminder':
      return <Calendar className="h-4 w-4" />;
    case 'payment_due':
      return <DollarSign className="h-4 w-4" />;
    case 'appointment_canceled':
      return <AlertCircle className="h-4 w-4" />;
    case 'system':
      return <Bell className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'appointment_reminder':
      return 'bg-blue-500';
    case 'payment_due':
      return 'bg-yellow-500';
    case 'appointment_canceled':
      return 'bg-red-500';
    case 'system':
      return 'bg-gray-500';
    case 'marketing':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const NotificationCenter: React.FC = () => {
  const { notifications, isLoading, markAsRead, unreadCount } = useNotifications();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Central de Notificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Carregando notificações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Central de Notificações
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive">
              {unreadCount} não lidas
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Nenhuma notificação encontrada</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg space-y-2 ${
                  notification.status === 'read' ? 'bg-muted/50' : 'bg-background'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-full text-white ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                        {notification.status === 'sent' && notification.sent_at && (
                          <Badge variant="outline" className="text-xs">
                            Enviado
                          </Badge>
                        )}
                        {notification.status === 'pending' && (
                          <Badge variant="secondary" className="text-xs">
                            Pendente
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {notification.status !== 'read' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
