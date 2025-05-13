
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';
import { Professional, ProfessionalFormData, ProfessionalStatus } from './types';
import { useProfessionalOperations } from './professionalOperations';

export const useProfessionals = () => {
  // Use the professional operations hook
  const operations = useProfessionalOperations();
  
  // Extract all the functionality and data
  const { 
    professionals, 
    isLoading, 
    error,
    fetchProfessionals,
    addProfessional,
    updateProfessional,
    updateProfessionalStatus,
    removeProfessional,
    getProfessionalById
  } = operations;

  // Get specialties from all professionals
  const specialties = Array.from(
    new Set(professionals.flatMap(p => p.specialties || []))
  );

  return {
    professionals,
    isLoading,
    error,
    fetchProfessionals,
    createProfessional: addProfessional,
    updateProfessional,
    deleteProfessional: removeProfessional,
    getProfessionalById,
    specialties
  };
};
