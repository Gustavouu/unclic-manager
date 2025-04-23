
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useGitHubSync } from '@/hooks/appointments/useGitHubSync';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GitHubSyncButtonProps {
  repoOwner: string;
  repoName: string;
  branchName?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  autoCheck?: boolean;
  checkInterval?: number; // em minutos
}

export const GitHubSyncButton = ({
  repoOwner,
  repoName,
  branchName = 'main',
  className = '',
  variant = 'outline',
  autoCheck = true,
  checkInterval = 60
}: GitHubSyncButtonProps) => {
  const {
    isLoading,
    lastSyncDate,
    hasUpdates,
    checkForUpdates,
    syncWithGitHub
  } = useGitHubSync(repoOwner, repoName, branchName);
  
  const [lastCheckDate, setLastCheckDate] = useState<Date | null>(null);

  // Verifica atualizações ao carregar o componente
  useEffect(() => {
    if (autoCheck) {
      checkForUpdates().then(() => {
        setLastCheckDate(new Date());
      });
      
      // Configura verificação periódica
      const intervalId = setInterval(() => {
        checkForUpdates().then(() => {
          setLastCheckDate(new Date());
        });
      }, checkInterval * 60 * 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [autoCheck, checkInterval, checkForUpdates]);

  // Formata a data da última sincronização
  const getLastSyncText = () => {
    if (!lastSyncDate) return 'Nunca sincronizado';
    return `Última sinc: ${format(lastSyncDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {hasUpdates && (
        <Badge variant="destructive" className="animate-pulse">
          Atualizações disponíveis
        </Badge>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={variant} 
              size="sm" 
              onClick={isLoading ? undefined : syncWithGitHub}
              disabled={isLoading || !hasUpdates}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className={`h-4 w-4 ${hasUpdates ? 'animate-pulse text-yellow-500' : ''}`} />
              )}
              {hasUpdates ? 'Atualizar' : 'Sincronizado'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getLastSyncText()}</p>
            {lastCheckDate && (
              <p className="text-xs text-muted-foreground">
                Última verificação: {format(lastCheckDate, "HH:mm", { locale: ptBR })}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
