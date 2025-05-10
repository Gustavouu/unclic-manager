
import { useState, useEffect } from "react";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsTabs } from "@/components/reports/ReportsTabs";
import { useReportsData } from "@/hooks/reports/useReportsData";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/common/StatsCard";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { DollarSign, Calendar, Users, Percent } from "lucide-react";

const Reports = () => {
  const [dateRange, setDateRange] = useState("last30days");
  const { fetchAppointments } = useAppointments();
  const { stats, isLoading, error } = useReportsData(dateRange);

  // Fetch appointments whenever the component mounts
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Calculate derived statistics if they don't exist directly
  const appointmentsCount = stats.totalAppointments || 0;
  const clientsCount = stats.totalClients || 0;
  const completionRate = stats.completedAppointments && stats.totalAppointments 
    ? Math.round((stats.completedAppointments / stats.totalAppointments) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <ReportsHeader 
        dateRange={dateRange} 
        onDateRangeChange={setDateRange} 
      />
      
      {!isLoading && !error && (
        <ResponsiveGrid columns={{ default: 1, sm: 4 }} gap="md" equalHeight>
          <StatsCard
            title="Receita"
            value={`R$ ${stats.totalRevenue?.toFixed(2) || '0.00'}`}
            icon={<DollarSign size={18} />}
            iconColor="text-blue-600 bg-blue-50"
            borderColor="border-l-blue-600"
          />
          
          <StatsCard
            title="Agendamentos"
            value={appointmentsCount.toString()}
            icon={<Calendar size={18} />}
            iconColor="text-green-600 bg-green-50"
            borderColor="border-l-green-600"
            description="No período"
          />
          
          <StatsCard
            title="Clientes"
            value={clientsCount.toString()}
            icon={<Users size={18} />}
            iconColor="text-amber-600 bg-amber-50"
            borderColor="border-l-amber-600"
            description="No período"
          />
          
          <StatsCard
            title="Taxa de Conclusão"
            value={`${completionRate}%`}
            icon={<Percent size={18} />}
            iconColor="text-purple-600 bg-purple-50"
            borderColor="border-l-purple-600"
            description="Agendamentos"
          />
        </ResponsiveGrid>
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
