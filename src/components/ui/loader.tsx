
import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  text, 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div className={cn('animate-spin rounded-full border-4 border-gray-300 border-t-blue-600', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};
