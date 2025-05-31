
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
