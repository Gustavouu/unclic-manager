
import React from 'react';
import { ReportsHeaderProps } from './types';

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({ dateRange, onDateRangeChange }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Relatórios</h1>
      <p className="text-muted-foreground">Análise detalhada do desempenho do seu negócio</p>
    </div>
  );
};
