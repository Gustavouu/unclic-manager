
/**
 * Utility functions for sanitizing user input to prevent XSS attacks
 */

/**
 * Sanitizes a string by removing HTML tags
 * @param input String to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Replace HTML tags with empty string
  return input.replace(/<\/?[^>]+(>|$)/g, '');
};

/**
 * Sanitizes HTML content, allowing only specific safe tags
 * @param html HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof html !== 'string') return '';
  
  // Create a temporary DOM element
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  
  // Remove script tags and on* attributes
  const scriptElements = tempElement.getElementsByTagName('script');
  while (scriptElements.length > 0) {
    scriptElements[0].parentNode?.removeChild(scriptElements[0]);
  }
  
  // Remove potentially harmful attributes
  const allElements = tempElement.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const attributes = allElements[i].attributes;
    for (let j = attributes.length - 1; j >= 0; j--) {
      const attributeName = attributes[j].name.toLowerCase();
      
      // Remove event handler attributes
      if (attributeName.startsWith('on') || 
          attributeName === 'href' && attributes[j].value.toLowerCase().startsWith('javascript:')) {
        allElements[i].removeAttribute(attributeName);
      }
    }
  }
  
  // Return sanitized HTML
  return tempElement.innerHTML;
};

/**
 * Sanitizes SQL input to prevent SQL injection
 * @param input String to sanitize
 * @returns Sanitized string safe for SQL queries
 */
export const sanitizeSQLInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Replace quotes and other potentially dangerous characters
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, "\\\\")
    .replace(/\0/g, "\\0");
};

/**
 * Sanitizes form data object
 * @param formData Object containing form data
 * @returns Sanitized form data object
 */
export const sanitizeFormData = <T extends Record<string, any>>(formData: T): T => {
  const sanitized = { ...formData };
  
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]);
    }
  });
  
  return sanitized;
};
