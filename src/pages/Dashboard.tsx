
import { Users, Calendar, DollarSign, Scissors, BarChart2, ShoppingBag } from "lucide-react";
import { StatsCard } from "@/components/common/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { formatCurrency } from "@/lib/format";
import { NextAppointments } from "@/components/dashboard/NextAppointments";
import { PopularServices } from "@/components/dashboard/PopularServices";
import { FinancialChart } from "@/components/dashboard/FinancialChart";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { useEffect } from "react";

const Dashboard = () => {
  const { stats, loading, error } = useDashboardData();
  const { businessId, loading: businessLoading, error: businessError } = useCurrentBusiness();
  
  useEffect(() => {
    // Apenas para log de debug
    console.log("Dashboard stats:", stats);
    console.log("Business ID:", businessId);
  }, [stats, businessId]);
  
  if (businessLoading || loading) {
    return <DashboardSkeleton />;
  }
  
  if (businessError || error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="text-xl font-semibold text-red-500">Erro ao carregar dados</div>
        <p className="text-muted-foreground text-center max-w-md">
          Não foi possível carregar os dados do seu negócio. Tente novamente mais tarde.
        </p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="text-xl font-semibold">Bem-vindo ao Sistema</div>
        <p className="text-muted-foreground text-center max-w-md">
          Para começar, você precisa configurar seu negócio. Acesse as configurações ou complete o processo de onboarding.
        </p>
        <div className="flex gap-2">
          <Button 
            onClick={() => window.location.href = "/onboarding"}
          >
            Iniciar configuração
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = "/settings"}
          >
            Ir para configurações
          </Button>
        </div>
      </div>
    );
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
          <CardContent className="p-4">
            <NextAppointments 
              appointments={stats.nextAppointments} 
              isLoading={loading} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-display">Movimentação Financeira</CardTitle>
            <CardDescription>Visão geral das receitas recentes</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <FinancialChart data={stats.revenueData} />
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
            <PopularServices services={stats.popularServices} />
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
