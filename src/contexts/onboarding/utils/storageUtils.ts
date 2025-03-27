
import { BusinessData } from "../types";
import { fileToBase64, createFilePreview } from "./fileUtils";

/**
 * Prepares business data for storage in localStorage by
 * handling file conversions and creating URLs for previews
 */
export const prepareDataForStorage = async (data: BusinessData): Promise<Partial<BusinessData>> => {
  // Create a copy to avoid modifying the original
  const preparedData = { ...data };
  
  // Handle logo file - convert to base64 if needed
  if (preparedData.logo instanceof File) {
    try {
      // Convert file to base64 for storage if not already done
      if (!preparedData.logoData) {
        preparedData.logoData = await fileToBase64(preparedData.logo);
      }
      
      // Store metadata
      preparedData.logoName = preparedData.logo.name;
      
      // Create URL for preview if doesn't exist
      if (!preparedData.logoUrl) {
        preparedData.logoUrl = createFilePreview(preparedData.logo);
      }
    } catch (err) {
      console.error("Error processing logo file:", err);
    }
    
    // Files can't be serialized, so set to null for storage
    preparedData.logo = null;
  }
  
  // Handle banner file - convert to base64 if needed
  if (preparedData.banner instanceof File) {
    try {
      // Convert file to base64 for storage if not already done
      if (!preparedData.bannerData) {
        preparedData.bannerData = await fileToBase64(preparedData.banner);
      }
      
      // Store metadata
      preparedData.bannerName = preparedData.banner.name;
      
      // Create URL for preview if doesn't exist
      if (!preparedData.bannerUrl) {
        preparedData.bannerUrl = createFilePreview(preparedData.banner);
      }
    } catch (err) {
      console.error("Error processing banner file:", err);
    }
    
    // Files can't be serialized, so set to null for storage
    preparedData.banner = null;
  }
  
  return preparedData;
};
