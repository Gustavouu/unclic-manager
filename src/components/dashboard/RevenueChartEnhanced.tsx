
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, BarChart3, Calendar, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RevenueDataPoint {
  date: string;
  value: number;
  appointments: number;
  target?: number;
}

interface RevenueChartEnhancedProps {
  data: RevenueDataPoint[];
  isLoading?: boolean;
  className?: string;
  showTarget?: boolean;
  interactive?: boolean;
}

export const RevenueChartEnhanced: React.FC<RevenueChartEnhancedProps> = ({
  data,
  isLoading = false,
  className,
  showTarget = false,
  interactive = true
}) => {
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateGrowth = () => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    return ((current - previous) / previous) * 100;
  };

  const totalRevenue = data.reduce((sum, point) => sum + point.value, 0);
  const averageRevenue = totalRevenue / data.length;
  const growth = calculateGrowth();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-4 space-y-2">
          <p className="font-semibold text-foreground">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-primary font-medium">
              Receita: {formatCurrency(payload[0].value)}
            </p>
            {payload[1] && (
              <p className="text-sm text-muted-foreground">
                Agendamentos: {payload[1].value}
              </p>
            )}
            {showTarget && payload[2] && (
              <p className="text-sm text-accent">
                Meta: {formatCurrency(payload[2].value)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            Receita dos Últimos 6 Meses
          </CardTitle>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(totalRevenue)}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <ArrowUpRight className={cn(
                "h-3 w-3",
                growth > 0 ? "text-green-600" : "text-red-600"
              )} />
              <span className={cn(
                "font-medium",
                growth > 0 ? "text-green-600" : "text-red-600"
              )}>
                {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {interactive && (
          <div className="flex gap-2">
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
              className="h-8"
            >
              <BarChart3 className="h-3 w-3" />
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              className="h-8"
            >
              <TrendingUp className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart
                data={data}
                onMouseMove={(e) => {
                  if (e?.activeTooltipIndex !== undefined) {
                    setHoveredPoint(e.activeTooltipIndex);
                  }
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  opacity={0.3}
                  stroke="hsl(var(--muted-foreground))"
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={{ 
                    fill: 'hsl(var(--primary))', 
                    strokeWidth: 2, 
                    r: 4,
                    stroke: 'hsl(var(--background))'
                  }}
                  activeDot={{ 
                    r: 6, 
                    stroke: 'hsl(var(--primary))', 
                    strokeWidth: 2,
                    fill: 'hsl(var(--background))'
                  }}
                />
                {showTarget && (
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart
                data={data}
                onMouseMove={(e) => {
                  if (e?.activeTooltipIndex !== undefined) {
                    setHoveredPoint(e.activeTooltipIndex);
                  }
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  opacity={0.3}
                  stroke="hsl(var(--muted-foreground))"
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ 
                    fill: 'hsl(var(--primary))', 
                    strokeWidth: 2, 
                    r: 4,
                    stroke: 'hsl(var(--background))'
                  }}
                  activeDot={{ 
                    r: 6, 
                    stroke: 'hsl(var(--primary))', 
                    strokeWidth: 2,
                    fill: 'hsl(var(--background))'
                  }}
                />
                {showTarget && (
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Mini insights */}
        <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Média Mensal</p>
            <p className="text-sm font-semibold">{formatCurrency(averageRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Melhor Mês</p>
            <p className="text-sm font-semibold">
              {formatCurrency(Math.max(...data.map(d => d.value)))}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Crescimento</p>
            <p className={cn(
              "text-sm font-semibold",
              growth > 0 ? "text-green-600" : "text-red-600"
            )}>
              {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
