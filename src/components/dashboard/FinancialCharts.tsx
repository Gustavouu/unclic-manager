
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { formatCurrency } from "@/lib/format";
import { Loader } from "@/components/ui/loader";

interface ChartData {
  date: string;
  value: number;
}

interface FinancialChartsProps {
  revenueData: ChartData[];
  loading?: boolean;
}

export function FinancialCharts({ revenueData, loading = false }: FinancialChartsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader size="lg" text="Carregando dados financeiros..." />
      </div>
    );
  }

  if (!revenueData || revenueData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground mb-4"
        >
          <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
          <path d="M8 7v0a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0" />
        </svg>
        <h3 className="font-medium mb-1">Sem dados financeiros</h3>
        <p className="text-sm text-muted-foreground">
          Não existem dados financeiros para visualizar neste período
        </p>
      </div>
    );
  }

  // Format tooltip values
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            {formatCurrency(payload[0].value || 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                tickMargin={10}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => formatCompactCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function for compact currency formatting
const formatCompactCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};
