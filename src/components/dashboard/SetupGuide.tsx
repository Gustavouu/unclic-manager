
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import { usePermissions } from '@/hooks/security/usePermissions';
import { 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Building,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  completed: boolean;
  isRecommended?: boolean;
}

export const SetupGuide = () => {
  const navigate = useNavigate();
  const { currentBusiness } = useTenant();
  const { permissions, hasPermission, isAdmin } = usePermissions();

  const quickActions: QuickAction[] = [
    {
      id: 'business-setup',
      title: 'Configurar Negócio',
      description: 'Complete as informações do seu estabelecimento',
      icon: <Building className="h-5 w-5" />,
      route: '/onboarding',
      completed: !!currentBusiness?.name,
      isRecommended: !currentBusiness?.name
    },
    {
      id: 'team-setup',
      title: 'Gerenciar Equipe',
      description: 'Configure profissionais e permissões',
      icon: <Users className="h-5 w-5" />,
      route: '/security',
      completed: isAdmin || permissions.length > 0,
      isRecommended: isAdmin && permissions.length <= 3
    },
    {
      id: 'first-appointment',
      title: 'Primeiro Agendamento',
      description: 'Crie seu primeiro agendamento de teste',
      icon: <Calendar className="h-5 w-5" />,
      route: '/appointments',
      completed: false, // TODO: Verificar se tem agendamentos
      isRecommended: hasPermission('appointments.create')
    },
    {
      id: 'view-reports',
      title: 'Ver Relatórios',
      description: 'Acompanhe o desempenho do seu negócio',
      icon: <BarChart3 className="h-5 w-5" />,
      route: '/reports',
      completed: false,
      isRecommended: hasPermission('reports.view')
    }
  ];

  const availableActions = quickActions.filter(action => {
    // Mostrar apenas ações que o usuário tem permissão para acessar
    if (action.id === 'business-setup') return true;
    if (action.id === 'team-setup') return isAdmin;
    if (action.id === 'first-appointment') return hasPermission('appointments.create');
    if (action.id === 'view-reports') return hasPermission('reports.view');
    return false;
  });

  const recommendedActions = availableActions.filter(action => action.isRecommended);
  const completedActions = availableActions.filter(action => action.completed);

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <CardTitle>Primeiros Passos</CardTitle>
        </div>
        <CardDescription>
          Configure seu sistema para começar a usar todas as funcionalidades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendedActions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-orange-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Recomendado
              </h4>
              {recommendedActions.map((action) => (
                <ActionCard key={action.id} action={action} navigate={navigate} />
              ))}
            </div>
          )}

          {completedActions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-green-600">Concluído</h4>
              {completedActions.map((action) => (
                <ActionCard key={action.id} action={action} navigate={navigate} />
              ))}
            </div>
          )}

          {availableActions.filter(a => !a.completed && !a.isRecommended).map((action) => (
            <ActionCard key={action.id} action={action} navigate={navigate} />
          ))}
        </div>

        {completedActions.length === availableActions.length && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Parabéns!</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Você completou a configuração inicial. Agora pode aproveitar todas as funcionalidades!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ActionCardProps {
  action: QuickAction;
  navigate: (route: string) => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ action, navigate }) => (
  <div className={`
    flex items-center gap-3 p-3 rounded-lg border transition-colors
    ${action.completed 
      ? 'bg-green-50 border-green-200' 
      : action.isRecommended 
        ? 'bg-orange-50 border-orange-200' 
        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    }
  `}>
    <div className={`
      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
      ${action.completed 
        ? 'bg-green-100 text-green-600' 
        : action.isRecommended 
          ? 'bg-orange-100 text-orange-600'
          : 'bg-blue-100 text-blue-600'
      }
    `}>
      {action.completed ? <CheckCircle className="h-4 w-4" /> : action.icon}
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h4 className={`font-medium ${action.completed ? 'text-green-800' : 'text-gray-900'}`}>
          {action.title}
        </h4>
        {action.isRecommended && !action.completed && (
          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-600">
            Recomendado
          </Badge>
        )}
      </div>
      <p className={`text-sm ${action.completed ? 'text-green-600' : 'text-gray-500'}`}>
        {action.description}
      </p>
    </div>
    
    {!action.completed && (
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate(action.route)}
        className="flex-shrink-0"
      >
        Ir
        <ArrowRight className="h-3 w-3 ml-1" />
      </Button>
    )}
  </div>
);
