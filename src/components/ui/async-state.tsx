
import React from 'react';
import { LoadingState } from '@/hooks/use-loading-state';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AsyncStateProps extends React.HTMLAttributes<HTMLDivElement> {
  state: LoadingState;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  error?: string | null;
  children?: React.ReactNode;
  size?: 'sm' | 'default' | 'lg';
}

export function AsyncState({
  state,
  loadingText = 'Carregando...',
  successText = 'Operação concluída',
  errorText = 'Ocorreu um erro',
  error,
  children,
  size = 'default',
  className,
  ...props
}: AsyncStateProps) {
  const sizeClasses = {
    sm: 'text-xs py-2',
    default: 'text-sm py-3',
    lg: 'text-base py-4'
  };

  const iconSize = {
    sm: 16,
    default: 20,
    lg: 24
  };

  if (state === 'idle') {
    return <>{children}</>;
  }

  if (state === 'loading') {
    return (
      <div className={cn('flex flex-col items-center justify-center', sizeClasses[size], className)} {...props}>
        <Loader2 className="h-auto w-auto animate-spin text-primary mb-2" size={iconSize[size]} />
        <p className="text-center text-muted-foreground">{loadingText}</p>
        {children}
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className={cn('flex flex-col items-center justify-center', sizeClasses[size], className)} {...props}>
        <CheckCircle className="h-auto w-auto text-green-500 mb-2" size={iconSize[size]} />
        <p className="text-center text-muted-foreground">{successText}</p>
        {children}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', sizeClasses[size], className)} {...props}>
      <AlertCircle className="h-auto w-auto text-red-500 mb-2" size={iconSize[size]} />
      <p className="text-center text-red-600 font-medium">{errorText}</p>
      {error && <p className="text-center text-sm text-muted-foreground mt-1">{error}</p>}
      {children}
    </div>
  );
}
