
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { FilterPeriod } from "@/types/dashboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardAnalytics } from "@/hooks/dashboard/useDashboardAnalytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import { CalendarClock, User, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const [period, setPeriod] = useState<FilterPeriod>("month");
  const { metrics, loading, error } = useDashboardAnalytics(period);
  
  useEffect(() => {
    document.title = "Dashboard | Unclic Manager";
  }, []);

  const handlePeriodChange = (value: string) => {
    setPeriod(value as FilterPeriod);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Painel de Controle"
          description="Ocorreu um erro ao carregar os dados do dashboard."
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center flex-col gap-4 text-center">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <span className="text-xl">!</span>
              </div>
              <h3 className="text-lg font-medium">Erro ao carregar dados</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Painel de Controle"
          description="Bem-vindo ao seu dashboard. Aqui você encontra os dados mais importantes do seu negócio."
        />
        
        <div className="w-[180px]">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <KpiCards stats={metrics} period={period} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Receita no Período</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="h-full w-full rounded-md" />
              </div>
            ) : metrics.revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => `R$${Math.floor(value)}`}
                  />
                  <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">Nenhum dado disponível para o período</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Status de Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <CalendarClock size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Agendados</div>
                    <div className="text-sm text-muted-foreground">
                      {metrics.appointmentsByStatus.scheduled} agendamentos
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Concluídos</div>
                    <div className="text-sm text-muted-foreground">
                      {metrics.appointmentsByStatus.completed} agendamentos
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Cancelados</div>
                    <div className="text-sm text-muted-foreground">
                      {metrics.appointmentsByStatus.canceled} agendamentos
                    </div>
                  </div>
                </div>
                
                <div className="h-12 w-full bg-gray-100 dark:bg-gray-800 rounded-md mt-4">
                  <div className="flex h-full">
                    {metrics.monthlyServices > 0 && (
                      <>
                        <div 
                          className="bg-blue-500 h-full rounded-l-md"
                          style={{ 
                            width: `${(metrics.appointmentsByStatus.scheduled / metrics.monthlyServices) * 100}%` 
                          }}
                        />
                        <div 
                          className="bg-green-500 h-full"
                          style={{ 
                            width: `${(metrics.appointmentsByStatus.completed / metrics.monthlyServices) * 100}%` 
                          }}
                        />
                        <div 
                          className="bg-red-500 h-full rounded-r-md"
                          style={{ 
                            width: `${(metrics.appointmentsByStatus.canceled / metrics.monthlyServices) * 100}%` 
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))}
            </div>
          ) : metrics.upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {metrics.upcomingAppointments.map((appointment: any, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="font-medium text-blue-600">
                        {appointment.clientes?.nome?.substring(0, 2).toUpperCase() || "CL"}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{appointment.clientes?.nome || "Cliente"}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.servicos?.nome || "Serviço"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {new Date(appointment.data).toLocaleDateString()} 
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.hora_inicio}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-center">
              <div>
                <CalendarClock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-medium">Nenhum agendamento próximo</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Não há agendamentos programados para os próximos dias
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Popular Services */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços Populares</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : metrics.popularServices.length > 0 ? (
            <div className="space-y-4">
              {metrics.popularServices.map((service, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm">{service.count} agendamentos</div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-1">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${service.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                Nenhum serviço foi realizado no período selecionado
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
