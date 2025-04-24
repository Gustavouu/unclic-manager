
import { useState, useEffect } from "react";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsTabs } from "@/components/reports/ReportsTabs";
import { useReportsData } from "@/hooks/reports/useReportsData";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => {
  const [dateRange, setDateRange] = useState("last30days");
  const { fetchAppointments } = useAppointments();
  const { stats, isLoading, error } = useReportsData(dateRange);

  // Fetch appointments whenever the component mounts
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Relatórios</h1>
          <p className="text-sm text-muted-foreground">
            Visualize estatísticas e métricas do seu negócio
          </p>
        </div>
        
        <ReportsHeader 
          dateRange={dateRange} 
          onDateRangeChange={setDateRange} 
        />
      </div>
      
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium mb-1">Receita</h3>
              <p className="text-3xl font-bold text-blue-600">
                R$ {stats.totalRevenue?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-muted-foreground">No período</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium mb-1">Agendamentos</h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.appointmentsCount || 0}
              </p>
              <p className="text-sm text-muted-foreground">No período</p>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium mb-1">Clientes</h3>
              <p className="text-3xl font-bold text-amber-600">
                {stats.clientsCount || 0}
              </p>
              <p className="text-sm text-muted-foreground">No período</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium mb-1">Taxa de Conclusão</h3>
              <p className="text-3xl font-bold text-purple-600">
                {stats.completionRate ? `${stats.completionRate}%` : '0%'}
              </p>
              <p className="text-sm text-muted-foreground">Agendamentos</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b bg-white">
          <CardTitle className="text-lg">Análise de Dados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              <Skeleton className="h-[200px] w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[300px] w-full" />
              </div>
            </div>
          ) : (
            <ReportsTabs dateRange={dateRange} stats={stats} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
