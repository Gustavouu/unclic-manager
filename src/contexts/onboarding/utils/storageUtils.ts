
import { BusinessData } from "../types";
import { fileToBase64, createFilePreview } from "./fileUtils";

/**
 * Interface para dados serializáveis do negócio
 * Exclui propriedades File pois não são serializáveis
 */
export interface SerializableBusinessData extends Omit<BusinessData, 'logo' | 'banner'> {
  logo: null;
  banner: null;
  logoData?: string;
  logoName?: string;
  logoUrl?: string;
  bannerData?: string;
  bannerName?: string;
  bannerUrl?: string;
}

/**
 * Prepara os dados do negócio para armazenamento no localStorage
 * convertendo arquivos para base64 e criando URLs para previews
 * 
 * @param data Dados do negócio com possíveis arquivos
 * @returns Dados preparados para armazenamento sem objetos File
 */
export const prepareDataForStorage = async (data: BusinessData): Promise<SerializableBusinessData> => {
  if (!data) {
    throw new Error("Dados do negócio não fornecidos");
  }
  
  // Cria uma cópia para evitar modificar o original
  const preparedData: SerializableBusinessData = {
    ...data,
    logo: null,
    banner: null
  };
  
  // Trata o arquivo de logo - converte para base64 se necessário
  if (data.logo && typeof data.logo === 'object' && data.logo !== null && 'name' in data.logo) {
    try {
      // Converte arquivo para base64 para armazenamento
      preparedData.logoData = await fileToBase64(data.logo as File);
      preparedData.logoName = (data.logo as File).name;
      
      // Mantém a URL do logo se já existir
      if (!preparedData.logoUrl) {
        preparedData.logoUrl = createFilePreview(data.logo as File);
      }
    } catch (error) {
      console.error("Erro ao processar arquivo de logo:", error);
      // Em caso de erro, limpa os dados para evitar inconsistências
      preparedData.logoData = undefined;
      preparedData.logoName = undefined;
    }
  } else if (!data.logo && data.logoData) {
    // Se temos logoData mas não temos File, mantém os dados para persistência
    preparedData.logoUrl = data.logoUrl || null;
  }
  
  // Trata o arquivo de banner - converte para base64 se necessário
  if (data.banner && typeof data.banner === 'object' && data.banner !== null && 'name' in data.banner) {
    try {
      // Converte arquivo para base64 para armazenamento
      preparedData.bannerData = await fileToBase64(data.banner as File);
      preparedData.bannerName = (data.banner as File).name;
      
      // Mantém a URL do banner se já existir
      if (!preparedData.bannerUrl) {
        preparedData.bannerUrl = createFilePreview(data.banner as File);
      }
    } catch (error) {
      console.error("Erro ao processar arquivo de banner:", error);
      // Em caso de erro, limpa os dados para evitar inconsistências
      preparedData.bannerData = undefined;
      preparedData.bannerName = undefined;
    }
  } else if (!data.banner && data.bannerData) {
    // Se temos bannerData mas não temos File, mantém os dados para persistência
    preparedData.bannerUrl = data.bannerUrl || null;
  }
  
  return preparedData;
};
