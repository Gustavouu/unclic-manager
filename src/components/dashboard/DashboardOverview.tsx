
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Calendar, DollarSign, TrendingUp, 
  BarChart3, Percent, Clock, CheckCircle 
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { Skeleton } from '@/components/ui/skeleton';

type DashboardMetric = {
  label: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend?: number;
  color?: string;
};

export function DashboardOverview() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { businessId } = useTenant();
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      if (!businessId) {
        console.log('No business ID available');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Try to use our new RPC function
        const { data, error } = await supabase
          .rpc('obter_metricas_periodo', {
            business_id_param: businessId,
            periodo: period
          });
        
        if (error) {
          console.error('Error fetching dashboard metrics:', error);
          // Fallback to default metrics
          setDefaultMetrics();
          return;
        }
        
        console.log('Dashboard metrics:', data);
        
        // Format the metrics for display
        const formattedMetrics: DashboardMetric[] = [
          {
            label: "Clientes Ativos",
            value: formatNumber(data?.clientes_ativos || 0),
            icon: <Users className="h-4 w-4" />,
            description: "Total de clientes",
            color: "bg-blue-500/10 text-blue-500",
          },
          {
            label: "Agendamentos Próximos",
            value: formatNumber(data?.agendamentos_proximos || 0),
            icon: <Calendar className="h-4 w-4" />,
            description: "Agendamentos futuros",
            color: "bg-indigo-500/10 text-indigo-500",
          },
          {
            label: "Receita",
            value: formatCurrency(data?.receita_periodo || 0),
            icon: <DollarSign className="h-4 w-4" />,
            description: getPeriodDescription(period),
            color: "bg-green-500/10 text-green-500",
          },
          {
            label: "Serviços Realizados",
            value: formatNumber(data?.servicos_realizados || 0),
            icon: <CheckCircle className="h-4 w-4" />,
            description: getPeriodDescription(period),
            color: "bg-amber-500/10 text-amber-500",
          },
        ];

        setMetrics(formattedMetrics);
      } catch (error) {
        console.error('Error in fetchDashboardMetrics:', error);
        // Fallback to default metrics
        setDefaultMetrics();
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, [businessId, period]);

  const setDefaultMetrics = () => {
    setMetrics([
      {
        label: "Clientes Ativos",
        value: "0",
        icon: <Users className="h-4 w-4" />,
        description: "Total de clientes",
        color: "bg-blue-500/10 text-blue-500",
      },
      {
        label: "Agendamentos Próximos",
        value: "0",
        icon: <Calendar className="h-4 w-4" />,
        description: "Agendamentos futuros",
        color: "bg-indigo-500/10 text-indigo-500",
      },
      {
        label: "Receita",
        value: "R$ 0,00",
        icon: <DollarSign className="h-4 w-4" />,
        description: getPeriodDescription(period),
        color: "bg-green-500/10 text-green-500",
      },
      {
        label: "Serviços Realizados",
        value: "0",
        icon: <CheckCircle className="h-4 w-4" />,
        description: getPeriodDescription(period),
        color: "bg-amber-500/10 text-amber-500",
      },
    ]);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getPeriodDescription = (period: string): string => {
    switch (period) {
      case 'today':
        return 'Hoje';
      case 'week':
        return 'Esta semana';
      case 'year':
        return 'Este ano';
      case 'month':
      default:
        return 'Este mês';
    }
  };

  const handlePeriodChange = (newPeriod: 'today' | 'week' | 'month' | 'year') => {
    setPeriod(newPeriod);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Visão Geral</h2>
        <div className="flex space-x-1">
          <button 
            onClick={() => handlePeriodChange('today')}
            className={`px-2 py-1 text-xs rounded-md ${period === 'today' ? 'bg-primary text-white' : 'bg-muted'}`}
          >
            Hoje
          </button>
          <button 
            onClick={() => handlePeriodChange('week')}
            className={`px-2 py-1 text-xs rounded-md ${period === 'week' ? 'bg-primary text-white' : 'bg-muted'}`}
          >
            Semana
          </button>
          <button 
            onClick={() => handlePeriodChange('month')}
            className={`px-2 py-1 text-xs rounded-md ${period === 'month' ? 'bg-primary text-white' : 'bg-muted'}`}
          >
            Mês
          </button>
          <button 
            onClick={() => handlePeriodChange('year')}
            className={`px-2 py-1 text-xs rounded-md ${period === 'year' ? 'bg-primary text-white' : 'bg-muted'}`}
          >
            Ano
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          // Skeleton loaders while data is loading
          [...Array(4)].map((_, i) => (
            <Card key={`skeleton-${i}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Skeleton className="h-8 w-16" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <Skeleton className="h-3 w-20" />
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          // Actual metric cards
          metrics.map((metric, index) => (
            <Card key={`metric-${index}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <div className={`p-1 rounded mr-2 ${metric.color}`}>
                    {metric.icon}
                  </div>
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                  {metric.trend !== undefined && (
                    <span className={`ml-2 ${metric.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.trend >= 0 ? '+' : ''}{metric.trend}%
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
