
import { toast } from "sonner";

// Valida formato do CEP
export const validateCEP = (cep: string): string | null => {
  if (!cep) return null;
  
  const cepRegex = /^\d{5}-?\d{3}$/;
  if (!cepRegex.test(cep)) {
    return "CEP inválido (formato: 00000-000)";
  }
  return null;
};

// Função para formatar CEP
export const formatCEP = (cep: string): string => {
  // Remove tudo que não for número
  const numericCEP = cep.replace(/\D/g, '');
  
  // Formata como 00000-000
  if (numericCEP.length <= 5) {
    return numericCEP;
  }
  
  return `${numericCEP.slice(0, 5)}-${numericCEP.slice(5, 8)}`;
};

// Interface para os dados de endereço
export interface AddressData {
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  error?: string;
}

// Busca endereço pelo CEP usando a API ViaCEP
export const fetchAddressByCEP = async (cep: string): Promise<AddressData> => {
  try {
    // Remove caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, '');
    
    // Verifica se o CEP tem o tamanho correto
    if (cleanCEP.length !== 8) {
      return { error: "CEP deve conter 8 dígitos" };
    }
    
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return { error: "CEP não encontrado" };
    }
    
    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      zipCode: cleanCEP
    };
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return { error: "Erro ao buscar informações do CEP" };
  }
};

// Função para gerar endereço formatado
export const formatAddress = (addressData: AddressData): string => {
  const { street, neighborhood, city, state } = addressData;
  
  const parts = [
    street,
    neighborhood ? neighborhood : null,
    city && state ? `${city} - ${state}` : city || state
  ].filter(Boolean);
  
  return parts.join(', ');
};
