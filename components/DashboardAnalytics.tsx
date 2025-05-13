import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useDashboardData, DateRange } from '@/hooks/useDashboardData';
import { 
  Bar, 
  BarChart, 
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis 
} from "recharts";
import { Download, RefreshCw, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

export function DashboardAnalytics() {
  const { 
    metrics, 
    isLoading, 
    dateRange, 
    updateDateRange,
    refreshData,
    exportDataToCSV
  } = useDashboardData();
  
  const [currentView, setCurrentView] = useState('overview');

  // Formatador de moeda para valores em Reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Manipulador para alteração de período
  const handleDateRangeChange = (range: {from: Date, to: Date}) => {
    updateDateRange({
      from: range.from.toISOString().split('T')[0],
      to: range.to.toISOString().split('T')[0]
    });
  };

  // Cores para gráficos
  const chartColors = {
    primary: "#2563eb",
    secondary: "#16a34a",
    tertiary: "#ef4444",
    background: "#f3f4f6"
  };

  // Renderizador condicional para o estado de carregamento
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Carregando métricas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Dashboard Analítico</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <DateRangePicker
            value={{
              from: new Date(dateRange.from),
              to: new Date(dateRange.to)
            }}
            onChange={handleDateRangeChange}
          />
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={refreshData}
              title="Atualizar dados"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              onClick={exportDataToCSV}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={currentView} onValueChange={setCurrentView}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="schedule">Horários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {metrics ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Agendamentos
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.total_agendamentos}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Taxa de Cancelamento: {metrics.taxa_cancelamento.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Vendas
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(metrics.total_vendas)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ticket Médio: {formatCurrency(metrics.ticket_medio)}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Novos Clientes
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.novos_clientes}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Tendência
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{Math.round(metrics.total_agendamentos / 30)}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Crescimento nos agendamentos
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="services">
          {metrics && metrics.servicos_populares.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Serviços Mais Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={metrics.servicos_populares}
                      margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
                    >
                      <XAxis 
                        dataKey="servico" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} agendamentos`, 'Total']}
                      />
                      <Bar 
                        dataKey="total" 
                        fill={chartColors.primary} 
                        name="Total de Agendamentos" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Nenhum dado de serviço disponível para o período selecionado</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="schedule">
          {metrics && metrics.horarios_pico.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Horários de Pico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={metrics.horarios_pico.sort((a, b) => a.hora - b.hora)}
                      margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                    >
                      <XAxis 
                        dataKey="hora" 
                        tickFormatter={(hora) => `${hora}:00`} 
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} agendamentos`, 'Total']}
                        labelFormatter={(hora) => `${hora}:00`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke={chartColors.secondary} 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        name="Agendamentos" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Nenhum dado de horário disponível para o período selecionado</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
