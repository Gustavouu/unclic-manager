
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardStats } from "@/hooks/dashboard/useDashboardData";
import { UserCheck } from "lucide-react";

interface RetentionRateCardProps {
  stats: DashboardStats;
}

export function RetentionRateCard({ stats }: RetentionRateCardProps) {
  const retentionRate = stats.retentionRate || 0;
  
  // Determine color based on retention rate
  const getColorClass = () => {
    if (retentionRate >= 80) return "bg-green-500";
    if (retentionRate >= 60) return "bg-blue-500";
    if (retentionRate >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display flex items-center">
          <UserCheck className="mr-2 h-5 w-5 text-blue-500" />
          Taxa de Retenção de Clientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-5xl font-bold">{retentionRate}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                dos clientes retornam
              </p>
            </div>
            <div className="flex items-center justify-center bg-primary/10 rounded-full p-3 h-16 w-16">
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span>0%</span>
              <span className="font-medium">Meta: 80%</span>
              <span>100%</span>
            </div>
            <Progress 
              value={retentionRate} 
              className={`h-3 ${getColorClass()}`}
            />
            
            <p className="text-sm text-muted-foreground mt-3">
              {retentionRate >= 80 ? (
                <span className="text-green-600 font-medium">Excelente taxa de retenção!</span>
              ) : retentionRate >= 60 ? (
                <span className="text-blue-600 font-medium">Boa taxa de retenção</span>
              ) : retentionRate >= 40 ? (
                <span className="text-amber-600 font-medium">Taxa de retenção moderada</span>
              ) : (
                <span className="text-red-600 font-medium">Precisa melhorar a retenção de clientes</span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
