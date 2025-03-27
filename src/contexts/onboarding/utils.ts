
// Re-export all utility functions for backward compatibility
import { checkOnboardingComplete } from "./utils/validationUtils";
import { 
  createFilePreview, 
  revokeFilePreview, 
  fileToBase64, 
  base64ToFile,
  serializeFile,
  deserializeFile
} from "./utils/fileUtils";
import { prepareDataForStorage } from "./utils/storageUtils";

export {
  // Validation utilities
  checkOnboardingComplete,
  
  // File utilities
  createFilePreview,
  revokeFilePreview,
  fileToBase64,
  base64ToFile,
  serializeFile,
  deserializeFile,
  
  // Storage utilities
  prepareDataForStorage
};
