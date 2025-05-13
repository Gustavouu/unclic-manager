
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface RetentionRateCardProps {
  retentionRate: number;
  loading?: boolean;
}

export function RetentionRateCard({ retentionRate, loading = false }: RetentionRateCardProps) {
  const safeRate = loading ? 0 : (retentionRate || 0);
  
  // Determine color based on retention rate
  const getColor = (rate: number) => {
    if (rate >= 75) return "text-green-500";
    if (rate >= 50) return "text-amber-500";
    return "text-red-500";
  };
  
  // Determine progress color based on retention rate
  const getProgressColor = (rate: number) => {
    if (rate >= 75) return "bg-green-500";
    if (rate >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Taxa de Retenção de Clientes</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-[calc(100%-60px)]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="h-24 w-24 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <div className="relative h-40 w-40 flex items-center justify-center mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={safeRate >= 75 ? "#10b981" : safeRate >= 50 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray={`${(safeRate * 2.83)}px 283px`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className={cn("text-3xl font-bold", getColor(safeRate))}>
                    {safeRate}%
                  </span>
                  <span className="text-xs text-muted-foreground">Taxa de Retenção</span>
                </div>
              </div>
              
              <div className="w-full space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Meta</span>
                  <span>70%</span>
                </div>
                <Progress className="h-2" value={safeRate} />
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <UserCheck className="w-4 h-4 mr-2" />
                <span>
                  {safeRate >= 70 
                    ? "Excelente taxa de retenção!"
                    : safeRate >= 50
                    ? "Taxa de retenção aceitável"
                    : "Melhore sua taxa de retenção"}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
