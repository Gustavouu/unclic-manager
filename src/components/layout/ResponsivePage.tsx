
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsivePageProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  fullWidth?: boolean;
  centered?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  noPadding?: boolean;
}

export function ResponsivePage({
  children,
  className,
  contentClassName,
  fullWidth = false,
  centered = true,
  maxWidth = '7xl',
  noPadding = false,
}: ResponsivePageProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div
      className={cn(
        'w-full',
        !noPadding && 'px-4 pb-6 sm:px-6',
        className
      )}
    >
      <div
        className={cn(
          'w-full',
          !fullWidth && maxWidthClasses[maxWidth],
          centered && 'mx-auto',
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
