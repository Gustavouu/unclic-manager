
/**
 * Validates an email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number
 */
export function validatePhone(phone: string): boolean {
  // Basic validation - at least 8 digits
  const phoneRegex = /^\+?[\d\s()-]{8,}$/;
  return phoneRegex.test(phone);
}

/**
 * Formats a phone number
 */
export function formatPhone(phone: string): string {
  // Remove non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for Brazil (assuming Brazilian format)
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  }
  
  return phone;
}
