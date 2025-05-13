
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Database, ArrowRightLeft, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { migrateAllData, migrateBusinessesData, migrateClientsData } from '@/utils/migrateData';
import { useAuth } from '@/hooks/useAuth';

export function DataMigrationTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleMigrateAll = async () => {
    setIsLoading(true);
    setStatus('running');
    setMessage('Migrando todos os dados para o novo formato padronizado...');
    
    try {
      const success = await migrateAllData();
      if (success) {
        setStatus('success');
        setMessage('Todos os dados foram migrados com sucesso! A aplicação agora está usando as novas tabelas padronizadas.');
      } else {
        throw new Error('Migração falhou');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(`Erro na migração: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigrateBusinesses = async () => {
    setIsLoading(true);
    setStatus('running');
    setMessage('Migrando dados de negócios...');
    
    try {
      const success = await migrateBusinessesData();
      if (success) {
        setStatus('success');
        setMessage('Dados de negócios migrados com sucesso!');
      } else {
        throw new Error('Migração de negócios falhou');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(`Erro na migração: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigrateClients = async () => {
    setIsLoading(true);
    setStatus('running');
    setMessage('Migrando dados de clientes...');
    
    try {
      const success = await migrateClientsData();
      if (success) {
        setStatus('success');
        setMessage('Dados de clientes migrados com sucesso!');
      } else {
        throw new Error('Migração de clientes falhou');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(`Erro na migração: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetStatus = () => {
    setStatus('idle');
    setMessage('');
  };

  // Only admin users should see this tool
  if (!user) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Ferramenta de Migração de Dados
        </CardTitle>
        <CardDescription>
          Esta ferramenta ajuda a migrar dados das tabelas antigas em português para as novas tabelas padronizadas em inglês.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Padronização de Nomenclatura
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Migra dados de tabelas como 'clientes', 'negocios', 'agendamentos' para as novas tabelas 'clients', 'businesses', 'bookings', etc.
            </p>
          </div>
          
          {status !== 'idle' && (
            <div className={`rounded-md border p-4 ${
              status === 'running' ? 'bg-blue-50 border-blue-200' : 
              status === 'success' ? 'bg-green-50 border-green-200' : 
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {status === 'running' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                {status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                <h3 className={`text-sm font-medium ${
                  status === 'running' ? 'text-blue-700' : 
                  status === 'success' ? 'text-green-700' : 
                  'text-red-700'
                }`}>
                  {status === 'running' ? 'Migrando dados' : 
                   status === 'success' ? 'Migração concluída' : 
                   'Erro na migração'}
                </h3>
              </div>
              <p className={`text-sm mt-1 ${
                status === 'running' ? 'text-blue-600' : 
                status === 'success' ? 'text-green-600' : 
                'text-red-600'
              }`}>
                {message}
              </p>
              {status !== 'running' && (
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetStatus}
                    className="text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Nova operação
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
        <Button 
          variant="outline" 
          onClick={handleMigrateBusinesses} 
          disabled={isLoading || status === 'running'}
        >
          {isLoading && status === 'running' ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowRightLeft className="h-4 w-4 mr-2" />
          )}
          Migrar Negócios
        </Button>
        <Button 
          variant="outline" 
          onClick={handleMigrateClients} 
          disabled={isLoading || status === 'running'}
        >
          {isLoading && status === 'running' ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowRightLeft className="h-4 w-4 mr-2" />
          )}
          Migrar Clientes
        </Button>
        <Button 
          variant="default" 
          onClick={handleMigrateAll} 
          disabled={isLoading || status === 'running'}
        >
          {isLoading && status === 'running' ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Database className="h-4 w-4 mr-2" />
          )}
          Migrar Todos os Dados
        </Button>
      </CardFooter>
    </Card>
  );
}
