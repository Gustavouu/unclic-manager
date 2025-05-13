
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, DollarSign, Users, Star, BarChart3, TrendingUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

interface DashboardMetrics {
  totalAppointments: number;
  totalSales: number;
  averageTicket: number;
  cancellationRate: number;
  newCustomers: number;
  popularServices: { service: string; total: number }[];
  peakHours: { hour: number; total: number }[];
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { businessId } = useTenant();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAppointments: 0,
    totalSales: 0,
    averageTicket: 0,
    cancellationRate: 0,
    newCustomers: 0,
    popularServices: [],
    peakHours: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!businessId) return;
      
      setIsLoading(true);
      try {
        // Fetch dashboard metrics from the database
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // Format dates for API
        const formattedStartDate = startOfMonth.toISOString().split('T')[0];
        const formattedEndDate = today.toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .rpc('obter_metricas_periodo', {
            p_tenant_id: businessId,
            p_data_inicio: formattedStartDate, 
            p_data_fim: formattedEndDate
          });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Aggregate data from all days in the period
          const aggregatedMetrics = {
            totalAppointments: data.reduce((sum, day) => sum + day.total_agendamentos, 0),
            totalSales: data.reduce((sum, day) => sum + parseFloat(day.total_vendas), 0),
            averageTicket: data.reduce((sum, day) => sum + parseFloat(day.ticket_medio), 0) / data.length,
            cancellationRate: data.reduce((sum, day) => sum + parseFloat(day.taxa_cancelamento), 0) / data.length,
            newCustomers: data.reduce((sum, day) => sum + day.novos_clientes, 0),
            popularServices: aggregatePopularServices(data),
            peakHours: aggregatePeakHours(data),
          };
          
          setMetrics(aggregatedMetrics);
        } else {
          // No data found - use default empty values
          console.log('No dashboard metrics found for the period');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [businessId]);
  
  // Helper function to aggregate popular services from multiple days
  const aggregatePopularServices = (data) => {
    const servicesMap = new Map();
    
    data.forEach(day => {
      if (day.servicos_populares) {
        day.servicos_populares.forEach(service => {
          const currentTotal = servicesMap.get(service.servico) || 0;
          servicesMap.set(service.servico, currentTotal + service.total);
        });
      }
    });
    
    return Array.from(servicesMap.entries())
      .map(([service, total]) => ({ service, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };
  
  // Helper function to aggregate peak hours from multiple days
  const aggregatePeakHours = (data) => {
    const hoursMap = new Map();
    
    data.forEach(day => {
      if (day.horarios_pico) {
        day.horarios_pico.forEach(hourData => {
          const currentTotal = hoursMap.get(hourData.hora) || 0;
          hoursMap.set(hourData.hora, currentTotal + hourData.total);
        });
      }
    });
    
    return Array.from(hoursMap.entries())
      .map(([hour, total]) => ({ hour: parseInt(hour), total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Este Mês
          </Button>
          <Button variant="outline" size="sm">
            Últimos 7 dias
          </Button>
          <Button variant="outline" size="sm">
            Hoje
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-slate-200 rounded w-2/3 mb-1"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Total do mês
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalSales)}</div>
              <p className="text-xs text-muted-foreground">
                Total do mês
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.averageTicket)}</div>
              <p className="text-xs text-muted-foreground">
                Por atendimento
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.newCustomers}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.newCustomers > 0 ? '+' : ''}{metrics.newCustomers} este mês
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 xl:col-span-2">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Visão geral dos agendamentos do dia
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center animate-pulse">
                      <div className="h-12 w-12 rounded-full bg-slate-200"></div>
                      <div className="ml-4 space-y-2 flex-1">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : metrics.totalAppointments > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/appointments")}
                    >
                      Ver todos os agendamentos
                    </Button>
                  </div>
                  {metrics.popularServices.length > 0 ? (
                    <div className="space-y-3">
                      {metrics.popularServices.slice(0, 3).map((service, i) => (
                        <div key={i} className="flex items-center p-2 rounded-md bg-slate-50">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Star className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">{service.service}</div>
                            <div className="text-sm text-muted-foreground">{service.total} agendamentos</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhum serviço popular encontrado</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-lg mb-1">Nenhum agendamento</h3>
                  <p className="text-muted-foreground mb-4">
                    Você ainda não possui agendamentos registrados neste período.
                  </p>
                  <Button onClick={() => navigate("/appointments")}>
                    Criar Agendamento
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>
              Métricas importantes do seu negócio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-1"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Taxa de Cancelamento</span>
                    <span className="text-sm font-medium">
                      {metrics.cancellationRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100">
                    <div 
                      className="h-full rounded-full bg-red-400" 
                      style={{ width: `${Math.min(metrics.cancellationRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Horários de Pico</h4>
                  {metrics.peakHours.length > 0 ? (
                    <div className="space-y-2">
                      {metrics.peakHours.slice(0, 3).map((hourData, i) => (
                        <div key={i} className="flex items-center">
                          <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium">{hourData.hour}:00</div>
                            <div className="text-xs text-muted-foreground">{hourData.total} agendamentos</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Dados insuficientes</p>
                  )}
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full" onClick={() => navigate("/reports")}>
                    Ver relatórios detalhados
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
