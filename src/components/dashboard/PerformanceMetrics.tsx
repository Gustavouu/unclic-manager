
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/hooks/dashboard/useDashboardData";

interface PerformanceMetricsProps {
  stats: DashboardStats;
}

export function PerformanceMetrics({ stats }: PerformanceMetricsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Clientes atendidos</span>
            <span className="font-medium">{stats.monthlyServices}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.min(stats.monthlyServices / 2, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">Taxa de ocupação</span>
            <span className="font-medium">65%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: "65%" }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">Clientes novos</span>
            <span className="font-medium">{stats.newClientsCount}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${Math.min(stats.newClientsCount * 2, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
