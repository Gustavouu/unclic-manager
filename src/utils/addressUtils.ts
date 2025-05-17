
interface AddressResponse {
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  error?: string;
}

// Function to fetch address by Brazilian CEP (ZIP Code)
export const fetchAddressByCEP = async (cep: string): Promise<AddressResponse> => {
  // Remove any non-digit characters
  const cleanCEP = cep.replace(/\D/g, '');
  
  if (cleanCEP.length !== 8) {
    return { error: 'CEP deve ter 8 dígitos' };
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return { error: 'CEP não encontrado' };
    }
    
    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf
    };
  } catch (error) {
    console.error('Error fetching address:', error);
    return { error: 'Erro ao buscar endereço' };
  }
};

// Format a full address from components
export const formatAddress = (
  street?: string, 
  number?: string, 
  complement?: string, 
  neighborhood?: string,
  city?: string,
  state?: string
): string => {
  const parts = [
    street,
    number && `${number}`,
    complement && `${complement}`,
    neighborhood && `${neighborhood}`,
    (city || state) && [city, state].filter(Boolean).join(', ')
  ].filter(Boolean);
  
  return parts.join(', ');
};
