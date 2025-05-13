
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { useTenant } from "@/contexts/TenantContext";
import { BusinessSetupAlert } from "@/components/dashboard/BusinessSetupAlert";
import { ServicesTab } from "@/components/settings/tabs/ServicesTab";

// Import the tab components we'll need for settings
import BusinessInfoTab from "@/components/settings/tabs/BusinessInfoTab";
import UserProfileTab from "@/components/settings/tabs/UserProfileTab";
import NotificationsTab from "@/components/settings/tabs/NotificationsTab";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("business");
  const { businessNeedsSetup, loading } = useTenant();

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações do seu negócio e da sua conta."
      />

      {businessNeedsSetup && (
        <BusinessSetupAlert className="mb-6" />
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business">Negócio</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="business">
            <Card className="p-6">
              {businessNeedsSetup ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Primeiro configure seu negócio para acessar estas configurações.
                  </p>
                  <BusinessSetupAlert />
                </div>
              ) : (
                <BusinessInfoTab />
              )}
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>

          <TabsContent value="profile">
            <Card className="p-6">
              <UserProfileTab />
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <NotificationsTab />
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;
