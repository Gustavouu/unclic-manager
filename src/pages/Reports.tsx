
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsTabs } from "@/components/reports/ReportsTabs";

const Reports = () => {
  const [dateRange, setDateRange] = useState("last30days");

  return (
    <AppLayout breadcrumb={[{ label: "Relatórios" }]}>
      <div className="space-y-6">
        <ReportsHeader 
          dateRange={dateRange} 
          onDateRangeChange={setDateRange} 
        />
        <ReportsTabs dateRange={dateRange} />
      </div>
    </AppLayout>
  );
};

export default Reports;
