
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Client } from '@/types/client';

interface ClientAnalytics {
  totalClients: number;
  topSpenders: Client[];
  clientsNeedingAttention: Client[];
}

interface ClientsAnalyticsProps {
  analytics: ClientAnalytics;
  onCreateAppointment?: (clientId: string) => void;
}

export const ClientsAnalytics: React.FC<ClientsAnalyticsProps> = ({
  analytics,
  onCreateAppointment
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topSpenders.map((client, index) => (
              <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(client.total_spent || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clientes que Precisam de Atenção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.clientsNeedingAttention.slice(0, 5).map((client) => (
              <div key={client.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-gray-500">
                    Última visita: {client.last_visit 
                      ? new Date(client.last_visit).toLocaleDateString('pt-BR')
                      : 'Nunca'
                    }
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onCreateAppointment?.(client.id)}
                >
                  Agendar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
