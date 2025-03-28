
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { FinancialActions } from "@/components/finance/FinancialActions";
import { TransactionsTable } from "@/components/finance/TransactionsTable";
import { TransactionFilters } from "@/components/finance/TransactionFilters";
import { FinancialSummary } from "@/components/finance/FinancialSummary";
import { PaymentMethodsStats } from "@/components/finance/PaymentMethodsStats";
import { FinanceStats } from "@/components/finance/FinanceStats";

const Finance = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState("30days");

  const breadcrumb = [
    { label: "Dashboard", path: "/" },
    { label: "Financeiro" }
  ];

  return (
    <AppLayout breadcrumb={breadcrumb}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2">
          <h1 className="text-xl font-display font-medium">Gerenciamento Financeiro</h1>
          <FinancialActions />
        </div>

        {/* Stats cards row */}
        <FinanceStats />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <FinancialSummary isLoading={isLoading} />
          </Card>
          
          <Card className="col-span-1">
            <PaymentMethodsStats isLoading={isLoading} />
          </Card>
        </div>

        <Card className="border shadow-sm">
          <TransactionFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateRange={dateRange}
            setDateRange={setDateRange}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            period={period}
            setPeriod={setPeriod}
          />
          
          <TransactionsTable 
            isLoading={isLoading}
            filterType="all"
            period={period}
            currentPage={currentPage}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
            searchTerm={searchTerm}
            dateRange={dateRange}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default Finance;
