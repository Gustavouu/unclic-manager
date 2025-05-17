
import React, { useEffect, useState } from 'react';
import { Calendar, Banknote, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTenant } from "@/contexts/TenantContext";
import { supabase } from '@/integrations/supabase/client';

type MetricsData = {
  clientes_ativos: number;
  agendamentos_proximos: number;
  receita_periodo: number;
  servicos_realizados: number;
  periodo: string;
  error?: string;
}

export const DashboardOverview = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const { businessId } = useTenant();

  useEffect(() => {
    const loadMetrics = async () => {
      if (!businessId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase.rpc('obter_metricas_periodo', {
          business_id_param: businessId,
          periodo: 'month'
        });

        if (error) {
          console.error('Erro ao obter métricas:', error);
        } else if (data) {
          setMetrics(data as MetricsData);
        }
      } catch (err) {
        console.error('Erro ao carregar métricas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [businessId]);

  // Use placeholder values when loading or if there's an error
  const activeClients = isLoading ? '...' : metrics?.clientes_ativos || 0;
  const upcomingAppointments = isLoading ? '...' : metrics?.agendamentos_proximos || 0;
  const periodRevenue = isLoading ? '...' : metrics?.receita_periodo || 0;
  const servicesCompleted = isLoading ? '...' : metrics?.servicos_realizados || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="bg-primary/10 p-2 rounded">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Clientes Ativos</p>
            <h3 className="text-2xl font-bold">{activeClients}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="bg-primary/10 p-2 rounded">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Próximos Agendamentos</p>
            <h3 className="text-2xl font-bold">{upcomingAppointments}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="bg-primary/10 p-2 rounded">
            <Banknote className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Receita do Mês</p>
            <h3 className="text-2xl font-bold">
              {typeof periodRevenue === 'number' 
                ? `R$ ${periodRevenue.toFixed(2).replace('.', ',')}`
                : periodRevenue}
            </h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="bg-primary/10 p-2 rounded">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Serviços Realizados</p>
            <h3 className="text-2xl font-bold">{servicesCompleted}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
