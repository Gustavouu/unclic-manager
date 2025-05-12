
import { z } from "zod";
import { toast } from "sonner";

// Generic validate function for Zod schemas
export function validateInput<T>(data: unknown, schema: z.ZodType<T>) {
  try {
    return { 
      data: schema.parse(data), 
      success: true,
      error: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        error: error.format(), 
        success: false,
        data: null
      };
    }
    return {
      error: { _errors: ["An unknown error occurred"] },
      success: false,
      data: null
    };
  }
}

// Helper to sanitize string input to prevent XSS
export function sanitizeHtml(html: string): string {
  return html
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Helper to show validation errors as toasts
export function showValidationErrors(errors: z.ZodFormattedError<any>): void {
  const errorMessages: string[] = [];
  
  // Extract error messages from the formatted error object
  Object.entries(errors).forEach(([key, value]) => {
    if (key === "_errors") {
      errorMessages.push(...(value as string[]));
    } else if (typeof value === "object" && value !== null && "_errors" in value) {
      const fieldErrors = value._errors;
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        errorMessages.push(`${key}: ${fieldErrors.join(", ")}`);
      }
    }
  });
  
  // Show each error as a toast
  errorMessages.forEach(message => {
    toast.error(message);
  });
}
