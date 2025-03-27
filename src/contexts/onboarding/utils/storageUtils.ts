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
      preparedData.logoData = await fileToBase64(preparedData.logo);
      preparedData.logoName = preparedData.logo.name;
      
      // Keep the logoUrl as is if it already exists
      if (!preparedData.logoUrl) {
        preparedData.logoUrl = createFilePreview(preparedData.logo);
      }
    } catch (err) {
      console.error("Error processing logo file:", err);
    }
    
    // Files can't be serialized, so set to null for storage
    preparedData.logo = null;
  } else if (!preparedData.logo && preparedData.logoData) {
    // If we have logoData but no File, keep the data for persistence
    preparedData.logoUrl = preparedData.logoUrl || null;
  }
  
  // Handle banner file - convert to base64 if needed
  if (preparedData.banner instanceof File) {
    try {
      // Convert file to base64 for storage if not already done
      preparedData.bannerData = await fileToBase64(preparedData.banner);
      preparedData.bannerName = preparedData.banner.name;
      
      // Keep the bannerUrl as is if it already exists
      if (!preparedData.bannerUrl) {
        preparedData.bannerUrl = createFilePreview(preparedData.banner);
      }
    } catch (err) {
      console.error("Error processing banner file:", err);
    }
    
    // Files can't be serialized, so set to null for storage
    preparedData.banner = null;
  } else if (!preparedData.banner && preparedData.bannerData) {
    // If we have bannerData but no File, keep the data for persistence
    preparedData.bannerUrl = preparedData.bannerUrl || null;
  }
  
  return preparedData;
};
