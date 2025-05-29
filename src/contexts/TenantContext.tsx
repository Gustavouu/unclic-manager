
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface TenantContextType {
  businessId: string | null;
  businessName: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setBusinessId: (id: string | null) => void;
  refreshBusiness: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType>({
  businessId: null,
  businessName: null,
  user: null,
  isLoading: true,
  error: null,
  setBusinessId: () => {},
  refreshBusiness: async () => {},
});

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: React.ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshBusiness = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        setUser(null);
        setBusinessId(null);
        setBusinessName(null);
        setIsLoading(false);
        return;
      }

      setUser(currentUser);
      console.info('Auth state changed:', currentUser ? 'SIGNED_IN' : 'SIGNED_OUT', currentUser?.id);

      if (currentUser) {
        console.info('Getting business for user', currentUser.id);
        
        // Try to get business from business_users table first
        const { data: businessUsers, error: businessUsersError } = await supabase
          .from('business_users')
          .select('business_id, businesses(id, name)')
          .eq('user_id', currentUser.id)
          .limit(1)
          .single();

        if (businessUsers && businessUsers.businesses) {
          const business = businessUsers.businesses as any;
          setBusinessId(business.id);
          setBusinessName(business.name);
          console.info('Found business ID:', business.id);
        } else {
          // Fallback: try application_users table
          const { data: appUser, error: appUserError } = await supabase
            .from('application_users')
            .select('business_id')
            .eq('email', currentUser.email)
            .single();

          if (appUser?.business_id) {
            const { data: business } = await supabase
              .from('businesses')
              .select('id, name')
              .eq('id', appUser.business_id)
              .single();

            if (business) {
              setBusinessId(business.id);
              setBusinessName(business.name);
              console.info('Found business ID from app users:', business.id);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Error refreshing business:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshBusiness();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      refreshBusiness();
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: TenantContextType = {
    businessId,
    businessName,
    user,
    isLoading,
    error,
    setBusinessId,
    refreshBusiness,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
