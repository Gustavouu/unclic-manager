
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueData } from "@/hooks/dashboard/useDashboardData";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/format";

interface FinancialChartsProps {
  data: RevenueData[];
}

export function FinancialCharts({ data }: FinancialChartsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const [year, month] = date.split("-");
                  return `${month}/${year.slice(2)}`;
                }}
                stroke="#888888"
              />
              <YAxis
                tickFormatter={(value) => `R$${value / 1000}K`}
                stroke="#888888"
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Receita"]}
                cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              />
              <Bar
                dataKey="value"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
