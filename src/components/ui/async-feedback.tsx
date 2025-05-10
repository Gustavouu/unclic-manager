
import React from 'react';
import { Loader2, Check, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FeedbackStatus = 'idle' | 'loading' | 'success' | 'error' | 'info';

interface AsyncFeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
  status: FeedbackStatus;
  message?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const AsyncFeedback = ({
  status,
  message,
  description,
  size = 'md',
  centered = true,
  icon,
  className,
  children,
  ...props
}: AsyncFeedbackProps) => {
  const getDefaultIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="animate-spin" />;
      case 'success':
        return <Check />;
      case 'error':
        return <AlertCircle />;
      case 'info':
        return <Info />;
      default:
        return null;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-5 w-5';
      case 'lg': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'md': return 'text-base';
      case 'lg': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return 'text-blue-600 dark:text-blue-400';
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (status === 'idle') return <>{children}</>;

  return (
    <div 
      className={cn(
        'rounded-md transition-all duration-300 ease-in-out',
        centered && 'flex flex-col items-center justify-center text-center',
        className
      )}
      {...props}
    >
      {(icon || getDefaultIcon()) && (
        <div className={cn("mb-2", getStatusColor())}>
          <div className={cn(getIconSize())}>
            {icon || getDefaultIcon()}
          </div>
        </div>
      )}
      
      {message && (
        <div className={cn("font-semibold", getTextSize(), getStatusColor())}>
          {message}
        </div>
      )}
      
      {description && (
        <div className="text-sm text-muted-foreground mt-1">
          {description}
        </div>
      )}
      
      {status !== 'loading' && children}
    </div>
  );
};

// Componentes específicos para estados comuns
export const LoadingSpinner = ({ message = "Carregando...", size = "md", className, ...props }: Omit<AsyncFeedbackProps, 'status'>) => (
  <AsyncFeedback 
    status="loading" 
    message={message}
    size={size}
    className={cn("py-4", className)}
    {...props}
  />
);

export const ErrorMessage = ({ message = "Ocorreu um erro", description, size = "md", className, ...props }: Omit<AsyncFeedbackProps, 'status'>) => (
  <AsyncFeedback 
    status="error" 
    message={message}
    description={description}
    size={size} 
    className={cn("py-4", className)}
    {...props}
  />
);

export const SuccessMessage = ({ message = "Operação concluída", size = "md", className, ...props }: Omit<AsyncFeedbackProps, 'status'>) => (
  <AsyncFeedback 
    status="success" 
    message={message}
    size={size} 
    className={cn("py-4", className)}
    {...props}
  />
);
