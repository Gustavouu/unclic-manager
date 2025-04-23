
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardStats } from "@/hooks/dashboard/useDashboardData";

interface PerformanceMetricsProps {
  stats: DashboardStats;
}

export function PerformanceMetrics({ stats }: PerformanceMetricsProps) {
  // Métricas simuladas para demonstração
  const metrics = [
    {
      name: "Taxa de Ocupação",
      value: stats.occupancyRate || 75,
      target: 90,
      color: "bg-blue-500"
    },
    {
      name: "Taxa de Retenção de Clientes",
      value: stats.retentionRate || 82,
      target: 95,
      color: "bg-green-500"
    },
    {
      name: "Utilização dos Profissionais",
      value: 68,
      target: 80,
      color: "bg-amber-500"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Métricas de Desempenho</CardTitle>
        <CardDescription>Progresso em relação às metas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric) => (
            <div key={metric.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{metric.name}</span>
                <span className="text-muted-foreground">{metric.value}% de {metric.target}%</span>
              </div>
              <Progress value={(metric.value / metric.target) * 100} className={metric.color} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
