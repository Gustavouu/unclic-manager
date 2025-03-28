
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, CreditCard, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const FinanceStats = () => {
  // In a real app, this data would come from a hook or API
  // For this example, we'll use dummy data
  const totalRevenue = 5280.75;
  const revenueToday = 620.50;
  const pendingPayments = 850.25;
  const scheduledPayments = 1240.00;

  // Format dates for display
  const today = new Date();
  const formattedToday = format(today, "dd 'de' MMMM", { locale: ptBR });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard 
        title="Receita Total"
        value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        icon={<DollarSign size={20} className="text-green-500" />}
        description={formattedToday}
        trending="up"
      />
      
      <StatsCard 
        title="Receita Hoje"
        value={`R$ ${revenueToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        icon={<TrendingUp size={20} className="text-blue-500" />}
        description={formattedToday}
        trending={revenueToday > 500 ? "up" : "neutral"}
      />
      
      <StatsCard 
        title="Pagamentos Pendentes"
        value={`R$ ${pendingPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        icon={<CreditCard size={20} className="text-amber-500" />}
        description="A receber"
        trending={pendingPayments > 1000 ? "down" : "neutral"}
      />
      
      <StatsCard 
        title="Pagamentos Agendados"
        value={`R$ ${scheduledPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        icon={<Calendar size={20} className="text-purple-500" />}
        description="Próximos 7 dias"
        trending="neutral"
      />
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trending: "up" | "down" | "neutral";
}

const StatsCard = ({ title, value, icon, description, trending }: StatsCardProps) => {
  return (
    <Card className="border-l-4 border-l-blue-600">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="bg-blue-50 p-2 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
