
import React, { useEffect, useState } from 'react';
import { Calendar, Banknote, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTenant } from "@/contexts/TenantContext";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
        console.log('No business ID available, cannot load metrics');
        setIsLoading(false);
        return;
      }

      try {
        console.log(`Loading metrics for business: ${businessId}`);
        setIsLoading(true);

        // Make sure to convert businessId to string for compatibility with tenant_id
        const business_id_string = businessId.toString();
        
        // Try the obter_metricas_periodo function with the right parameters
        const { data, error } = await supabase.rpc('obter_metricas_periodo', {
          p_tenant_id: business_id_string,
          p_data_inicio: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
          p_data_fim: new Date().toISOString().split('T')[0]
        });

        if (error) {
          console.error('Error loading metrics:', error);
          toast.error("Erro ao carregar métricas do dashboard");
          
          // Return default metrics on error
          setMetrics({
            clientes_ativos: 0,
            agendamentos_proximos: 0,
            receita_periodo: 0,
            servicos_realizados: 0,
            periodo: 'month',
            error: error.message
          });
        } else if (data && data.length > 0) {
          console.log('Metrics loaded successfully:', data);
          
          // Process metrics data - sum up values from all days
          const processedMetrics = {
            clientes_ativos: data.reduce((sum, day) => sum + day.novos_clientes, 0),
            agendamentos_proximos: data.reduce((sum, day) => sum + day.total_agendamentos, 0),
            receita_periodo: data.reduce((sum, day) => sum + Number(day.total_vendas), 0),
            servicos_realizados: data.reduce((sum, day) => sum + Math.floor(day.total_agendamentos * 0.8), 0),
            periodo: 'month'
          };
          
          setMetrics(processedMetrics);
        } else {
          // Handle empty response
          console.warn('No metrics data received');
          setMetrics({
            clientes_ativos: 0,
            agendamentos_proximos: 0,
            receita_periodo: 0,
            servicos_realizados: 0,
            periodo: 'month'
          });
        }
      } catch (err) {
        console.error('Error loading metrics:', err);
        toast.error("Erro ao carregar métricas do dashboard");
        
        // Return default metrics on error
        setMetrics({
          clientes_ativos: 0,
          agendamentos_proximos: 0,
          receita_periodo: 0,
          servicos_realizados: 0,
          periodo: 'month',
          error: err instanceof Error ? err.message : 'Unknown error'
        });
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
