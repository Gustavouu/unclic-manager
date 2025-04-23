import { useCallback, useRef } from "react";
import { BusinessData, ServiceData, StaffData, BusinessHours } from "../types";
import { prepareDataForStorage, SerializableBusinessData } from "../utils/storageUtils";
import { base64ToFile, createFilePreview } from "../utils/fileUtils";
import { initialBusinessHours } from "../initialValues";

interface StoredOnboardingData {
  businessData: SerializableBusinessData;
  services: ServiceData[];
  staffMembers: StaffData[];
  businessHours: BusinessHours;
  hasStaff: boolean;
  currentStep: number;
}

export const usePersistence = (
  businessData: BusinessData,
  services: ServiceData[], 
  staffMembers: StaffData[],
  businessHours: BusinessHours,
  hasStaff: boolean,
  currentStep: number,
  hasLoaded: React.MutableRefObject<boolean>,
  setBusinessData: React.Dispatch<React.SetStateAction<BusinessData>>,
  setServices: (services: ServiceData[]) => void,
  setStaffMembers: (staffMembers: StaffData[]) => void,
  setBusinessHours: (businessHours: BusinessHours) => void,
  setHasStaff: (hasStaff: boolean) => void,
  setCurrentStep: (step: number) => void
) => {
  const saveTimeoutRef = useRef<number | null>(null);
  const STORAGE_KEY = 'onboardingData';

  // Salva o progresso no localStorage
  const saveProgress = useCallback(async () => {
    // Pula o salvamento se o carregamento inicial não foi concluído ainda
    if (!hasLoaded.current) return;
    
    try {
      // Prepara os dados do negócio para armazenamento (converte arquivos para base64)
      const preparedBusinessData = await prepareDataForStorage(businessData);
      
      const dataToStore: StoredOnboardingData = {
        businessData: preparedBusinessData,
        services,
        staffMembers,
        businessHours,
        hasStaff,
        currentStep
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      console.debug("Dados de onboarding salvos com sucesso");
    } catch (error) {
      console.error("Erro ao salvar dados de onboarding:", error);
    }
  }, [businessData, services, staffMembers, businessHours, hasStaff, currentStep, hasLoaded]);

  // Carrega o progresso do localStorage
  const loadProgress = useCallback(() => {
    // Pula o carregamento se já foi carregado
    if (hasLoaded.current) {
      return;
    }
    
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      
      if (!savedData) {
        console.debug("Nenhum dado de onboarding encontrado no armazenamento");
        hasLoaded.current = true;
        return;
      }
      
      try {
        const parsed = JSON.parse(savedData) as StoredOnboardingData;
        
        // Carrega os dados do negócio
        const loadedBusinessData = { ...parsed.businessData } as BusinessData;
        
        // Trata a restauração do logo e banner a partir de dados base64
        if (loadedBusinessData.logoData && loadedBusinessData.logoName) {
          // Restaura o objeto File a partir da string base64
          const logoFile = base64ToFile(loadedBusinessData.logoData, loadedBusinessData.logoName);
          if (logoFile) {
            loadedBusinessData.logo = logoFile;
            // Cria uma nova URL apenas se não existir
            if (!loadedBusinessData.logoUrl) {
              loadedBusinessData.logoUrl = createFilePreview(logoFile);
            }
          } else {
            console.warn("Não foi possível restaurar o arquivo de logo");
          }
        }
        
        if (loadedBusinessData.bannerData && loadedBusinessData.bannerName) {
          // Restaura o objeto File a partir da string base64
          const bannerFile = base64ToFile(loadedBusinessData.bannerData, loadedBusinessData.bannerName);
          if (bannerFile) {
            loadedBusinessData.banner = bannerFile;
            // Cria uma nova URL apenas se não existir
            if (!loadedBusinessData.bannerUrl) {
              loadedBusinessData.bannerUrl = createFilePreview(bannerFile);
            }
          } else {
            console.warn("Não foi possível restaurar o arquivo de banner");
          }
        }
        
        // Atualiza os estados com os dados carregados
        setBusinessData(loadedBusinessData);
        setServices(parsed.services || []);
        setStaffMembers(parsed.staffMembers || []);
        setBusinessHours(parsed.businessHours || initialBusinessHours);
        setHasStaff(parsed.hasStaff || false);
        setCurrentStep(parsed.currentStep || 0);
        
        console.debug("Dados de onboarding carregados com sucesso");
      } catch (parseError) {
        console.error("Erro ao analisar dados de onboarding:", parseError);
        // Em caso de erro de análise, limpa os dados corrompidos
        localStorage.removeItem(STORAGE_KEY);
      }
      
      // Marca como carregado para evitar recarregamento
      hasLoaded.current = true;
    } catch (error) {
      console.error("Erro ao carregar dados de onboarding:", error);
      hasLoaded.current = true; // Marca como carregado mesmo se ocorrer um erro
    }
  }, [setBusinessData, setServices, setStaffMembers, setBusinessHours, setHasStaff, setCurrentStep, hasLoaded]);

  // Limpa todos os dados de onboarding do localStorage
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.debug("Dados de onboarding limpos com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao limpar dados de onboarding:", error);
      return false;
    }
  }, []);

  return {
    saveProgress,
    loadProgress,
    clearProgress,
    saveTimeoutRef
  };
};
