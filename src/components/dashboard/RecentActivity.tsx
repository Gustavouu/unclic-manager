
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, DollarSign } from 'lucide-react';

interface Activity {
  id: string;
  type: 'appointment' | 'payment' | 'client' | 'service';
  title: string;
  description: string;
  time: string;
  status?: 'completed' | 'pending' | 'cancelled';
  amount?: number;
}

interface RecentActivityProps {
  activities?: Activity[];
  loading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities = [], 
  loading = false 
}) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'client':
        return <User className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status?: Activity['status']) => {
    if (!status) return null;
    
    const statusConfig = {
      completed: { label: 'Concluído', variant: 'default' as const },
      pending: { label: 'Pendente', variant: 'secondary' as const },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Mock data if no activities provided
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'appointment',
      title: 'Agendamento confirmado',
      description: 'João Silva - Corte de cabelo',
      time: '10 min atrás',
      status: 'completed',
    },
    {
      id: '2',
      type: 'payment',
      title: 'Pagamento recebido',
      description: 'Pagamento via PIX',
      time: '25 min atrás',
      amount: 50.00,
      status: 'completed',
    },
    {
      id: '3',
      type: 'client',
      title: 'Novo cliente cadastrado',
      description: 'Maria Santos',
      time: '1 hora atrás',
    },
    {
      id: '4',
      type: 'appointment',
      title: 'Agendamento cancelado',
      description: 'Pedro Costa - Barba',
      time: '2 horas atrás',
      status: 'cancelled',
    },
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center space-x-2">
                    {activity.amount && (
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(activity.amount)}
                      </span>
                    )}
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {activity.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {displayActivities.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">Nenhuma atividade recente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
