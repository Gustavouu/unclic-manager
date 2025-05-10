
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LoadingState } from '@/hooks/use-loading-state';
import { AsyncState } from './async-state';

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
  loadingText,
  errorText,
  error
}: CardContainerProps) {
  const variantStyles = {
    default: '',
    elevated: 'shadow-md border-muted/40',
    outline: 'border-2',
    glass: 'bg-white/60 dark:bg-background/60 backdrop-blur-md border-white/20 dark:border-white/5'
  };

  return (
    <Card className={cn(variantStyles[variant], className)}>
      {(title || description) && (
        <CardHeader>
          {title && (typeof title === 'string' ? <CardTitle>{title}</CardTitle> : title)}
          {description && (
            typeof description === 'string' 
              ? <CardDescription>{description}</CardDescription> 
              : description
          )}
        </CardHeader>
      )}
      <CardContent className={cn('relative', contentClassName)}>
        {state !== 'idle' ? (
          <AsyncState 
            state={state} 
            loadingText={loadingText} 
            errorText={errorText} 
            error={error}
          >
            {state === 'loading' ? null : children}
          </AsyncState>
        ) : (
          children
        )}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
