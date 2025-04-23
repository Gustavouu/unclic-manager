import { useCallback, useEffect, useRef } from "react";
import { BusinessData } from "../types";
import { revokeFilePreview, createFilePreview } from "../utils/fileUtils";

export const useBusinessDataState = (
  saveTimeoutRef: React.MutableRefObject<number | null>, 
  saveProgress: () => void,
  businessData: BusinessData,
  setBusinessData: React.Dispatch<React.SetStateAction<BusinessData>>
) => {
  // Rastreador de URLs de blob criadas para limpeza adequada
  const createdBlobUrls = useRef<Set<string>>(new Set());

  // Limpa as URLs de blob quando o componente é desmontado ou quando as URLs mudam
  useEffect(() => {
    const currentLogoUrl = businessData.logoUrl;
    const currentBannerUrl = businessData.bannerUrl;

    // Rastrear URLs recém-criadas
    if (currentLogoUrl?.startsWith('blob:')) {
      createdBlobUrls.current.add(currentLogoUrl);
    }
    if (currentBannerUrl?.startsWith('blob:')) {
      createdBlobUrls.current.add(currentBannerUrl);
    }

    return () => {
      // Limpa apenas as URLs criadas por este componente, não as carregadas do armazenamento
      if (currentLogoUrl?.startsWith('blob:')) {
        revokeFilePreview(currentLogoUrl);
        createdBlobUrls.current.delete(currentLogoUrl);
      }
      if (currentBannerUrl?.startsWith('blob:')) {
        revokeFilePreview(currentBannerUrl);
        createdBlobUrls.current.delete(currentBannerUrl);
      }
    };
  }, [businessData.logoUrl, businessData.bannerUrl]);

  // Limpa todas as URLs na desmontagem final do componente
  useEffect(() => {
    return () => {
      // Limpa todas as URLs restantes quando o componente for completamente desmontado
      createdBlobUrls.current.forEach(url => {
        revokeFilePreview(url);
      });
      createdBlobUrls.current.clear();
    };
  }, []);

  // Função auxiliar para criar previews de arquivos
  const handleFileChange = useCallback((
    file: File | null, 
    fileType: 'logo' | 'banner'
  ): Partial<BusinessData> => {
    if (!file) {
      return fileType === 'logo' 
        ? { logo: null, logoUrl: null, logoName: undefined, logoData: undefined }
        : { banner: null, bannerUrl: null, bannerName: undefined, bannerData: undefined };
    }

    // Limpa URL anterior se existir
    const oldUrl = fileType === 'logo' ? businessData.logoUrl : businessData.bannerUrl;
    if (oldUrl?.startsWith('blob:')) {
      revokeFilePreview(oldUrl);
      createdBlobUrls.current.delete(oldUrl);
    }

    // Cria nova URL
    const previewUrl = createFilePreview(file);
    
    if (previewUrl) {
      createdBlobUrls.current.add(previewUrl);
    }

    return fileType === 'logo'
      ? { logo: file, logoUrl: previewUrl, logoName: file.name }
      : { banner: file, bannerUrl: previewUrl, bannerName: file.name };
  }, [businessData.logoUrl, businessData.bannerUrl]);

  // Atualiza os dados do negócio com comparação profunda para evitar atualizações desnecessárias
  const updateBusinessData = useCallback((data: Partial<BusinessData>) => {
    setBusinessData(prev => {
      // Processa arquivos especificamente se presentes em data
      if ('logo' in data && data.logo instanceof File) {
        data = {
          ...data,
          ...handleFileChange(data.logo, 'logo')
        };
      }

      if ('banner' in data && data.banner instanceof File) {
        data = {
          ...data,
          ...handleFileChange(data.banner, 'banner')
        };
      }

      // Verifica se algum dos dados é diferente antes de atualizar
      const hasChanges = Object.keys(data).some(key => {
        const k = key as keyof BusinessData;
        
        // Comparação especial para objetos File
        if (k === 'logo' || k === 'banner') {
          return (prev[k] === null && data[k] !== null) || 
                 (prev[k] !== null && data[k] === null) ||
                 (prev[k] instanceof File && data[k] instanceof File && 
                  prev[k].name !== data[k].name);
        }
        
        return prev[k] !== data[k];
      });
      
      // Apenas atualiza se algo mudou
      if (!hasChanges) {
        return prev;
      }
      
      // Cria novo objeto de dados com atualizações
      const newData = { ...prev, ...data };
      
      // Agenda um salvamento com debounce
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = window.setTimeout(() => {
        saveProgress();
        saveTimeoutRef.current = null;
      }, 500);
      
      return newData;
    });
  }, [setBusinessData, saveTimeoutRef, saveProgress, handleFileChange]);

  return {
    updateBusinessData,
    handleFileChange
  };
};
