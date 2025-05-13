import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

export type DashboardMetrics = {
  total_agendamentos: number;
  total_vendas: number;
  ticket_medio: number;
  taxa_cancelamento: number;
  novos_clientes: number;
  servicos_populares: Array<{servico: string, total: number}>;
  horarios_pico: Array<{hora: number, total: number}>;
};

export type DateRange = {
  from: string;
  to: string;
};

export function useDashboardData() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('obter_metricas_periodo', {
        p_tenant_id: localStorage.getItem('tenant_id'),
        p_data_inicio: dateRange.from,
        p_data_fim: dateRange.to
      });

      if (error) throw error;

      // Processar dados para o formato esperado
      const metrics: DashboardMetrics = {
        total_agendamentos: data.reduce((sum, item) => sum + item.total_agendamentos, 0),
        total_vendas: data.reduce((sum, item) => sum + Number(item.total_vendas), 0),
        ticket_medio: data.length > 0 ? 
          data.reduce((sum, item) => sum + Number(item.ticket_medio), 0) / data.length : 0,
        taxa_cancelamento: data.length > 0 ? 
          data.reduce((sum, item) => sum + Number(item.taxa_cancelamento), 0) / data.length : 0,
        novos_clientes: data.reduce((sum, item) => sum + item.novos_clientes, 0),
        servicos_populares: aggregateServices(data),
        horarios_pico: aggregateHours(data)
      };

      setMetrics(metrics);
    } catch (error: any) {
      console.error('Erro ao buscar dados do dashboard:', error);
      setError(error.message);
      toast({
        title: "Erro ao carregar métricas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar serviços populares de todos os dias
  const aggregateServices = (data: any[]): Array<{servico: string, total: number}> => {
    const services: Record<string, number> = {};
    
    data.forEach(day => {
      if (day.servicos_populares) {
        day.servicos_populares.forEach((service: {servico: string, total: number}) => {
          services[service.servico] = (services[service.servico] || 0) + service.total;
        });
      }
    });
    
    return Object.entries(services)
      .map(([servico, total]) => ({ servico, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  // Agregar horários de pico de todos os dias
  const aggregateHours = (data: any[]): Array<{hora: number, total: number}> => {
    const hours: Record<number, number> = {};
    
    data.forEach(day => {
      if (day.horarios_pico) {
        day.horarios_pico.forEach((hour: {hora: number, total: number}) => {
          hours[hour.hora] = (hours[hour.hora] || 0) + hour.total;
        });
      }
    });
    
    return Object.entries(hours)
      .map(([hora, total]) => ({ hora: parseInt(hora), total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  // Atualizar o período
  const updateDateRange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  // Exportar dados para CSV
  const exportDataToCSV = () => {
    if (!metrics) return;
    
    // Preparar cabeçalhos e dados
    const headers = ['Métrica', 'Valor'];
    const rows = [
      ['Total de Agendamentos', metrics.total_agendamentos],
      ['Total de Vendas (R$)', metrics.total_vendas],
      ['Ticket Médio (R$)', metrics.ticket_medio],
      ['Taxa de Cancelamento (%)', metrics.taxa_cancelamento],
      ['Novos Clientes', metrics.novos_clientes],
    ];
    
    // Adicionar serviços populares
    rows.push(['', '']);
    rows.push(['Serviços Populares', 'Total']);
    metrics.servicos_populares.forEach(service => {
      rows.push([service.servico, service.total]);
    });
    
    // Adicionar horários de pico
    rows.push(['', '']);
    rows.push(['Horários de Pico', 'Total']);
    metrics.horarios_pico.forEach(hour => {
      rows.push([`${hour.hora}:00`, hour.total]);
    });
    
    // Converter para CSV
    const csvContent = 
      'data:text/csv;charset=utf-8,' + 
      rows.map(row => row.join(',')).join('\n');
    
    // Fazer o download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dashboard_${dateRange.from}_to_${dateRange.to}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Buscar dados quando o componente monta ou o período muda
  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  return {
    metrics,
    isLoading,
    error,
    dateRange,
    updateDateRange,
    refreshData: fetchDashboardData,
    exportDataToCSV
  };
}
