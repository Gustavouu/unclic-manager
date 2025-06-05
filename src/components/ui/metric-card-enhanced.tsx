
import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Card, CardContent } from './card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export interface MetricCardEnhancedProps {
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
  tooltip?: string;
  highlight?: boolean;
  gradient?: boolean;
}

export const MetricCardEnhanced: React.FC<MetricCardEnhancedProps> = ({
  title,
  value,
  previousValue,
  change,
  icon: Icon,
  format = 'number',
  loading = false,
  className,
  size = 'md',
  tooltip,
  highlight = false,
  gradient = false
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
      <Card className={cn("animate-pulse", className)}>
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

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {children}
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <Card className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        highlight && 'ring-2 ring-primary/20 border-primary/30',
        gradient && 'bg-gradient-to-br from-background to-accent/5',
        'cursor-pointer',
        className
      )}>
        <CardContent className={classes.card}>
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <p className={cn('font-medium text-muted-foreground', classes.title)}>
                  {title}
                </p>
                {tooltip && (
                  <Info className="h-3 w-3 text-muted-foreground/60" />
                )}
              </div>
              
              <p className={cn(
                'font-bold text-foreground transition-all duration-300 group-hover:scale-105',
                classes.value
              )}>
                {formatValue(value)}
              </p>
              
              {change && (
                <div className={cn(
                  'flex items-center gap-1.5 font-medium transition-all duration-300',
                  classes.change,
                  getTrendColor()
                )}>
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    {getTrendIcon()}
                  </div>
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
                <div className={cn(
                  'p-3 rounded-xl transition-all duration-300 group-hover:scale-110',
                  highlight 
                    ? 'bg-primary/15 text-primary' 
                    : 'bg-primary/10 text-primary'
                )}>
                  <Icon className={cn('transition-transform duration-300', classes.icon)} />
                </div>
              </div>
            )}
          </div>

          {/* Decorative gradient overlay */}
          {gradient && (
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

export const MetricGridEnhanced: React.FC<{
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
      'grid gap-6',
      gridClasses[columns],
      className
    )}>
      {children}
    </div>
  );
};
