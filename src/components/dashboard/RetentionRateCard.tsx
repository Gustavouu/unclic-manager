
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display flex items-center">
          <UserCheck className="mr-2 h-5 w-5" />
          Taxa de Retenção de Clientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-4xl font-bold">{retentionRate}%</p>
              <p className="text-sm text-muted-foreground">
                dos clientes retornam
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Meta: 80%
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={retentionRate} 
              className={getColorClass()} 
            />
            
            <p className="text-sm text-muted-foreground">
              {retentionRate >= 80 ? (
                "Excelente taxa de retenção!"
              ) : retentionRate >= 60 ? (
                "Boa taxa de retenção"
              ) : retentionRate >= 40 ? (
                "Taxa de retenção moderada"
              ) : (
                "Precisa melhorar a retenção de clientes"
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
