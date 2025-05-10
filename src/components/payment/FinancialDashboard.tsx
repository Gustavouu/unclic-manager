
import React, { useState } from 'react';
import { useFinancialMetrics } from '@/hooks/payment/useFinancialMetrics';
import { usePlans } from '@/hooks/payment/usePlans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, RefreshCw, Plus, BarChart as BarChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/financialCalculations';
import { RevenueBarChart } from '@/components/ui/chart/RevenueBarChart';
import { RevenueLineChart } from '@/components/ui/chart/RevenueLineChart';

const dateRangeOptions = [
  { value: '30', label: 'Últimos 30 Dias' },
  { value: '90', label: 'Últimos 90 Dias' },
  { value: '180', label: 'Últimos 180 Dias' },
  { value: '365', label: 'Último Ano' },
];

export const FinancialDashboard = () => {
  const [dateRange, setDateRange] = useState('180');
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  
  // Calculate date range
  const calculateDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - parseInt(dateRange));
    return { start, end };
  };
  
  const { 
    metrics, 
    revenueChartData, 
    isLoading, 
    error, 
    refreshMetrics 
  } = useFinancialMetrics(calculateDateRange());
  
  const { plans } = usePlans();

  const handleRefresh = () => {
    refreshMetrics();
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log('Export data');
  };

  const toggleChartType = () => {
    setChartType(prev => prev === 'bar' ? 'line' : 'bar');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel Financeiro</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho do seu negócio e métricas financeiras principais
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={dateRange}
            onValueChange={(value) => setDateRange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button size="icon" variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Receita Mensal Recorrente"
          value={metrics?.mrr ?? 0}
          description="MRR atual"
          loading={isLoading}
          format="currency"
        />
        <MetricCard 
          title="Receita Anual Recorrente"
          value={metrics?.arr ?? 0}
          description="ARR atual"
          loading={isLoading}
          format="currency"
        />
        <MetricCard 
          title="Assinaturas Ativas"
          value={metrics?.activeSubscriptions ?? 0}
          description="Total de assinantes ativos"
          loading={isLoading}
          format="number"
        />
        <MetricCard 
          title="Valor Vitalício do Cliente"
          value={metrics?.customerLifetimeValue ?? 0}
          description="Média CLV"
          loading={isLoading}
          format="currency"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Crescimento de Receita</CardTitle>
                  <CardDescription>Receita mensal ao longo do tempo</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleChartType}>
                  {chartType === 'bar' ? <LineChartIcon className="h-4 w-4" /> : <BarChartIcon className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="w-full h-[300px]" />
                ) : (
                  chartType === 'bar' ? (
                    <RevenueBarChart 
                      data={revenueChartData} 
                      className="w-full h-[300px]"
                      showSubscriptions={false}
                    />
                  ) : (
                    <RevenueLineChart 
                      data={revenueChartData}
                      className="w-full h-[300px]"
                      showSubscriptions={false}
                    />
                  )
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Assinaturas</CardTitle>
                <CardDescription>Total de assinaturas ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="w-full h-[300px]" />
                ) : (
                  <RevenueLineChart 
                    data={revenueChartData}
                    className="w-full h-[300px]"
                    showSubscriptions={true}
                  />
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Indicadores de Desempenho</CardTitle>
                <CardDescription>Métricas de saúde do negócio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Taxa de Conversão</Label>
                    <p className="text-2xl font-bold">
                      {isLoading ? <Skeleton className="h-8 w-16" /> : `${metrics?.conversionRate.toFixed(1)}%`}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Taxa de Cancelamento</Label>
                    <p className="text-2xl font-bold">
                      {isLoading ? <Skeleton className="h-8 w-16" /> : `${metrics?.churnRate.toFixed(1)}%`}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Receita por Usuário</Label>
                    <p className="text-2xl font-bold">
                      {isLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        formatCurrency(metrics?.avgRevenuePerCustomer ?? 0)
                      )}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Receita Total</Label>
                    <p className="text-2xl font-bold">
                      {isLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        formatCurrency(metrics?.totalRevenue ?? 0)
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="subscriptions" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Assinaturas</CardTitle>
              <CardDescription>Métricas detalhadas de assinatura</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                O conteúdo de análise de assinaturas será exibido aqui
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Planos de Assinatura</CardTitle>
                <CardDescription>Gerencie suas ofertas de assinatura</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Plano
              </Button>
            </CardHeader>
            <CardContent>
              {plans.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Nenhum plano de assinatura encontrado</p>
                  <Button>Criar seu primeiro plano</Button>
                </div>
              ) : (
                <div className="border rounded-md divide-y">
                  {plans.map((plan) => (
                    <div key={plan.id} className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {plan.interval_count > 1 ? `${plan.interval_count} ${plan.interval}s` : plan.interval}
                          </span>
                          <span className={`text-sm px-2 py-0.5 rounded ${
                            plan.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {plan.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(plan.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  loading: boolean;
  format: 'currency' | 'number' | 'percent';
}

const MetricCard = ({ title, value, description, loading, format }: MetricCardProps) => {
  const formattedValue = () => {
    if (loading) return <Skeleton className="h-8 w-20" />;
    
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percent':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue()}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FinancialDashboard;
