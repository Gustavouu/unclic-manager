
import { useState, useEffect } from "react";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsTabs } from "@/components/reports/ReportsTabs";
import { useReportsData } from "@/hooks/reports/useReportsData";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointments } from "@/hooks/appointments/useAppointments";

const Reports = () => {
  const [dateRange, setDateRange] = useState("last30days");
  const { fetchAppointments } = useAppointments();
  const { stats, isLoading, error } = useReportsData(dateRange);

  // Fetch appointments whenever the component mounts
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // When date range changes, we need fresh data
  useEffect(() => {
    // Trigger a data refresh when the date range changes
  }, [dateRange]);

  return (
    <div className="space-y-6">
      <ReportsHeader 
        dateRange={dateRange} 
        onDateRangeChange={setDateRange} 
      />
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      ) : (
        <ReportsTabs dateRange={dateRange} stats={stats} />
      )}
    </div>
  );
};

export default Reports;
