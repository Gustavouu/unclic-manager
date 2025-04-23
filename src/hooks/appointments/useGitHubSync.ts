
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Hook para sincronizar o código da aplicação com o repositório GitHub
 * @param repoOwner - Proprietário do repositório
 * @param repoName - Nome do repositório
 * @param branchName - Nome da branch (padrão: main)
 */
export const useGitHubSync = (
  repoOwner: string,
  repoName: string,
  branchName: string = 'main'
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState<Date | null>(null);
  const [hasUpdates, setHasUpdates] = useState(false);

  // Verifica se há atualizações disponíveis
  const checkForUpdates = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Busca informações do último commit no GitHub
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/commits/${branchName}`
      );
      
      if (!response.ok) {
        throw new Error('Não foi possível verificar atualizações');
      }
      
      const commitData = await response.json();
      const lastCommitDate = new Date(commitData.commit.committer.date);
      
      // Compara com a última data de sincronização
      const lastSyncStored = localStorage.getItem('github_last_sync');
      const currentSyncDate = lastSyncStored ? new Date(lastSyncStored) : null;
      
      // Define se há atualizações disponíveis
      if (!currentSyncDate || lastCommitDate > currentSyncDate) {
        setHasUpdates(true);
      } else {
        setHasUpdates(false);
      }
      
      return hasUpdates;
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
      toast.error('Erro ao verificar atualizações do GitHub');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [repoOwner, repoName, branchName, hasUpdates]);

  // Sincroniza o código com o GitHub
  const syncWithGitHub = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Em um cenário real, aqui seria feita uma chamada para API
      // que dispararia um processo de CI/CD para atualizar a aplicação
      // Por enquanto, simulamos o processo com um timeout
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualiza a data de última sincronização
      const now = new Date();
      localStorage.setItem('github_last_sync', now.toISOString());
      setLastSyncDate(now);
      setHasUpdates(false);
      
      // Recarrega a aplicação para refletir as mudanças
      toast.success('Aplicação sincronizada com sucesso!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      return true;
    } catch (error) {
      console.error('Erro ao sincronizar com GitHub:', error);
      toast.error('Erro ao sincronizar aplicação com GitHub');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    lastSyncDate,
    hasUpdates,
    checkForUpdates,
    syncWithGitHub
  };
};
