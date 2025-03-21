
import { Users, Calendar, DollarSign, Scissors, BarChart2, ShoppingBag } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppointmentCalendar } from "@/components/dashboard/Calendar";
import { FinancialChart } from "@/components/dashboard/FinancialChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-display font-bold">Bem-vindo ao Painel</h1>
        <p className="text-muted-foreground">Confira o resumo do seu estabelecimento.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total de Clientes"
          value="128"
          subtitle="Clientes cadastrados"
          icon={<Users size={18} />}
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatCard
          title="Agendamentos Hoje"
          value="8"
          subtitle="Horários marcados"
          icon={<Calendar size={18} />}
          iconClassName="bg-blue-50 text-blue-600"
        />
        
        <StatCard
          title="Faturamento Mensal"
          value="R$ 8.459,00"
          subtitle="Mês atual"
          icon={<DollarSign size={18} />}
          trend={{ value: 8, isPositive: true }}
          iconClassName="bg-green-50 text-green-600"
        />
        
        <StatCard
          title="Serviços Realizados"
          value="93"
          subtitle="Este mês"
          icon={<Scissors size={18} />}
          trend={{ value: 4, isPositive: true }}
          iconClassName="bg-amber-50 text-amber-600"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-display">Próximos Agendamentos</CardTitle>
            <CardDescription>Clientes agendados para hoje e amanhã</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <AppointmentCalendar />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-display">Movimentação Financeira</CardTitle>
            <CardDescription>Visão geral das receitas recentes</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <FinancialChart />
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

export default Dashboard;
