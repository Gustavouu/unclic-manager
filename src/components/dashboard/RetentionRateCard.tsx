
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { formatPercentage } from '@/lib/format';

interface RetentionRateCardProps {
  retentionRate?: number;
  isLoading?: boolean;
}

export function RetentionRateCard({ retentionRate = 0, isLoading = false }: RetentionRateCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <div className="p-1 rounded bg-blue-50">
              <TrendingUp size={16} className="text-blue-600" />
            </div>
            Taxa de Retenção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <div className="p-1 rounded bg-blue-50">
            <TrendingUp size={16} className="text-blue-600" />
          </div>
          Taxa de Retenção
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {formatPercentage(retentionRate)}
        </div>
        <p className="text-xs text-gray-500">
          Clientes que retornaram
        </p>
      </CardContent>
    </Card>
  );
}
