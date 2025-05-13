
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function migrateAllData() {
  try {
    toast.info('Iniciando migração de dados...', { duration: 2000 });
    
    const { data, error } = await supabase.rpc('migrate_all_data');
    
    if (error) throw error;
    
    toast.success('Migração de dados concluída com sucesso!');
    return true;
  } catch (err: any) {
    console.error('Erro durante a migração de dados:', err);
    toast.error(`Erro durante a migração: ${err.message}`);
    return false;
  }
}

export async function migrateBusinessesData() {
  try {
    toast.info('Migrando dados de negócios...', { duration: 2000 });
    
    const { data, error } = await supabase.rpc('migrate_businesses');
    
    if (error) throw error;
    
    toast.success('Migração de negócios concluída!');
    return true;
  } catch (err: any) {
    console.error('Erro durante a migração de negócios:', err);
    toast.error(`Erro durante a migração: ${err.message}`);
    return false;
  }
}

export async function migrateClientsData() {
  try {
    toast.info('Migrando dados de clientes...', { duration: 2000 });
    
    const { data, error } = await supabase.rpc('migrate_clients');
    
    if (error) throw error;
    
    toast.success('Migração de clientes concluída!');
    return true;
  } catch (err: any) {
    console.error('Erro durante a migração de clientes:', err);
    toast.error(`Erro durante a migração: ${err.message}`);
    return false;
  }
}
