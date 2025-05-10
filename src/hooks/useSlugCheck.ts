
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SlugCheckResult = {
  slug: string;
  isAvailable: boolean;
  suggestions: { name: string; slug: string }[];
  existingBusiness: { id: string; name: string } | null;
  loading: boolean;
  error: string | null;
};

export function useSlugCheck(businessName: string) {
  const [result, setResult] = useState<SlugCheckResult>({
    slug: "",
    isAvailable: true,
    suggestions: [],
    existingBusiness: null,
    loading: false,
    error: null
  });
  
  const [debouncedName, setDebouncedName] = useState(businessName);
  
  // Debounce the name input to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (businessName && businessName.trim().length >= 3) {
        setDebouncedName(businessName);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [businessName]);
  
  // Check slug availability
  const checkSlug = useCallback(async (name: string) => {
    if (!name || name.trim().length < 3) {
      setResult(prev => ({
        ...prev,
        slug: "",
        isAvailable: true,
        suggestions: [],
        existingBusiness: null,
        loading: false
      }));
      return;
    }
    
    setResult(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.functions.invoke(
        'check-slug-availability',
        {
          body: { name },
        }
      );
      
      if (error) {
        throw new Error(error.message);
      }
      
      setResult({
        slug: data.slug,
        isAvailable: data.isAvailable,
        suggestions: data.suggestions || [],
        existingBusiness: data.existingBusiness,
        loading: false,
        error: null
      });
      
    } catch (error: any) {
      setResult(prev => ({
        ...prev,
        loading: false,
        error: error.message || "Erro ao verificar disponibilidade do nome"
      }));
    }
  }, []);
  
  // Check slug when debounced name changes
  useEffect(() => {
    if (debouncedName && debouncedName.trim().length >= 3) {
      checkSlug(debouncedName);
    }
  }, [debouncedName, checkSlug]);
  
  return result;
}
