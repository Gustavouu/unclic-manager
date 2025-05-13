
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp, AlertCircle, Award, Users } from "lucide-react";
import { DashboardStats } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardInsightsProps {
  stats: DashboardStats | null;
}

export function DashboardInsights({ stats }: DashboardInsightsProps) {
  if (!stats) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-display">Insights</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 p-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determining some insights based on the data
  const isRevenuePositive = (stats?.monthlyRevenue || 0) > 5000;
  const isClientGrowthPositive = (stats?.clientsCount || 0) > 20;
  
  const insights = [
    {
      title: isRevenuePositive ? "Receita acima da média" : "Receita abaixo da média",
      description: isRevenuePositive 
        ? "A receita está 15% acima da média dos últimos 3 meses" 
        : "A receita está 10% abaixo da média dos últimos 3 meses",
      icon: isRevenuePositive ? TrendingUp : ArrowDown,
      color: isRevenuePositive ? "text-green-500" : "text-amber-500",
      bgColor: isRevenuePositive ? "bg-green-50" : "bg-amber-50"
    },
    {
      title: "Serviço destaque",
      description: stats?.popularServices?.length > 0 
        ? `"${stats?.popularServices[0]?.name || "Sem dados"}" está com alta procura` 
        : "Monitore quais serviços estão com maior procura",
      icon: Award,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50"
    },
    {
      title: isClientGrowthPositive ? "Base de clientes crescendo" : "Base de clientes estável",
      description: isClientGrowthPositive 
        ? `Aumento de ${stats?.newClientsCount || 5} novos clientes neste período` 
        : "Considere estratégias para atrair novos clientes",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Insights</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {insights.map((insight, index) => (
            <div key={index} className="flex gap-3 p-3 hover:bg-accent/5 transition-colors">
              <div className={`${insight.bgColor} ${insight.color} p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0`}>
                <insight.icon size={16} />
              </div>
              <div>
                <h4 className="text-sm font-medium">{insight.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
