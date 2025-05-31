
/**
 * Converts a File object to base64 string
 * @param file - File object to convert
 * @returns Promise that resolves to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Creates a preview URL for a File object
 * @param file - File object to create preview for
 * @returns URL string for preview
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes a preview URL created by createFilePreview
 * @param url - URL string to revoke
 */
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Converts base64 string back to File object
 * @param base64 - Base64 string to convert
 * @param filename - Name for the file
 * @param mimeType - MIME type of the file
 * @returns File object
 */
export const base64ToFile = (base64: string, filename: string, mimeType: string = 'image/jpeg'): File => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type: mimeType });
};

/**
 * Serializes a File object for storage
 * @param file - File object to serialize
 * @returns Promise that resolves to serialized data
 */
export const serializeFile = async (file: File): Promise<{ data: string; name: string; type: string }> => {
  const base64 = await fileToBase64(file);
  return {
    data: base64,
    name: file.name,
    type: file.type
  };
};

/**
 * Deserializes file data back to File object
 * @param serializedFile - Serialized file data
 * @returns File object
 */
export const deserializeFile = (serializedFile: { data: string; name: string; type: string }): File => {
  return base64ToFile(serializedFile.data, serializedFile.name, serializedFile.type);
};
