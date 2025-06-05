
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "../charts/RevenueChart";
import { SalesDistributionChart } from "../charts/SalesDistributionChart";
import { PaymentMethodsChart } from "../charts/PaymentMethodsChart";
import { FinancialSummarySection } from "../sections/FinancialSummarySection";
import { ReportStatistics } from "@/hooks/reports/useReportsData";

interface FinancialReportsProps {
  dateRange: string;
  stats: ReportStatistics;
}

export function FinancialReports({ dateRange, stats }: FinancialReportsProps) {
  // Mock payment methods data based on stats
  const paymentMethodsData = [
    { method: 'Cartão de Crédito', count: Math.floor(stats.totalAppointments * 0.4), percentage: 40 },
    { method: 'PIX', count: Math.floor(stats.totalAppointments * 0.3), percentage: 30 },
    { method: 'Dinheiro', count: Math.floor(stats.totalAppointments * 0.2), percentage: 20 },
    { method: 'Cartão de Débito', count: Math.floor(stats.totalAppointments * 0.1), percentage: 10 },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
          <CardDescription>Visão geral das suas finanças no período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialSummarySection dateRange={dateRange} stats={stats} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Receitas</CardTitle>
          <CardDescription>Receitas nos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueChart dateRange={dateRange} stats={stats} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Vendas</CardTitle>
          <CardDescription>Por categoria de serviço</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesDistributionChart dateRange={dateRange} />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Métodos de Pagamento</CardTitle>
          <CardDescription>Distribuição por forma de pagamento</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentMethodsChart data={paymentMethodsData} />
        </CardContent>
      </Card>
    </div>
  );
}
