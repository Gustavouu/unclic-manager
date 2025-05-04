
export interface AddressData {
  cep?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  error?: string;
}

/**
 * Formats a Brazilian postal code (CEP)
 * @param cep CEP to format
 * @returns Formatted CEP
 */
export const formatCEP = (cep: string): string => {
  const numbers = cep.replace(/\D/g, '');
  
  if (numbers.length <= 5) {
    return numbers;
  }
  
  return `${numbers.substring(0, 5)}-${numbers.substring(5, 8)}`;
};

/**
 * Validates if a string is a valid CEP
 * @param cep CEP to validate
 * @returns Error message or null if valid
 */
export const validateCEP = (cep?: string): string | null => {
  if (!cep) return "CEP é obrigatório";
  
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    return "CEP inválido. O formato correto é 00000-000";
  }
  
  return null;
};

/**
 * Fetches address information using a CEP (Brazilian postal code)
 * @param cep Brazilian postal code (CEP)
 * @returns Object with address data or error message
 */
export const fetchAddressByCEP = async (cep: string): Promise<AddressData> => {
  // Clean up CEP format
  const cleanCep = cep.replace(/\D/g, '');
  
  // Validate CEP format
  if (cleanCep.length !== 8) {
    return { error: 'CEP inválido. Formato correto: 00000-000' };
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    // Check for error in ViaCEP response
    if (data.erro) {
      return { error: 'CEP não encontrado' };
    }
    
    return {
      cep: data.cep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return { error: 'Ocorreu um erro ao buscar o CEP' };
  }
};

/**
 * Formats a Brazilian address string
 * @param street Street name
 * @param number Street number
 * @param neighborhood Neighborhood
 * @param city City
 * @param state State
 * @returns Formatted address string
 */
export const formatAddress = (
  street: string,
  number: string,
  neighborhood: string,
  city: string,
  state: string
): string => {
  const parts: string[] = [];
  
  if (street) {
    parts.push(number ? `${street}, ${number}` : street);
  }
  
  if (neighborhood) {
    parts.push(neighborhood);
  }
  
  if (city || state) {
    parts.push([city, state].filter(Boolean).join(' - '));
  }
  
  return parts.join(', ');
};
