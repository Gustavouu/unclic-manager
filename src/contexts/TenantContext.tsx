
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface TenantData {
  id: string;
  name: string;
  slug?: string;
  logo_url?: string;
  status: string;
}

interface TenantContextType {
  currentTenantId: string | null;
  tenants: TenantData[];
  currentTenant: TenantData | null;
  loading: boolean;
  error: string | null;
  setCurrentTenant: (tenantId: string) => void;
  refreshTenants: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType>({
  currentTenantId: null,
  tenants: [],
  currentTenant: null,
  loading: false,
  error: null,
  setCurrentTenant: () => {},
  refreshTenants: async () => {},
});

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(
    localStorage.getItem('currentBusinessId')
  );
  const [tenants, setTenants] = useState<TenantData[]>([]);
  const [currentTenant, setCurrentTenant] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  // Fetch list of tenants/businesses available to the user
  const fetchTenants = async () => {
    if (!user) {
      setTenants([]);
      setCurrentTenant(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, slug, logo_url, status')
        .order('name');
        
      if (error) throw error;
      
      setTenants(data || []);
      
      // If there's a currentTenantId but no currentTenant,
      // find the tenant in the list and set it
      if (currentTenantId && !currentTenant) {
        const tenant = data?.find(t => t.id === currentTenantId);
        if (tenant) {
          setCurrentTenant(tenant);
        } else if (data && data.length > 0) {
          // If the currentTenantId is not in the list but there are tenants,
          // set the first one as current
          setCurrentTenantId(data[0].id);
          localStorage.setItem('currentBusinessId', data[0].id);
          setCurrentTenant(data[0]);
        }
      } else if (data && data.length > 0 && !currentTenantId) {
        // If there's no currentTenantId but there are tenants,
        // set the first one as current
        setCurrentTenantId(data[0].id);
        localStorage.setItem('currentBusinessId', data[0].id);
        setCurrentTenant(data[0]);
      }
    } catch (err: any) {
      console.error('Error fetching tenants:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Set current tenant by ID
  const handleSetCurrentTenant = (tenantId: string) => {
    localStorage.setItem('currentBusinessId', tenantId);
    setCurrentTenantId(tenantId);
    
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      toast.success(`Negócio alterado para: ${tenant.name}`);
    } else {
      console.error('Tenant not found:', tenantId);
      toast.error('Negócio não encontrado');
    }
  };
  
  // Effect to fetch tenants when user changes
  useEffect(() => {
    fetchTenants();
  }, [user]);
  
  // Effect to update current tenant when currentTenantId changes
  useEffect(() => {
    if (currentTenantId && tenants.length > 0) {
      const tenant = tenants.find(t => t.id === currentTenantId);
      if (tenant) {
        setCurrentTenant(tenant);
      }
    }
  }, [currentTenantId, tenants]);

  return (
    <TenantContext.Provider
      value={{
        currentTenantId,
        tenants,
        currentTenant,
        loading,
        error,
        setCurrentTenant: handleSetCurrentTenant,
        refreshTenants: fetchTenants,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
