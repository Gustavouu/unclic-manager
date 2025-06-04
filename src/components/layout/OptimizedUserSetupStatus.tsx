
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { usePermissions } from '@/hooks/security/usePermissions';
import { useOptimizedDashboard } from '@/hooks/data/useOptimizedDashboard';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  Users, 
  Calendar, 
  Shield,
  ArrowRight
} from 'lucide-react';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  route?: string;
}

export const OptimizedUserSetupStatus = () => {
  const { user } = useAuth();
  const { businessId, currentBusiness } = useTenant();
  const { permissions, isAdmin, loading } = usePermissions();
  const { metrics } = useOptimizedDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasBasicPermissions = permissions.length > 0;
  const hasBusinessInfo = currentBusiness?.name;
  const hasData = metrics.totalClients > 0 || metrics.todayAppointments > 0;

  const setupSteps: SetupStep[] = [
    {
      id: 'business',
      title: 'Informações do Negócio',
      description: hasBusinessInfo ? `${currentBusiness.name}` : 'Configurar informações básicas',
      icon: <Settings className="h-4 w-4" />,
      completed: !!hasBusinessInfo,
      route: '/onboarding'
    },
    {
      id: 'permissions',
      title: 'Permissões de Acesso',
      description: hasBasicPermissions ? `${permissions.length} permissões ativas` : 'Configurar permissões',
      icon: <Shield className="h-4 w-4" />,
      completed: hasBasicPermissions
    },
    {
      id: 'team',
      title: 'Configuração de Equipe',
      description: isAdmin ? 'Acesso administrativo completo' : 'Acesso configurado',
      icon: <Users className="h-4 w-4" />,
      completed: hasBasicPermissions
    },
    {
      id: 'data',
      title: 'Dados Iniciais',
      description: hasData ? 'Dados existentes encontrados' : 'Adicionar primeiros dados',
      icon: <Calendar className="h-4 w-4" />,
      completed: hasData,
      route: hasBasicPermissions ? '/clients' : undefined
    }
  ];

  const completedSteps = setupSteps.filter(step => step.completed).length;
  const progress = (completedSteps / setupSteps.length) * 100;
  const isFullySetup = completedSteps === setupSteps.length;

  if (isFullySetup) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-green-800">Sistema Configurado ✨</p>
              <p className="text-sm text-green-600">
                {metrics.totalClients} clientes, {metrics.todayAppointments} agendamentos hoje
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Configuração do Sistema</CardTitle>
            <CardDescription>
              {completedSteps} de {setupSteps.length} etapas concluídas
            </CardDescription>
          </div>
          <Badge variant={progress === 100 ? 'default' : 'secondary'}>
            {Math.round(progress)}%
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        {setupSteps.map((step) => (
          <div 
            key={step.id} 
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              step.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              ${step.completed 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-400'
              }
            `}>
              {step.completed ? <CheckCircle className="h-4 w-4" /> : step.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium ${step.completed ? 'text-green-800' : 'text-gray-900'}`}>
                {step.title}
              </h4>
              <p className={`text-sm ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                {step.description}
              </p>
            </div>
            
            {!step.completed && step.route && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(step.route!)}
                className="flex-shrink-0"
              >
                Configurar
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        ))}

        {!isFullySetup && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span>
                Complete a configuração para aproveitar todas as funcionalidades
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
