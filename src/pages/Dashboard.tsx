import { useState, useEffect } from "react";
import { Users, Calendar, DollarSign, Scissors, BarChart2, ShoppingBag } from "lucide-react";
import { StatsCard } from "@/components/common/StatsCard";
import { AppointmentCalendar } from "@/components/dashboard/Calendar";
import { FinancialChart } from "@/components/dashboard/FinancialChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { businessId, loading: businessLoading } = useCurrentBusiness();
  const [stats, setStats] = useState({
    clientsCount: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    monthlyServices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!businessId) return;
      
      setLoading(true);
      try {
        // Obter contagem de clientes
        const { count: clientsCount, error: clientsError } = await supabase
          .from('clientes')
          .select('*', { count: 'exact', head: true })
          .eq('id_negocio', businessId);
          
        if (clientsError) throw clientsError;
        
        // Obter agendamentos de hoje
        const today = new Date().toISOString().split('T')[0];
        const { count: appointmentsCount, error: appointmentsError } = await supabase
          .from('agendamentos')
          .select('*', { count: 'exact', head: true })
          .eq('id_negocio', businessId)
          .eq('data', today);
          
        if (appointmentsError) throw appointmentsError;
        
        // Obter faturamento do mês atual
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const startOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
        const endOfMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];
        
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transacoes')
          .select('valor')
          .eq('id_negocio', businessId)
          .eq('tipo', 'receita')
          .gte('data_pagamento', startOfMonth)
          .lte('data_pagamento', endOfMonth);
          
        if (transactionsError) throw transactionsError;
        
        const monthlyRevenue = transactionsData.reduce((sum, transaction) => sum + transaction.valor, 0);
        
        // Obter quantidade de serviços realizados no mês
        const { count: servicesCount, error: servicesError } = await supabase
          .from('agendamentos')
          .select('*', { count: 'exact', head: true })
          .eq('id_negocio', businessId)
          .eq('status', 'concluido')
          .gte('data', startOfMonth)
          .lte('data', endOfMonth);
          
        if (servicesError) throw servicesError;
        
        setStats({
          clientsCount: clientsCount || 0,
          todayAppointments: appointmentsCount || 0,
          monthlyRevenue: monthlyRevenue,
          monthlyServices: servicesCount || 0
        });
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (businessId) {
      fetchDashboardData();
    }
  }, [businessId]);
  
  // Formatação dos valores
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  if (businessLoading || loading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-display font-bold">Bem-vindo ao Painel</h1>
        <p className="text-muted-foreground">Confira o resumo do seu estabelecimento.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Clientes"
          value={stats.clientsCount.toString()}
          description="Clientes cadastrados"
          icon={<Users size={18} />}
          iconColor="bg-blue-50 text-blue-500"
          borderColor="border-l-blue-600"
        />
        
        <StatsCard
          title="Agendamentos Hoje"
          value={stats.todayAppointments.toString()}
          description="Horários marcados"
          icon={<Calendar size={18} />}
          iconColor="bg-indigo-50 text-indigo-500"
          borderColor="border-l-indigo-600"
        />
        
        <StatsCard
          title="Faturamento Mensal"
          value={formatCurrency(stats.monthlyRevenue)}
          description="Mês atual"
          icon={<DollarSign size={18} />}
          iconColor="bg-green-50 text-green-500"
          borderColor="border-l-green-600"
        />
        
        <StatsCard
          title="Serviços Realizados"
          value={stats.monthlyServices.toString()}
          description="Este mês"
          icon={<Scissors size={18} />}
          iconColor="bg-amber-50 text-amber-500"
          borderColor="border-l-amber-600"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-display">Próximos Agendamentos</CardTitle>
            <CardDescription>Clientes agendados para hoje e amanhã</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <AppointmentCalendar businessId={businessId} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-display">Movimentação Financeira</CardTitle>
            <CardDescription>Visão geral das receitas recentes</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <FinancialChart businessId={businessId} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-display">Serviços Mais Populares</CardTitle>
            <CardDescription>Os serviços mais procurados este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Corte Masculino", count: 38, percentage: 40 },
                { name: "Coloração", count: 24, percentage: 25 },
                { name: "Manicure", count: 18, percentage: 20 },
                { name: "Barba", count: 13, percentage: 15 },
              ].map((service) => (
                <div key={service.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{service.name}</span>
                    <span className="text-sm text-muted-foreground">{service.count} agendamentos</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Próximas Tarefas</CardTitle>
            <CardDescription>Prioridades para hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Confirmar agendamentos", icon: <Calendar size={16} /> },
                { title: "Inventário produtos", icon: <ShoppingBag size={16} /> },
                { title: "Revisar financeiro", icon: <DollarSign size={16} /> },
                { title: "Análise semanal", icon: <BarChart2 size={16} /> },
              ].map((task, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                  <div className="bg-primary/10 text-primary p-2 rounded-md">
                    {task.icon}
                  </div>
                  <span>{task.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente de skeleton para o carregamento
const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Skeleton className="h-64 w-full lg:col-span-2" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
};

export default Dashboard;
