
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Users, Settings, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'new-appointment',
      title: 'Novo Agendamento',
      description: 'Criar um novo agendamento',
      icon: <Calendar className="h-5 w-5" />,
      action: () => navigate('/appointments'),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      id: 'new-client',
      title: 'Novo Cliente',
      description: 'Cadastrar um novo cliente',
      icon: <Users className="h-5 w-5" />,
      action: () => navigate('/clients'),
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      id: 'view-reports',
      title: 'Relatórios',
      description: 'Ver relatórios e análises',
      icon: <BarChart3 className="h-5 w-5" />,
      action: () => navigate('/reports'),
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      id: 'settings',
      title: 'Configurações',
      description: 'Gerenciar configurações',
      icon: <Settings className="h-5 w-5" />,
      action: () => navigate('/settings'),
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={action.action}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg text-white ${action.color}`}>
                  {action.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-gray-500">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
