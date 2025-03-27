
import { BusinessData } from "../types";
import { fileToBase64, createFilePreview } from "./fileUtils";

/**
 * Prepares business data for storage in localStorage by
 * handling file conversions and creating URLs for previews
 */
export const prepareDataForStorage = (data: BusinessData): Partial<BusinessData> => {
  // Cria uma cópia para não modificar o original
  const preparedData = { ...data };
  
  // Handle logo file - convert to base64 if needed
  if (preparedData.logo instanceof File) {
    if (!preparedData.logoData) {
      // Convert file to base64 for storage
      fileToBase64(preparedData.logo).then(base64 => {
        preparedData.logoData = base64;
      }).catch(err => {
        console.error("Error converting logo to base64:", err);
      });
    }
    
    // Store metadata
    preparedData.logoName = preparedData.logo.name;
    
    // Create URL for preview if doesn't exist
    if (!preparedData.logoUrl) {
      preparedData.logoUrl = createFilePreview(preparedData.logo);
    }
    
    // Files can't be serialized, so set to null for storage
    preparedData.logo = null;
  }
  
  // Handle banner file - convert to base64 if needed
  if (preparedData.banner instanceof File) {
    if (!preparedData.bannerData) {
      // Convert file to base64 for storage
      fileToBase64(preparedData.banner).then(base64 => {
        preparedData.bannerData = base64;
      }).catch(err => {
        console.error("Error converting banner to base64:", err);
      });
    }
    
    // Store metadata
    preparedData.bannerName = preparedData.banner.name;
    
    // Create URL for preview if doesn't exist
    if (!preparedData.bannerUrl) {
      preparedData.bannerUrl = createFilePreview(preparedData.banner);
    }
    
    // Files can't be serialized, so set to null for storage
    preparedData.banner = null;
  }
  
  return preparedData;
};
