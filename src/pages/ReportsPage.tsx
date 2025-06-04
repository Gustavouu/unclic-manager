import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Star
} from 'lucide-react';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

type PeriodType = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

interface MetricCard {
  title: string;
  value: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
}

const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Mock data - em produção viria da API
  const metricsData: MetricCard[] = [
    {
      title: 'Receita Total',
      value: 'R$ 32.580,00',
      change: { value: 12, type: 'increase' },
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      title: 'Agendamentos',
      value: '248',
      change: { value: 8, type: 'increase' },
      icon: <Clock className="h-4 w-4" />
    },
    {
      title: 'Novos Clientes',
      value: '35',
      change: { value: 5, type: 'decrease' },
      icon: <Users className="h-4 w-4" />
    },
    {
      title: 'Avaliação Média',
      value: '4.8',
      change: { value: 2, type: 'increase' },
      icon: <Star className="h-4 w-4" />
    }
  ];

  const revenueData = [
    { month: 'Jan', value: 4200 },
    { month: 'Fev', value: 3800 },
    { month: 'Mar', value: 5100 },
    { month: 'Abr', value: 4700 },
    { month: 'Mai', value: 6200 },
    { month: 'Jun', value: 5800 },
  ];

  const topServices = [
    { name: 'Corte Masculino', count: 85, revenue: 'R$ 4.250,00' },
    { name: 'Barba', count: 62, revenue: 'R$ 1.860,00' },
    { name: 'Corte + Barba', count: 43, revenue: 'R$ 2.580,00' },
    { name: 'Coloração', count: 28, revenue: 'R$ 3.360,00' },
  ];

  const topProfessionals = [
    { name: 'João Silva', appointments: 45, revenue: 'R$ 2.250,00', rating: 4.9 },
    { name: 'Maria Santos', appointments: 38, revenue: 'R$ 3.040,00', rating: 4.8 },
    { name: 'Pedro Costa', appointments: 30, revenue: 'R$ 1.500,00', rating: 4.7 },
  ];

  const handleExport = (format: 'excel' | 'pdf') => {
    console.log(`Exporting report as ${format}`);
    // Implementar exportação
  };

  const formatPeriodLabel = (period: PeriodType) => {
    const labels = {
      today: 'Hoje',
      week: 'Esta semana',
      month: 'Este mês',
      quarter: 'Este trimestre',
      year: 'Este ano',
      custom: 'Personalizado'
    };
    return labels[period];
  };

  return (
    <OnboardingRedirect>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Análise detalhada do seu negócio</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as PeriodType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="quarter">Este trimestre</SelectItem>
                <SelectItem value="year">Este ano</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            {selectedPeriod === 'custom' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                      )
                    ) : (
                      <span>Selecionar período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}

            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metricsData.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.change && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    {metric.change.type === 'increase' ? (
                      <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                    )}
                    <span className={metric.change.type === 'increase' ? 'text-green-600' : 'text-red-600'}>
                      {metric.change.value}%
                    </span>
                    <span className="ml-1">vs período anterior</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Reports */}
        <Tabs defaultValue="financial" className="space-y-4">
          <TabsList>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="professionals">Profissionais</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Receita por Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {revenueData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.month}</span>
                        <span className="font-medium">R$ {item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métodos de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cartão de Crédito</span>
                      <Badge variant="secondary">45%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">PIX</span>
                      <Badge variant="secondary">30%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dinheiro</span>
                      <Badge variant="secondary">15%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cartão de Débito</span>
                      <Badge variant="secondary">10%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Serviços Mais Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topServices.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.count} agendamentos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{service.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professionals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho dos Profissionais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProfessionals.map((professional, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {professional.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-medium">{professional.name}</h4>
                          <p className="text-sm text-gray-600">{professional.appointments} agendamentos</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{professional.revenue}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{professional.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total de Clientes</span>
                      <span className="font-medium">245</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Novos este mês</span>
                      <span className="font-medium">35</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de Retenção</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ticket Médio</span>
                      <span className="font-medium">R$ 85,00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequência de Visitas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>1 vez</span>
                      <Badge variant="outline">25%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>2-3 vezes</span>
                      <Badge variant="outline">35%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>4-6 vezes</span>
                      <Badge variant="outline">25%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>7+ vezes</span>
                      <Badge variant="outline">15%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OnboardingRedirect>
  );
};

export default ReportsPage;
