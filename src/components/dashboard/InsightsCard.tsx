
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, Users, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'tip';
  title: string;
  description: string;
  value?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  priority: 'high' | 'medium' | 'low';
}

interface InsightsCardProps {
  insights: Insight[];
  className?: string;
  limit?: number;
}

export const InsightsCard: React.FC<InsightsCardProps> = ({
  insights,
  className,
  limit = 3
}) => {
  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'success':
        return <TrendingUp className="h-4 w-4" />;
      case 'warning':
        return <Clock className="h-4 w-4" />;
      case 'info':
        return <Users className="h-4 w-4" />;
      case 'tip':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'tip':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getBadgeVariant = (priority: Insight['priority']) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const displayedInsights = insights.slice(0, limit);

  // Mock insights para demonstração
  const mockInsights: Insight[] = [
    {
      id: '1',
      type: 'success',
      title: 'Crescimento Excelente! 🎉',
      description: 'Seus agendamentos aumentaram 25% este mês',
      value: '+25%',
      priority: 'high',
      action: {
        label: 'Ver detalhes',
        onClick: () => console.log('Ver crescimento')
      }
    },
    {
      id: '2',
      type: 'tip',
      title: 'Horário de Pico Identificado',
      description: 'Sextas-feiras às 14h são seu melhor horário',
      priority: 'medium',
      action: {
        label: 'Otimizar agenda',
        onClick: () => console.log('Otimizar')
      }
    },
    {
      id: '3',
      type: 'warning',
      title: 'Atenção aos Cancelamentos',
      description: '3 clientes cancelaram esta semana',
      priority: 'high',
      action: {
        label: 'Entrar em contato',
        onClick: () => console.log('Contatar clientes')
      }
    }
  ];

  const finalInsights = insights.length > 0 ? displayedInsights : mockInsights;

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      className
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          Insights Inteligentes
          <span className="text-sm text-muted-foreground font-normal ml-auto">
            Baseado nos seus dados
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {finalInsights.map((insight, index) => (
          <div
            key={insight.id}
            className={cn(
              "p-4 rounded-lg border transition-all duration-200 hover:shadow-sm",
              getInsightColor(insight.type),
              "group/insight"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <Badge 
                      variant={getBadgeVariant(insight.priority)}
                      className="text-xs"
                    >
                      {insight.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-sm opacity-80">{insight.description}</p>
                  
                  {insight.value && (
                    <div className="text-lg font-bold mt-2">
                      {insight.value}
                    </div>
                  )}
                </div>
              </div>

              {insight.action && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={insight.action.onClick}
                  className="opacity-0 group-hover/insight:opacity-100 transition-all duration-200 hover:scale-105"
                >
                  {insight.action.label}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {insights.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Seus insights aparecerão aqui conforme você usar o sistema
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
