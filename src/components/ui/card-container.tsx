
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LoadingSpinner, ErrorMessage } from '@/components/ui/async-feedback';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface CardContainerProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: 'default' | 'elevated' | 'outline' | 'glass';
  state?: LoadingState;
  loadingText?: string;
  errorText?: string;
  error?: string;
}

export function CardContainer({
  title,
  description,
  children,
  footer,
  className,
  contentClassName,
  variant = 'default',
  state = 'idle',
  loadingText = 'Carregando...',
  errorText = 'Ocorreu um erro',
  error
}: CardContainerProps) {
  const variantStyles = {
    default: '',
    elevated: 'shadow-md border-muted/40',
    outline: 'border-2',
    glass: 'bg-white/60 dark:bg-background/60 backdrop-blur-md border-white/20 dark:border-white/5'
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return <LoadingSpinner message={loadingText} />;
      case 'error':
        return <ErrorMessage message={errorText} description={error} />;
      default:
        return children;
    }
  };

  return (
    <Card className={cn(variantStyles[variant], 'transition-all duration-200', className)}>
      {(title || description) && (
        <CardHeader>
          {title && (
            typeof title === 'string' ? <CardTitle>{title}</CardTitle> : title
          )}
          {description && (
            typeof description === 'string' ? 
              <CardDescription>{description}</CardDescription> : 
              description
          )}
        </CardHeader>
      )}
      <CardContent className={cn('relative', contentClassName)}>
        {renderContent()}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
