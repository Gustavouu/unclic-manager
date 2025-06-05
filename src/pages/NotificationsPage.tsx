
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { Bell, Settings } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  return (
    <OnboardingRedirect>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centro de Notificações</h1>
          <p className="text-gray-600">Gerencie suas notificações e configurações</p>
        </div>

        <Tabs defaultValue="center" className="space-y-4">
          <TabsList>
            <TabsTrigger value="center" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Central de Notificações
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="center">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="settings">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </OnboardingRedirect>
  );
};

export default NotificationsPage;
