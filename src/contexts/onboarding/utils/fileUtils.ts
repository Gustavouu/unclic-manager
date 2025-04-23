/**
 * Utilities for file handling (previews, conversion, serialization)
 */

/**
 * Cria uma URL para visualização de um arquivo
 * @param file Arquivo para criar preview
 * @returns URL do objeto ou null em caso de erro
 */
export const createFilePreview = (file: File | null): string | null => {
  if (!file) return null;
  
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Erro ao criar preview do arquivo:", error);
    return null;
  }
};

/**
 * Revoga uma URL de objeto para liberar memória
 * @param url URL a ser revogada
 */
export const revokeFilePreview = (url: string | null): void => {
  if (!url || !url.startsWith('blob:')) return;
  
  try {
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao revogar URL:", error);
  }
};

/**
 * Converte um arquivo para string base64
 * @param file Arquivo para converter
 * @returns Promise com a string base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Arquivo não fornecido"));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error("Falha ao converter arquivo para base64"));
      }
    };
    
    reader.onerror = (event) => {
      reject(new Error(`Erro ao ler arquivo: ${event.target?.error?.message || 'Erro desconhecido'}`));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Converte uma string base64 de volta para um objeto File
 * @param base64 String base64 do arquivo
 * @param filename Nome do arquivo
 * @returns Objeto File ou null se falhar
 */
export const base64ToFile = (base64: string, filename: string): File | null => {
  if (!base64 || !filename) {
    console.error("Base64 ou nome do arquivo não fornecido");
    return null;
  }
  
  try {
    // Extrai o tipo MIME da string base64
    const mimeMatch = base64.match(/data:([^;]+);base64,/);
    if (!mimeMatch) {
      console.error("Formato base64 inválido, MIME não encontrado");
      return null;
    }
    
    const mime = mimeMatch[1];
    const base64Data = base64.replace(/^data:[^;]+;base64,/, '');
    
    // Converte base64 para binário
    const byteCharacters = atob(base64Data);
    const byteArrays: Uint8Array[] = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, { type: mime });
    return new File([blob], filename, { type: mime });
  } catch (error) {
    console.error("Erro ao converter base64 para arquivo:", error);
    return null;
  }
};

// Interfaces para serialização de arquivos
interface SerializedFile {
  type: string;
  name: string;
  lastModified: number;
  data: string; // base64 data sem o prefixo
}

/**
 * Serializa um arquivo para armazenamento (compatibilidade)
 * @param file Arquivo para serializar
 * @returns Promise com string JSON do arquivo serializado
 */
export const serializeFile = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("Arquivo não fornecido para serialização");
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        try {
          const base64Data = reader.result.split(',')[1]; // Remove o prefixo "data:MIME;base64,"
          
          if (!base64Data) {
            reject(new Error('Falha ao extrair dados base64 do arquivo'));
            return;
          }
          
          const serialized: SerializedFile = {
            type: file.type,
            name: file.name,
            lastModified: file.lastModified,
            data: base64Data
          };
          
          resolve(JSON.stringify(serialized));
        } catch (error) {
          reject(new Error(`Erro ao serializar arquivo: ${error}`));
        }
      } else {
        reject(new Error('Falha ao ler o arquivo como string'));
      }
    };
    
    reader.onerror = (event) => {
      reject(new Error(`Erro ao ler arquivo: ${event.target?.error?.message || 'Erro desconhecido'}`));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Deserializa um arquivo do armazenamento (compatibilidade)
 * @param serialized String JSON do arquivo serializado
 * @returns Objeto File ou null se falhar
 */
export const deserializeFile = (serialized: string): File | null => {
  if (!serialized) {
    console.error('String serializada não fornecida');
    return null;
  }
  
  try {
    const { type, name, lastModified, data }: SerializedFile = JSON.parse(serialized);
    
    if (!type || !name || !data) {
      console.error('Dados de arquivo incompletos após deserialização');
      return null;
    }
    
    const binaryString = atob(data);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return new File([bytes.buffer], name, { type, lastModified });
  } catch (error) {
    console.error('Erro ao deserializar o arquivo:', error);
    return null;
  }
};
