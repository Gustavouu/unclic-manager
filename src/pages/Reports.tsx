
import { useState } from "react";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsTabs } from "@/components/reports/ReportsTabs";

const Reports = () => {
  const [dateRange, setDateRange] = useState("last30days");

  return (
    <div className="space-y-6">
      <ReportsHeader 
        dateRange={dateRange} 
        onDateRangeChange={setDateRange} 
      />
      <ReportsTabs dateRange={dateRange} />
    </div>
  );
};

export default Reports;
