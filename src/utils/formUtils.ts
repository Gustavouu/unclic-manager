
import { toast } from "sonner";

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

/**
 * Shows a success toast notification
 */
export function showSuccessToast(message: string = "Operação realizada com sucesso!") {
  toast.success(message, {
    duration: 3000,
  });
}

/**
 * Shows an error toast notification
 */
export function showErrorToast(message: string = "Ocorreu um erro. Por favor, tente novamente.") {
  toast.error(message, {
    duration: 5000,
  });
}

/**
 * Mock function for simulating async operations (for prototypes)
 */
export async function mockSaveFunction(shouldSucceed: boolean = true): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(shouldSucceed);
    }, 1500);
  });
}
