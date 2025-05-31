
import React, { useState } from 'react';
import { ReportsHeader } from '@/components/reports/ReportsHeader';
import { ReportsTabs } from '@/components/reports/ReportsTabs';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });

  return (
    <div className="container mx-auto p-6">
      <ReportsHeader />
      <ReportsTabs dateRange={dateRange} onDateRangeChange={setDateRange} />
    </div>
  );
};

export default Reports;
