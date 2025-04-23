
import { useState, useEffect } from "react";
import { useAppointments } from "../appointments/useAppointments";
import { isToday, isTomorrow, isAfter, startOfDay, startOfMonth, endOfMonth, format, 
  isSameMonth, subMonths, startOfWeek, endOfWeek, startOfQuarter, endOfQuarter, 
  startOfYear, endOfYear, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentBusiness } from "../useCurrentBusiness";
import { toast } from "sonner";
import { FilterPeriod } from "@/pages/Dashboard";

export interface DashboardStats {
  clientsCount: number;
  todayAppointments: number;
  monthlyRevenue: number;
  monthlyServices: number;
  nextAppointments: any[];
  revenueData: any[];
  popularServices: {
    name: string;
    count: number;
    percentage: number;
  }[];
  occupancyRate: number;
  retentionRate: number;
  newClientsCount: number;
  returningClientsCount: number;
}

export const useDashboardData = (period: FilterPeriod = "month") => {
  const [stats, setStats] = useState<DashboardStats>({
    clientsCount: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    monthlyServices: 0,
    nextAppointments: [],
    revenueData: [],
    popularServices: [],
    occupancyRate: 0,
    retentionRate: 0,
    newClientsCount: 0,
    returningClientsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { appointments, isLoading: appointmentsLoading } = useAppointments();
  const { businessId } = useCurrentBusiness();

  // Função para atualizar os dados
  const refreshData = () => {
    setLoading(true);
    fetchDashboardData();
  };

  // Função que retorna o período de datas baseado no filtro selecionado
  const getDateRange = (periodFilter: FilterPeriod) => {
    const today = new Date();

    switch (periodFilter) {
      case "today":
        return { start: startOfDay(today), end: today };
      case "week":
        return { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) };
      case "month":
        return { start: startOfMonth(today), end: endOfMonth(today) };
      case "quarter":
        return { start: startOfQuarter(today), end: endOfQuarter(today) };
      case "year":
        return { start: startOfYear(today), end: endOfYear(today) };
      default:
        return { start: startOfMonth(today), end: endOfMonth(today) };
    }
  };

  // Função que determina os labels para o gráfico baseado no período
  const getChartLabels = (periodFilter: FilterPeriod) => {
    switch (periodFilter) {
      case "today":
        return ["8h", "10h", "12h", "14h", "16h", "18h"];
      case "week":
        return ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
      case "month":
        // Divide o mês em 6 partes para o gráfico
        return ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];
      case "quarter":
        // Mostra os três meses do trimestre
        const today = new Date();
        const currentMonth = today.getMonth();
        const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
        return [0, 1, 2].map(i => {
          const month = (quarterStartMonth + i) % 12;
          return format(new Date(today.getFullYear(), month, 1), "MMM", { locale: ptBR });
        });
      case "year":
        return ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      default:
        return ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];
    }
  };

  const fetchDashboardData = async () => {
    if (appointmentsLoading) return;

    setLoading(true);
    try {
      // Obtém o intervalo de datas baseado no período selecionado
      const dateRange = getDateRange(period);
      const periodLabels = getChartLabels(period);
      
      // Filtrar agendamentos dentro do período selecionado
      const periodAppts = appointments.filter(app => {
        const appDate = new Date(app.date);
        return appDate >= dateRange.start && appDate <= dateRange.end;
      });
      
      // Agendamentos de hoje
      const todayAppts = appointments.filter(app => isToday(new Date(app.date)));
      
      // Próximos agendamentos (hoje e amanhã)
      const nextAppts = appointments
        .filter(app => {
          const appDate = new Date(app.date);
          return isToday(appDate) || isTomorrow(appDate) || isAfter(appDate, new Date());
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);
      
      // Dados de serviços populares
      const serviceMap = new Map();
      periodAppts.forEach(app => {
        const current = serviceMap.get(app.serviceName) || 0;
        serviceMap.set(app.serviceName, current + 1);
      });
      
      const totalServices = periodAppts.length;
      const popularServices = Array.from(serviceMap.entries())
        .map(([name, count]) => ({
          name,
          count: count as number,
          percentage: totalServices > 0 ? Math.round(((count as number) / totalServices) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);
      
      // Dados financeiros para o gráfico - adaptados ao período
      const revenueData = periodLabels.map((label, index) => {
        // Para simplificar, estamos gerando dados aleatórios
        // Em uma implementação real, esses dados viriam do banco de dados
        const revenueValue = Math.floor(Math.random() * 10000) + 1000;
        return {
          name: label,
          receita: revenueValue,
          despesa: revenueValue * (0.4 + Math.random() * 0.2) // Despesas entre 40% e 60% da receita
        };
      });

      // Obter contagem de clientes
      let clientsCount = 0;
      let newClientsCount = 0;
      let returningClientsCount = 0;
      
      try {
        if (businessId) {
          // Clientes totais
          const { count, error } = await supabase
            .from('clientes')
            .select('id', { count: 'exact', head: true })
            .eq('id_negocio', businessId);
            
          if (!error) {
            clientsCount = count || 0;
          }
          
          // Novos clientes no período
          const { count: newCount, error: newError } = await supabase
            .from('clientes')
            .select('id', { count: 'exact', head: true })
            .eq('id_negocio', businessId)
            .gte('criado_em', dateRange.start.toISOString())
            .lte('criado_em', dateRange.end.toISOString());
            
          if (!newError) {
            newClientsCount = newCount || 0;
          }
          
          // Clientes retornando (com agendamentos no período)
          const clientIds = new Set(periodAppts.map(app => app.clientId));
          returningClientsCount = clientIds.size;
        }
      } catch (err) {
        console.warn("Erro ao obter contagem de clientes:", err);
        // Usa os dados dos agendamentos como fallback
        const clientIds = new Set(periodAppts.map(app => app.clientId));
        clientsCount = clientIds.size;
        newClientsCount = Math.round(clientsCount * 0.2); // Estimativa 
        returningClientsCount = clientsCount - newClientsCount;
      }
      
      // Calcular taxa de retenção estimada
      const retentionRate = clientsCount > 0 
        ? Math.round((returningClientsCount / clientsCount) * 100) 
        : 0;
      
      // Calcular taxa de ocupação estimada
      // Quantidade de horas agendadas / quantidade total de horas disponíveis
      const totalBookedHours = periodAppts.reduce((sum, app) => sum + (app.duration / 60), 0);
      const businessHours = 8; // 8 horas por dia
      const workingDays = period === "today" ? 1 : 
                         period === "week" ? 5 : 
                         period === "month" ? 22 : 
                         period === "quarter" ? 66 : 
                         period === "year" ? 264 : 22;
      
      const totalAvailableHours = businessHours * workingDays;
      const occupancyRate = Math.min(100, Math.round((totalBookedHours / totalAvailableHours) * 100));
      
      // Atualizar estatísticas
      setStats({
        clientsCount,
        todayAppointments: todayAppts.length,
        monthlyRevenue: periodAppts.reduce((sum, app) => sum + app.price, 0),
        monthlyServices: periodAppts.length,
        nextAppointments: nextAppts,
        revenueData,
        popularServices,
        occupancyRate,
        retentionRate,
        newClientsCount,
        returningClientsCount
      });
    } catch (err: any) {
      console.error("Erro ao carregar dados do dashboard:", err);
      setError(err.message || "Erro ao carregar dados do dashboard");
      toast.error("Falha ao carregar estatísticas do dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [appointments, appointmentsLoading, businessId, period]);

  return {
    stats,
    loading: loading || appointmentsLoading,
    error,
    refreshData
  };
};
