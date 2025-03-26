
import { useState } from "react";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsTabs } from "@/components/reports/ReportsTabs";
import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Reports() {
  const [dateRange, setDateRange] = useState("last30days");
  
  return (
    <AppLayout breadcrumb={[{ label: "Relatórios" }]}>
      <div className="space-y-6">
        <ReportsHeader dateRange={dateRange} onDateRangeChange={setDateRange} />
        <Card>
          <CardContent className="p-6">
            <ReportsTabs dateRange={dateRange} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
