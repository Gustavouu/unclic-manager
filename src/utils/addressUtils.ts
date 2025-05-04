
export interface AddressData {
  cep?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  error?: string;
}

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
