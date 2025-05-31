
import React from 'react';
import { ReportsTabsProps } from './types';

export const ReportsTabs: React.FC<ReportsTabsProps> = ({ dateRange, onDateRangeChange }) => {
  return (
    <div>
      <p>Relatórios para o período de {dateRange.from.toLocaleDateString()} até {dateRange.to.toLocaleDateString()}</p>
    </div>
  );
};
