
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface MetricCardChange {
  value: number;
  type: 'increase' | 'decrease' | 'neutral';
  label?: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: MetricCardChange;
  icon?: React.ComponentType<{ className?: string }>;
  format?: 'currency' | 'number' | 'percentage';
  loading?: boolean;
  className?: string;
  highlight?: boolean;
  tooltip?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  format = 'number',
  loading = false,
  className,
  highlight = false,
  tooltip,
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString('pt-BR');
    }
  };

  const getChangeColor = () => {
    if (!change) return '';
    switch (change.type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    if (!change) return null;
    switch (change.type) {
      case 'increase':
        return <ArrowUpIcon className="h-4 w-4" />;
      case 'decrease':
        return <ArrowDownIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className={cn(className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        className,
        highlight && "border-primary/50 bg-primary/5"
      )}
      title={tooltip}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {change && (
          <div className={cn("flex items-center text-xs", getChangeColor())}>
            {getChangeIcon()}
            <span className="ml-1">
              {change.value > 0 && change.type !== 'decrease' && '+'}
              {change.value}
              {format === 'percentage' ? 'pp' : '%'}
              {change.label && ` ${change.label}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MetricGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </div>
  );
}
