
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseTables = () => {
  const [tablesStatus, setTablesStatus] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkTables = async () => {
      setLoading(true);
      setError(null);
      
      // Lista de tabelas principais da aplicação
      const tablesToCheck = [
        'businesses',
        'business_users',
        'business_settings',
        'services',
        'professionals',
        'clients',
        'appointments'
      ];
      
      const results: {[key: string]: boolean} = {};
      
      try {
        // Verificar cada tabela
        for (const table of tablesToCheck) {
          try {
            // Tenta uma consulta simples para verificar se a tabela existe
            const { error } = await supabase
              .from(table)
              .select('id')
              .limit(1);
            
            // Se não houver erro, a tabela existe e está acessível
            results[table] = !error;
          } catch (tableError) {
            console.error(`Erro ao verificar tabela ${table}:`, tableError);
            results[table] = false;
          }
        }
        
        setTablesStatus(results);
      } catch (err: any) {
        console.error('Erro ao verificar tabelas:', err);
        setError(err.message || 'Erro ao verificar tabelas do banco de dados');
      } finally {
        setLoading(false);
      }
    };
    
    checkTables();
  }, []);

  return { tablesStatus, loading, error };
};
