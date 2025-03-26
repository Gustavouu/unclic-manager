
import { AppLayout } from "@/components/layout/AppLayout";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsTabs } from "@/components/reports/ReportsTabs";

export default function Reports() {
  return (
    <AppLayout breadcrumb={[{ label: "Relatórios" }]}>
      <div className="space-y-6">
        <ReportsHeader />
        <ReportsTabs />
      </div>
    </AppLayout>
  );
}
