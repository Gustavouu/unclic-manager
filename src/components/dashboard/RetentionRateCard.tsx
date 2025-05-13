
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatPercentage } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

interface RetentionRateCardProps {
  retentionRate: number;
  loading?: boolean;
}

export function RetentionRateCard({ retentionRate, loading = false }: RetentionRateCardProps) {
  const getColorClass = (rate: number) => {
    if (rate >= 80) return "bg-green-500";
    if (rate >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getMessage = (rate: number) => {
    if (rate >= 80) return "Excelente! Continue com o bom trabalho.";
    if (rate >= 60) return "Bom, mas há espaço para melhorias.";
    return "Atenção! É importante melhorar a retenção.";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Taxa de Retenção</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 mx-auto" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-4">
                <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90">
                  <path
                    className="stroke-current text-muted stroke-2"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`stroke-current ${getColorClass(retentionRate)} stroke-2`}
                    fill="none"
                    strokeDasharray={`${retentionRate}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-3xl font-bold">{retentionRate}%</span>
                </div>
              </div>
              
              <p className="text-sm text-center mb-6">{getMessage(retentionRate)}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Meta mensal</span>
                  <span>90%</span>
                </div>
                <Progress value={(retentionRate / 90) * 100} className="h-1" />
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p className="mb-1">Como melhorar:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Enviar follow-ups após atendimentos</li>
                  <li>Oferecer descontos para clientes recorrentes</li>
                  <li>Criar programa de fidelidade</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
