
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Scissors, DollarSign, Plus, Settings, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  badge?: string;
}

interface QuickActionsPanelProps {
  className?: string;
  compact?: boolean;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  className,
  compact = false
}) => {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: 'new-appointment',
      title: 'Novo Agendamento',
      description: 'Agendar um novo serviço',
      icon: Calendar,
      href: '/appointments?new=true',
      color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
      badge: 'Rápido'
    },
    {
      id: 'add-client',
      title: 'Novo Cliente',
      description: 'Cadastrar novo cliente',
      icon: Users,
      href: '/clients?new=true',
      color: 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
    },
    {
      id: 'add-service',
      title: 'Novo Serviço',
      description: 'Criar novo serviço',
      icon: Scissors,
      href: '/services?new=true',
      color: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20'
    },
    {
      id: 'financial',
      title: 'Financeiro',
      description: 'Ver receitas e despesas',
      icon: DollarSign,
      href: '/finance',
      color: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
    },
    {
      id: 'reports',
      title: 'Relatórios',
      description: 'Análises detalhadas',
      icon: BarChart3,
      href: '/reports',
      color: 'bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20'
    },
    {
      id: 'settings',
      title: 'Configurações',
      description: 'Ajustar preferências',
      icon: Settings,
      href: '/settings',
      color: 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20'
    }
  ];

  const handleActionClick = (action: QuickAction) => {
    navigate(action.href);
  };

  if (compact) {
    return (
      <Card className={cn("transition-all duration-300 hover:shadow-lg", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.slice(0, 4).map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  onClick={() => handleActionClick(action)}
                  className={cn(
                    "h-auto p-3 flex flex-col gap-1 transition-all duration-200 hover:scale-105",
                    action.color
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{action.title}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      className
    )}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          Ações Rápidas
          <span className="text-sm text-muted-foreground font-normal ml-auto">
            Agilize seu fluxo de trabalho
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="ghost"
                onClick={() => handleActionClick(action)}
                className={cn(
                  "h-auto p-4 flex flex-col items-start gap-2 transition-all duration-200 hover:scale-105 relative group/action",
                  action.color
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className="h-5 w-5" />
                  {action.badge && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                      {action.badge}
                    </span>
                  )}
                </div>
                
                <div className="text-left">
                  <p className="font-semibold text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {action.description}
                  </p>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover/action:opacity-100 transition-opacity duration-200 rounded-md" />
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
