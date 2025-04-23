
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FinancialChartsProps {
  data: any[];
}

export function FinancialCharts({ data }: FinancialChartsProps) {
  const [chartView, setChartView] = useState<"bar" | "line">("bar");
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-display">Desempenho Financeiro</CardTitle>
            <CardDescription>Receitas e despesas ao longo do período</CardDescription>
          </div>
          <Tabs value={chartView} onValueChange={(v) => setChartView(v as "bar" | "line")} className="w-[180px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bar">Barras</TabsTrigger>
              <TabsTrigger value="line">Linha</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartView === "bar" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis 
                  tickFormatter={formatCurrency} 
                  axisLine={false} 
                  tickLine={false} 
                  width={80}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value)]} 
                  labelFormatter={(value) => `${value}`}
                  contentStyle={{ 
                    borderRadius: '8px',
                    backgroundColor: 'white', 
                    borderColor: '#e2e8f0'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="receita" 
                  name="Receita" 
                  fill="#22c55e" 
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
                <Bar 
                  dataKey="despesa" 
                  name="Despesa" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis 
                  tickFormatter={formatCurrency} 
                  axisLine={false} 
                  tickLine={false} 
                  width={80}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value)]} 
                  labelFormatter={(value) => `${value}`}
                  contentStyle={{ 
                    borderRadius: '8px',
                    backgroundColor: 'white', 
                    borderColor: '#e2e8f0'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="receita" 
                  name="Receita" 
                  stroke="#22c55e" 
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="despesa" 
                  name="Despesa" 
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
