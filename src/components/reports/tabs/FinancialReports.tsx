
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "../charts/RevenueChart";
import { SalesDistributionChart } from "../charts/SalesDistributionChart";
import { PaymentMethodsChart } from "../charts/PaymentMethodsChart";
import { FinancialSummarySection } from "../sections/FinancialSummarySection";

interface FinancialReportsProps {
  dateRange: string;
}

export function FinancialReports({ dateRange }: FinancialReportsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
          <CardDescription>Visão geral das suas finanças nos últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialSummarySection dateRange={dateRange} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Receitas</CardTitle>
          <CardDescription>Receitas nos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueChart dateRange={dateRange} />
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
          <PaymentMethodsChart dateRange={dateRange} />
        </CardContent>
      </Card>
    </div>
  );
}
