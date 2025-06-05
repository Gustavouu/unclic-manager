
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  text?: string;
}

const Spinner = ({ size = 'md', className }: { size: string; className?: string }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn(
      'animate-spin text-primary',
      sizeClasses[size as keyof typeof sizeClasses],
      className
    )} />
  );
};

const Dots = ({ size = 'md', className }: { size: string; className?: string }) => {
  const dotSizes = {
    sm: 'h-1 w-1',
    md: 'h-2 w-2',
    lg: 'h-3 w-3'
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-primary rounded-full animate-pulse',
            dotSizes[size as keyof typeof dotSizes]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </div>
  );
};

const Pulse = ({ size = 'md', className }: { size: string; className?: string }) => {
  const pulseClasses = {
    sm: 'h-8 w-16',
    md: 'h-12 w-24',
    lg: 'h-16 w-32'
  };

  return (
    <div className={cn(
      'bg-muted animate-pulse rounded',
      pulseClasses[size as keyof typeof pulseClasses],
      className
    )} />
  );
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  className,
  text
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <Dots size={size} className={className} />;
      case 'pulse':
        return <Pulse size={size} className={className} />;
      default:
        return <Spinner size={size} className={className} />;
    }
  };

  if (text) {
    return (
      <div className="flex flex-col items-center space-y-2">
        {renderLoader()}
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    );
  }

  return renderLoader();
};

export const LoadingOverlay: React.FC<{
  isVisible: boolean;
  children?: React.ReactNode;
  text?: string;
}> = ({ isVisible, children, text }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg border">
        <Loading size="lg" text={text} />
        {children}
      </div>
    </div>
  );
};

export const LoadingCard: React.FC<{
  className?: string;
  text?: string;
}> = ({ className, text }) => {
  return (
    <div className={cn(
      'flex items-center justify-center p-8 bg-card rounded-lg border',
      className
    )}>
      <Loading size="md" text={text} />
    </div>
  );
};
