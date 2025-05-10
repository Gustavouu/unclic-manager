
import React from 'react';
import { BarChart } from '@/components/ui/chart';
import { RevenueChartData } from '@/hooks/payment/useFinancialMetrics';
import { formatCurrency } from '@/lib/utils';

interface RevenueBarChartProps {
  data: RevenueChartData[];
  height?: number;
  showSubscriptions?: boolean;
  className?: string;
}

export function RevenueBarChart({
  data,
  height = 300,
  showSubscriptions = true,
  className,
}: RevenueBarChartProps) {
  const categories = showSubscriptions
    ? ['revenue', 'subscriptions']
    : ['revenue'];

  return (
    <div style={{ height: `${height}px` }} className={className}>
      <BarChart
        data={data}
        index="month"
        categories={categories}
        valueFormatter={(value) => 
          categories.includes('revenue') && value > 1000 
            ? formatCurrency(value) 
            : value.toString()
        }
        colors={["#22c55e", "#3b82f6"]}
        className="h-full"
      />
    </div>
  );
}
