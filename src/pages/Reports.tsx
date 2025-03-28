
import { useState } from "react";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsTabs } from "@/components/reports/ReportsTabs";
import { useReportsData } from "@/hooks/reports/useReportsData";
import { Skeleton } from "@/components/ui/skeleton";

const Reports = () => {
  const [dateRange, setDateRange] = useState("last30days");
  const { stats, isLoading } = useReportsData(dateRange);

  return (
    <div className="space-y-6">
      <ReportsHeader 
        dateRange={dateRange} 
        onDateRangeChange={setDateRange} 
      />
      
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
