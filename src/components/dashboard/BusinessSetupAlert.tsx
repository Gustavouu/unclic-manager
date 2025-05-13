
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import { Rocket, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

interface BusinessSetupAlertProps {
  message?: string;
  showButton?: boolean;
  className?: string;
}

export const BusinessSetupAlert: React.FC<BusinessSetupAlertProps> = ({ 
  message = "Você precisa configurar seu negócio para acessar esta funcionalidade.",
  showButton = true,
  className = ""
}) => {
  const navigate = useNavigate();
  const { refreshBusinessData } = useTenant();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleOnboarding = () => {
    navigate('/onboarding');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshBusinessData();
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast.error("Não foi possível atualizar os dados do negócio.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Alert className={className}>
      <AlertTitle>Configuração Necessária</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>{message}</p>
        
        {showButton && (
          <div className="flex flex-wrap gap-3 mt-4">
            <Button onClick={handleOnboarding} variant="default">
              <Rocket className="mr-2 h-4 w-4" />
              Configurar Negócio
            </Button>
            
            <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
              <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? "Atualizando..." : "Atualizar Dados"}
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default BusinessSetupAlert;
