
import React from 'react';
import { Calendar, Banknote, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardMetrics } from '@/hooks/dashboard/useDashboardMetrics';

export const DashboardOverview = () => {
  const { metrics, isLoading, formatCurrency } = useDashboardMetrics();

  const cards = [
    {
      title: "Clientes Ativos",
      value: metrics.activeClients,
      icon: Users,
    },
    {
      title: "Próximos Agendamentos",
      value: metrics.todayAppointments,
      icon: Calendar,
    },
    {
      title: "Receita do Mês",
      value: formatCurrency(metrics.monthlyRevenue),
      icon: Banknote,
      isMonetary: true,
    },
    {
      title: "Serviços Realizados",
      value: metrics.servicesCompleted,
      icon: Clock,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const displayValue = isLoading ? '...' : card.isMonetary ? card.value : card.value;
        
        return (
          <Card key={index}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-primary/10 p-2 rounded">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <h3 className="text-2xl font-bold">{displayValue}</h3>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
