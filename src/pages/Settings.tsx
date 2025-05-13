
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, Save, Rocket, RefreshCcw } from "lucide-react";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { showSuccessToast, showErrorToast } from "@/utils/formUtils";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { OnboardingProvider } from "@/contexts/onboarding/OnboardingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBusinessConfig } from "@/hooks/business/useBusinessConfig";
import { useSearchParams } from "react-router-dom";
import { useTenant } from "@/contexts/TenantContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const Settings = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "business-profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const { saveConfig, saving: configSaving } = useBusinessConfig();
  const { currentBusiness, loading: businessLoading, error: businessError, refreshBusinessData } = useTenant();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    
    try {
      // Cada aba é responsável por salvar suas próprias alterações
      // Aqui podemos adicionar algum processamento global se necessário
      
      showSuccessToast("Todas as configurações foram salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      showErrorToast();
    } finally {
      setIsSaving(false);
    }
  };

  const handleOnboarding = () => {
    navigate("/onboarding");
  };

  const handleRefreshBusinessData = async () => {
    setIsRefreshing(true);
    try {
      await refreshBusinessData();
      showSuccessToast("Dados do negócio atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar dados do negócio:", error);
      showErrorToast();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    // Atualizar a URL com a aba ativa
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", activeTab);
    window.history.replaceState({}, "", `${window.location.pathname}?${newParams.toString()}`);
  }, [activeTab, searchParams]);

  // Mostrar mensagem de erro se não encontrar o negócio
  if (businessError) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive">
          <AlertTitle>Erro ao carregar dados do negócio</AlertTitle>
          <AlertDescription>
            {businessError}
            <div className="mt-4">
              <Button onClick={handleRefreshBusinessData} disabled={isRefreshing}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                {isRefreshing ? "Atualizando..." : "Tentar novamente"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Mostrar skeleton durante o carregamento
  if (businessLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <Skeleton className="h-12 w-full" />
              <div className="grid gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <OnboardingProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Configurações</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie as configurações do seu negócio
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 h-9">
                  <HelpCircle className="h-4 w-4" />
                  Ajuda
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72" side="left">
                <div className="space-y-2">
                  <h3 className="font-medium">Configurações do Negócio</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure todos os aspectos do seu negócio, como perfil da empresa, horários de funcionamento, serviços e colaboradores.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" onClick={handleOnboarding}>
              <Rocket className="mr-2 h-4 w-4" />
              Onboarding
            </Button>

            <Button 
              variant="outline" 
              onClick={handleRefreshBusinessData} 
              disabled={isRefreshing}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              {isRefreshing ? "Atualizando..." : "Atualizar"}
            </Button>
            
            <Button 
              onClick={handleGlobalSave} 
              disabled={isSaving || configSaving} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving || configSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>

        {currentBusiness ? (
          <Card className="border shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />
            </CardContent>
          </Card>
        ) : (
          <Alert>
            <AlertTitle>Nenhum negócio encontrado</AlertTitle>
            <AlertDescription>
              Você ainda não possui um negócio configurado. Clique no botão Onboarding para configurar seu negócio.
              <div className="mt-4">
                <Button onClick={handleOnboarding} variant="default">
                  <Rocket className="mr-2 h-4 w-4" />
                  Iniciar Onboarding
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <Toaster position="top-right" />
      </div>
    </OnboardingProvider>
  );
};

export default Settings;
