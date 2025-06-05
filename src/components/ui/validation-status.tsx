
import React from 'react';
import { CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationStatusProps {
  isValid: boolean;
  isValidating: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  className?: string;
  showDetails?: boolean;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({
  isValid,
  isValidating,
  errors,
  touched,
  className,
  showDetails = false
}) => {
  const touchedFields = Object.keys(touched).filter(key => touched[key]);
  const fieldErrors = Object.entries(errors).filter(([key, error]) => error && touched[key]);
  
  if (isValidating) {
    return (
      <div className={cn('flex items-center gap-2 text-blue-600', className)}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Validando...</span>
      </div>
    );
  }

  if (touchedFields.length === 0) {
    return (
      <div className={cn('flex items-center gap-2 text-gray-500', className)}>
        <Info className="h-4 w-4" />
        <span className="text-sm">Preencha os campos para validar</span>
      </div>
    );
  }

  if (isValid && touchedFields.length > 0) {
    return (
      <div className={cn('flex items-center gap-2 text-green-600', className)}>
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm">Todos os campos são válidos</span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">
          {fieldErrors.length} erro{fieldErrors.length !== 1 ? 's' : ''} encontrado{fieldErrors.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      {showDetails && fieldErrors.length > 0 && (
        <ul className="text-sm text-red-600 space-y-1">
          {fieldErrors.map(([field, error]) => (
            <li key={field} className="flex items-start gap-1">
              <span className="font-medium">{field}:</span>
              <span>{error}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
