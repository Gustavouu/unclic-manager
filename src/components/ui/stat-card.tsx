
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { LoadingState } from '@/hooks/use-loading-state';
import { AsyncState } from './async-state';

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  variant?: 'default' | 'outline';
  colorScheme?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'indigo' | 'neutral';
  state?: LoadingState;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = 'default',
  colorScheme = 'blue',
  state = 'idle',
  className
}: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-700 dark:text-blue-400',
    green: 'text-green-700 dark:text-green-400',
    amber: 'text-amber-700 dark:text-amber-400',
    red: 'text-red-700 dark:text-red-400',
    purple: 'text-purple-700 dark:text-purple-400',
    indigo: 'text-indigo-700 dark:text-indigo-400',
    neutral: 'text-gray-700 dark:text-gray-400'
  };

  const bgClasses = {
    blue: 'bg-blue-50 dark:bg-blue-950/40',
    green: 'bg-green-50 dark:bg-green-950/40',
    amber: 'bg-amber-50 dark:bg-amber-950/40',
    red: 'bg-red-50 dark:bg-red-950/40',
    purple: 'bg-purple-50 dark:bg-purple-950/40',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/40',
    neutral: 'bg-gray-50 dark:bg-gray-900/40'
  };

  const getTrendColorClass = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up': return 'text-green-600 dark:text-green-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      case 'neutral': return 'text-gray-600 dark:text-gray-400';
      default: return '';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up': return <ArrowUpRight className="w-4 h-4" />;
      case 'down': return <ArrowDownRight className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-md',
      variant === 'outline' && 'border border-border shadow-sm',
      className
    )}>
      <CardContent className="p-6">
        {state !== 'idle' ? (
          <AsyncState state={state} size="sm" />
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className={cn("text-2xl font-semibold", colorClasses[colorScheme])}>
                  {value}
                </h3>
                {description && (
                  <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
              </div>
              {icon && (
                <div className={cn("p-2 rounded-md", bgClasses[colorScheme])}>
                  {icon}
                </div>
              )}
            </div>
            
            {trend && (
              <div className={cn("text-xs flex items-center mt-4 gap-1", getTrendColorClass())}>
                {getTrendIcon()}
                <span>
                  {trend.value}% {trend.label || (trend.direction === 'up' ? 'aumento' : trend.direction === 'down' ? 'queda' : '')}
                </span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
