
import React, { useState, FormEvent } from 'react';
import { z } from 'zod';
import { sanitizeFormData } from '@/utils/sanitize';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { generateNonce } from '@/utils/securityHeaders';

// Interface for form props
interface ValidatedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  schema: z.ZodType<any>;
  onSubmit: (data: any) => Promise<void> | void;
  children: React.ReactNode;
  maxSubmissionSize?: number; // Maximum size in bytes
  throttleTime?: number; // Minimum time between submissions in ms
  className?: string;
}

export function ValidatedForm({
  schema,
  onSubmit,
  children,
  maxSubmissionSize = 100 * 1024, // 100KB default max
  throttleTime = 1000, // 1 second default throttle
  className,
  ...props
}: ValidatedFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);
  // CSRF token
  const [csrfToken] = useState(() => generateNonce());

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Throttle submissions
    const now = Date.now();
    if (now - lastSubmissionTime < throttleTime) {
      toast.error("Por favor, aguarde antes de enviar novamente");
      return;
    }

    // Prevent concurrent submissions
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Get form data
      const formData = new FormData(e.currentTarget);
      const formObject: Record<string, any> = {};
      
      formData.forEach((value, key) => {
        // Check for large inputs
        if (typeof value === 'string' && value.length > 10000) { // Arbitrary threshold for individual fields
          throw new Error(`Campo ${key} excede o tamanho máximo permitido`);
        }
        formObject[key] = value;
      });

      // Check total submission size
      const submissionSize = new Blob([JSON.stringify(formObject)]).size;
      if (submissionSize > maxSubmissionSize) {
        throw new Error("Dados enviados excedem o tamanho máximo permitido");
      }

      // Verify CSRF token matches
      const submittedToken = formObject['csrf_token'];
      if (submittedToken !== csrfToken) {
        throw new Error("Erro de validação de segurança. Por favor, recarregue a página.");
      }

      // Sanitize the data
      const sanitizedData = sanitizeFormData(formObject);

      // Validate with schema
      const result = schema.safeParse(sanitizedData);

      if (!result.success) {
        // Handle validation errors
        const formattedErrors = result.error.format();
        const errorMessages: string[] = [];

        // Extract error messages
        Object.entries(formattedErrors).forEach(([field, error]) => {
          if (field === '_errors' && Array.isArray(error)) {
            errorMessages.push(...error);
          } else if (typeof error === 'object' && error && '_errors' in error) {
            const fieldErrors = error._errors;
            if (Array.isArray(fieldErrors)) {
              errorMessages.push(`${field}: ${fieldErrors.join(', ')}`);
            }
          }
        });

        // Show toast with errors
        if (errorMessages.length > 0) {
          toast.error("Erros de validação:", {
            description: (
              <ul className="list-disc pl-4">
                {errorMessages.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            )
          });
        }

        return;
      }

      // All good, call the submit handler
      await onSubmit(result.data);
      setLastSubmissionTime(Date.now());
      
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error('Erro ao enviar formulário', {
        description: error.message || 'Ocorreu um erro ao processar sua solicitação'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fix: Clone children and properly pass isSubmitting state using a type-safe approach
  const childrenWithProps = React.Children.map(children, child => {
    // Only add props to valid React elements
    if (React.isValidElement(child)) {
      // Don't pass isSubmitting to DOM elements like input, div, etc.
      if (typeof child.type === 'string') {
        return child;
      }
      
      // For custom components, we need to check if they accept isSubmitting prop
      const componentType = child.type as any;
      
      // Type-safe approach using displayName and property checking
      if (componentType.displayName === 'LoadingButton' || 
          componentType.name === 'LoadingButton') {
        // We know LoadingButton accepts isLoading prop based on our component definition
        return React.cloneElement(child, { isLoading: isSubmitting });
      }
      
      // For components that already have isSubmitting or isLoading, maintain their current props
      return child;
    }
    return child;
  });

  return (
    <form {...props} onSubmit={handleSubmit} className={cn('relative', className)}>
      {/* Hidden CSRF token field */}
      <input type="hidden" name="csrf_token" value={csrfToken} />
      
      {childrenWithProps}
    </form>
  );
}
