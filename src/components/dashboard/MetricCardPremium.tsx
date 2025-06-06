
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardPremiumProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  gradient?: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
  className?: string;
}

const gradients = {
  blue: 'from-blue-500 to-cyan-500',
  purple: 'from-purple-500 to-pink-500',
  green: 'from-green-500 to-emerald-500',
  orange: 'from-orange-500 to-red-500',
  pink: 'from-pink-500 to-rose-500'
};

export const MetricCardPremium: React.FC<MetricCardPremiumProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  gradient = 'blue',
  className
}) => {
  return (
    <Card className={cn(
      "group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
      className
    )}>
      {/* Gradient Border */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[1px] rounded-lg",
        gradients[gradient]
      )}>
        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg"></div>
      </div>

      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "p-3 rounded-xl bg-gradient-to-br shadow-lg group-hover:shadow-xl transition-shadow duration-300",
                gradients[gradient]
              )}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {title}
                </p>
                {trend && (
                  <div className="flex items-center gap-1 mt-1">
                    {trend.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={cn(
                      "text-xs font-semibold",
                      trend.isPositive ? "text-green-600" : "text-red-600"
                    )}>
                      {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                    <span className="text-xs text-gray-500">{trend.label}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
              </h3>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity duration-300">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 blur-xl"></div>
        </div>
      </CardContent>
    </Card>
  );
};
