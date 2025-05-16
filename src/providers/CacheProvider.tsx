
import { ReactNode, createContext, useContext, useState } from 'react';
import { clearCache } from '@/integrations/supabase/client';

interface CacheContextType {
  clearAllCache: () => void;
  clearCacheByKey: (key: string) => void;
}

const CacheContext = createContext<CacheContextType>({
  clearAllCache: () => {},
  clearCacheByKey: () => {},
});

interface CacheProviderProps {
  children: ReactNode;
}

export const CacheProvider = ({ children }: CacheProviderProps) => {
  const clearAllCache = () => {
    clearCache();
  };

  const clearCacheByKey = (key: string) => {
    clearCache(key);
  };

  return (
    <CacheContext.Provider value={{ clearAllCache, clearCacheByKey }}>
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = () => useContext(CacheContext);
