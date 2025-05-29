
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jcdymkgmtxpryceziazt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZHlta2dtdHhwcnljZXppYXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MjQyNTIsImV4cCI6MjA1ODEwMDI1Mn0.xQxEnFLVLRP_x3TXETogDGTQ4g5qksHLlDWszrEFxwA';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Available RPC functions based on the schema
const availableFunctions = [
  'belongs_to_tenant',
  'clear_tenant_context', 
  'fetch_agendamentos',
  'get_current_tenant_context',
  'get_current_tenant_id',
  'get_user_business_id',
  'get_user_business_ids',
  'get_user_tenant_id',
  'has_permission',
  'obter_metricas_periodo',
  'set_tenant_context',
  'user_belongs_to_tenant',
  'user_has_permission_on_resource',
  'user_has_role',
  'user_is_admin_for_tenant',
  'usuario_tem_acesso_ao_negocio',
  'verificar_completar_onboarding',
  'verificar_completar_onboarding_v2'
];

export const createRpcFunction = (functionName: string) => {
  if (!availableFunctions.includes(functionName)) {
    console.warn(`Function ${functionName} is not available in the current schema`);
    return () => Promise.resolve(null);
  }
  
  return (params?: any) => supabase.rpc(functionName, params);
};
