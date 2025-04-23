
import { useState, useEffect } from "react";
import { useAppointments } from "../appointments/useAppointments";
import { isToday, isTomorrow, isAfter, startOfDay, startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentBusiness } from "../useCurrentBusiness";
import { toast } from "sonner";

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
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    clientsCount: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    monthlyServices: 0,
    nextAppointments: [],
    revenueData: [],
    popularServices: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { appointments, isLoading: appointmentsLoading } = useAppointments();
  const { businessId } = useCurrentBusiness();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (appointmentsLoading) return;

      setLoading(true);
      try {
        // Filtrar agendamentos de hoje
        const today = startOfDay(new Date());
        const todayAppts = appointments.filter(app => isToday(new Date(app.date)));
        
        // Próximos agendamentos (hoje e amanhã)
        const nextAppts = appointments
          .filter(app => {
            const appDate = new Date(app.date);
            return isToday(appDate) || isTomorrow(appDate) || isAfter(appDate, today);
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5);
          
        // Agendamentos do mês
        const currentMonth = new Date();
        const startMonth = startOfMonth(currentMonth);
        const endMonth = endOfMonth(currentMonth);
        const monthAppts = appointments.filter(app => {
          const appDate = new Date(app.date);
          return appDate >= startMonth && appDate <= endMonth;
        });
        
        // Dados de serviços populares
        const serviceMap = new Map();
        appointments.forEach(app => {
          const current = serviceMap.get(app.serviceName) || 0;
          serviceMap.set(app.serviceName, current + 1);
        });
        
        const totalServices = appointments.length;
        const popularServices = Array.from(serviceMap.entries())
          .map(([name, count]) => ({
            name,
            count: count as number,
            percentage: totalServices > 0 ? Math.round(((count as number) / totalServices) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);
        
        // Dados financeiros para o gráfico
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const revenueData = monthNames.map(month => {
          const value = Math.floor(Math.random() * 10000) + 1000;
          return {
            name: month,
            receita: value,
            despesa: value * 0.6
          };
        });

        // Obter contagem de clientes (tenta fazer a consulta, mas usa valor padrão em caso de erro)
        let clientsCount = 0;
        try {
          if (businessId) {
            const { count, error } = await supabase
              .from('clientes')
              .select('id', { count: 'exact', head: true })
              .eq('id_negocio', businessId);
              
            if (!error) {
              clientsCount = count || 0;
            }
          }
        } catch (err) {
          console.warn("Erro ao obter contagem de clientes:", err);
          // Usa um valor padrão caso não consiga obter do banco de dados
          clientsCount = nextAppts.filter((app, index, self) => 
            self.findIndex(a => a.clientId === app.clientId) === index
          ).length;
        }
        
        // Calcular receita mensal
        const monthlyRevenue = monthAppts.reduce((sum, app) => sum + app.price, 0);

        setStats({
          clientsCount,
          todayAppointments: todayAppts.length,
          monthlyRevenue,
          monthlyServices: monthAppts.length,
          nextAppointments: nextAppts,
          revenueData,
          popularServices
        });
      } catch (err: any) {
        console.error("Erro ao carregar dados do dashboard:", err);
        setError(err.message || "Erro ao carregar dados do dashboard");
        toast.error("Falha ao carregar estatísticas do dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [appointments, appointmentsLoading, businessId]);

  return {
    stats,
    loading: loading || appointmentsLoading,
    error
  };
};
