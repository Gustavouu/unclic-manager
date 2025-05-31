
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';

const Settings = () => {
  return (
    <OnboardingRedirect>
      <div className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">Gerencie as configurações do seu negócio</p>
          </div>

          {/* Settings placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <SettingsIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Configurações em desenvolvimento</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Esta funcionalidade será implementada nas próximas fases
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </OnboardingRedirect>
  );
};

export default Settings;
