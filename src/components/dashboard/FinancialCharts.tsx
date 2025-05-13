
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { formatCurrency } from "@/lib/format";

interface FinancialChartsProps {
  revenueData: Array<{date: string, value: number}>;
  loading?: boolean;
}

export function FinancialCharts({ revenueData, loading = false }: FinancialChartsProps) {
  // Format date for display
  const formattedData = revenueData?.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  })) || [];

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="h-64 w-full bg-gray-100 animate-pulse rounded"></div>
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formattedData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="formattedDate" 
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value).split(',')[0]}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Receita']}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#4F46E5" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
