
import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from './card';

export interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    label?: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  format?: 'currency' | 'percentage' | 'number';
  loading?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  previousValue,
  change,
  icon: Icon,
  format = 'number',
  loading = false,
  className,
  size = 'md'
}) => {
  const formatValue = (val: string | number) => {
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(numVal);
      case 'percentage':
        return `${numVal}%`;
      default:
        return numVal.toLocaleString('pt-BR');
    }
  };

  const sizeClasses = {
    sm: {
      card: 'p-4',
      title: 'text-sm',
      value: 'text-lg',
      icon: 'h-4 w-4',
      change: 'text-xs'
    },
    md: {
      card: 'p-6',
      title: 'text-sm',
      value: 'text-2xl',
      icon: 'h-5 w-5',
      change: 'text-sm'
    },
    lg: {
      card: 'p-8',
      title: 'text-base',
      value: 'text-3xl',
      icon: 'h-6 w-6',
      change: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  const getTrendIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case 'increase':
        return <TrendingUp className="h-3 w-3" />;
      case 'decrease':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    if (!change) return 'text-muted-foreground';
    
    switch (change.type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className={classes.card}>
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
            <div className="h-8 bg-muted animate-pulse rounded w-16"></div>
            <div className="h-3 bg-muted animate-pulse rounded w-20"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('transition-all duration-200 hover:shadow-md', className)}>
      <CardContent className={classes.card}>
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className={cn('font-medium text-muted-foreground', classes.title)}>
              {title}
            </p>
            <p className={cn('font-bold text-foreground', classes.value)}>
              {formatValue(value)}
            </p>
            
            {change && (
              <div className={cn(
                'flex items-center gap-1 font-medium',
                classes.change,
                getTrendColor()
              )}>
                {getTrendIcon()}
                <span>
                  {change.value > 0 ? '+' : ''}{change.value}%
                </span>
                {change.label && (
                  <span className="text-muted-foreground ml-1">
                    {change.label}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {Icon && (
            <div className="flex-shrink-0">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className={cn('text-primary', classes.icon)} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const MetricGrid: React.FC<{
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}> = ({ children, columns = 4, className }) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={cn(
      'grid gap-4',
      gridClasses[columns],
      className
    )}>
      {children}
    </div>
  );
};
