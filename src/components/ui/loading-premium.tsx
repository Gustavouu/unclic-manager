
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingPremiumProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'shimmer';
}

export const LoadingPremium: React.FC<LoadingPremiumProps> = ({
  size = 'md',
  text,
  className,
  variant = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'shimmer') {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="shimmer h-4 rounded"></div>
        <div className="shimmer h-4 rounded w-4/5"></div>
        <div className="shimmer h-4 rounded w-3/5"></div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        {text && <span className={cn("ml-3", textSizeClasses[size])}>{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="relative">
          <div className={cn("rounded-full bg-blue-600 animate-ping absolute", sizeClasses[size])}></div>
          <div className={cn("rounded-full bg-blue-700 relative flex items-center justify-center", sizeClasses[size])}>
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
        {text && <span className={cn("ml-3", textSizeClasses[size])}>{text}</span>}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-blue-600", sizeClasses[size])} />
      {text && <span className={cn("ml-3", textSizeClasses[size])}>{text}</span>}
    </div>
  );
};
