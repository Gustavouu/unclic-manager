
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { DashboardStats } from "@/types/dashboard";
import { Loader } from "@/components/ui/loader";

interface ClientsComparisonChartProps {
  stats: DashboardStats | null;
}

export function ClientsComparisonChart({ stats }: ClientsComparisonChartProps) {
  if (!stats) {
    return (
      <Card className="h-full">
        <CardContent className="flex justify-center items-center h-full">
          <Loader text="Carregando dados..." />
        </CardContent>
      </Card>
    );
  }

  const newClientsCount = stats.newClientsCount || 0;
  const returningClientsCount = stats.returningClientsCount || 0;

  // If no data is available
  if (newClientsCount === 0 && returningClientsCount === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col justify-center items-center h-full p-6 text-center">
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
            className="text-muted-foreground mb-2"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <p className="text-sm text-muted-foreground mt-2">
            Sem dados de clientes para visualizar
          </p>
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: "Novos Clientes", value: newClientsCount },
    { name: "Clientes Retornando", value: returningClientsCount }
  ];
  
  const COLORS = ["#4338ca", "#0284c7"];

  return (
    <Card className="h-full">
      <CardContent className="p-6 h-full">
        <div className="h-full flex flex-col">
          <div className="flex-grow" style={{ minHeight: "180px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} clientes`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-2 bg-indigo-50 rounded-md">
              <p className="text-indigo-700 font-medium text-lg">
                {newClientsCount}
              </p>
              <p className="text-xs text-muted-foreground">
                Novos clientes
              </p>
            </div>
            <div className="p-2 bg-sky-50 rounded-md">
              <p className="text-sky-700 font-medium text-lg">
                {returningClientsCount}
              </p>
              <p className="text-xs text-muted-foreground">
                Clientes retornando
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
