
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/types/dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Users, UserPlus, UserCheck } from "lucide-react";

interface ClientsComparisonChartProps {
  stats: DashboardStats;
}

export function ClientsComparisonChart({ stats }: ClientsComparisonChartProps) {
  const data = [
    { name: 'Novos Clientes', value: stats?.newClientsCount || 0, color: '#8B5CF6' },
    { name: 'Clientes Recorrentes', value: stats?.returningClientsCount || 0, color: '#10b981' },
  ];

  const COLORS = ['#8B5CF6', '#10b981'];

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Novos Clientes vs Recorrentes</CardTitle>
      </CardHeader>
      <CardContent>
        {total > 0 ? (
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full h-[200px] mb-4 lg:mb-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => [`${value} clientes`, '']}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{ 
                      borderRadius: '8px',
                      backgroundColor: 'white', 
                      borderColor: '#e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col space-y-6 w-full lg:w-auto">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#8B5CF6] mr-2 rounded"></div>
                <div>
                  <span className="text-sm font-medium">Novos Clientes</span>
                  <p className="text-2xl font-bold">{stats?.newClientsCount || 0}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
                <div>
                  <span className="text-sm font-medium">Clientes Recorrentes</span>
                  <p className="text-2xl font-bold">{stats?.returningClientsCount || 0}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <Users className="h-12 w-12 mb-2" />
            <p>Sem dados de clientes para o período selecionado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
